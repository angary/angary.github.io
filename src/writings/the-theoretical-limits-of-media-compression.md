---
title: "The Theoretical Limits of Media Compression"
description: "How thermodynamics explains codec tuning"
date: "2026-04-18"
type: "Essay"
mathjax: true
---

## Introduction

Working in the media group (i.e. handling with user uploaded audio / images / video) at tech company, we often apply an encoding on uploaded user files. An important decision we make when choosing the encoding options is the tradeoff between "file size" and "file quality".

```tikz
% Title
\node[font=\Large\itshape] at (7, 1.5) {An encoded file exists somewhere along this spectrum};

% Single axis: file size spectrum
\draw[<->, thick] (0,0) -- (14,0);

% Tick marks
\draw[thick] (1, -0.15) -- (1, 0.15);
\draw[thick] (13, -0.15) -- (13, 0.15);

% Top labels (file size)
\node[above, font=\large] at (1, 0.2) {small file};
\node[above, font=\large] at (13, 0.2) {large file};

% Bottom labels (quality)
\node[below, font=\large] at (1, -0.2) {low quality};
\node[below, font=\large] at (13, -0.2) {high quality};
```

The more we can compress our files, the more we can save on storage / network costs.
With millions of users and files in the MBs to GBs range, a small % in savings can result in relatively huge absolute numbers.

Of course this comes with downsides, compressing the file can decrease the file quality (and customer satisfaction \**ahem*\* looking at you Facebook Messenger for compressing all my videos from my highschool days).

But file size and quality are two separate dimensions.
If we view quality as a function of file size, what function describes the theoretical best quality we can get for a specified file size?

```tikz
% Title
\node[font=\Large\itshape] at (5, 7.5) {What is $f$?};

% Axes
\draw[->, thick] (0,0) -- (10,0) node[below, font=\large] {File size};
\draw[->, thick] (0,0) -- (0,7) node[left, font=\large] {Quality};

% f(x) curve with question mark
\draw[thick] plot[smooth, tension=0.7] coordinates {
  (0.3, 0.3) (1.5, 2.5) (3, 4.0) (5, 5.2) (7, 5.9) (9.5, 6.3)
};

% Label the curve
\node[below right, font=\large] at (7.5, 5.5) {Quality $= f($File size$)$};
```

## Lossless Compression

First, I'll do a quick refresher on lossless compression since it'll contain some important concepts usually introduced (and usually forgotten) in CS undergrad.

The hard limit on lossless compression (where the original is perfectly recoverable) is the **entropy** of the source:

$$
H(X) = -\sum_x p(x) \log_2 p(x)
$$

where $p(x)$ is the probability of a symbol $x$.
Entropy measures the "average surprise" - a predictable source has low entropy (few bits needed), while an unpredictable source has high entropy (can't compress at all).

For a coin flip with probability $p$ of heads, the entropy $H = -p\log_2 p - (1-p)\log_2(1-p)$ looks like:

```tikz
\begin{axis}[
  width=10cm,
  height=7cm,
  xlabel={$p$},
  ylabel={$H$ (bits)},
  xlabel style={font=\large},
  ylabel style={font=\large},
  tick label style={font=\large},
  xmin=0, xmax=1,
  ymin=0, ymax=1.15,
  domain=0.01:0.99,
  samples=100,
  grid=major,
  grid style={gray!30},
]
\addplot[thick, black] {-x*ln(x)/ln(2) - (1-x)*ln(1-x)/ln(2)};
\node[font=\large, above] at (axis cs:0.5, 1.0) {max entropy at $p = 0.5$};
\node[font=\large, right] at (axis cs:0.05, 0.15) {predictable};
\node[font=\large, left] at (axis cs:0.95, 0.15) {predictable};
\end{axis}
```

The outcomes of a biased coin ($p \approx 0$ or $p \approx 1$) is predictable and compresses well.
A helpful way to think about this is how Huffman encoding more efficiently compresses long strings of H or T the more frequent they are.
Long strings of H or T would appear more frequently the more biased the coin is.

## Lossy Compression

But media codecs go far beyond the entropy limit every day - a raw 1080p frame at 24fps is about 1.5 Gbps, yet streaming services deliver it at around 5 Mbps, a 300x reduction.

```tikz
% Title
\node[font=\Large\itshape] at (6, 3.3) {Bitrate of 1080p 24fps video};

% Raw
\node[left, font=\large] at (0, 2) {Raw};
\draw[thick] (0.2, 1.7) rectangle (12, 2.3);
\node[right, font=\large] at (12.1, 2) {1500 Mbps};

% Lossless
\node[left, font=\large] at (0, 0.8) {Lossless};
\draw[thick] (0.2, 0.5) rectangle (6, 1.1);
\node[right, font=\large] at (6.1, 0.8) {750 Mbps};

% Lossy
\node[left, font=\large] at (0, -0.4) {Lossy};
\draw[thick] (0.2, -0.7) rectangle (0.24, -0.1);
\node[right, font=\large] at (0.35, -0.4) {5 Mbps};
```

This is because they use **lossy** compression - the decoder's output isn't identical to the original, just close enough that it's not perceivable by humans, i.e. 

- We're far more sensitive to brightness than colour - colour can be stored at lower resolution without anyone noticing
- Loud sounds mask quieter sounds at nearby frequencies - the encoder can skip the masked parts entirely
- Adjacent video frames are almost identical - the encoder only stores what changed between frames

The question becomes: if we tolerate some distortion, how few bits do we actually need?

## Rate-Distortion Theory

Suppose you have a source of data drawn from distribution $p(x)$ - audio samples, video frames, whatever.
You want to compress each sample $x$ into a reconstruction $\hat{x}$.

The encoder is a conditional distribution $q(\hat{x} | x)$ - for a given input $x$, it gives the probability of producing each possible reconstruction $\hat{x}$.

The reconstruction won't be perfect, so we need a way to measure how far off it is.
This is the **distortion function** $d(x, \hat{x})$ - it takes the original and the reconstruction and returns a number representing how different they are.

There are multiple types of distortion functions, i.e.

1. **signal** level i.e. **squared error** $d(x, \hat{x}) = (x - \hat{x})^2$
2. **human perceptual** level i.e. **VMAF** (Video Multimethod Assessment Fusion) - Netflix's machine-learned metric that combines multiple features to predict human quality scores

But we'll soon see that rate-distortion theory works regardless of what distortion function we choose.

We want to find the encoder that uses the fewest bits while keeping distortion acceptable. This is a tradeoff between two things - rate $R$ (bits used) and distortion $D$ (quality lost) - and we can express it directly as a single objective using a Lagrange multiplier $\lambda$:

$$
\begin{align*}
\mathcal{L}
  &= R + \lambda D \\\\
  &= I(X; \hat{X}) + \lambda  \mathbb{E}[d(x, \hat{x})]
\end{align*}
$$

| Symbol                          | Name | Description |
| ------------------------------- | ---- | ----------- |
| $R = I(X; \hat{X})$             | Rate | mutual information between source $X$ and reconstruction $\hat{X}$ or bitrate |
| $D = \mathbb{E}[d(x, \hat{x})]$ | Distortion | the expected distortion, averaged over all inputs |
| $\lambda$                       | Lagrange multiplier | controls weighting between rate and distortion |

Sweeping $\lambda$ from $0$ to $\infty$ and solving for the optimal encoder at each value traces out the **rate-distortion curve** $R(D)$ - the theoretical best rate at every distortion level:

```tikz
% Title
\node[font=\Large\itshape] at (5, 7.5) {The rate-distortion curve $R(D)$};

% Axes
\draw[->, thick] (0,0) -- (10,0) node[below, font=\large] {Distortion $D$};
\draw[->, thick] (0,0) -- (0,7) node[left, font=\large] {Rate $R$ (bits)};

% R(D) curve
\draw[thick] plot[smooth, tension=0.7] coordinates {
  (0.3, 6.5) (1, 4.5) (2, 3.0) (3.5, 2.0) (5.5, 1.2) (8, 0.5) (9.5, 0.2)
};

% Impossible region
\node[font=\large] at (2, 1.0) {impossible};

% Achievable region
\node[font=\large] at (7, 4.0) {achievable};

% Example points
\filldraw (2, 4.5) circle (2pt);
\node[right, font=\large] at (2.1, 4.5) {real codec (suboptimal)};

\filldraw (2, 3.0) circle (2pt);
\node[right, font=\large] at (2.1, 3.0) {theoretical best};
\draw[dashed, thin] (2, 0) -- (2, 3.0);
```

Any point on the curve is the best possible, but our encoders exist above the curve, with each improvement bringing it closer to the curve.

## Thermodynamics

Short primer if you haven't seen statistical mechanics before - it studies systems with many possible states, each with some energy $E$.
Heat constantly moves the system between states, so rather than sitting in one state, it spends time in many (lower-energy states more often whilst higher-energy states less often).

The **Boltzmann distribution** describes exactly how much time is spent in each state:

$$
p(\text{state}) = \frac{1}{Z} e^{-\beta E(\text{state})}
$$

where $\beta$ is the **inverse temperature** (large $\beta$ = cold, small $\beta$ = hot) and $Z = \sum_{\text{states}} e^{-\beta E}$ is a normalising constant called the partition function.

The system is minimising the **free energy** $F$ where

$$
F = E - \frac{1}{\beta}S
$$

This is a tradeoff - minimise energy (settle into low-energy states) vs maximise entropy $S$ (spread out across many states).
The parameter $\beta$ controls how much you care about each.

```tikz
% Title
\node[font=\Large\itshape] at (5, 8.5) {Boltzmann distribution $\propto e^{-\beta E}$ at different temperatures};

% Axes
\draw[->, thick] (0,0) -- (10,0) node[below, font=\large] {Energy $E$};
\draw[->, thick] (0,0) -- (0,7) node[left, font=\large] {Probability};

% Cold (sharp peak)
\draw[thick] plot[smooth, domain=0.2:9.5, samples=80] (\x, {6.5*exp(-2*(\x-0.2))});

% Medium
\draw[thick, dashed] plot[smooth, domain=0.2:9.5, samples=80] (\x, {4.5*exp(-1*(\x-0.2))});

% Hot (nearly flat)
\draw[thick, dotted] plot[smooth, domain=0.2:9.5, samples=80] (\x, {2.5*exp(-0.5*(\x-0.2))});

% Legend
\draw[thick] (6, 6.5) -- (7.5, 6.5); \node[right, font=\large] at (7.7, 6.5) {cold (low energy states dominate)};
\draw[thick, dashed] (6, 5.8) -- (7.5, 5.8); \node[right, font=\large] at (7.7, 5.8) {warm};
\draw[thick, dotted] (6, 5.1) -- (7.5, 5.1); \node[right, font=\large] at (7.7, 5.1) {hot (states spread out)};
```

Comparing this with our rate-distortion Lagrangian:

$$
\mathcal{L} = R + \lambda D
$$

It's the same structure - we're trying to minimise distortion (energy) vs minimise rate (negative entropy).
The parameter $\lambda$ controls how much you care about each.

## The Equivalence

### Intuition

TLDR: information entropy ($-\sum p \log p$) and thermodynamic entropy ($S = k \log W$) are both counts of configurations - bit sequences vs physical microstates.
We take the $\log$ so independent systems add ($\log W_1 + \log W_2$) instead of multiply ($W_1 \cdot W_2$), which matches how every other physical quantity combines.

When minimising a $\log$ cost function, setting the derivative to zero and isolating $\log q$ gives $\log q = \text{stuff}$, and exponentiating both sides gives $q = e^{\text{stuff}}$.
That's the Boltzmann distribution.

### Formal proof

Expanding mutual information gives you a double sum with a $\log$, and the Lagrangian collapses into:

$$
\mathcal{L}[q] = \sum_{x, \hat{x}} p(x) q(\hat{x} | x) \left[ \log \frac{q(\hat{x} | x)}{q(\hat{x})} + \lambda d(x, \hat{x}) \right]
$$

where $q(\hat{x}) = \sum_x p(x) q(\hat{x}|x)$ is the marginal over reconstructions.
Holding $q(\hat{x})$ fixed and minimising over $q(\hat{x}|x)$ (subject to probabilities summing to 1), the $\log$ in the objective pops out an exponential in the solution:

$$
q^*(\hat{x} | x) = \frac{q(\hat{x})}{Z(x)} e^{-\lambda d(x, \hat{x})}
$$

And there's the Boltzmann distribution, with the same partition function from before.

$$
Z(x) = \sum_{\hat{x}} q(\hat{x}) e^{-\lambda d(x, \hat{x})}
$$

Notice that $d(x, \hat{x})$ enters the Lagrangian linearly (as a coefficient multiplied by $q(\hat{x} | x)$) so the derivative treats it as a constant.
Hence if we change $d$ the "energy landscape" changes, but the Boltzmann form stays the same.


## Encoding Implications

Now we can use this knowledge to gain intuition on what tweaking certain parameters are doing.
I'll use FFmpeg parameters here, but we can essentially map from a video to a physical system (note this is not an exhaustive list).

| Parameter        | Role                     | Physics Analogy |
| ---------------- | ------------------------ | --------------- |
| bitrate          | resource limits          | energy |
| QP               | quality vs bitrate tradeoff | temperature |
| preset           | solve quality            | equilibrium time |
| partitions       | block split size         | degrees of freedom |
| deblock          | smooth block boundaries  | heat diffusion |

Using this model we can view the encoder and its parameters as defining a free-energy functional and the encoding process is the system "relaxing" towards a minimum free-energy state.

There are also some other parameters for "rate-control" 

| Setting | Implication | Physics Analogy |
| ------- | ----------- | --------------- |
| CRF (Constant Rate Factor) | bit rate varies, quality constant with time | canonical ensemble (heat bath to maintain temperature) |
| CBR (Constant Bitrate) | bit rate constant, quality varies with time  | microcanonical ensemble (fixed energy which redistributes itself locally) |
| Two-pass encoding | understanding complexity on first pass then optimising rate control settings before encoding | measuring the energy landscape to set optimal conditions for relaxation |
