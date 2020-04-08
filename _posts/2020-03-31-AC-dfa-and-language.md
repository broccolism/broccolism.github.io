---  
layout: post  
title: "[AC] DFA와 language"
categories: classes
tags: ac automata dfa language
use_math: true
comments: true
---
## 순서  
[1) Deterministic Finite Acceptor: DFA란??](#deterministic-finite-acceptor-dfa)  
[2) DFA와 Associated Language](#language-and-associated-language)  
[3) 오토마타 그래프와 DFA의 관계](#relation-between-graph-of-automata-and-dfa)    

# Deterministic Finite Acceptor DFA
### 정의


$$
a\quad DFA\quad M=(Q, \Sigma, \delta,q_0,F)
$$


- Q: internal states의 유한집합
- ∑: symbols(input alphabet)의 유한집합
- δ: **transition function**. states 간의 transition을 의미하는 함수. 엄밀한 정의로는
    - Q X ∑ → Q
    ![delta](https://broccolism.github.io/assets/img/AC/2020-03-31-1.png)
    - 즉, 특정 state에서 어떤 action을 취하면 어떤 state로 갈 지 나타낸다.
- q0: Initial State. 시작점.


$$
q_0\in Q
$$


- F: final states들의 유한집합


$$
F\subseteq Q
$$


## More about Transition Function
### Extended Transition Function


$$
\delta ^* : Q \times \Sigma ^* \to Q
$$


예시)
![transition](https://broccolism.github.io/assets/img/AC/2020-03-31-2.png)

참고)


$$
\begin{aligned}
   &\delta ^*(q, \lambda)=q,\\
   &\delta ^*(q, w1)=\delta(\delta ^*(q, w),1)
\end{aligned}
$$



---

# Language and Associated Language
[grammer는 language를 만드는 일종의 규칙](https://broccolism.github.io/classes/2020/03/27/AC-language-and-grammer/#grammer)이었다. DFA 역시 비슷한 역할을 할 수 있다.


$$
L(M)=\{w \in \Sigma ^*:\delta ^*(q_0,w)\in F \}
$$


즉, 다음과 같다.
1. M이라는 function을 바탕으로 만들어진 language L은 set of sequences인데
2. 그 sequences는 알파벳을 이용해 만들 수 있는 모든 string들이고
3. 시작점이었던 q0에 그 sequences를 계속 dldj나가면 final state에 도달할 수 있는 sequences를 모아서 만든 set이다.
이렇게 만들어진 language에 대해 다음과 같이 말할 수 있다.
> The Language *L* is *accepted by(associated with)* a DFA *M*

### Relation between graph of automata and DFA
- Gm: Associated Transition Graph. transition과 state를 이용해 나타낸 그래프.

당연하게 들릴지도 모르겠지만 아래 두 문장은 동치이다.
1. 


$$
\delta ^*(q_i, w) = q_j
$$


2.


$$
In\;G_m,\;there\;is\;a\;path\;from\;q_i\;to\;q_j\;with\;sequence\;w.
$$


![example](https://broccolism.github.io/assets/img/AC/2020-03-31-3.png)
- 증명) Proof by Induction

왜 문장 1, 2가 중요한가 하면, 위의 두 문장이 동치이기 때문에
1. 특정 Language 안의 시퀀스 w가 그 언어를 표현한 그래프에서도 존재하고
2. 그 언어를 표현한 그래프에서 만들어낸 시퀀스 w가 그 language의 일부라는
사실이 성립할 수 있기 때문이다.
![conclusion](https://broccolism.github.io/assets/img/AC/2020-03-31-4.png)