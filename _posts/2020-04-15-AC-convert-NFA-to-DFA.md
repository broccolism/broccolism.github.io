---  
layout: post  
title: "[AC] NFA를 DFA로 바꾸기"
categories: classes
tags: classes ac nfa dfa state transition
comments: true
use_math: true
---
# Convert DFA into NFA or NFA into DFA
### DFA를 NFA로 바꾸는 것
은 항상 가능하다. 왜냐하면 DFA가 NFA의 특별한 케이스, 다시 말해 각 action의 결과가 오직 한 state뿐인 NFA이기 때문이다.

### NFA를 DFA로 바꾸는 것
역시 가능하다. 다만 위의 경우보다 덜 직관적일 뿐이다. 그 어떤 NFA가 주어지더라도 우리는 그것과 equivalent한 DFA를 만들 수 있다.

아래 NFA를 DFA로 바꾸어보자.

![e.g 1](https://broccolism.github.io/assets/img/AC/2020-04-15-1.jpg)

1. NFA의 모든 transition들을 적는다. action λ는 적을 필요 없으나, λ를 통해 갈 수 있는 state는 모두 집합에 포함시켜야 한다.


$$
\begin{aligned}
&\delta(q_0, a)=\{q_1,q_2\}\\
&\delta(q_1,a)=\{q_1,q_2\}\\
&\delta(q_2,a)=\emptyset\\
&\delta(q_0,b)=\emptyset\\
&\delta(q_1,b)=\{q_0\}\\
&\delta(q_2,b)=\{q_0\}
\end{aligned}
$$


- 위의 예시에서 `a` = `aλ` 이기 때문에 q0에 a를 적용해서 갈 수 있는 state의 집합에는 `q1`뿐만 아니라 `q2` 도 포함된다.

2. 위의 목록에서 transition function을 적용한 결과로 나온 집합을 state 하나로 생각한다.
- 따라서 이번 예시에서 만들 state는 `{q1, q2}` , `∅`, `q0` 총 세가지이다.

3. NFA의 final state가 포함되어 있는 state를 final state로 정한다. initial state는 NFA의 것과 동일하다.
- 이번 예시에서는 원래 `q1` 이 있었던 `{q1, q2}` 가 새로운 final state가 된다.
- 만약 initial state가 미리 만들어둔 state 목록에 없다면 NFA의 것과 똑같은 state를 새로 만들면 된다.
- 만약 initial state에서 할 수 있는 action이 λ뿐이라면 그 바로 다음 state와 합쳐서 생각하면 된다.

4. 지금까지 정한 것과 transition function을 바탕으로 새로운 DFA를 그리고, complete한지 확인한다.

![e.g 2](https://broccolism.github.io/assets/img/AC/2020-04-15-2.jpg)

*(2020.04.15 추가)*
이 때 {q1, q2}처럼 원래 NFA에서 여러 state였던 것을 DFA에서 합친 경우에는 action a를 취하는 state가 단 하나뿐이었더라도(즉, q1 하나뿐이거나 q2 하나뿐이더라도) DFA에서 합친 state 전체가 행하는 것으로 보면 된다. 단, 그 결과는 집합적으로 합쳐주면 된다.

![e.g 3](https://broccolism.github.io/assets/img/AC/2020-04-15-3.jpg)

- 그래서 이 예시를 보면... q0에서 가는게 q1, q0 둘 다였기에 하나의 집합으로 묶어 생각해서 state 하나로 만들어주었고
- q1에서 b를 취하면 q1, q2로, q2에서 b를 취하면 q3로 갔기 때문에 DFA에서는 {q1, q2} 전체가 {q1, q2, q3}로 가는 것처럼 표현했다.

### final state in NFA and DFA
위의 예시에서 바뀐 DFA를 보면 이상한 일이 일어나고 있다. 분명히 원래 final state는 q3 하나였는데 여기서는 q1, q2까지 있기 때문이다.
하지만 잘 생각해보면 전혀 문제가 되지 않는다.

1. DFA의 {q1, q2, q3}에 도달한다는 것은 NFA에서 q1, q2, 혹은 q3에 각각 도달한다는 것과 같은 의미이다.
2. 그런데 NFA에서 q1, q2 각각에서 b를 취하면 q3으로 갈 수 있었다.
3. 현재 바뀐 DFA에서도 {q1, q2, q3}에서 b를 취하면 {q1, q2, q3}으로 갈 수 있다.
4. 따라서 NFA에서 accept 하지 않는 것은 DFA에서도 accept하지 않고 있으며 accept 하는 경우도 마찬가지이다. 

*그렇다면 이 경우는 어떨까?*

![e.g 4](https://broccolism.github.io/assets/img/AC/2020-04-15-4.jpg)

여기서는 DFA의 final state가 2개인데, 그 중 q8이 포함되어있는 final state로 가려면 a-b-a를 거쳐야 한다. 이 DFA는 `aba`를 accept하는 것이다.  
그런데 NFA에서는 같은 `aba`라는 transition을 사용해서 q8에 도달해도(q0- `a` - q2 - `b` - q5 - `a` - q8) q8이 final state가 아니기 때문에 accept되지 않는다! 어떻게 된 일일까?  
이런 경우에는 `aba`라는 transition을 취해서 final state까지 갈수 있는 **또다른 path가 NFA에 존재한다**고 생각하면 된다. 실제로 왼쪽 NFA에서 q0 - `a` - q1 - `b` - q3 - `a` - q6 이라는 다른 경로를 통해 `aba`를 accept 할 수 있다.  
그러니까 새로 바뀐 DFA의 final state의 *이름*에 속해있는 state가 NFA에서는 final state가 아니었더라도, DFA의 fianl state까지 도달하기 위해 만든 string은 DFA, NFA가 나타내고 있는 language의 일부로서 accept될 수 있음을 의미한다.

![e.g 5](https://broccolism.github.io/assets/img/AC/2020-04-15-5.jpg)

### Initial state in NFA and DFA
- 만약 NFA에서 λ도 accept 되었다면, DFA의 initial state를 final state로 바꾸어 주어야 함!

### Claim 1) Number of states and transitions


$$
\begin{aligned}
&Let\;Q_N\;number\;of\;states\;in\;NFA.\\
&G_D\;for\;DFA\;has\;at\;most\;2^{|Q_N|}\;states\;and\;2^{|Q_N|}|\Sigma|\;edges.
\end{aligned}
$$


### Claim 2) Uniqueness
For a DFA M, L(M) is unique.
For given L, M such that L = L(M) is not unique.