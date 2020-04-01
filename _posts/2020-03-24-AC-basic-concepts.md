---  
layout: post  
title: "[AC] 오토마타 기본 개념"
categories: classes
tags: ac automata state transition set
use_math: true
comments: true
---
# 순서
[1) State와 Transition](#state-and-transition)  
[2) 오토마타 표현 방식](#notations)  
[3) "동등한" Equivalence 관계](#equivalence-relation)

- Intro
    > fundamental mathematical concepts & basic techniques used in automata & the theory of computation

    - Overview
        - Notations based on the Set Theory
        - Proof
        - Different Concepts
            - Automata
                - Deterministic
                - Non-deterministic
            - Language (Grammer): Formal Language
            - Regular Expression
        - Extension of concepts above
        - Turing Machines

# State and Transition
### What is Automata?
state와 transition으로 알고리즘을 나타내는 방식

- 원: `state` (hungray, not hungry state), 문자: `transition`(or `acition`) (O, T) 
- 어떤 state에서 특정 action을 하면 state가 어떻게 변화하는지 나타내는 방식.

- Automata is `Complete` when
    모든 state에 대해 그 state에서 가능한 모든 action을 취했을 때 어떤 state로 변하는지 나타냄.

- Features
    1. Finite States 로 구성
    2. No memory
        - 각 state의 다음 state를 판단할 때는 해당 state와 해당 action만 보고 판단함
    3. Sequences that can reach the Final State
        - Final State로 갈 수 있는/없는 state들의 sequences가 존재함
        - `final state`: 해당 state에서 끝나면 그 sequence가 acceptable한 state.
    4. 똑같은 것을 나타내기 위한 오토마타는 여러개일 수 있다.
        ![compare-two-automatas](https://broccolism.github.io/assets/img/AC/2020-03-24-1.png)
        두 오토마타는 서로 다르지만 나타내는 바는 같다.

- **Model of the hardware of a computer = Automata**
    1. `input`을 받는다.
        - e.g) tennis example의 input: "wlww"와 같은 sequence.
    2. `output`을 만들어낸다.
        - e.g) tennis example의 output: w 혹은 l
    3. `temporary storage`만을 갖는다.
        - input, history 등이 무한하지 않다.
        - 우리는 오토마타의 `current state`만을 갖고 무언가 하고싶어!
    4. input을 output으로 `transforming`하면서 결정을 내린다.
        - 가능한 output: 특정 state, 특정 state의 property, 특정한 연산 결과, ...

### Formal Language = Programming Langauge that is
rule에 의해 `permit`된 모든 sentences의 `SET`.
- e.g) tennis example에서
    accepted senctence: "wwllww"
        - end state까지 갈 수 있음.
        - 따라서 이 문장은 Formal language로 쓰인 문장.
    not accepted sentence: "wwllwl"
        - end state까지 갈 수 없음.

---

# Notations
집합의 기본적 방식 따름
- `조건부 정의` 방식: 땡땡이랑 세미콜론 사용!!
    - S = {i **:** i > 0 **,** i is even}
- `유한집합`, `무한집합` 모두 존재
- `공집합`은 모든 집합의 부분집합
- `여집합` 기호: 집합 이름 위에 바 하나 얹기!
- `멱집합` `Power Set`: S의 모든 부분 집합으로 구성된 집합
    - S = {a, b, c} 일 때

    
    $$2^S = \{\emptyset, \{a\}, \{b\}, \{c\}, \{a, b\}, \{a, c\}, \{b, c\}, \{a, b, c\} \}$$


    ⚠ 주의사항! 아래처럼 표기하면 안 됨 ⚠
    ![worng-notation](https://broccolism.github.io/assets/img/AC/2020-03-24-2.png)
- 집합의 크기 = `cardinality`: 절댓값 쓰듯이 씀
    - $\| 2^S \| = 2^\|S\|$
- `Cartesian Product`
    - A X B = { (x, y) : x is in A, y is in B }
    - A X B X ... X Z = { (a, b, ..., z) : each of a, b, ..., z is in A, B, ..., Z }

---

# Order of a Function
- [big-O, big-Omega, big-Theta notation (위키백과 링크)](https://ko.wikipedia.org/wiki/%EC%A0%90%EA%B7%BC_%ED%91%9C%EA%B8%B0%EB%B2%95)

# Equivalence Relation
- property
    1. `Reflexivity`: reflexive property
        $$x ≡ x, ∀x$$
    2. `Symmetry`: symmetric property
        $$x ≡ y ⇒ y ≡ x$$
    3. `Transitivity`: transitive property
        $$x ≡ y, y ≡ z ⇒ x ≡ z$$