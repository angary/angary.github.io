---
title: "Harmonic numbers in short circuit evaluation"
description: "Why many randomised algorithms in systems scale logarithmically."
date: "2025-11-29"
mathjax: true
hljs: true
---


## Introduction

> The purpose of this post is to give me a reference to explain a common misunderstanding in "stop-early" situations.

We start by analysing the following algorithm

```py
def f(xs: int):
    curr_max = xs[0]
    for x in xs[1:]:
        if x > curr_max: # How many times is this true?
            curr_max = x
```

A common first guess is that it will take on average $\frac{n}{2}$ checks, which is $O(n)$. However, the actual average number of checks is the $n$-th harmonic number, $H_n$.

$$ E[\text{checks}] = H_n = \sum_{k=1}^n \frac{1}{k} $$

For large $n$, the harmonic number can be approximated by the natural logarithm:

$$ H_n \approx \ln n + \gamma $$

where $\gamma \approx 0.57721$ is the Euler-Mascheroni constant. This means the average number of checks is actually $\Theta(\ln n)$.

```tikz
\begin{tikzpicture}
\begin{axis}[
    title={Harmonic Numbers vs. Natural Logarithm},
    xlabel={no\# conditions},
    ylabel={no\# checks},
    label style={scale=1.2},
    legend pos=north west,
    grid=major,
    xmin=0, xmax=53.9,
    ymin=0, ymax=5,
    width=2\textwidth, % Make it wider
    height=\textwidth
]

\addplot[
    ybar, % Makes it a bar graph
    bar width=1,
    fill, % Fills the bars
    fill opacity=0.01, % Make it transparent
] table {
    x y
    1 1
    2 1.5
    3 1.8333333333333333
    4 2.083333333333333
    5 2.283333333333333
    6 2.45
    7 2.592857142857143
    8 2.717857142857143
    9 2.828968253968254
    10 2.928968253968254
    11 3.0198773448773446
    12 3.103210678210678
    13 3.180133755133755
    14 3.2515623265623263
    15 3.318228993228993
    16 3.380728993228993
    17 3.4395525226392383
    18 3.495108078194794
    19 3.5477396569251644
    20 3.5977396569251645
    21 3.645358704544212
    22 3.6908132499987577
    23 3.7343110277765357
    24 3.775977694443202
    25 3.815977694443202
    26 3.8544491230146306
    27 3.8914861600516675
    28 3.927200445765953
    29 3.961689230553744
    30 3.994989230553744
    31 4.02724640166661
    32 4.05849640166661
    33 4.088824179444388
    34 4.118239465158673
    35 4.1468108937299585
    36 4.174588671507736
    37 4.201625708544773
    38 4.227943486322551
    39 4.253575264099996
    40 4.278575264099996
    41 4.302945752316526
    42 4.3267571808879545
    43 4.350020817251591
    44 4.372748089978864
    45 4.394970312190985
    46 4.41669466542799
    47 4.438016483599692
    48 4.458849816933025
    49 4.479260021035066
    50 4.499205021035066
};
\addlegendentry{$H_n = \sum_{k=1}^n \frac{1}{k}$}
\addplot[
    domain=1:50,
    samples=50,
    smooth,
] {ln(x)};
\addlegendentry{$\ln(n)$}

\end{axis}
\end{tikzpicture}
```

## The Proof

Let 

$$
X = \text{number of checks until a stopping item is found}
$$

We want to prove for $E[X]$ (the expected number of checks) to be


$$
E[X] = H_n = 1 + \frac{1}{2} + \frac{1}{3} + ... + \frac{1}{n}.
$$

1. For $i = 1, 2, 3, ..., n$ define the indicator random variable

    $$
    X_i =
    \begin{cases}
        1 & \quad \text{if position $i$ is a stopping element,} \\\\
        0 & \quad \text{otherwise}
    \end{cases}
    $$

    The total number of records is $X = X_1 + X_2 + ... + X_n$
2. By linearity of expectation,
    $$
    E[X] = \sum_{i=1}^n E[X_i] = \sum_{i=1}^n P(X_i = 1)
    $$
3. Compute $P(X_i = 1)$.
    Among the first $i$ items, any one of them is equally likely to be the stopping element since the permutation is uniform.
    So the probability that the $i$-th element is a stopping element of the first $i$ elements is exactly $\frac{1}{i}$.
    Therefore

    $$
    P(X_i = 1) = \frac{1}{i}
    $$
4. Substitute
    $$
    E[X] = \sum_{i=1}^n \frac{1}{i} = H_n
    $$

## Real life cases

This appears often in algorithms and system design.
This is because many things involves sequential checks with decreasing probabilities and early stopping.
