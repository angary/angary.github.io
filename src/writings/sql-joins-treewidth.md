---
title: "Tree Decomposition in Relational Databases"
description: "How modern SQL databases use tree decompositions to optimise complex join queries"
date: "2025-08-16"
mathjax: true
hljs: true
---

## Introduction



## SQL Query Optimizer

The `JOIN` clause is used to combine rows from 2 or more tables in SQL databases.
It is an essential part of SQL databases as it allows retrieval of data intentionally separated into different tables (this principal is known as **normalization**).

However, SQL being a declarative language does not specify how the joins are ordered - instead this is determined by the query optimizer.

As a simple example for the following query

```sql
SELECT A.a, B.b, C.c
FROM A
JOIN B ON A.x = B.x
JOIN C on A.y = C.y;
```

1. The query optimizer parses and generates an internal representation, often a **query graph**.

```tikz
\node[circle, draw] (A) at (0, 0) {Table A};
\node[circle, draw] (B) at (-4, 0) {Table B};
\node[circle, draw] (C) at (4, 0) {Table C};

\draw (A) -- (B);
\draw (A) -- (C);
```

2. Then it generates the join orders - here there are 2
    1. `(A JOIN B) JOIN C`
    2. `(A JOIN C) JOIN B`

3. Then it now has to estimate the cost - to do this is needs to know some statistics about the table - say we have the following rows:

    | Table A        | Table B        | Table C  |
    | -------------- | -------------- | -------- |
    | 1 000 000 rows | 5 000 000 rows | 500 rows |

    Next it estimates the cost of each plan
    
    1. `(A JOIN B) JOIN C`

        The first join will result in an intermediate table of at most 1 000 000 rows
    2. `(A JOIN C) JOIN B`

        The first join will result in an intermediate table of at most 500 rows
    
    Consequently, it's clear that plan 1 creates a much smaller intermediate table, reducing the amount of data it has to carry into the second more expensive join.



In the above case 

However, for a query with many joins, the number of possible execution orders grows exponentially.
A query with just 10 tables can have over 175,000 possible join orderings!
So choice of join order can have a dramatic impact on query performance.

Modern SQL query optimizers use a variety of sophisticated techniques to tackle this combinatorial explosion.
One of the most elegant and powerful techniques, especially for complex queries, involves modeling the query as a graph and using a concept from graph theory called **tree decomposition**.
This allows the optimizer to find the optimal join order for a large class of queries in a structured and efficient way.

## From SQL to Query Graphs

The first step is to transform the SQL query into a more abstract representation: a **query graph**.
In a simple query graph, each table involved in the query becomes a vertex, and an edge is drawn between two vertices if there is a join condition between them.

While many queries have simple, linear, or tree-like structures (making them **acyclic**), many interesting real-world queries are **cyclic**.
It is in solving these cyclic queries that tree decomposition truly shines.

Consider the following query, which introduces a cycle:

```sql
SELECT P.name
FROM Employee AS E
JOIN WorksOn AS W ON E.id = W.emp_id
JOIN Project AS P ON W.proj_id = P.id
JOIN Department AS D ON E.dept_id = D.id
JOIN ProjectManager AS PM ON P.id = PM.proj_id AND D.manager_id = PM.emp_id
WHERE D.name = 'Data Science';
```

This query can be modeled as the following cyclic graph:

```tikz
% A cyclic query graph
\node[circle, draw] (E) at (0,2) {Employee};
\node[circle, draw] (D) at (0,0) {Department};
\node[circle, draw] (W) at (3,2) {WorksOn};
\node[circle, draw] (P) at (3,0) {Project};
\node[circle, draw] (PM) at (1.5,-2) {ProjectManager};

\draw (E) -- (W);
\draw (W) -- (P);
\draw (P) -- (PM);
\draw (PM) -- (D);
\draw (D) -- (E);
```

## Tree Decomposition

A **tree decomposition** of a graph $G = (V, E)$ is a mapping of the graph into a tree.
The nodes of this tree are called "bags", and each bag is a subset of the vertices $V$ of the original graph.
A tree decomposition must satisfy three properties:

1.  **Vertex Coverage:** Every vertex of $G$ must appear in at least one bag.
2.  **Edge Coverage:** For every edge $(u, v)$ in $G$, there must be at least one bag that contains both $u$ and $v$.
3.  **Coherence (Running Intersection Property):** For any vertex $v$, the set of bags containing $v$ must form a connected subtree. An easier way to think about this is: if a vertex appears in two bags, it must also appear in all bags on the unique path between them.

The **width** of a tree decomposition is the size of its largest bag, minus one.
The **treewidth** of a graph is the minimum width over all possible tree decompositions.
Treewidth is a measure of how "tree-like" a graph is. A tree has a treewidth of 1.

For our cyclic graph, a valid tree decomposition is:

```tikz
% A valid tree decomposition for the cyclic query graph
\node[rectangle, draw, rounded corners] (B1) at (0,0) {D, E, PM};
\node[rectangle, draw, rounded corners] (B2) at (4,0) {E, P, PM, W};

\draw (B1) -- (B2);
```
This decomposition is valid: all vertices and edges are covered, and the coherence property holds. For example, `E` and `PM` appear in both bags, and the bags are directly connected. The largest bag has size 4, so the treewidth of our graph is at most 3.

## Dynamic Programming on Tree Decompositions

The magic of tree decomposition is that it allows us to use dynamic programming to find the optimal join plan. The algorithm works by traversing the tree decomposition from the leaves up to a chosen root.

Here's the general idea:

1.  **Root the Tree:** Pick an arbitrary bag as the root of the tree decomposition.
2.  **Post-Order Traversal:** Process the bags in a post-order traversal (children before the parent).
3.  **Process a Bag:** For each bag $X_i$, we compute the optimal plan for joining all the relations *within that bag*. This step also incorporates the results from the children of $X_i$.
    - When processing a leaf bag, we just find the best order to join the tables within that bag.
    - When processing an internal bag $X_i$, we first consider the optimal plans for its children. For each child $X_j$, we have already computed the cost of joining the tables in $X_j$. We then join this partial result with the tables in $X_i$.
4.  **Passing Results Up:** The result of processing a bag $X_i$ is not the full joined table. Instead, it's a smaller, intermediate table containing only the attributes that are needed by its parent. These are the attributes in the intersection of $X_i$ and its parent's bag, $X_p$: $X_i \cap X_p$.
5.  **Final Plan:** When the root bag is processed, we have the optimal join plan for the entire query.

### Pseudocode

Here is a simplified pseudocode for the algorithm:

```
function find_optimal_plan(query_graph):
  tree_decomposition = find_tree_decomposition(query_graph)
  root = pick_root(tree_decomposition)
  return process_bag(root)

function process_bag(bag_X_i):
  // First, get the optimal plans from children bags
  for each child bag_X_j of bag_X_i:
    partial_plan_j = process_bag(bag_X_j)
    // We now have a plan to join tables in bag_X_j.
    // We need to join this with the tables in bag_X_i.

  // Find all possible join orders for tables in bag_X_i,
  // including the partial results from children.
  best_plan_for_X_i = null
  min_cost = infinity
  for each permutation of joins in bag_X_i:
    cost = calculate_cost(permutation)
    if cost < min_cost:
      min_cost = cost
      best_plan_for_X_i = permutation

  // Project the result to only the attributes needed by the parent
  parent_attributes = bag_X_i intersect parent(bag_X_i)
  final_plan = project(best_plan_for_X_i, parent_attributes)

  return final_plan
```

This is a high-level sketch. A real implementation would involve detailed cost models for different join algorithms (hash join, nested loop join, etc.) and statistics about the data (table sizes, cardinalities, etc.).

## Complexity

Finding the optimal tree decomposition with the minimum treewidth is an NP-hard problem. However, for the small number of tables typically found in a single SQL query (rarely more than 20-30), heuristics can find good-enough decompositions quickly.

The complexity of the dynamic programming algorithm is exponential in the treewidth ($w$) of the graph, but polynomial in the number of tables ($n$). The runtime is roughly $O(n \cdot 2^w)$. This is a huge improvement over the factorial complexity of naive enumeration, especially for graphs with low treewidth. If a query graph is a tree (treewidth 1), the complexity is linear in the number of tables.

## Conclusion

Tree decomposition is a powerful tool from graph theory that has found a practical application in the complex world of SQL query optimization. By transforming a potentially cyclic query graph into a tree structure, database systems can break down the enormous problem of join ordering into a series of smaller, manageable subproblems. This allows them to use dynamic programming to find the most efficient join plan, turning potentially slow queries into fast ones. While the theory might seem abstract, it's a key ingredient in the secret sauce of modern high-performance databases.

## A General Cyclic Query Example

Here is a general example of a cyclic query with five tables, forming a pentagon in the query graph. This is a classic case where tree decomposition is highly effective.

### SQL Query

```sql
-- A general cyclic query joining 5 tables.
-- The join conditions form a cycle: A -> B -> C -> D -> E -> A
SELECT *
FROM A
JOIN B ON A.id = B.a_id
JOIN C ON B.id = C.b_id
JOIN D ON C.id = D.c_id
JOIN E ON D.id = E.d_id AND E.a_id = A.id;
```

### TikZ Query Graph

This diagram shows the cyclic nature of the query.

```tikz
% A cyclic query graph with 5 tables in a pentagon shape
\node[circle, draw] (A) at (90:1.5cm) {A};
\node[circle, draw] (B) at (162:1.5cm) {B};
\node[circle, draw] (C) at (234:1.5cm) {C};
\node[circle, draw] (D) at (306:1.5cm) {D};
\node[circle, draw] (E) at (18:1.5cm) {E};

\draw (A) -- (B);
\draw (B) -- (C);
\draw (C) -- (D);
\draw (D) -- (E);
\draw (E) -- (A);
```

## A Medium-Complexity Graph Example

Here is an example of a medium-complexity graph with 8 nodes and two cycles, forming a "barbell" shape. This type of graph presents a more interesting challenge for a query optimizer.

```tikz
% A medium-complexity graph with 8 nodes and 2 cycles

% Define the nodes for the first cycle (left side)
\node[circle, draw] (A) at (0,1) {A};
\node[circle, draw] (B) at (-1,0) {B};
\node[circle, draw] (C) at (0,-1) {C};
\node[circle, draw] (D) at (1,0) {D};

% Define the nodes for the second cycle (right side)
\node[circle, draw] (E) at (3,0) {E};
\node[circle, draw] (F) at (4,1) {F};
\node[circle, draw] (G) at (5,0) {G};
\node[circle, draw] (H) at (4,-1) {H};

% Draw the edges for the first cycle
\draw (A) -- (B);
\draw (B) -- (C);
\draw (C) -- (D);
\draw (D) -- (A);

% Draw the edges for the second cycle
\draw (E) -- (F);
\draw (F) -- (G);
\draw (G) -- (H);
\draw (H) -- (E);

% Draw the connecting bridge between the two cycles
\draw (D) -- (E);
```