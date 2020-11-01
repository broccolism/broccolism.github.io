---  
layout: post  
title: "[AC] NFA를 regular expression으로 바꾸기"
categories: study
tags: study 2020-1 ac nfa rex regular-expression state transition gtg
comments: true
use_math: true
---

## 순서
[Regularity가 유지되는 연산](#answer-1-preserving-regularity)  
[1) 합집합, 연쇄](#answer-1-preserving-regularity)  
[2) 여집합](#complementation-여집합에서는-왜-성립할까)  
[3) 교집합](#intersection-교집합에서는-왜-성립할까)  
[4) Homomorphism](#homomorphism)  
[5) Right Quotient](#right-quotient)  

# Properties of Regular Languages
- Question 1) 어떤 regular language에 특정 set operation을 적용한 뒤에도 계속 regular language가 만들어질까?
    - e.g) regular language L1과 regular language L2의 교집합도 regular할까?
- Question 2) 어떤 language가 regular language인지 아닌지 어떻게 판단할 수 있을까?
    - 이에 대한 답은 앞서 우리가 배웠던 내용에도 있다.
        - 그 language를 표현하는 DFA를 만들 수 있으면 해당 language는 regular language이다.
        - 하지만 어떤 language를 표현하는 DFA가 매우 복잡하여 만들기 어렵다면? 그 language가 regular한지 아닌지 바로 판단할 수 있는 방법은 없을까?

## Answer 1 Preserving Regularity
- regular language L1, L2에 대해 closed operation을 적용한 결과는 여전히 regular language이다.
    - **closed operation**: 교집합, 합집합, 연속(concatenation), 여집합, 클로저(star-closure)
    - 따라서 L1 ⋂ L2, L1 ⋃ L2, L1 L2, L1c, L2c, L1*, L2* 는 모두 regular language이다.

### 이런 성질이 성립하는 이유는 무엇일까?
- Union: L(r1) ⋃ L(r2) = L(r1 + r2)
    - 위의 등식에서 볼 수 있듯이, 새로 만든 language에서도 기존의 regular expression을 찾을 수 있다. 따라서 L(r1 + r2) 역시 여전히 regular language이다.
- Concatenation: L(r1) L(r2) = L(r1 r2)
- Star Closure: L(r)* = L(r*)
- concatenation, start closure 역시 등식에서 바로 확인할 수 있다. trivial 한 것이다. 모두 closeness를 갖고 있는 연산이다.

### Complementation 여집합에서는 왜 성립할까
- regular language의 complementation set을 나타낼 수 있는 DFA를 만들 수 있기 때문이다.
    - 기존 language에는 δ*(q, w) ∈ F 인 transaction set T1과 δ*(p, w) ∉ F인 transaction set T2가 있었을 것이다.
    - 여집합 language에서는 기존의 final states를 모두 non-final states로 만들고, 기존에 non-final states였던 것을 모두 final states로 만든다.
        - 그러면 T1에 속하는 transition이 final state로 가지 못하게 되고, T2에 속하는 transition들이 final state로 가게 된다!

따라서 proof by constuction을 이용해 regular language의 complementation 역시 regular하다는 점을 증명할 수 있다. 위의 과정을 요약하면 아래와 같이 표현할 수 있다.


$$
\begin{aligned}
&If\;M_L=(Q, \Sigma, \delta, q_0, F)\;then\\
&M_{L^C}=(Q, \Sigma, \delta, q_0, Q - F)\\
&\therefore Regular\;language\;L\;is\;closed\;by\;complementation
\end{aligned}
$$


### Intersection 교집합에서는 왜 성립할까

이를 증명하는 방법은 두가지가 있다.

1. Poof by Constructoin
    - L1, L2를 나타낸 DFA를 각각 DFA1, DFA2라고 하자. 여기서 DFA1의 states Q와 DFA2의 states P의 combination으로 이루어진 새로운 set of states를 만들 수 있다.
    - 새 DFA의 transition은 아래와 같이 정할 수 있다.


$$
\delta((q_i,p_j),a)=(q_k,p_l)
$$


이 때 q는 DFA1의 state, p는 DFA2의 state였던 것이다.

- 새 DFA의 final state는 아래와 같이 정할 수 있다.


$$
F=\{(q_i,p_j)\in Q \times P:q_i\in F_1\;and\;p_j \in F_2\
}$$


이 때 F1과 F2는 각각 DFA1, DFA2의 set of final states 였던 것이다.

- 따라서 아래와 같이 결론지을 수 있다.


$$
\therefore The\;regular\;lnaguage\;is\;closed\\
under\;intersection\;operation.
$$


2. using set operation


$$
\begin{aligned}
&L_1,L_2:\;regular\\
&=> L_1^C,L_2^C:regular\\
&=>L_1^C \cup L_2^C:regular\\
&=>(L_1^C \cup L_2^C)^C:regular\\
&\therefore L_1\cap L_2:regular
\end{aligned}
$$


### 또 다른 예시

- L1, L2가 egular할 때
- (L1 - L2)도 regular일까?
    - Yes. 여집합과 교집합으로 표현가능하기 때문!
- L1의 reversed language도 regular일까?
    - Yes. 기존의 initial states를 final states로, 기존의 final states를 initial states로(initial vertex 하나와  λ transition 사용) 바꾼 뒤, 모든 actions의 방향을 거꾸로 돌리면 새로운 DFA를 만들 수 있다!
    - proof by construction!

---

### Homomorphism
language에 적용할 수 있는 operation에는 우리가 잘 모르는 특별한 친구도 있다.

- **homomorphism: 일종의 매핑 연산.**
    - Σ, Γ 는 모두 set of alphabets일 때
        - h: Σ → Γ*
        - 을 의미한다.
        - e.g) Σ = {a, b, c}, Γ = {1, 2, 3, 4}일 때 h(a) = 1232
- **extension**
    - w = a1 a2 a3 ... an 일 때
    - h(w) = h(a1) h(a2) h(a3) ... h(an)
- L이 Σ로 만들어진 language일 때
    - homomorphic image of L h(L) = {h(w), w ∈ L}

### Homomorphism 에서도 성립할까?
대답은 "그렇다" 이다! 여기서도 역시 proof by construction을 사용한다.

처음 주어진 regular language L1을 나타내는 regular expression에 바뀐 symbol을 그대로 대입하면 새로운 regular expression이 된다!

---

### Right Quotient
이 연산에 대해서도 regularity가 성립한다.

- **right quotient** operation은 language를 나타내는 두 집합을 operands로 받는다. 연산자 앞에 주어진 집합을 L1, 뒤에 주어진 집합을 L2라고 하면
    - L1에 있는 string 중에서 L2에 있는 string을 **surfix**로 갖는 string을 찾고
    - 그 string에서 해당 surfix를 제외한 substring만으로 이루어진 set를 돌려준다.
- e.g) 아래에서 L1 / L2의 결과는 {a} 이다.
    - L1의 `acad`는 고려 대상조차 아니다. `bc`를 prefix로 갖지 않기 때문이다.

![right quotient](https://broccolism.github.io/assets/img/AC/2020-05-05-1.jpg)

right quotient가 regularity에 대해 closed되어있다는 사실은 **proof by construction**으로 증명할 수 있다.

- L1 / L2 에 대한 DFA를 그릴 수 있다.
    1. L1을 나타내는 DFA M1을 그린다.
    2. M1의 state중, 그 state에서 시작해서 L2의 string만으로 final state에 도달할 수 있는 state를 찾는다.
        - 즉, qn에서 시작할 경우 M1에서 만든 Language L(Mn)과 L2의 교집합이 공집합이 아닌 qn만을 찾는다.
    3. 2번에서 찾은 모든 state를 final state로 갖고 나머지 state와 transaction은 모두 M1의 것과 같은 새 DFA M2를 그린다.
    4. M2가 L1 / L2에 대한 DFA가 된다.