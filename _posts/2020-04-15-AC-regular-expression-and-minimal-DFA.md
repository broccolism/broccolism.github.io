---  
layout: post  
title: "[AC] Minimal DFA & Regular Expression"
categories: classes
tags: classes nfa dfa minimal regular expression language
comments: true
use_math: true
---
## 순서
[1) DFA를 좀 더 간단하게 나타내자](#make-dfa-simpler)  
[2) 진짜 minimal DFA인지 확인하기](#proof-by-contradiction-to-show)  
[3) Regular Expressions](#regular-expressions)  
[4) Language를 나타내는 3가지 방법](#relationship-between-regular-expressions-and-languages)  

### Claim 1) Uniqueness
For a DFA M, L(M) is unique.
For a given language L, M such that L = L(M) is not unique.

# Make DFA Simpler
복잡한 DFA 그래프를 간단하게 바꾸는 general procedure가 있다. 이를 이해하기 위해서는 먼저 **indistinguish**한 두 state가 무엇인지 알고 있어야 한다.

### Definition 1) Indistinguishability
DFA의 두 state p, q가 아래를 만족할 때 이 둘은 **구분할 수 없다**고 한다.
δ*(p, w) ∈ F 이면 δ*(q, w) ∈ F 이고 δ*(p, w) ∉ F 이면 δ*(q, w) ∉ F이다.

### Definition 2) Distinguishability
DFA의 두 state p, q가 아래를 만족할 때 이 둘은 **구분할 수 있다**고 한다.
string w ∈ ∑* 일 때, δ*(p, w) ∈ F 이면 δ*(q, w) ∉ F이다. (혹은  δ*(p, w) ∉ F 이면 δ*(q, w) ∈ F이다.)

### Procedure: to the DFA with minimum number of states

1. initial state에서 출발해서 갈 수 있는 path가 없는 states를 지운다.
2. final states로 이루어진 집합 P와 그 외의 states로 이루어진 집합 Q는 *구분할 수 있다.*
3.  모든 (p, q)와 모든 transition에 대해 p, q는 δ(p, a) = pa 와  δ(q, a) = qa = qa가 *구분 가능* 할 때 *구분할 수 있다.*
    - 3번을 반복해서 distinguishable sets를 만든다.

![e.g 1](https://broccolism.github.io/assets/img/AC/2020-04-15-6.jpg)

예시를 보자. 여기서 {q3, q4}, {q0, q1, q2}는 2번에 의해 *구분 가능*하다.  
3번으로 가서 p = q3, q = q0를 골라보자. δ(p, 1) = q3이고 이는 F의 원소이다. δ(q, 1) = q2이고 이는 F의 원소가 아니다. 따라서 q3과 q0은 *구분 할 수 있다*. 지금까지 만들어진 집합들은 {q3, q4}, {q0}, {q1, q2}이다.  
위 예시의 경우 이렇게 q0만 따로 빼내면 3번 과정은 끝이다.

4. 3번에서 만든 집합을 각각 state 하나로 보고 DFA를 만든다.

위의 예시에서 만들어진 miminum state DFA는 아래와 같다.

![e.g 2](https://broccolism.github.io/assets/img/AC/2020-04-15-7.jpg)

## Proof by Contradiction to show
that what we made through the precedure above is the minimum DFA!
- 우리가 만든 *minimum DFA*를 M이라 하고 이와 equivalent한 DFA를 M1이라 하자.
- M1이 가장 적은 states를 갖고 있으며 M1의 transition set을 δ1, initial state를 q0라고 하자.
    - 이 때 δ*(q0, w) = qi인 w가 항상 존재해야 한다.
        - 왜냐하면 M1이 갖고 있는 state 갯수가 그것과 equivalent한 DFA 중 최소이고, 그렇다면 initial state에서 도달할 수 없는 state는 버리고 없을 것이기 때문이다.
- M1은 M보다 state 갯수가 더 작기 때문에 [pigeonhole principle](https://ko.wikipedia.org/wiki/%EB%B9%84%EB%91%98%EA%B8%B0%EC%A7%91_%EC%9B%90%EB%A6%AC){: target="_blank"}에 의해 `δ1*(q0, wk) = δ1*(q0, wl)`이 성립한다.
- 위의 과정에 의해 만든 M1의 모든 states는 **distinguishable**하기 때문에 δ1(p0, wkx)∈F이면서 동시에 δ1(p0, wx)∉F인 어떤 string x가 존재한다.
- 위의 두 문장에 의해 δ1*(p0, wkx) = δ1*(δ1*(p0, wk), x) = δ1*(δ1*(p0, wl), x) = δ1*(p0, wlx) 가 된다. 그렇지만 **distinguishable**해야 하기 때문에 δ1*(p0, wkx)와 δ1*(p0, wlx)는 동시에 accept 될 수가 없으며 동시에 not accept 되어서도 안된다. 즉, 모순이 발생한다.
- 따라서 M1이 존재한다는 우리의 초기 가정은 성립할 수 없다.

---

# Regular Expressions
= 일종의 집합. 원소는 아래와 같다.


$$
\begin{aligned}
&\Sigma^*\;(\;)\;+\;\bullet\;^*\\
&+:\;union\\\bullet:\;concatenation\\
&\\ ^*:\;star-closure
$$


예를 들어, Σ = {a, b, c} 일 때 만들 수 있는 regular expression 중 하나는 `r =(a + (b • C))*` 이 있고 이는 `star closure of {a} ⋃ {bc}` 와 같으며, 이를 풀어쓰면 아래와 같다.
- L(r) = {λ, a, bc, abc, bca, bcbca, ... }
위의 집합에 속하지 않는 원소의 예로는 *cba*가 있다. 왜냐하면 *bc*와 *a* 를 갖는 집합의 합집합이지, *cb*를 갖고 있지 않기 때문이다.
- `r = ∅`: regular expression이 공집합
- `r = λ`: {λ}
- `r = a`: {a}

한편 집합은 아래와 같이 다룰 수 있다.
- `L(r1 + r2)` = L(r1) ⋃ L(r2)
- `L(r1 • r2)` = L(r1)L(r2)
- `L(r*)` = (L(r))*
- e.g) L(a* • (a + b))
    = (L(a))*L(a + b)
    = {λ, a, aa, aaa, ...}{a, b}
    = {a, aa, aaa, aaaa, ..., b, ab, aab, aaab, ....}

### Automata Equivalent with Regular Expression
- NFA로 만들 때에는
    1. initial state 설정
    2. 마지막 string에 대한 제약조건을 state와 transition으로 표현
    3. final state로 연결
- DFA로 만들 때에는
    - NFA가 훨씬 만들기 쉽기 때문에 위의 과정으로 만든 NFA를 DFA로 바꿔주면 된다.

### Relationship between Regular Expressions and Languages
- Regular expressions denote regular languages.
    - 즉, Regular expression으로 만들어진 language를 regular language라고 한다.
- ANY regular language는 각자 자신을 표현할 수 있는 DFA나 NFA로 바꾸어 나타낼 수 있다.
- 다시 말하자면 regular language 하나를 표현하는 방식에는 regular expression, DFA, NFA 이렇게 총 3가지가 있다.
    - 바꾸어 말하자면, regular expression, DFA 혹은 NFA로 표현할 수 있는 language가 하나 있다면 그것을 나머지 두가지 방식으로 표현할 수 없는 경우는 있을 수 없다는 뜻이다.
        - 세 가지 모두로 표현할 수 있거나, 세 가지 모두로 표현할 수 없거나, 이 두가지 경우 뿐이다.
- 역으로 어떤 language가 regular language임을 보이려면 해당 language를 표현할 수 있는 regular expression, DFA 혹은 NFA 중 하나를 만들면 proof by construction으로 증명이 되었다고 할 수 있다.