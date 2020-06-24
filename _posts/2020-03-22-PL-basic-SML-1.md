---  
layout: post  
title: "[PL] SML 기초(1) - Syntax, Type, Value, Function"
categories: study
tags: study 2020-1 pl sml basic syntax type-checking evaluation expression functional langauge programming 
comments: true
---
## 순서
[0) Language를 이루는 5가지 개념들](#five-different-things)  
[1) ML 개념들](#concepts-of-ml)  
[*) 다른 언어에 익숙한 사람을 위한 팁](#some-tips)  
[2) if문](#conditional-expression)  
[3) 함수](#function-bindings)  


GOAL of PL class: learn essential concepts relevant in any programming language so that we can become a better programmer.

- ML, Racket, Cuda: all represents different language families.
- Big focuse on **functional programming**
    - **mutation** 지양
        mutation: C, java, python처럼 변수에 값을 할당하고 그 값을 업데이트하면서 프로그래밍 하는 것

    - **first-class functions** 사용
        int, string처럼 우리가 지금까지 알고 있었던 변수의 일반적인 타입과 함수를 동일하게 여기는 사고방식.

    - Many other topics...!

# Five Different Things
language를 구성하는 5가지 개념들이 있다.
1. Syntax: 어떤 형식으로 써야 하는가
2. Semantics: 그 형식들이 어떤 의미를 가지는가 (evaluation rules)
3. Idioms: 보통 어떤 패턴으로 해당 language에서 제공하는 것을 활용하는가 (e.g: C++에서 for문의 활용 / micro-design pattern)
4. Libraries: 해당 language가 "standard"로써 제공하는 것은 무엇인가
5. Tools: 편의를 위해 무엇을 제공하는가 (e.g: 디버거)

---

# Concepts of ML
- Program: a sequence of *bindings*
    - example of *bindings*: variable binding
``` sml
        val x = 34;
```

- `Syntax`: 무언가를 적는 방식
- Semantics: 우리가 적은 무언가가 갖는 의미

    SML이 semantic을 밝혀내는 방법은

    1. *Type-checking* in `static environment` (프로그램 실행 전)

        SML은 **static type language** 이다. 이런 언어의 모토는 실행 중에 발생하는 타입 에러를 최소화하기 위해 실행 전에 타입을 체크하는 것이기 때문에 정적 환경에서 미리 타입 체킹을 해준다.

        - SML의 type-checking은 C++, java, C#과 같은 다른 언어에 비해 더 꼼꼼하다.
    2. *Evaluation* in `dynamic environment` (프로그램 실행 중)
        - evaluation을 통해 얻어낸 결과를 *value*라 한다.
- Expression
``` sml
        34   true   false   x
        e1 + e2       e1 < e2
        if e1 then e2 else e3
```
    모든 expression은 아래 3가지를 갖는다.

    1. Syntax
    2. Type-checking rules

        ⇒ 특정한 type이나 failure를 만들어냄

    3. Evaluation rules

        ⇒ 특정한 value나 exception, 혹은 infinite-loop을 만들어냄

---

### Some Tips
- SML에서 음수 표시를 하려면 숫자 앞에 `-`가 아닌 `~`을 넣어야한다.
``` sml
        -3 (x)
        ~3 (o)
```
- type syntax에서 사용하는 `*`은 곱하기가 아니다.
``` sml
        int * int -> int
```
    위 예시는 놀랍게도 `함수의 type`이다. '함수의 return type'이 아니다. 변수가 `int`, `string` 등 type을 가질 수 있듯이 함수 자체에도 type이 있는데 이를 표현하는 방식이다. 왼쪽의 `int * int` 는 이 함수가 argument로 받는 변수가 2개이고, 각각 `int` type이라는 것을 의미한다.

- Boolean Operations

    C 계열 언어나 java처럼 기호를 쓰지 않고 아래처럼 쓴다.

    참고로 주석은 `(* *)` 로 둘러싸면 된다.
``` sml
        e1 andalso e2 (* && *) (* and 라는 키워드는 따로 용도가 있다.*)
        e1 orelse e2 (* || *)
        not e1 (* !e1 *)
```
- Comparisons
``` sml
        = <> > < >= <=
```
    나머지는 익숙하지만 `<>`는 처음 볼 것이다. `<>` 는 양 쪽 expression이 서로 다른지 확인하는 연산자이다. C계열, java 언어에서 보던 `!=` 와 비슷한 역할을 한다.

- Modulo, Division
```sml
    10 mod 4 (* = 2 *)
    10 % 4 (* error! because it is for REAL *)
    10.0 % 4.0 (* = 2.0 *)
        
    10 div 4 (* = 2 *)
    10 / 4 (* error! because it is for REAL *)
    10.0 / 4.0 = 2.5
```

---

### Conditional Expression
1. Syntax
``` sml
    if e1 then e2 else e3
```
2. Type-checking
    - e1: 반드시 `bool`
    - e2, e3: 서로 같은 type `T`
    - expression 자체의 type: `T`
3. Evaluation
    - e1: `v1`
    - expression 자체의 value: v1이 true이면 e2를 evaluate, false이면 e3를 evaluate한 value

### Function Bindings
SML에서 function은 class가 아닌 **value**이며 **this**, **return** 또한 없다.

1. Syntax
``` sml
        fun x0 (x1: t1, x2: t2, ..., xn: tn) = e
```
2. Type-checking
    - x1, x2, ..., xn: 각각 t1, t2, ..., tn type
    - x0: (t1 * t2 * ... * tn) → t
        - 오른쪽에 적은 표현 자체가 `함수의 type` 이 된다.
        - 함수의 `return type` : e의 type
3. Evaluation
    - x0: `value of e`

### Function Calls
1. Syntax
``` sml
        e0 (e1, e2, ..., en)
```
2. Type-checking
    - e0: `(t1 * t2 * ... * tn) → t`
        - e1, e2, ..., en의 타입을 각각 t1, t2, ..., tn이라 했을 때
    - e0 (e1, e2, ..., en): `t`
3. Evaluation
    1. e0 : `fun x0 (x1: t1, x2: t2, ..., xn: t2)`
        - e0 이라는 expression 자체의 value는 함수 자체가 된다.
    2. 이후 arguments x1, x2, ..., xn 들을 각각 v1, v2, ..., vn 이라는 value로 값을 결정한 후
    3. e의 value를 결정한다.
    이 때 1, 2번은 **dynamic environment**에서, 3번은 **function 이 define 된 environment** 에서 수행한다.