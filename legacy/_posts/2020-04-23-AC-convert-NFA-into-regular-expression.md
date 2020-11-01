---  
layout: post  
title: "[AC] NFA를 regular expression으로 바꾸기"
categories: study
tags: study 2020-1 study ac nfa rex regular-expression state transition gtg
comments: true
use_math: true
---
[1) 또 다른 transition graph: GTG](#gtg)  
[2) NFA를 regular expression으로! 예시 먼저 보기](#finally-we-can-convert)  
[3) NFA를 regular expression으로! 일반화](#general-procedure-of-nfa-to-rex)

### GTG
- **generalized transition graph(GTG)**: regular expressions를 사용해서 만든 transition이 있는 transition graph.
- 그래서 아래와 같이 transition에 symbol 뿐만 아니라 union, star closure와 같은 regular expression을 사용할 수 있다.

![GTG](https://broccolism.github.io/assets/img/AC/2020-04-23-4.jpg)

- 어떤 language가 regular하다면 그를 표현하는 GTG 역시 존재한다.
- GTG를 이용해 만든 language는 regular language이다.
- NFA는 GTG의 특별한 케이스라고 이해할 수 있다.

### Complete GTG
- GTG의 각 state에서 수행할 수 있는 모든 transition이 표현되어 있을 때 그 GTG는 **complete**하다고 말할 수 있다.
    - 이 때 "모든 transition"이라는 의미는 "각 state에서 자기 자신을 포함한 모든 state로 가기 위한 transition들"을 말한다.
- *v*개의 vertices를 갖는 complete GTG에서는
    - edges: *v^2* 개
        - DFA에서는 (symbol의 갯수)*v 개였다.

### Phi Transition
- **phi transition `∅`**: state A에서 state B로 갈 수 있는 transition이 존재하지 않음을 explicit하게 표현할 수 있는 transition이다.
    - ∅는 regular expression 중 하나임을 기억하자.
- 따라서 phi transition을 활용해서 그 어떤 GTG든 complete하게 만들 수 있다.

### Finally We Can Convert
state가 2개인 모든 complete GTG를 regular expression으로 나타낼 수 있는 systemic method가 존재한다.

![convert](https://broccolism.github.io/assets/img/AC/2020-04-23-5.jpg)

위와 같은 GTG가 주어졌다고 해보자. 그러면 아래와 같은 regular expression으로 표현할 수 있다.


$$
r = r_1^*r_2(r_4 + r_3r_1^*r_2)^*
$$


state가 2개인 GTG는 모두 위의 그래프와 같은 형태이기 때문에, 다른 모든 GTG 역시 state가 2개라면 이렇게 표현할 수 있다. 이를 **rex of 2-state GTG**라고 부른다. 

그렇다면 state가 3개인 경우는 어떻게 할 수 있을까? state 하나를 없애고 기존 GTG와 equivalent한 2-state GTG를 만들어서 rex of 2-state GTG로 표현한다. 한 state를 *없애기* 위해서는 나머지 두 state 사이를 오가는 4개의 transition을 새롭게 만들어야 한다. 이 때 남은 두 state 사이에 있던 원래 transition뿐만 아니라 없애려는 state를 거쳐서 다른 한쪽으로 가는, 혹은 자기 자신에게 가는 모든 **경로**를 포함시켜야 한다.

![route](https://broccolism.github.io/assets/img/AC/2020-04-23-6.jpg)

이렇게 2-state GTG로 만든 이후에는 rex of 2-state GTG를 사용하면 된다.

### General Procedure of NFA to REX
1. 기존 NFA의 final state를 **한개**로 만든다.
    - final state가 여러개였다면 그 state를 모두 모아서 새로운 final state를 만들고, 기존 final states에서 새 final state로 가는 λ transition을 만들어주면 된다.

    ![one final state](https://broccolism.github.io/assets/img/AC/2020-04-23-7.jpg)
2. NFA를 complete GTG로 만든다.
    - phi transition을 활용하자
3. 2-state GTG가 될 때까지 state를 지우고 이전의 GTG와 equivalent한 새 GTG를 만든다.
    - 이 때, [r12 + r13r33*r23] 형식을 기억해두면 편리하다.
4. rex of 2-state GTG를 사용한다.
5. 만약 완성한 regular expression에 아래와 같은 표현이 있다면 바꿔준다.
    - `r + ∅` ****⇒ `r`
    - `r∅` ⇒ `∅`
    - `∅*` ⇒ `λ`