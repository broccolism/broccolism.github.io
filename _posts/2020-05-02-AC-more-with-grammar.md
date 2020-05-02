---  
layout: post  
title: "[AC] Grammar랑 놀자!"
categories: classes
tags: classes ac grammar linear right left regular language
comments: true
use_math: true
---

> DFA is programmable using a table.

- 그리고 rex → NFA → DFA의 과정으로 DFA를 얻을 수 있다.
- 즉, 오토마타를 이용해서 프로그램을 만들 수 있는 것이다.
    - 이 때 필요한 것이 symbol table이다.
        - 각 symbol을 취하는 action의 starting state와 target state를 나타낸 테이블.

## 순서
[1) Left, Right Grammar](#more-with-grammar)  
[2) Right/Left-linear Grammar are All Regular!](#regular-grammar-come-back)  
[3) NFA를 Right/Left Linear Grammar로 바꾸기](#nfa-and-right-linear-grammar)  

# More with Grammar
- **regular grammar** = regular languge를 만들어내는 grammar.
- **linear grammar**
    - 어떤 garmmar G=(V, T, S, P)에서 production rule의 모든 문장의 오른쪽에 **1개 이하의 variable만** 있는 경우 그 garmmar는 linear하다고 말할 수 있다.
    - **production rule**의 예시: S → aBcd
        - 여기서 왼쪽에는 S, 오른쪽에는 aBcd가 있다.
    - e.g) G = ({S, A, B}, {a, b}, S, P) where P is this:
        - S → A, A → aB │ λ, B → aaAb, S → λ
            - 여기서 두 번째 A → aB │ λ 에서 │ 는 or를 의미한다.
                - A → aB │ λ == (A → aB or A → λ)
            - 이럴 때에는 A → aB 하나와 A → λ로 해석한다.
                - λ가 오른쪽에 있는 경우, variable이 0개라고 해석한다.
        - 따라서 이 grammar는 linear grammar이다.
- **right-linear**, **left-linear** grammar: linear grammar의 subset.
- **right-linear**: linear grammar 중, 모든 variable이 화살표 기준 오른쪽 항의 가장 오른쪽에 위치하는 grammar
    - e.g) B가 variable인 경우 모든 production rules가 아래처럼 생겼으면 해당 grammar는 right-linear grammar 이다.

    ![right-linear](https://broccolism.github.io/assets/img/AC/2020-05-02-1.jpg)

- **left-linear**: linear grammar 중, 모든 variable이 화살표 기준 오른쪽 항의 가장 왼쪽에 위치하는 grammar
    - e.g) B가 variable인 경우 모든 production rules가 아래처럼 생겼으면 해당 grammar는 left-linear grammar이다.

    ![left-linear](https://broccolism.github.io/assets/img/AC/2020-05-02-2.jpg)

## Regular Grammar Come Back
Right-linear, left-linear grammar는 모두 Regular grammar이다. 물론 right-linear, left-linear grammar가 아닌 grammar도 regular grammar가 될 수 있다. 하지만 일단 right-linear, left-linear인 grammar가 있다면 그 grammar는 항상 regular grammar라고 말할 수 있다.

### Intuitive Explanation of the Reason

1. Right-linear grammar is regular grammar.
grammar G = (V, T, S, P) where V = (V0, V1, ..., Vn) and S = V0이 주어졌다고 하자. 이 때 production rule은 주어진 grammar가 right-linear하기 때문에 모두 V0 → a1 Vi (i < n), Vi → a2 Vj (j < n) , Vn → al 의 형태로 나타날 것이다.

이제 여기서 모든 variable을 *state*라고 생각해보자. 그러면 V0에서 시작하는 derivation:

V0 → a1 Vi → a1 a2 Vj →* a1 a2 a3 ... an Vn → a1 a2 a3 ... an al

덕분에 최종적으로  a1 a2 a3 ... an al 라는 형태의 string을 얻을 수 있다. 그런데 이것은 variable들이 모두 state로 여겨진다면 δ*(V0, a1 a2 a3 ... al) = Vf 인것과 같고 이 말은 아래처럼 생긴 NFA가 존재한다는 의미이다.

![nfa](https://broccolism.github.io/assets/img/AC/2020-05-02-3.jpg)

어떤 language를 나타내는 NFA가 있다는 뜻은 해당 language가 regular하다는 뜻이고 regular language를 만들어내는 grammar는 regular하다. 따라서 right-linear grammar는 항상 regular하다.

2. Left-linear grammar is regular grammar.
left-linear grammar의 경우 역시 위와 같은 방식으로 설명할 수 있다.

# NFA and Right Linear Grammar
- **모든** NFA는 그와 equivalent한 right-linear grammar를 갖고 있다.
    - 이를 위한 systemic method까지 이미 준비되어 있다!
1. 우선은 해당 NFA를 DFA로 바꾼 후...
2. 각 transition δ(q1, a) = q2 를 grammar의 production rule로 바꾼다.
    - q1 → a q2 로 바꾸면 된다.
3. final state qj에 대해서는 아래와 같이 바꾼다.
    - qj → λ 형태로 바꾼다.

# NFA and Left Linear Grammar
right linear grammar와 달리 꽤 tricky하다고 한다.

- left-linear grammar GL이 주어졌다고 하자. 이 grammar의 production rule에서 오른쪽 항의 순서를 바꾸어 right-linear grammar GR로 바꿀 수 있다.

![left to right](https://broccolism.github.io/assets/img/AC/2020-05-02-4.jpg)

- 따라서 아래 관계가 성립한다.


$$
L(G_R)=L(G_L)^R
$$


- 이 때 L(GL)위의 R은 right가 아니라 **reverse**를 의미한다.
- 어떤 lagnuage가 regular하다면 그 laguage의 **reverse language** 역시 regular하다.
    - 이것이 성립하는 이유는?
    - 원래 lagnuage는 regular하기 때문에 이를 나타내는 DFA가 존재한다.
    - 이것의 reverse language를 나타내는 NFA는 다음과 같이 만들 수 있다.
        - 기존의 final state을 모두 모아 하나의 state를 향하게 한 후 initial state로 만든다.
        - 모든 transition의 기존 방향을 반대로 바꾼다.
        - 기존의 initial state를 final state로 바꾼다.
    - reverse language를 나타내는 NFA가 있기 때문에 이 language 역시 regular하다.
- 위에서 찾은 GR과 GL의 관계와 reverse language의 성질 때문에 left-linear grammar 역시 regular grammar이다.