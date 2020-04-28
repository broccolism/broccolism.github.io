---
layout: post
title: "[AC] Regular Language / DFA vs. NFA"
categories: classes
tags: ac regular language grammar dfa nfa
comments: true
---
# 바로가기
[1) Grammar와 DFA는 다르다](#grammer와-dfa는-다르다)  
[2) 정규..언어? Regular Language](#regular-language)  
[3) DFA랑 비슷해보이지만 다른 NFA](#nfa-nondeterministic-finite-acceptors)  

# Grammar와 DFA는 다르다


$$
\begin{aligned}
   &G=(V, T, S, P)\\
   &M=(Q,\Sigma,\delta,q_0,F)
\end{aligned}
$$


- Transition
    - in Grammar: P
    - in DFA: δ
모든 오토마타 그래프는 DFA로 정의할 수 있고, DFA로 나타낼 수 있는 language는 그래프로도 표현할 수 있다.
하지만 Grammar와 language 사이에는 위와 같은 관계가 성립하지 않는다. 이를 잘 구분해야 한다.

# Regular Language


$$
\begin{aligned}
   &L\; is \; Regular\;if\;and\;only\;if\\
   &\exist DFA\quad M\;such\;that\\
   &L=L(M)
\end{aligned}
$$


따라서 어떤 language L이 regular 함을 증명하려면 `proof by construction`을 이용해 그것을 의미하는 DFA 하나만 만들어내면 된다. 그렇게 되면 definition에 의해 자연스럽게 참이 된다.

### L이 regular language이면 LL도 regular language일까
정답은 `그럴수도 있고, 아닐수도 있다` 이다. 그러니까 `L^2` 가 regular language 라는 사실은 `L` 이 regular하다는 사실의 충분조건이 아니라는 뜻이다. 단, 아래 예시는 `L` 과 `L^2` 가 모두 regular language인 사례이다.


$$
\begin{aligned}
   &L=\{awa:w \in \{a,b\}^*\}\\
   &\\
   &L^2=\{aw_1aaw_2w:w_1\;and\;w_2\in \{a, b\}^*\}
\end{aligned}
$$


여기서 재밌는 사실 하나를 찾을 수 있다. 위의 예시에서 `L^2` 역시 regular함을 보이기 위해 DFA 그래프를 그리다 보면 `L` 의 그래프와 매우 유사한 부분이 있다는 점을 발견할 수 있다. 그리고 그 부분이 정확히 2번 나타난다는 것도! 사실 language concetonation을 할 때 첫 번째 language의 fianal state를 두 번째 language의 initial state인 것처럼 (아주 rough하게 말하자면) 그래프를 그리면 된다고 한다. 이에 대한 자세한 얘기는 추후 할 것이다.

---

# NFA Nondeterministic Finite Acceptors
- DFA와 다른 점
    - DFA에서 각 transition은 deterministic했다. 즉 어떤 state에서 특정 transition을 하기로 했으면 그 이후 state가 무조건 하나로 정해져 있었다.
    - NFA에서는 하나의 transition에 대한 next state가 non-deterministic하다. 즉, 여러개일 수도 아예 없을 수도 있다는 뜻이다. `next state` 에 대한 갯수 제한이 없다.
    ![difference bewt. nfa and dfa](https://broccolism.github.io/assets/img/AC/2020-04-01-1.png)
    (좌: DFA, 우: NFA)
그래서 특정 string이 accept 될 지 아닌 지를 판단할 때 DFA가 보다 간편하다고 말할 수 있다. 위의 예시에서 `q_1`과 `q_2`가 모두 final state이고 `q_2` 가 trash state라고 가정해보자. 그러면 `a` 라는 string은 accepted 일수도(`q_1` 으로 간 경우), 아니면 그럴 수 없을 수도(`q_2` 로 간 경우) 있다는 것이다!