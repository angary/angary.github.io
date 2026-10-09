---
title: "Kubernetes Compute Optimisations"
description: "Anecdotal first principles attempt to reduce the world's compute footprint!"
date: "2026-10-10"
type: "Essay"
mathjax: true
---

<details>
  <summary><i>Why am I writing this? (ramble)</i></summary>

  > WHY THIS STYLE?
  >
  > Bit of a departure from my typical writings which I generally aim to be a short "technically interesting and possibly broadly" applicable idea (possibly is doing some heavy lifting here)
  > 
  > Why?
  > Because I like to satisfy the two:
  >
  > - solving problems through first principles (intellectual)
  > - bonus points if it will result in some good for the world (moral)
  >
  > Writing this post is an extension of the above where
  >
  > - explaining things stress test my understanding (intellectual)
  > - sharing this knowledge is a multiplier of my impact (moral)
  >
  > In my opinion there's less of a need for "broad" explainers, now that AI is able to summarise things so well.
  > However, I believe there's still value in shedding light on the "helpful type" of knowledge / having a say what information and knowledge gets spread.
  > 
  > Hence I see more value in talking about specific anecdotal technical problems that can be broadly useful to other readers (thank you whoever you are?).
  >
  > Also it's fun to talk about things you have accomplished that you are passionate about!
  >
  > WHY THIS TOPIC?
  >
  > There's been a shift in sentiment towards the tech industry particularly with data centers and their huge compute demands consuming water, energy, etc.
  > I won't delve into the moralities and politics of the above (haha how often do you find engineers like to do so anyways?) as that's not where my "expertise" lies.
  > 
  > However, I believe we can agree that reducing their compute / memory footprint is good and as engineers there's a a moral duty to improve this within our capacity (+ which engineer doesn't like optimisations?).

</details>

## Context

In my company I work with media processing, which tends to be heavy on compute and memory.
As a bit of a curiosity project, I looked into ways that we could reduce our compute and memory footprint which was happily recieved when it reduced our AWS bill by some big $$$.

I'll cover some lessons learnt whilst maintaining confidentiality by using "general" graphs / charts instead of raw values, and hopefully the ideas will be helpful for you too!

## Kubernetes Resources Overview

Minimum information you'll need to understand how many resources your system is using.

## Instance Types

AWS different compute instances

## Binpacking and Utilisation

What is bin packing, what is the importance of statistics in provisioning

## RAM Optimisations

Save memory through memory arenas, garbage collection


## CPU Optimisations

Maybe some things on waiting threads
