---
title: "Dynamic Programming as Discrete Calculus of Variations"
description: "Computer science meets classical mechanics"
date: "2026-03-21"
mathjax: true
hljs: true
---

## Preamble
Recently I’ve been enjoying studying physics and the Principle of Stationary Action is a pretty crazy way to rethink mechanics.
It reformulates Newton’s laws where instead of $F=ma$, you say nature takes the path of stationary action.
Strangely it felt like I’ve seen this structure before: condition on what you observe, solve for the path you aim to predict.
Intuitively, this felt very similar to what a dynamic programming algorithm: the Viterbi algorithm does for a Hidden Markov Model.

## Introduction

It turns out dynamic programming can be viewed as a discrete analogue of the calculus of variations - both are frameworks for optimizing over paths, one discrete and one continuous.

The calculus of variations asks: given a cost that depends on a path, which path makes the total cost stationary?
Where ordinary calculus finds the input $x$ that minimises $f(x)$, the calculus of variations finds the *function* $q(t)$ that makes a functional $J[q] = \int_0^T L(q, \dot{q}, t)\, dt$ stationary.

> Note a "functional" takes a function as input and returns a scalar, i.e. `J: (R -> R) -> R` - a definite integral is a common example.

To get there, I'll build off a simple CS problem until we've recovered the Principle of Stationary Action for a particle in one dimension (extending to higher dimensions is left as an exercise for the reader).

## Shortest Path on a Grid

Starting off with a classic computer science problem -
suppose we have an $n \times m$ grid where each edge has a transition cost.
Starting at $(0, 0)$, we want to find the shortest path to all other nodes, moving only right or down.

```tikz
\def\sx{3.0}   % horizontal spacing
\def\sy{1.0}   % vertical spacing
\def\nc{5}     % n_cols - 1  (6 columns = indices 0..5)
\def\nr{4}     % n_rows - 1  (5 rows    = indices 0..4)

% Horizontal edges
\foreach \i in {0,...,\nr} {
  \foreach \j in {0,...,\numexpr\nc-1} {
    \draw ({\j*\sx},{-\i*\sy}) -- ({(\j+1)*\sx},{-\i*\sy});
  }
}

% Vertical edges
\foreach \i in {0,...,\numexpr\nr-1} {
  \foreach \j in {0,...,\nc} {
    \draw ({\j*\sx},{-\i*\sy}) -- ({\j*\sx},{-(\i+1)*\sy});
  }
}

% Nodes
\foreach \i in {0,...,\nr} {
  \foreach \j in {0,...,\nc} {
    \filldraw[fill=white] ({\j*\sx},{-\i*\sy}) circle (6pt);
  }
}

% Labels
\node[above left=4pt, font=\large] at (0,0) {$(0,0)$};
\node[below right=4pt, font=\large] at ({\nc*\sx},{-\nr*\sy}) {$(n,m)$};

% Caption
\node[below=12pt, font=\large\itshape] at ({0.5*\nc*\sx},{-\nr*\sy}) {Our $n \times m$ grid};
```

For a brute force approach, we have $O(2^{n+m})$ cases to check.
However, with dynamic programming we can reduce this to $O(nm)$.

Suppose the shortest path from $(0,0)$ to some node $(i,j)$ goes through an intermediate node $(i',j')$.
Then the sub-path from $(0,0)$ to $(i',j')$ must itself be the shortest - if it weren't, we could swap in a cheaper prefix and get a cheaper overall path, a contradiction.

This lets us build up the solution incrementally - rather than considering all possible paths, at each node we just answer:

> What’s the cheapest way to reach here?

Since the answer only depends on the cheapest way to reach each predecessor, we can fill the table left-to-right, top-to-bottom.
This is the principle of **optimal substructure** - sub-paths of optimal paths are themselves optimal.

To write the recurrence, we need a cost function for each edge.
Since we can only move right or down, each edge can be uniquely identified by its starting node $(i, j)$ and direction $d \in \\{\rightarrow, \downarrow\\}$.
So the minimum number of parameters is:

$$
c(i, j, d)
$$

This gives us the recurrence:

$$
S(i, j) = \min \\{ S(i-1,j) + c(i-1, j, \downarrow),\\ S(i, j-1) + c(i, j-1, \rightarrow) \\}
$$

where $S(i, j)$ is the minimum cost to reach cell $(i, j)$. This is known as the Bellman equation.

```py
def shortest_path(cost: callable, n: int, m: int):
    S = init_dp(n, m) # cost table
    P = init_dp(n, m) # predecessor table
    for i in range(1, n+1):
        for j in range(1, m+1):
            best = float('inf')
            for (ip, jp) in predecessors(i, j):
                candidate = S[ip][jp] + cost(ip, jp, i, j)
                if candidate < best:
                    best = candidate
                    P[i][j] = (ip, jp)
            S[i][j] = best
    return P
```

To reconstruct the actual shortest path, we can trace back through the predecessor table from any endpoint:

```py
def trace_path(P, i: int, j: int) -> list[tuple[int, int]]:
    if (i, j) == (0, 0):
        return [(0, 0)]
    return trace_path(P, *P[i][j]) + [(i, j)]
```

## Reframing to Space and Time

We'll make three changes to our grid problem to connect it to more "practical" physics
1. Relabel the dimensions as space and time,
2. Enforce that time always advances
3. Allow higher velocities

### Relabelling Dimensions

1. columns are now time values $t = 0, 1, ..., T$ (renaming $m \to T$)
2. rows are now position values $q = 0, 1, ..., Q$ (renaming $n \to Q$)

Nothing mathematically has changed - it's the same code and recurrence, just reinterpreted.
The grid is now a discrete $q$-$t$ state space, and a path through it is a trajectory $q(t)$.

### Enforcing Time

We now impose a key constraint: **time must always advance** - every step must move us to the next time column.
This removes the old vertical edges (which advanced $q$ without advancing $t$).

In their place, each step goes from $(q, t)$ to either $(q, t+1)$ (stay in place, $\dot{q}=0$) or $(q+1, t+1)$ (move one step, $\dot{q}=1$).

```tikz
\def\sx{3.0}   % horizontal spacing
\def\sy{1.0}   % vertical spacing
\def\nc{5}     % n_cols - 1  (6 columns = indices 0..5)
\def\nr{4}     % n_rows - 1  (5 rows    = indices 0..4)

% Velocity 0 edges (horizontal) - only from reachable nodes (q <= t)
\foreach \i in {0,...,\nr} {
  \foreach \j in {0,...,\numexpr\nc-1} {
    \ifnum\i>\j\else
      \draw ({\j*\sx},{-\i*\sy}) -- ({(\j+1)*\sx},{-\i*\sy});
    \fi
  }
}

% Velocity 1 edges (diagonal by 1) - only from reachable nodes (q <= t)
\foreach \i in {0,...,\numexpr\nr-1} {
  \foreach \j in {0,...,\numexpr\nc-1} {
    \ifnum\i>\j\else
      \draw ({\j*\sx},{-\i*\sy}) -- ({(\j+1)*\sx},{-(\i+1)*\sy});
    \fi
  }
}

% Nodes - only reachable (q <= t)
\foreach \i in {0,...,\nr} {
  \foreach \j in {0,...,\nc} {
    \ifnum\i>\j\else
      \filldraw[fill=white] ({\j*\sx},{-\i*\sy}) circle (6pt);
    \fi
  }
}

% Labels
\node[above left=4pt, font=\large] at (0,0) {$(0,0)$};
\node[below right=4pt, font=\large] at ({\nc*\sx},{-\nr*\sy}) {$(Q,T)$};

% Axis labels
\node[left=6pt, font=\large] at (0,{-0.5*\nr*\sy}) {$q$};
\node[below=6pt, font=\large] at ({0.5*\nc*\sx},{-\nr*\sy}) {$t$};

% Caption
\node[below=32pt, font=\large\itshape] at ({0.5*\nc*\sx},{-\nr*\sy}) {Edges after enforcing time must advance, $\dot{q} \in \{0, 1\}$};
```

> As a side benefit: Since time only moves forward, the graph is topologically ordered - we can just sweep left to right in our DP algorithm


### Enabling higher velocity

Our existing edges enforce a "very constraining" velocity $\dot{q} \in \\{0, 1\\}$.
To allow discrete velocities $\dot{q} > 1$, we introduce new edges that allow us to transition from state $(q, t)$ to $(q + \dot{q},\ t + 1)$ for any $\dot{q} \in \\{0, 1, \ldots, Q\\}$.

```tikz
\def\sx{3.0}   % horizontal spacing
\def\sy{1.0}   % vertical spacing
\def\nc{5}     % n_cols - 1  (6 columns = indices 0..5)
\def\nr{4}     % n_rows - 1  (5 rows    = indices 0..4)

% Velocity edges: from reachable (i,j) to (i+k, j+1)
% Reachable: j>0 (any row), or j=0 and i=0 (origin only)
\foreach \j in {0,...,\numexpr\nc-1} {
  \foreach \i in {0,...,\nr} {
    \ifnum\j>0
      \pgfmathtruncatemacro{\maxk}{\nr-\i}
      \foreach \k in {0,...,\maxk} {
        \draw ({\j*\sx},{-\i*\sy}) -- ({(\j+1)*\sx},{-(\i+\k)*\sy});
      }
    \else
      \ifnum\i=0
        \pgfmathtruncatemacro{\maxk}{\nr-\i}
        \foreach \k in {0,...,\maxk} {
          \draw ({\j*\sx},{-\i*\sy}) -- ({(\j+1)*\sx},{-(\i+\k)*\sy});
        }
      \fi
    \fi
  }
}

% Nodes - reachable only
\foreach \i in {0,...,\nr} {
  \foreach \j in {0,...,\nc} {
    \ifnum\j>0
      \filldraw[fill=white] ({\j*\sx},{-\i*\sy}) circle (6pt);
    \else
      \ifnum\i=0
        \filldraw[fill=white] ({\j*\sx},{-\i*\sy}) circle (6pt);
      \fi
    \fi
  }
}

% Labels
\node[above left=4pt, font=\large] at (0,0) {$(0,0)$};
\node[below right=4pt, font=\large] at ({\nc*\sx},{-\nr*\sy}) {$(Q,T)$};

% Axis labels
\node[left=6pt, font=\large] at (0,{-0.5*\nr*\sy}) {$q$};
\node[below=6pt, font=\large] at ({0.5*\nc*\sx},{-\nr*\sy}) {$t$};

% Caption
\node[below=32pt, font=\large\itshape] at ({0.5*\nc*\sx},{-\nr*\sy}) {Edges after allowing velocity $\dot{q} = 0, 1, \ldots, Q$};
```

> To simplify things for our example, we've constrained ourselves to "positive velocities", hence there are no edges going "up and right".

### Reformulating our cost function

Since we introduced more edges, we need to update our cost function, as a cost had to be defined for each edge.

An edge is now determined by three things:
1. $q_i$ the starting position
2. $q_j$ the ending position
3. $t$ the starting time

$$
cost(q_i \rightarrow q_j, t)
$$

However, we can replace the ending position with velocity. Since discrete velocity is defined as

$$
\dot{q} = \frac{q_j - q_i}{\Delta t}
$$

we can recover $q_j$ from $q_i$, $\dot{q}$, and $\Delta t$ - so we can equivalently write the cost as $cost(q, \dot{q}, t)$ without losing any information.

Our recurrence becomes:

$$
S(q, t) = \min_{q_p \in \text{pred}(q)} \big[ S(q_p, t-1) + cost(q_p, \dot{q}, t-1) \big]
$$

where $\dot{q} = q - q_p$ (since $\Delta t = 1$) and $\text{pred}(q)$ is short for "predecessor of $q$".

```py
def shortest_path(cost: callable, Q: int, T: int):
    S = init_dp(Q, T)
    P = init_dp(Q, T)
    for t in range(1, T+1):
        for q in range(Q+1):
            best = float('inf')
            for qp in predecessors(q):
                dq = q - qp
                candidate = S[qp][t-1] + cost(qp, dq, t-1)
                if candidate < best:
                    best = candidate
                    P[q][t] = qp
            S[q][t] = best
    return P
```

Now you may be wondering the motivation for why we reformulated to use velocity rather than start and end position.
The answer: $cost(q, \dot{q}, t)$ is already in the form of a Lagrangian (which will be very important for the next part).

## Taking the Continuous Limit

### Cost: sum becomes integral

So far we have total cost of a discrete path as

$$
\sum_{t=0}^{T-1} cost(q_t, \dot{q}_t, t)
$$

Now shrink the grid spacing - divide $[0, T]$ into $N$ steps each of width $\Delta t = T/N$, and let $N \to \infty$.
For the discrete sum to converge to a finite limit, each per-step cost must shrink proportionally with the step size.
Concretely, we require $cost(q, \dot{q}, t) = L(q, \dot{q}, t) \cdot \Delta t$ for some function $L$ that stays bounded as $\Delta t \to 0$.
Then the Riemann sum converges to an integral:

$$
\sum_{k=0}^{N-1} L\big(q_k,\ \dot{q}_k,\ t_k\big)\,\Delta t \;\xrightarrow{\Delta t \to 0} \int_0^T L\big(q(t),\ \dot{q}(t),\ t\big)\, dt
$$

This $L$ is the **Lagrangian** - the continuous version of the per-step cost.
Making the discrete total cost stationary now becomes making the integral of $L$ stationary - this integral is called the **action**.

### Optimality: predecessors become perturbations

The two formulations optimise differently but, for the physical systems we care about, arrive at the same path.

- In DP, we explicitly **minimise** - at each step we pick the cheapest predecessor, so the optimal path is the one where no single-step swap can reduce the total cost.

    $$
    S(q, t) = \min_{q_p} \big[ S(q_p, t-1) + cost(q_p, \dot{q}, t-1) \big]
    $$

    If the current path isn't optimal, there exists some predecessor $q_p$ that gives a lower cost - so we swap it in.

- In the continuous case there are no discrete predecessors - instead we nudge the entire path by a small smooth bump $\delta q(t)$ that vanishes at the endpoints, and ask whether the cost changes:

    $$
    \delta J = J[q + \delta q] - J[q]
    $$

    If the path is **stationary**, $\delta J = 0$ for every such bump. Working through the calculus gives:

    $$
    \delta J = \int_0^T \left(\frac{\partial L}{\partial q} - \frac{d}{dt}\frac{\partial L}{\partial \dot{q}}\right) \delta q \; dt = 0
    $$

    Since this must hold for *every* bump $\delta q$, the bracketed term must be zero everywhere - giving the **Euler-Lagrange equation**:

    $$
    \frac{\partial L}{\partial q} - \frac{d}{dt}\frac{\partial L}{\partial \dot{q}} = 0
    $$

### Summary

|  | Dynamic Programming | Calculus of Variations |
| --- | --- | --- |
| Domain | Discrete states/stages | Continuous paths |
| Objective | $\sum L(q, \dot{q}, t)\,\Delta t$ | $\int L(q, \dot{q}, t)\, dt$ |
| "Is this path optimal?" | No predecessor swap improves it | No perturbation changes it (to first order) |
| Optimality condition | Bellman equation | Euler-Lagrange equation |

> Unlike single-source shortest path, physics fixes both endpoints so we run the full DP table as before, then fix a destination $(Q, T)$ and trace back.

## Simulating a Particle with DP

We've gone from discrete to continuous - now let's come full circle and use DP to simulate a physical particle.

### The Lagrangian for a particle

The Lagrangian is defined as $L = T - V$, where $T$ is kinetic energy and $V$ is potential energy.
For a particle in one dimension under a constant force field of magnitude $a$ in the positive $q$ direction (and setting $m = 1$ for simplicity), the kinetic energy is $T = \frac{1}{2}\dot{q}^2$ and the potential energy is $V(q) = -aq$ (decreasing in the direction of the force):

$$
\begin{align}
L(q, \dot{q}) &= T - V \\\\
&= \frac{1}{2} \dot{q}^2 - (-aq) \\\\
&= \frac{1}{2} \dot{q}^2 + aq
\end{align}
$$
Plugging this into the Euler-Lagrange equation gives back $\ddot{q} = a$ - exactly Newton's second law:

$$
\frac{\partial L}{\partial q} - \frac{d}{dt}\frac{\partial L}{\partial \dot{q}} = 0 \implies a - \ddot{q} = 0 \implies \ddot{q} = a
$$

### Discretising the Lagrangian

Now we just need to use this Lagrangian as our cost function.
On our discrete grid with $\Delta t = 1$:

$$
cost(q, \dot{q}, t) = \frac{1}{2} \dot{q}^2 + aq
$$

where $\dot{q} = q_{t+1} - q_t$ is the discrete velocity.


### Implementation

Let's simulate a particle under a constant force field ($V(q) = -aq$, force in the positive $q$ direction) starting from $q(0) = 0$.

```py
def simulate_particle(a: int, Q: int, T: int):
    S = init_dp(Q, T)
    P = init_dp(Q, T)
    for t in range(1, T + 1):
        for q in range(Q + 1):
            best = float('inf')
            for qp in predecessors(q):
                dq = q - qp
                candidate = S[qp][t-1] + cost(qp, dq, a)
                if candidate < best:
                    best = candidate
                    P[q][t] = qp
            S[q][t] = best
    return P
```

The DP computes $S(q, t)$ - the minimum action from $(0, 0)$ to every point $(q, t)$ in the state space.
To extract a specific physical trajectory, we pick a fixed endpoint $(Q, T)$ and trace back through the predecessors.
The position gaps grow each time step - the particle accelerates, just as we'd expect in a constant field.

```tikz
\def\sx{3.0}
\def\sy{1.0}
\def\nc{5}     % n_cols - 1  (6 columns = indices 0..5)
\def\nr{10}    % n_rows - 1  (11 rows   = indices 0..10)

% Background velocity edges (low opacity)
\foreach \j in {0,...,\numexpr\nc-1} {
  \foreach \i in {0,...,\nr} {
    \ifnum\j>0
      \pgfmathtruncatemacro{\maxk}{\nr-\i}
      \foreach \k in {0,...,\maxk} {
        \draw[opacity=0.12] ({\j*\sx},{-\i*\sy}) -- ({(\j+1)*\sx},{-(\i+\k)*\sy});
      }
    \else
      \ifnum\i=0
        \pgfmathtruncatemacro{\maxk}{\nr-\i}
        \foreach \k in {0,...,\maxk} {
          \draw[opacity=0.12] ({\j*\sx},{-\i*\sy}) -- ({(\j+1)*\sx},{-(\i+\k)*\sy});
        }
      \fi
    \fi
  }
}

% Background nodes with S(q,t) values
% t=1
\foreach \q/\cost in {0/0, 1/.5, 2/2, 3/4.5, 4/8, 5/12.5, 6/18, 7/24.5, 8/32, 9/40.5, 10/50} {
  \filldraw[fill=white, draw opacity=0.15, fill opacity=1] ({\sx},{-\q*\sy}) circle (10pt);
  \node[font=\tiny, opacity=0.4] at ({\sx},{-\q*\sy}) {$\cost$};
}
% t=2
\foreach \q/\cost in {0/0, 1/.5, 2/2, 3/3.5, 4/6, 5/8.5, 6/12, 7/15.5, 8/20, 9/24.5, 10/30} {
  \filldraw[fill=white, draw opacity=0.15, fill opacity=1] ({2*\sx},{-\q*\sy}) circle (10pt);
  \node[font=\tiny, opacity=0.4] at ({2*\sx},{-\q*\sy}) {$\cost$};
}
% t=3
\foreach \q/\cost in {0/0, 1/.5, 2/2, 3/3.5, 4/6, 5/8.5, 6/11, 7/14.5, 8/18, 9/21.5, 10/26} {
  \filldraw[fill=white, draw opacity=0.15, fill opacity=1] ({3*\sx},{-\q*\sy}) circle (10pt);
  \node[font=\tiny, opacity=0.4] at ({3*\sx},{-\q*\sy}) {$\cost$};
}
% t=4
\foreach \q/\cost in {0/0, 1/.5, 2/2, 3/3.5, 4/6, 5/8.5, 6/11, 7/14.5, 8/18, 9/21.5, 10/25} {
  \filldraw[fill=white, draw opacity=0.15, fill opacity=1] ({4*\sx},{-\q*\sy}) circle (10pt);
  \node[font=\tiny, opacity=0.4] at ({4*\sx},{-\q*\sy}) {$\cost$};
}
% t=5
\foreach \q/\cost in {0/0, 1/.5, 2/2, 3/3.5, 4/6, 5/8.5, 6/11, 7/14.5, 8/18, 9/21.5, 10/25} {
  \filldraw[fill=white, draw opacity=0.15, fill opacity=1] ({5*\sx},{-\q*\sy}) circle (10pt);
  \node[font=\tiny, opacity=0.4] at ({5*\sx},{-\q*\sy}) {$\cost$};
}

% Trajectory edges (full opacity) with Lagrangian labels
\draw[thick] (0, 0) -- ({\sx}, 0) node[midway, above=4pt, font=\scriptsize] {$L=0$};
\draw[thick] ({\sx}, 0) -- ({2*\sx}, {-1*\sy}) node[midway, above=4pt, font=\scriptsize] {$L=.5$};
\draw[thick] ({2*\sx}, {-1*\sy}) -- ({3*\sx}, {-3*\sy}) node[midway, left=4pt, font=\scriptsize] {$L=3$};
\draw[thick] ({3*\sx}, {-3*\sy}) -- ({4*\sx}, {-6*\sy}) node[midway, left=4pt, font=\scriptsize] {$L=7.5$};
\draw[thick] ({4*\sx}, {-6*\sy}) -- ({5*\sx}, {-10*\sy}) node[midway, left=4pt, font=\scriptsize] {$L=14$};

% Trajectory nodes with S values (full opacity, on top)
\foreach \t/\q/\cost in {0/0/0, 1/0/0, 2/1/.5, 3/3/3.5, 4/6/11, 5/10/25} {
  \filldraw[fill=white] ({\t*\sx}, {-\q*\sy}) circle (10pt);
  \node[font=\tiny] at ({\t*\sx}, {-\q*\sy}) {$\cost$};
}

% Node coordinate labels (trajectory only)
\node[above left=10pt, font=\large] at (0, 0) {$(0, 0)$};
\node[above right=10pt, font=\large] at ({\sx}, 0) {$(0, 1)$};
\node[above right=10pt, font=\large] at ({2*\sx}, {-1*\sy}) {$(1, 2)$};
\node[above right=10pt, font=\large] at ({3*\sx}, {-3*\sy}) {$(3, 3)$};
\node[above right=10pt, font=\large] at ({4*\sx}, {-6*\sy}) {$(6, 4)$};
\node[above right=10pt, font=\large] at ({5*\sx}, {-10*\sy}) {$(10, 5)$};

% Axis labels
\node[left=6pt, font=\large] at (0, {-5*\sy}) {$q$};
\node[below=6pt, font=\large] at ({2.5*\sx}, {-10*\sy}) {$t$};

% Caption
\node[below=32pt, font=\large\itshape] at ({2.5*\sx}, {-10*\sy}) {Particle trajectory in a constant force field ($a = 1$, $q(0) = 0$, $q(T) = 10$)};
```

The vertex costs above show $S^{\mathrm{in}}(q, t)$ — the minimum action to reach each state from the origin.
Running the same DP in reverse from $(10, 5)$ gives $S^{\mathrm{out}}(q, t)$ — the minimum action to continue from each state to the destination.
Their sum is the total cost of passing through each point, plotted below — the optimal trajectory is the valley floor, where $S^{\mathrm{in}} + S^{\mathrm{out}}$ is minimised.

```tikz
\begin{axis}[
  view={-30}{30},
  xlabel={$t$},
  ylabel={$q$},
  zlabel={$S^{\mathrm{in}} + S^{\mathrm{out}}$},
  xlabel style={font=\large},
  ylabel style={font=\large},
  zlabel style={font=\large},
  tick label style={font=\normalsize},
  width=14cm,
  height=12cm,
  mesh/rows=5,
  colormap={bw}{color(0cm)=(white); color(1cm)=(white)},
]
\addplot3[surf, opacity=0.8, faceted color=black!50] coordinates {
  (1,0,25) (1,1,26) (1,2,28) (1,3,31) (1,4,35) (1,5,41) (1,6,48) (1,7,56) (1,8,66) (1,9,77) (1,10,90)

  (2,0,26) (2,1,25) (2,2,26) (2,3,27) (2,4,29) (2,5,32) (2,6,36) (2,7,40) (2,8,46) (2,9,52) (2,10,60)

  (3,0,30) (3,1,27) (3,2,26) (3,3,25) (3,4,26) (3,5,27) (3,6,29) (3,7,32) (3,8,36) (3,9,40) (3,10,46)

  (4,0,50) (4,1,42) (4,2,36) (4,3,31) (4,4,28) (4,5,26) (4,6,25) (4,7,26) (4,8,28) (4,9,31) (4,10,35)

  (5,0,90) (5,1,77) (5,2,66) (5,3,56) (5,4,48) (5,5,41) (5,6,35) (5,7,31) (5,8,28) (5,9,26) (5,10,25)
};
% Trajectory line along the valley floor
\addplot3[thick, mark=*, mark size=2pt] coordinates {
  (1,0,25) (2,1,25) (3,3,25) (4,6,25) (5,10,25)
};
\end{axis}
\node[below=8pt, font=\large\itshape] at (current bounding box.south) {Total action $S^{\mathrm{in}} + S^{\mathrm{out}}$ --- the optimal trajectory follows the valley floor};
```

Our particle simulation recovered the correct physics (yay) - but we didn't have to solve the Euler-Lagrange equation or differentiate anything.
We just evaluated the Lagrangian and took the min (bigger yay).
This hints at DP's benefit: it doesn't require $L$ to be smooth or even differentiable.

## Conclusion

So the intuition from the preamble was right - DP and the calculus of variations really are the same idea at different resolutions.
Both ask "which path minimises total cost?", one by sweeping a DAG, the other by solving a differential equation.
We started with shortest path on a grid and ended up at the same place as the Principle of Stationary Action.

Whilst the Euler-Lagrange equation needs $L$ to be smooth,
DP doesn't care, all it needs is optimal substructure and there lies a benefit (we don't talk about runtime and curse of dimensionality).
