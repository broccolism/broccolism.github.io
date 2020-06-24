---  
layout: post  
title: "[AC] NFA 갖고 놀기 - language / DFA와의 관계"
categories: study
tags: study 2020-1 ac automata nfa dfa language
use_math: true
comments: true
---
[DFA 관련 포스팅 보러 가기](https://broccolism.github.io/study/2020/03/31/AC-dfa-and-language/){: target="_blank"}  

## 순서  
[1) NFA의 정의](#nfa-nondeterministic-finite-acceptors)  
&nbsp;&nbsp;&nbsp;&nbsp;[1-1) Extended Transition Function: DFA와의 차이점](#extended-transition-function)  
[2) Language와 NFA의 관계](#language-and-nfa)  
&nbsp;&nbsp;&nbsp;&nbsp;[2-1) "동등함" 다시 살펴보기](#equivalent-automatas)  
[3) DFA를 NFA로, NFA를 DFA로!](#convert-dfa-into-nfa-or-nfa-into-dfa)  

# NFA Nondeterministic Finite Acceptors


$$
M=(Q, \Sigma, \delta, q_o, F)
$$


- DFA의 것과 같음.
- 하지만 transition이 uninque하지 않다는 차이점이 있음!
- e.g)
    ![def. of NFA](https://broccolism.github.io/assets/img/AC/2020-04-05-1.jpg)


$$
\delta(q_0,a)=\{q_1,q_2,q_3\}
$$


$$
\begin{aligned}
    &new\;def.\;of\;transition\;for\;NFA\\
    &\\
    &\delta:Q\times(\Sigma\cup\{\lambda\})\to2^Q
\end{aligned}    
$$


- 즉 NFA에서의 delta function은 Q X (\sigma \cup {\lambda}) 라는 set에서 Q의 power set으로 가는 함수이다.
- 그리고 여기서 특이한 점은 NFA가 취할 수 있는 action 중 `λ-transition`이 있다는 사실이다.

![lambda-transition](https://broccolism.github.io/assets/img/AC/2020-04-05-2.jpg)

여기서 a는 aλ와 같기 때문에 0번 state에서 `a` 라는 action을 취했을 때 갈 수 있는 state는 1번과 2번 총 2가지이다.
- DFA에서는 각 state에서 모든 action을 취해야 하지만 NFA에서는 그럴 필요가 없다. 그래서 trash state도 따로 그릴 필요 없이 그냥 두면 된다.
    - 반면 DFA에서는 trash state까지 꼭 그려야 한다는 말도 된다.
    ![example](https://broccolism.github.io/assets/img/AC/2020-04-05-3.jpg)

## Extended Transition Function


$$
\delta^*:Q\times\Sigma^*->2^Q
$$


- DFA의 δ*와 같지만 차이점이 있다. 이 차이점 역시 NFA의 특징 때문에 나타난다.
    ![example2](https://broccolism.github.io/assets/img/AC/2020-04-05-4.jpg)
    이 예시에서 extension은 다음과 같다.


$$
\begin{aligned}
    &\delta^*(q_1, a)=\{q_1,q_2, q_0\}\\
    &\\
    &\delta^*(q_2,\lambda)=\{q_0,q_2\}\\
    &c.f)\;\delta^*(q_2,\lambda)=\{q_0\}\\
    &\\
    &\delta^*(q_2,aa)=\{q_1,q_2,q_0\}
\end{aligned}
$$


- (DFA에서는 transiton function의 결과가 집합이 아닌 state 하나였다.)
    - 마지막 예시의 경우는 `aa` 가 `λaλλa`, `λaλλaλ`, `λaλλaλλ` 와 같기 때문에 이와 같은 결과가 나온 것이다.

---

# Language and NFA


$$
\begin{aligned}
    &L(M)=\{w\in\Sigma^*:\delta^*(q_0,w)\cap F \ne \empty\}\\
    &\\
    &where\;\delta^*(q_0,w)\in2^Q\;and\;F\in2^Q
\end{aligned}
$$


여기서 DFA가 정의하는 language를 다시 보자.


$$
L(M)=\{w \in \Sigma ^*:\delta ^*(q_0,w)\in F \}
$$


DFA와 다르게 NFA에서는 교집합과 공집합을 사용해 language를 정의하고 있다. 왜냐하면 NFA에서 transition function의 결과는 여전히 **집합**이기 때문이다. 그래서 final state를 모은 집합과 그 집합의 교집합이 공집합이 아니라면 해당 language는 accept 될 수 있다.
- DFA의 경우와 마찬가지로, NFA에서도 한 language를 accept하는 NFA는 unique하지 않다.

### Equivalent Automatas
두 오토마타 M과 N은 L(M) = L(N) 일 때 equivalent하다고 말할 수 있다. 이 때, M과 N이 각각 DFA인지 NFA인지는 상관없이 항상 성립한다. 그러니까 DFA와 NFA가 서로 equivalent한 경우도 있을 수 있다는 뜻이다.
> 그렇다면 NFA를 DFA로 바꿀 수 있단 소린가??

---

# Convert DFA into NFA or NFA into DFA
### DFA를 NFA로 바꾸는 것
은 항상 가능하다. 왜냐하면 DFA가 NFA의 특별한 케이스, 다시 말해 각 action의 결과가 오직 한 state뿐인 NFA이기 때문이다.

### NFA를 DFA로 바꾸는 것
역시 가능하다. 다만 위의 경우보다 덜 직관적일 뿐이다. 그 어떤 NFA가 주어지더라도 우리는 그것과 equivalent한 DFA를 만들 수 있다.
아래 NFA를 DFA로 바꾸어보자.
![example-last]](https://broccolism.github.io/assets/img/AC/2020-04-05-5.jpg)

1. NFA의 모든 transition들을 적는다. action λ는 적을 필요 없으나, λ를 통해 갈 수 있는 state는 모두 집합에 포함시켜야 한다.


$$
\begin{aligned}
    &\delta(q_0, a)=\{q_1,q_2\}\\
    &\delta(q_1,a)=\{q_1,q_2\}\\
    &\delta(q_2,a)=\empty\\
    &\delta(q_0,b)=\empty\\
    &\delta(q_1,b)=\{q_0\}\\
    &\delta(q_2,b)=\{q_0\}
$$

- 위의 예시에서 `a` = `aλ` 이기 때문에 q0에 a를 적용해서 갈 수 있는 state의 집합에는 `q1`뿐만 아니라 `q2` 도 포함된다.
2. 위의 목록에서 transition function을 적용한 결과로 나온 집합을 state 하나로 생각한다.  
    - 따라서 이번 예시에서 만들 state는 `{q1, q2}` , `∅`, `q0` 총 세가지이다.
3. NFA의 final state가 포함되어 있는 state를 final state로 정한다. initial state는 NFA의 것과 동일하다.  
    - 이번 예시에서는 원래 `q1` 이 있었던 `{q1, q2}` 가 새로운 final state가 된다.
    - 만약 initial state가 미리 만들어둔 state 목록에 없다면 NFA의 것과 똑같은 state를 새로 만들면 된다.
    - 만약 initial state에서 할 수 있는 action이 λ뿐이라면 그 바로 다음 state와 합쳐서 생각하면 된다.
4. 지금까지 정한 것과 transition function을 바탕으로 새로운 DFA를 그리고, complete한지 확인한다.
    ![complete DFA](https://broccolism.github.io/assets/img/AC/2020-04-05-6.jpg)