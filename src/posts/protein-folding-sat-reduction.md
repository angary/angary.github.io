---
title: "Protein Folding SAT Reduction"
description: "A look into the HP model in protein folding"
date: "2025-08-04"
mathjax: true
hljs: true
---

## Introduction

The protein folding problem is the challenge of predicting the three-dimensional structure of a protein from its amino acid sequence.

While AI models like DeepMind's AlphaFold have achieved great success in protein structure prediction, the focus of this research was to analyze the underlying SAT encodings to determine how much their performance could be improved.

### Protein folding in biology

Proteins are large molecules composed of a chain of amino acids.
A protein only becomes functional once this chain "folds" into a specific, complex 3D structure.

A prime example of this is myoglobin, an oxygen-binding protein found in muscle tissue.
The specific way myoglobin folds creates a small, hydrophobic pocket that is perfectly shaped to hold a heme group, which contains the iron atom that actually binds to oxygen [2].
If the protein were to misfold, this pocket would not form correctly, and the myoglobin would be unable to perform its crucial function of storing oxygen.

Given that these chains can be very long, the number of possible folding configurations can be astronomical (up to $10^{300}$), making it computationally challenging to predict the final structure from the amino acid sequence alone.

### A Computational Challenge 

The many possible ways a sequence can fold makes it an interesting computational problem, where our goal is to try and determine what structure a sequence will fold into as fast as possible.

## Protein Folding via the HP model

The Hydrophobic-Polar (HP) model is a way of encoding an amino sequence into a boolean sequence.

It works by classifying the 20 standard amino acids into either **hydrophobic (H)** (avoids water) or **hydrophilic (P)** (attracted to water).
Hence by assigning **H** to `1` or `true`, and **P** to `0` or `false` we can convert the amino sequence to a boolean sequence $S$, where $S_i$ represents if there is a H or a P at position $i$ in the sequence, with 1 encoding a H and 0 encoding a P.

The maximum configuration is then an embedding which maximises the number of adjacent 1's on the grid $G$.

To find the optimal structure we conduct a linear search, starting at the previous instance in which it was satisfiable, and then increasing the goal contacts by 1 each time, and solving, until it is unsatisfiable.
The maximum contacts is then the one which produced the largest satisfiable instance.
Despite being a linear search, this approach worked quite well since satisfiable instances could be solved much faster than unsatisfiable instances

### Legal Embedding

A legal embedding must follow the following rules:

1. Each character in the sequence gets assigned to some point on the grid.
2. No character in the sequence gets assigned to more than one point on the grid.
3. Each point of the grid gets assigned at most one character in the sequence.
4. Two adjacent characters in the sequence must be placed on two points that are neighbours on the grid in either the horizontal or vertical direction, but not both.

The points of the grid are enumerated from 1 to $w$ for the 2D version of the problem, where $G = \\{ j \mid 1 \leq j \leq w^2\\}$ and from 1 to $w^3$ for the 3D version, where $G = \\{ j \mid 1 \leq j \leq w^3\\}$.

For the 2D version, $w$ can be calculated as:

$$
w =
\begin{cases}
1 + \lfloor \frac{n}{4} \rfloor & \text{if } n \geq 12 \\\\
n & \text{otherwise}
\end{cases}
$$

For the 3D version, $w$ can be calculated as:

$$
w =
\begin{cases}
2 + \lfloor \frac{n}{8} \rfloor & \text{if } n \geq 20 \\\\
2 + \lfloor \frac{n}{4} \rfloor & \text{otherwise}
\end{cases}
$$


### Maximising Contacts

To then determine the optimal structure, we have to maximise the number of contacts.
A contact exists between $j$ and $m$ on the grid $G$ if and only if a 1 is assigned to both $j$ and $j'$ of $G$, and the 1s assigned to points $j$ and $j'$ are not adjacent in $S$.
A linear constraint encoding is then used to determine how many contacts there are.

## A Baseline SAT Encoding

The following SAT reduction is based on the work of Brown, Zuo, and Gusfield [1].
We represent each point on the 2D grid a number from 1 to $w^2$, or for the 3D grid a number from 1 to $w^3$.

We define the $I =\\{ i \mid 1 \leq i \leq |S|\\}$ as the set of indexes in the sequence $S$, and $I^1 = \\{ i \mid i \in I, S_i = 1 \\}$ be the set of indexes in $S$, where the character is 1.

The table describes the variables used in the original encoding
| Variable   | Description                                                    | Exists for all                                           |
| ---------- | -------------------------------------------------------------- | -------------------------------------------------------- |
| $X_{i,j}$  | The $i^{th}$ index in $S$ is located at coordinate $j$ of $G$  | $i \in S, j \in G$                                       |
| $T_j$      | There is a character 1 at coordinate $j$ of $G$                | $j \in G$                                                |
| $C_{j,j'}$ | There is a contact between adjacent points $j$ and $j'$ in $G$ | $j, j' \in G, j < j'$, where $j$ and $j'$ are neighbours |

#### Ensuring Legal Embeddings

To enforce a valid embedding of the sequence onto the grid, we first define a boolean variable $X_{i, j}$, which is `true` if and only if the *i*-th amino acid in the sequence is placed at position *j* on the grid.
The following rules must then be satisfied:
1. Every character position $i \in S$ must be assigned to some point $j \in G$.
  $$\left\\{ \bigvee\limits_{j \in G} X_{i, j} \\; \middle| \\; i \in I \right\\}$$

2. No characters position $i \in S$ can be assigned to more than one point $j \in G$.
  $$\\{\lnot X_{i, j} \lor \lnot X_{i, j'} \mid i \in I, j,j' \in G, j \neq j'\\}$$

3. No point $j \in G$ can have more than one character position $i \in S$ assigned to it.
  $$\\{\lnot X_{i, j} \lor \lnot X_{i', j} \mid i,i' \in I, i \neq i' j \in G\\}$$

4. Two adjacent characters in the sequence $i, i + 1 \in S$ must be placed on two horizontally or vertically adjacent points of the grid (but not diagonally).
This can be expressed as an implication: if amino acid $i$ is at position $j$, then its successor $i+1$ must be at one of the neighboring positions $j' \in G$.
  $$\left\\{ \lnot X_{i, j} \bigvee\limits_{j, j' \in G} X_{i + 1, j'} \\; \middle| \\; 1 \leq i < |S| \right\\}$$ 

  Note $j$ and $j'$ are neighbours.

#### Identifying Potential Contacts

There are two conditions for a potential contact:

1. A potential contact involves point $j \in G$ if and only if a character 1 is assigned to point $j$.
  The variable $T_j$ is set `true` if and only if this condition holds.
  $$\\{ \lnot C_{i, j} \lor T_{j} \mid i \in I^1, j \in G \\}$$
  $$\left\\{ \lnot T_j \bigvee\limits_{i \in I^1} C_{i,j} \\; \middle| \\; j \in G \right\\}$$
2. A potential contact exists between points $j$ and $j'$ on the grid if and only if a 1 is assigned to both pints $j$ and to a neighbouring point $j' \in G$.
  The variable $C_{j, j'}$ will be set to `true` if both $T_j$ and $T_{j'}$ are set `true`.

$$
\displaylines{
(\lnot C_{j, j'} \lor T_j) \land (\lnot C_{j, j'} \lor T_{j'}) \land (C_{j, j'} \lor \lnot T_j \lor \lnot T_{j'}) \\\\
\forall \text{ neighbouring positions } j, j' \in G
}
$$ 

#### Counting Potential Contacts

To determine the number of contacts, we have to count how many of the $C$ variables are set to true.
To determine the maximum number of contacts, a goal number of contacts $m$ is chosen.

In the encoding in paper [1], they count the number of variables that are not set true and test whether it is less than or equal to $r$, where $r = 2 |G| - m$ in the 2D version and $r = 3 |G| - m$ for the 3D version.

The clauses for their encoding can then be found in the original paper.
Overall, this requires $O(|G|)$ new variables.

However, in my encoding during my research, we count if the number of true $C$ variables is less than or equal to $m$, and encode the cardinality constraints using the sequential encoding in [3], i.e.

$$ 
\sum_{j,j' \in G, \; j \neq j'}C_{j,j'} \leq m
$$ 

This encoding also requires $O(|G|)$ new variables, however, empirically has fewer variables and runs faster compared to the encoding used in [1].

The clauses here have been omitted, as different cardinality constraint encodings can be used interchangeably.

## Potential Optimisations

During my time at UNSW, my research on this involved testing possible optimisations to the encoding model which could have reduced the total number of variables to solve.

> Note to assist with describing the encodings here I use $(A \rightarrow B)$ which is an implication, i.e. if A is true then B must be true.
> This can be converted to CNF form as $(\lnot A \lor B)$.

### Dimensionality Encoding

Rather than having a variable for if a sequence index is on a point in the grid, we have a variable for if it is in a position along an axis in a $d$ dimension, for all dimensions.
This should reduce the number of variables describing the grid points from scaling $O(w^2)$ for 2D and $O(w^3)$ to $O(w)$ for both 2 and 3D.

We define $D$ to be the set of possible dimensions.
For example if we have a 2D grid, then $D =\\{1, 2\\}$ else if we have a 3D grid, $D =\\{1, 2, 3\\}$.
We also define $P$ to be the set of possible positions along an axis of the grid, where $P = \\{p \mid 1 \leq p \leq w \\}$.

Rather than determining if there is a potential contact by checking if two adjacent points in the grid have a 1 from the sequence, we check if a 1 in the sequence is adjacent to another 1 in the sequence on the grid which is not next to it in the sequence.

We define $Q$ the set of potential contacts indexes as

$$Q = \\{ \langle{i, j}\rangle \mid 1 \leq i + 2 < j \leq |S|, S_i = S_j = 1, j - i \equiv 1 \pmod 2 \\}$$

where $i$ and $j$ are indexes of the 1s in the sequence that can potentially contact each other.

To assist with describing the encoding, we define the set of the pairs of adjacent as
$$A = \\{ \langle{i, i + 1}\rangle \mid 1 \leq i < |S| \\}$$

The table describes the variables used in the dimensionality encoding

| Variable                | Description                                                           | Exists for all                           |
| ----------------------- | --------------------------------------------------------------------- | ---------------------------------------- |
| $\text{at}\_{i,p,d}$    | The $i^{th}$ index in $S$ is located at position $p$ in dimension $d$ | $i \in I, p \in P, d \in D$              |
| $\text{same}\_{i,j,d}$  | Indexes $i, j$ are at the same position in dimension $d$              | $\langle i, j \rangle A \cup Q, d \in D$ |
| $\text{adj}\_{i,j,d}$   | Indexes $i,j$ are in adjacent positions in dimension $d$              | $\langle i, j \rangle A \cup Q, d \in D$ |
| $\text{contact}\_{i,j}$ | If postiions $i,j \in Q$ contact each other                           | $\langle i, j \rangle \in Q$             |

#### Ensuring Legal Embeddings

The four conditions for a legal embedding are as follows:

1. Every character position $i$ must be assigned to some position $p$ in dimension $d$
  $$\left\\{ \bigvee_{p \in P} \text{at}\_{i, p, d} \mid i \in I, d \in D \right\\}$$

2. No character position $i$ in the sequence can be assigned to more than one position $p$ in dimension $d$.
  $$\\{ \lnot \text{at}\_{i, p, d} \land \lnot \text{at}\_\{i, q, d\} \mid i \in I, 1 \leq p < q \leq w, d \in D \\}$$

3. No point in the grid can have more than one character position $i$ assigned to it.
  For any indexes $i$ and $j$ where $i \neq j$, we have the clauses
  $$
  \begin{align*}
    \\{ \text{at}\_{i, p, d} \land \text{at}\_{j, p, d} \rightarrow \phantom{\lnot} \text{same}\_{i, j, d} \mid p \in P, d \in D \\} \\\\
    \\{ (\lnot \text{at}\_{i, p, d} \land \text{at}\_{j, p, d}) \lor (\text{at}\_{i, p, d} \land \lnot \text{at}\_{j, p, d}) \rightarrow \lnot \text{same}\_{i, j, d} \mid p \in P, d \in D \\} \\\\
  \end{align*}
  $$
  $$\left\\{ \bigvee_{d \in D} \lnot \text{same}\_{i, j, d} \right\\}$$

4. Every adjacent pair of character positions $\langle{i, j}\rangle \in A$ must be placed on adjacent positions in the grid (diagonals are not adjacent).
  The following clauses are used to determine if two adjacent points are one unit apart in dimension $d$.
  For any $\langle{i, j}\rangle \in A \cup Q$, $d \in D$ we have the clauses
  $$
  \begin{align}
    \\{ \text{at}\_{i, p, d} \land \text{at}\_{j, p + 1, d} \rightarrow \phantom{\lnot} \text{adj}\_{i, j, d} \mid 1 \leq p < w\\} \\\\
    \\{ \text{at}\_{i, p, d} \land \text{at}\_{j, p - 1, d} \rightarrow \phantom{\lnot} \text{adj}\_{i, j, d} \mid 1 < p \leq w\\} \\\\
    \\{ \text{at}\_{i, p, d} \land \lnot \text{at}\_{j, p + 1, d} \land \lnot \text{at}\_{j, p - 1, d} \rightarrow \lnot \text{adj}\_{i, j, d} \mid 1 < p < w\\} \\\\
  \end{align}
  $$
  Then we enforce that adjacent points must be one unit apart in one dimension and remain the same in the rest.
  For any $\langle{i, j}\rangle \in A$ we have the clauses
  $$ \left\\{ \bigvee_{d \in D} \phantom{\lnot} \text{adj}\_{i, j, d} \right\\} $$
  $$\\{ \text{adj}\_{i, j, d} \rightarrow \phantom{\lnot} \text{same}\_{i, j, d'} \mid d, d' \in D, d \neq d'\\} $$
  $$\\{ \text{same}\_{i, j, d} \rightarrow \lnot \text{adj}\_{i, j, d'} \mid d, d' \in D, d \neq d'\\} $$

#### Identifying Potential Contacts

We have the same clauses as that in the adjacency section, except they exist for any $\langle{i, j}\rangle \in Q$ instead of $\langle{i, j}\rangle \in A$.
These clauses are required to for potential contact indexes to determine which potential contacts are next to each other.
Then, the condition for a potential contact are as follows:

1. There is a a contact between potential contact indexes $i, j$ if and only if they are in adjacent positions in one dimension and at the same position in other dimensions.
  For any index $\langle{i, j}\rangle \in Q, d \in D$, we have the clauses
  $$ \left\\{ \phantom{\lnot} \text{adj}\_{i, j, d} \bigwedge_{d' \in D, d \neq d'} \text{same}\_{i, j, d'} \rightarrow \phantom{\lnot} \text{contact}\_{i, j} \right\\} $$
  $$ \left\\{ \lnot \text{adj}\_{i, j, d} \bigwedge_{d' \in D, d \neq d'} \text{same}\_{i, j, d'} \rightarrow \lnot \text{contact}\_{i, j} \right\\} $$
  $$ \left\\{ \lnot \text{adj}\_{i, j, d} \bigwedge_{d' \in D, d \neq d'} \lnot \text{adj}\_{i, j, d'} \rightarrow \lnot \text{contact}\_{i, j} \right\\} $$
  $$\\{ \text{adj}\_{i, j, d} \land \lnot \text{same}\_{i, j, d'} \rightarrow \lnot \text{contact}\_{i, j} \mid d' \in D, d \neq d\\} $$

#### Counting Potential Contacts

Similar to the original encoding, we count if the number of true contact variables is less than or equal to $m$ where $m$ is the required number of contacts.
The cardinality constraint method is used in [3].

### Order Encoding

This encoding has the same concepts as a the dimensionality reduction, with one change.
Rather than $\text{at}\_{i, p, d}$ meaning sequence index $i$ is exactly at position $p$ in dimension $d$, it means that it is at least at position $p$ in dimension $d$.

The primary advantage of this encoding lies in how it simplifies spatial reasoning.
Instead of defining adjacency by checking every possible pair of coordinates (e.g. `p` and `p+1`), Order Encoding allows us to define it by comparing the cumulative position vectors of two amino acids directly.
This often leads to more powerful logical propagation for the SAT solver.

For instance, if a solver determines that an amino acid is *not* at or after position 5, it can immediately deduce that it cannot be at positions 6, 7, and so on.
This chain reaction can significantly prune the search space.
The hypothesis is that this more abstract, relational encoding results in a more compact set of constraints and allows the SAT solver to find a solution more efficiently.

The table describes the variables used in the order encoding

| Variable                | Description                                                                    | Exists for all                           |
| ----------------------- | ------------------------------------------------------------------------------ | ---------------------------------------- |
| $\text{at}\_{i,p,d}$    | The $i^{th}$ index in $S$ is located at at least position $p$ in dimension $d$ | $i \in I, p \in P, d \in D$              |
| $\text{same}\_{i,j,d}$  | Indexes $i, j$ are at the same position in dimension $d$                       | $\langle i, j \rangle A \cup Q, d \in D$ |
| $\text{adj}\_{i,j,d}$   | Indexes $i,j$ are in adjacent positions in dimension $d$                       | $\langle i, j \rangle A \cup Q, d \in D$ |
| $\text{contact}\_{i,j}$ | If postiions $i,j \in Q$ contact each other                                    | $\langle i, j \rangle \in Q$             |

#### Ensuring Legal Embeddings
The our conditions for a legal embedding is as follows

1. Every character index $i \in I$ must be assigned to some position $p$ in dimension $d$.
In other words, every character is at least in position 1 in all dimensions.
  $$\\{ \text{at}\_{i, 1, d} \mid i \in I, d \in D\\} $$

2. No character index $i \in I$ can be assigned to more than one point.
  $$\\{ \text{at}\_{i, p, d} \rightarrow \text{at}\_{i, p-1, d} \mid i \in I, d \in D, 1 < p \leq w\\} $$

3. No point in the grid can have more than one character index assigned to it.
  In other words, two indexes cannot be on the same point.
  For all $i, j \in I, i < j$, we have the clauses:
  $$\\{ \lnot \text{at}\_{i,p + 1, d} \land \text{at}\_{i, p d} \land \text{at}\_{j, p + 1, d} \land \text{at}\_{j, p, d} \rightarrow \text{same}\_{i, j, d} \mid d \in D, p \in P\\} $$
  $$\\{ \lnot \text{at}\_{i, p, d} \land \text{at}\_{j, p, d} \rightarrow \lnot \text{same}\_{i, j, d} \mid d \in D, p \in P\\} $$
  $$\\{ \text{at}\_{i, p, d} \land \lnot \text{at}\_{j, p, d} \rightarrow \lnot \text{same}\_{i, j, d} \mid d \in D, p \in P\\} $$
  $$ \left\\{ \bigvee_{d \in D} \lnot \text{same}\_{i, j, d} \right\\} $$

4. Every adjacent pair of character pair positions $\langle{i, j}\rangle \in A$ must be placed on adjacent points in the grid.

    Now that we have the $\text{at}$ and $\text{adj}$ variabels we can reuse the same fomulas from the Dimension Encoding.

#### Identifying Potential Contacts

Now that we have the same set of $\text{adj}$ and $\text{same}$ variables as in the Dimension Encoding, we can count contacts through the same method.

#### Counting Potential Contacts

Similar to the Dimension Encoding, counting potential contacts is accomplished through the same clauses, using the sequential encoding in [3].

## References

[1] Gusfield D. Brown H, Zuo L. Comparing integer linear programming to sat-solving for hard problems in computational and systems biology. Algorithms for Computational Biology., pages 63–76, 2020.

[2] Kendrew, J. C., Bodo, G., Dintzis, H. M., Parrish, R. G., Wyckoff, H., & Phillips, D. C. (1958). A three-dimensional model of the myoglobin molecule obtained by x-ray analysis. Nature, 181(4610), 662–666.

[3] Carsten Sinz. Towards an optimal cnf encoding of boolean cardinality constraints. In Peter van Beek, editor, Principles and Practice of Constraint Programming - CP 2005, pages 827–831, Berlin, Heidelberg, 2005. Springer Berlin Heidelberg.
