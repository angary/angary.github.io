+++
title = "Protein Folding Reduction in CS"
description = "A look into the HP model in protein folding"
type = ["posts","post"]
tags = []
date = "2021-09-08"
categories = []
series = ["algos"]
toc = false
[ author ]
  name = "Gary Sun"
+++

## Introduction

It is commonly brought up if we can prove P = NP, then we can quickly find a cure for cancer.

The reason for this is that the protein folding problem is an NP problem, and solving it helps scientists develop important drugs.

### Protein folding in biology

Proteins are large molecules made up of a chain of amino acids, however a protein is not functional until the chain has "folded", which requires the chain to twist and bend into a 3D structure.

That being said, these chains are very long, and there may be up to $10^{300}$ ways they fold. As a result, it is difficult for scientists to predict what their sequence of amino acids will result in.

## Relevance to CS

The many possible ways a sequence can fold makes it an interesting computational problem, where our goal is to try and determine what structure a sequence will fold into as fast as possible.

### The HP model

The HP model is a way of encoding an amino sequence into a boolean sequence.

It works by classifying the 20 standard amino acids into either **hydrophobic (H)** (avoids water) or **hydrophilic (P)** (attracted to water). Hence by assigning **H** to `1` or `true`, and **P** to `0` or `false` we can convert the amino sequence to a boolean sequence.

### Converting into an optimisation problem

To determine how a sequence will fold, we can determine how the boolean sequence will fold on a 2D grid.

To do so, the boolean sequence must satisfy the following rules

1. There must be a 1:1 mapping between a character in the boolean sequence and a point on the grid.
2. Two adjacent characters in the sequence must be placed on two horizontally or vertically adjacent points of the grid (but not diagonally).

This means that the sequence must be embedded on the gride as a self-avoiding walk, without deforming the sequence.

The HP model assumes that the most stable fold will be the one that maximises the number of (H-H) bonds - that is the fold that results in the highest number of `1`s adjacent to each other in the grid, which weren't adjacent to each other in the sequence. This is known as the **2-D Prototein Problem**.

However, this problem has been generalised to a 3-D grid, which better models real protein folding.

### ILP vs SAT

Being an optimisation problem, Integer Linear Programming formulations can be created to maximise the number of (H-H) contacts.

However, this can also be modeled as a SAT decision problem, where we have a target $n$, we create a CNF formula that will be satisfied if there are more (H-H) contacts than $n$.

### Protein Problem to SAT

We represent each point on the 2D grid a number from 1 to $w^2$, or for the 3D grid a number from 1 to $w^3$.

#### Ensuring Legal Embeddings

1. There must be a 1:1 mapping between a character in the boolean sequence and a point on the grid.
   This has to be enforced through 3 rules
   1. Every character $i \in S$ must be assigned to some point $j \in G$.
      $$\bigvee\limits_{1 \leq j \leq |G|} X_{i. j}$$
   2. No characters position $i \in S$ can be assigned to more than one point $j \in G$.
      $$\bigwedge\limits_{1 \leq j, j' \leq |G|} (\lnot X_{i, j} \lor \lnot X_{i, j'})$$
      Note $j \leq j'$.
   3. No point $j \in G$ can have more than one character position $i \in S$ assigned to it.
      $$\bigwedge\limits_{1 \leq i, i' \leq |G|} (\lnot X_{i, j} \lor \lnot X_{i', j})$$
      Note $i \neq i'$.
2. Two adjacent characters in the sequence $i, i + 1 \in S$ must be placed on two horizontally or vertically adjacent points of the grid (but not diagonally).
   $$\lnot X_{i, j} \bigvee\limits_{1 \leq j' \leq |G|} X_{i + 1, j'}$$
   Note $j$ and $j'$ are neighbours.

#### Grid Size

To limit the number of variables, we set the grid diameter $w$ to $1 + \lfloor \frac{n}{4} \rfloor$ for all values of $n \geq 12$, and to $n$ otherwise.

In the 3D version, $w$ is set to $2 + \lfloor \frac{n}{8} \rfloor$ for all values of $n \geq 20$ and to $2 + \lfloor \frac{n}{4} \rfloor$ otherwise.

#### Identifying Potential Contacts

There are two conditions for a potential contact:

1. A potential contact involves point $j \in G$ if and only if a character 1 is assigned to point $j$. The variable $T_j$ is set `true` if and only if this condition holds.
2. A potential contact exists between points $j$ and $m$ on the grid if and only if a 1 is assigned to both pints $j$ and to a neighbouring point $m \in G$. The variable $C_{j. m}$ will be set to `true` if both $T_j$ and $T_m$ are set `true`.
   $$(\lnot C_{j, m} \lor T_j) \land (\lnot C_{j, m} \lor T_m) \land (C_{j. m} \lor \lnot T_j \lor \lnot T_m) \\\\ \forall \text{ neighbouring positions } j, m, 1 \leq j, m \leq |G|$$

#### Counting Potential Contacts

Given a goal number of potential contacts, $m$, count the number of $C$ variables that are not set true, and test if it is $\leq r$, where $r = 2|G| - m$ for the 2D version, and $r = 3|G| - m$ for the 3D version.

$$
(\lnot b_{i}^{2k} \lor b_{j}^{2k + 1} \lor b_{i + j}^{k}), \\\\
0 \leq i \le t_{2k}, 0 \leq j \leq t_{2k + 1}, 1 \leq i + j \leq t_k + 1, 1 \leq k \leq |G|
$$

$$
(\lnot b_1^2 \lor \lnot b_j^3), \\\\
0 \leq i \leq t_2, 0 \leq j \leq t_3, i + j r + 1
$$

The $b$ variables exist for all internal nodes in a binary tree with $c = \lceil \text{log}_2(r) \rceil$ levels.
Each internal node is assigned $t_k = min(r, 2^{c - d})$ $b$ variables, where $d$ is the depth of node $k$.
The leaves are set to $\lnot C$, and $b_i^k$ being set true means there are at least $i$ $C$ variables set `false` in the leaves that descend from $k$.
Using this method requires adding $O(|G|)$ $b$ variables to the SAT implementation, which are not present in the ILP version, however - consistent with the ILP implementation - the number of variables for the whole CNF formula remains $O(n |G|)$.
