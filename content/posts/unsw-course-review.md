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

_C, if … else, while, arrays, pointers, structs, linked lists_

### Overview

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

_Linear algebra (complex numbers, vectors, linear equations, matrices), calculus (limits, continuity, integration, logarithms, exponentials, hyperbolic functions)_

### Overview

Goes over linear algebra and calculus. In my opinion, the calculus part started of pretty dry as it was focused a lot on the definition of a limit, etc. I originally was doing 1141, but dropped it after a couple of weeks due to terrible time management and me adapting from high school to uni + work. It's pretty normal to get close to full marks for your pre exam mark and lost most your marks in the final exam.

**Will I struggle in this course if I haven't done 3U or 4U?**

You'll have to put in more effort, but it's 100% not impossible to do very well. It's not unheard of for students to not do 4U, but do well in 1131, and then even pick up 1241.

**Should I do this or MATH1241?**

From what I know MATH1241 requires you to do / submit assignments earlier, and go more into mathematical proofs. However, for most people doing CS, I'd argue the extra content in 1241 will not be relevant. So if you want to do more math, feel free to do 1241.

**Recommended resources**

- Get the online textbook for the course from moodle (I found this more useful than the lectures)

## ECON1101 - Microeconomics 1

_Microeconomics idk man_

### Overview

Quite a fun course, where you're required to complete a mid sem, play a game called Playconomics and a final exam. Alberto's lecturers were great fun, and the first lecture was a bit like a comedy night live (until covid hit and things were online).

Overall, the course is a good introduction to Economics (though nothing you can't learn from casually watching Youtube videos). However, we had to pay $40 for the textbook + Playconomics. I decided to drop commerce after this course since I didn't find the course as engaging and writing long answer responses / essays wasn't my thing.

**Is this course a WAM booster?**

To be fair it was pretty easy when I did it. They created a giant database of questions, some of which would be in the final exam, so that students could revise the content. However, in my exam, there was a lot of vague game theory questions (likely because the exam was online, so students had access to their answers they made before the exam) which were tricky.

**What is Playconomics?**

In the lectures, they mention a revolutionary award winning game, where students who played it got better marks. In reality, it was because the game tended to broken, and a free 20 marks. According to Alberto, every time, some engineering students manage to find an exploit and form a engineering cartel, resulting in some oligarchy of the economy, disrupting the economies of other players.

**Recommended resources**

- Read the textbook that they give you

# 20T2

## COMP1521 - Computer System Fundamentals

_Bits & bytes, MIPs (assembly language), file systems, concurrency, virtual memory_

### Overview

A course where you learn about low level bits & bytes, the MIPs assembly language, and file systems. This was my least favourite 1st year course, as the content was pretty dry.

Overall, the content from this course wasn't too immediately useful unless you intend to go more into low level content, i.e. embedded systems / operating systems, so you can hold this course off (which tends to be alright for dual degrees).

You'll find the content in this course is a bit of a jump from COMP1511 - the content after file systems was introduced was all a bit of a blur and quite high level. Though if you are interested in those topics, take Operating Systems.

**Is this more difficult than COMP2521?**

I'd say this course is around the same level of difficulty of COMP2521. You may find that this course is more "content" heavy, whilst 2521 is more "theory" heavy. The 1521 challenges are quite tougher than that of 1511, and if Andrew Taylor is in charge, the later questions of the exam will be exponentially harder than the earlier ones.

**Should I take this course or COMP2521 first?**

Most computer science students probably take both courses in T2 simultaneously, though if you had to choose, take 2521 first as it is a prerequisite to many comp courses.

**Recommended resources**

- TODO

## COMP2521 - Data Structures and Algorithms

_Big O, BST (Binary Search Trees), balanced BSTs, graphs & graph algos, hashing, heaps_

### Overview

My favourite 1st year comp course. The course begins off with a recap on linked lists, so you may benefit from just having done COMP1511 (though not necessarily). From there, it's a mix of implementing data structures & algorithms in C and some theory (though nothing too complex / much math involved).

**Why is the content in this course important?**

Whilst the content wouldn't help you build a cool practical application anytime soon, there are two reasons I suggest completing this course.

1. You learn how to quantitatively assess code quality (i.e. how efficient is your code)
2. The content here is relevant for most software engineering technical interviews
3. Some of the algorithms, i.e. BFS, DFS can still be useful in software engineering

Aside from that, you'll be more than fine without having to remember the quirks of a red-black tree or 2-3-4 trees.

**Recommended resources**

- [Back To Back SWE](https://www.youtube.com/channel/UCmJz2DV1a3yfgrR7GqRtUUA)

## MATH1231 - Mathematics 1B

_Linear algebra (vector spaces, matrices, linear transformation, eigenvalues & eigenvectors), calculus(differential equations, sequences, series, integration)_

### Overview

More on Linear Algebra and Calculus. I found the matrices content to be quite interesting (which has some applications here and there in computer science). Meanwhile the calculus gets more interesting compared to 11[34]1.

**Recommended resources**

- Get the online textbook for the course from moodle (I found this more useful than the lectures)

# 20T3

## COMP1531 - Software Engineering Fundamentals

_Python, Git, Flask, HTTP, testing, agile_

### Overview

A useful group work course where you learn Python, Flask, and Git - also usually the first course you make something more interesting than a command line app.

Most people will be able to pick up Python in the first few weeks, and the course for most students is mostly focused on the project.
The course tries to cover many different topics (i.e. Object Orientated Programming, software engineering practices like agile, testing, networks) briefly so make sure to properly revise that for the exam, as those concepts are not well covered by the project.

**Should I find good teammates before I start this course?**

When I did it it was 5 people per course, but the project is very doable with 4, and can be done by even less. As a result, I wouldn't classify this as "necessary to find a good teammate" beforehand (unlike COMP2511). I had one friend going into the course, and found new friends through the project.

**What should I do to prepare for this course?**

If you are keen to get ahead, there isn't much needed but here are some ideas.

- Set up your computer for local development! You can do 90% of the course work on your own computer (there isn't anything like autotests / give).
  - If you are on a unix based OS, you don't need to do much, else if you are on windows, I recommend setting up WSL.
  - Whilst you are at it I would recommend learning how to use virtual environments. A good explanation of how / why you should use them can be found [here](https://uoa-eresearch.github.io/eresearch-cookbook/recipe/2014/11/26/python-virtual-env/).
- Learn features of python such as dictionaries, and how to write "pythonic" code (i.e. short code that takes advantage of python's features)

  **Recommended resources**

- TODO

## COMP3311 - Database Systems

_Database Schemas, SQL PlpgSQL, psycopg, normalisation, relational algebra, concurrency_

### Overview

In my opinion, the best first year comp elective if you're looking at backend development / data stuff, as it's not super content heavy, and still practical / engaging. You'll work with PostgreSQL (a relational database), and it's Python module.

Overall the course structure looks a bit like:

1. Database diagrams & relational schema
2. SQL queries & PL/pgSQL
3. Working with SQL in Python
4. Theory (i.e. relational algebra, concurrency, ACID)

There were 3 assignments, and the last two were quite fun, and required a bit of thinking (and I've heard that in 21T1, they required a bit of BFS / DFS). The assignments were as follows.

1. Writing a database schema
2. Writing queries to extract data from a database (using SQL & PL/pgSQL)
3. Using python and psycopg to perform queries and extract data from a database

In order of importance for the topics, I'd say 2 > 3 > 1 > 4 (I low-key learnt the theory content in the middle of my online exam and I suspect most of the cohort was the same).

**Should I do this course in first year?**

Yep! I would highly recommend this as an early course elective because it's simple but also useful. The only prerequisite is COMP2521, and I found the content to be a good balance of practical & theory (and it was pretty fun writing efficient queries).

**Recommended resources**

- TODO

## MATH1081 - Discrete Mathematics

_Set theory, number theory, logic, counting techniques, graph theory_

### Overview

Different to the typical math you're used to.

**Is discrete math more useful for computer science?**
The proofs that you complete in this course will be relevant for proofs in courses such as COMP3[18]21. The perms & combs are somewhat relevant for certain algorithms that brute force permutations / combinations. As for the graph theory, 2521 also goes over Dijkstra's but in more depth, doing either course first just helps you a bit in the other when it comes to graph theory.

**Recommended resources**

- TODO

---

# 21T1

## COMP3231 - Operating Systems

_Concurrency, file systems, virtual memory_

### Overview

An alright course in my opinion which covers the last couple topics of 1521, but in way more depth. There are 3 main assignments on different topics, the latter 2 of which are a bit heavier workload.

1. Concurrency (Individual work)
2. System calls / File systems (Pair work)
3. Virtual memory (Pair work)

Overall I found the first topic to be the most interesting and useful (learning about locks, semaphores, mutexes, CVs, etc), which was sad since they spent much more time on the following topics (which I didn't find useful).

The assignments tend to be more figuring out what you have to do than coding. I ended up doing all assignments solo and found the workload to be alright.

**Recommended resources**

- [Virtual memory lectures](https://www.youtube.com/watch?v=qcBIvnQt0Bw&list=PLiwt1iVUib9s2Uo5BeYmwkDFUh70fJPxX)

## COMP3821 - Extended Algorithms and Programming Techniques

_Divide & conquer, greedy, dynamic programming, max flow, linear programming, reductions_

### Overview

There are only lectures (no tuts / labs), and also 0 programming as everything is written in the form of pseudo code or an english description of an algorithm with some proofs. Specifically I had 4 assignments (each containing 5 questions to solve), and 4 group assignments. In T1, I still spent more time on this course than OS (maybe because I found this more interesting). You'll need some math knowledge such as matrices, complex numbers, and some proof writing, but they should all be covered in the 1st year math courses.

**Should I take this or the non extended version?**

Being the advanced version of COMP3121, I would only really recommend this course if you are willing to self study algorithms a bit more, and keen on learning reductions in a more formal way. Some people may decide to take this course since it is in T1 (whereas COMP3121 is T2 & T3) and may teach algorithms required for intern / grad technical interviews. From experience, this wasn't the case too much and the only time I 'applied' knowledge in this course was with some trading companies' technical interviews. If I had to choose again I would still take COMP3821 > COMP3121, despite losing marks in the reduction topics.

**Recommended resources**

- Not a resource, but please go over all the tutorial problems before the assignments.
- [MIT lectures on algorithms](https://www.youtube.com/watch?v=HtSuA80QTyo&list=PLUl4u3cNGP61Oq3tWYp6V_F-5jb5L2iHb)
- [Leetcode](https://leetcode.com/problemset/all/) (I found this to pretty useful for dynamic programming)

# 21T2

## COMP2511 - Object-Orientated Design & Programming

_Java, design patterns, code smells_

### Overview

A course that requires a LOT of coding. Whilst in 2521, you learn to analyse code from a quantitative standpoint (i.e. time/space complexity), 2511 teaches you how to write high quality code from a qualitative standpoint (i.e. how to write non-spaghetti modular code that can change to adapt to requirements easily).

There is an (solo work) assignment and a group work project. The assignment works as a good introduction to Java, whilst the project is quite a large project, which I feel is a necessary evil to teach the benefits of OOP, and software engineering practices.

**When should I do this course?**

In my opinion, I recommend completing this course perhaps as early as possible. Learning Java and design principles is very valuable, for writing higher quality code, and internships that require Java/OOP.

**Should I find good teammates before I start this course?**

When I did the course, there were 4 members per group, all of which had to be in the same tut-lab class. Unlike COMP1531, I would recommend finding teammates you can trust before you start the course due to the bigger project (which not only requires much more thinking about the design, but also coding(). It's still "doable" by 2 - 3 people, though highly draining, I had to spend 14+ hrs coding some days and had 2k+ lines of tests.

**Recommend resources**

- [Refactoring guru](https://refactoring.guru/)

## COMP3141 - Software System Design and Implementation

_Haskell, functional programming, induction, PBT, monads, type theory, curry-howard correspondence_

### Overview

Starts off by going through Haskell, which can be tricky and it's definitely not like your typical coding. The course jumps a bit in difficulty in week 7 when you go over "functors, applicatives, and monads", so I would recommend reading up on this topic in flex week. It then goes a bit more into the application of types as static checking, before touching on more theory, i.e. Curry-Howard correspondence in week 10 (which I'm told is similar to COMP3161).

**Is this a software engineering course?**

You don't build a practical app or anything in this course, which you may expect from software engineering, so if you like building things this may not be as fun. Similarly, whilst you have to think quite a bit for the assignments, the code of the is pretty trivia to implement in other languages and the difficulty comes down to the self imposed restriction of using Haskell, and stronger type checking (as a result, the assignment was a lot of trying different permutations of code until it compiled). That being said, you go more into the theory of good code.

**Recommended resources**

- [Learn You a Haskell for Great Good!](http://learnyouahaskell.com/)

## COMP3331 - Computer Networks and Applications

_Network application layer, transport layer, network layer, link layer, wireless networks_

This course heavily follows the textbook "Computer Networking: A Top-down Approach" for 10 week (for the most part). This may be a personal bias, but the course does have a lot of dry content, and since the content is the same as the textbook, I only did this as it was as prerequisite for COMP9243 (Distributed Systems). The content mostly requires ROTE learning, and the labs were pretty straightforward (though sometimes boring, they would consist of running commands in the terminal / reading wireshark data, and the later labs reminded me more of high school science lab reports).

**How is the assignment?**

I've heard historically the assignment was pretty easy, however for 21T2, it did require some thinking about data structures and multi-threading. You can choose between C, Python, and Java to implement the assignment (I would recommend Python for the sake of getting it done easily / quickly, and also because there's more tutor support for the language if you ever do need to go to help sessions).

**Recommended resources**

- [Computer Networking: A Top-down Approach 7th Edition](https://www.ucg.ac.me/skladiste/blog_44233/objava_64433/fajlovi/Computer%20Networking%20_%20A%20Top%20Down%20Approach,%207th,%20converted.pdf)

# 21T3
