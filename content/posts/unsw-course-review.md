+++
title = "UNSW Course Review"
description = "Review on courses I've taken at UNSW"
type = ["posts","post"]
tags = []
date = "2021-08-02"
categories = []
series = ["UNSW"]
toc = true
[ author ]
  name = "Gary Sun"
+++

# Context
I've been asked pretty often about what courses to take at UNSW, and guides on how to do well so hopefully this page will help.

Before UNSW, I had an interest in engineering (leaning towards Electrical Engineering), though I also wanted to do a double degree with Commerce since I found economics interesting. So I picked a double degree in Computer Science / Commerce as the degree was 4 years rather than the 5.6 years of Engineering / Commerce, despite having 0 programming experience (though I dropped Commerce after taking 1 Commerce course).

---


# 20T1
## COMP1511 - Programming Fundamentals
*C, if … else, while, arrays, pointers, structs, linked lists*

**Overview**

The starter programming course.You’ll have 2 lectures, 1 tut-lab each week (where you have a 1 hr tutorial where you listen to your tutor present topics, and 2 hr lab where you code and can ask for help). The course tends to get a bit more confusing when pointers are introduced. Whilst the skills taught in this course (i.e. if else, and while loops) are easily transferable to other languages, you are mostly taught “programming” which is a tool, but not necessarily the “science” of computer science (more theory), or the “engineering” of software engineering (how to write good quality, useful code that can adapt to new requirements).


**Do I need to know programming beforehand?**

I had next to 0 programming coming into the course, and the course is designed such that someone with no experience can learn everything so, it’s very possible to HD the course without prior experience.

**Why do we learn C?**

Admittedly, C is not the most practical language (you can easily build an app or website using it), despite this, in my opinion there’s good reason to learn it first.
- It’s a low level language (compared to most others you will use), meaning you interact more with the underlying machine - so you learn a bit about computer memory
- Other beginner friendly languages (i.e. Python/JavaScript) has many abstractions/inbuilt functions, whereas in C you have to code it yourself, which forces you to think about how things work.


**What if I've done programming before?**

There are many fantastic challenge problems in the course - give a shot at those. The final exam, and to a small degree the assignments have an exponential difficulty, so even those with experience may struggle with some of the problems. I thoroughly enjoyed the challenges, and found them to motivate me to study CS more, though it may not be everyone’s cup of tea, or that practical/useful.


**Recommend resources**
- TODO

## MATH1131 - Mathematics 1A
*Linear algebra, calculus*

**Overview**

Goes over linear algebra and calculus. From when I did it, you may benefit if you've done 4U math in high school, though not unheard of for students to do very well in this course without 4U (and even pick up MATH1241 next term).

Recommended resources
- Get the online textbook for the course from moodle (I found this more useful than the lectures)

## ECON1101 - Microeconomics 1
*Microeconomics idk man*

**Overview**

Quite a fun course, where you're required to complete a mid sem, play a game called Playconomics and a final exam. From what I know, every term, students tend to find a bug with Playconomics resulting in a free 20 marks.

Overall, the course is a good introduction to Economics (though nothing you can't learn from casually watching Youtube videos). I decided to drop commerce after this course since I didn't find the course as engaging and writing long answer responses / essays wasn't my thing.

**Recommended resources**
- TODO

# 20T2
## COMP1521 - Computer System Fundamentals
*Bits & bytes, MIPs (assembly language), file systems, concurrency, virtual memory*

**Overview**

A course where you learn about low level bits & bytes, the MIPs assembly language, and file systems. This was my least favourite 1st year course, as the content was pretty dry. 

Overall, the content from this course wasn't too immediately useful unless you intend to go more into low level content, i.e. embedded systems / operating systems, so you can hold this course off (which tends to be alright for dual degrees). You'll find the content in this course is a bit of a jump from COMP1511 - the content after file systems was introduced was all a bit of a blur.

The challenges in this course are tougher than that of 1511, and if Andrew Taylor is in charge, prepare for an exam with questions that increase in difficulty exponentially.

**Recommended resources**
- TODO

## COMP2521 - Data Structures and Algorithms
*Big O, BST (Binary Search Trees), balanced BSTs, graphs & graph algos, hashing, heaps*

**Overview**

My favourite 1st year comp course (I would recommend taking this ASAP since a lot of comp courses have this as a pre req). The course begins off with a recap on linked lists, so you may benefit from just having done COMP1511 (though not necessarily).

There were two big assignments, the first on binary trees, and the second on graphs (this may vary).

**Recommended resources**
- [Back To Back SWE](https://www.youtube.com/channel/UCmJz2DV1a3yfgrR7GqRtUUA)


## COMP1231 - Mathematics 1B
*Linear algebra, calculus*

**Overview**

More on Linear Algebra and Calculus. Some cool matrices in Linear Algebra, and differential equations in Calculus.

**Recommended resources**
- Get the online textbook for the course from moodle (I found this more useful than the lectures)

# 20T3

## COMP1531 - Software Engineering Fundamentals
*Python, Git, Flask, HTTP, testing, agile*

**Overview**

A useful group work course where you learn Python, Flask, and Git - also usually the first course you make something more interesting than a command line app. The groups were a size of 5 (though it's very manageable with 4 people), as such I feel I can recommend pairing up with only 1 friend, and meeting some new people in this course. 

Most people will be able to pick up Python in the first few weeks, and the course is mostly focused on the project, which will teach you TDD

**Recommended resources**
- TODO

## COMP3311 - Database Systems
*Database Schemas, SQL PlpgSQL, psycopg, normalisation, relational algebra, concurrency*

**Overview**

In my opinion, the best first year comp elective if you're looking at backend development / data stuff, as it's not super content heavy, and still practical / engaging. You'll work with PostgreSQL (a relational database), and it's Python module.

Overall the course structure looks a bit like:
1. Database diagrams & relational schema
2. SQL queries & PL/pgSQL
3. Working with SQL in Python
4. Theory (i.e. relational algebra, concurrency, ACID)

In order of importance for the topics, I'd say 2 > 3 > 1 > 4 (I lowkey learnt the theory content in the middle of my online exam and I suspect most of the cohort was the same).

**Recommended resources**
- TODO

## MATH1081 - Discrete Mathematics
*Set theory, number theory, logic, counting techniques, graph theory*

**Overview**

Different to the typical math you're used to. I found the logic / proofs to be useful when writing profs in COMP3821. 

**Recommended resources**
- TODO

---

# 21T1

## COMP3231 - Operating Systems
*Concurrency, file systems, virtual memory*

**Overview**

An alright course in my opinion which covers the last couple topics of 1521, but in way more depth. There are 3 main assignments on different topics, the latter 2 of which are a bit heavier workload.
1. Concurrency (Individual work)
2. System calls / File systems (Pair work)
3. Virtual memory (Pair work)

Overall I found the first topic to be the most interesting and useful (learning about locks, semaphores, mutexes, CVs, etc), which was sad since they spent much more time on the following topics (which I didn't find useful). 

The assignments tend to be more figuring out what you have to do than coding. I ended up doing all assignments solo and found the workload to be alright. 

**Recommended resources**
- [Virtual memory lectures](https://www.youtube.com/watch?v=qcBIvnQt0Bw&list=PLiwt1iVUib9s2Uo5BeYmwkDFUh70fJPxX)

## COMP3821 - Extended Algorithms and Programming Techniques
*Divide & conquer, greedy, dynamic programming, max flow, linear programming, reductions*

**Overview**

There are only lectures (no tuts / labs), and also 0 programming as everything is written in the form of pseudo code or an english description of an algorithm with some proofs. Specifically I had 4 assignments (each containing 5 questions to solve), and 4 group assignments. In T1, I still spent more time on this course than OS (maybe because I found this more interesting). You'll need some math knowledge such as matrices, complex numbers, and some proof writing, but they should all be covered in the 1st year math courses.

**Should I take this or the non extended version?**

Being the advanced version of COMP3121, I would only really recommend this course if you are willing to self study algorithms a bit more, and keen on learning reductions in a more formal way. Some people may decide to take this course since it is in T1 (whereas COMP3121 is T2 & T3) and may teach algorithms required for intern / grad technical interviews. From experience, this wasn't the case too much and the only time I 'applied' knowledge in this course was with some trading companies' technical interviews. If I had to choose again I would still take COMP3821 > COMP3121, despite losing marks in the reduction topics.

**Recommended resources**
- Not a resource, but please go over all the tutorial problems before the assignments.
- [MIT lectures on algorithms](https://www.youtube.com/watch?v=HtSuA80QTyo&list=PLUl4u3cNGP61Oq3tWYp6V_F-5jb5L2iHb)
- [Leetcode](https://leetcode.com/problemset/all/) (I found this to pretty useful for dynamic programming)

# 21T2

## COMP2511 - Object-Orientated Design & Programming
*Java, design patterns*

In progress (lots of coding, but you learn to analyse code from a more qualitative point of view)

## COMP3141 - Software System Design and Implementation
*Haskell, functional programming, induction, PBT, monads, type theory, curry-howard correspondence*

In progress (a bit more on the theoretical side, you need to think a bit about the code you write)

## COMP3331 - Computer Networks and Applications
*Network application layer, transport layer, network layer, link layer, wireless networks*

In progress (lots of dry content)
