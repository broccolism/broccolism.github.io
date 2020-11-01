---  
layout: post  
title: "[PL] 모듈 만들기 & type-checking"
categories: study
tags: study 2020-1 pl module signature match type checking
comments: true
use_math: true
---

## 순서
[1) Modules](#modules)  
[2) Signature Matching](#signature-matching)  
[3) ML의 type-checking 맛보기!](#ml-type-checking)  
&nbsp;&nbsp;&nbsp;&nbsp;[3-1) Problem: mutation issue](#problem)  

# Modules
`List.foldl`, `String.toUpper`와 같은 함수들은 미리 만들어진 모듈 `List`, `String` 안에 바인딩 되어있는 함수다.

`structure`, `struct` 키워드를 이용해서 새 모듈을 만들 수 있다.

```sml
structure MyModule = struct bindings end
```

`bindings`에는 어떤 종류든 상관없이 모든 binding을 사용할 수 있다.

- val(fun 포함), datatype, exception 등등!

어떤 모듈 밖에서 그 모듈 안의 바인딩을 부르고 싶을 때에는 `ModuleName.bindingName`과 같이 부르면 된다. 사실 `List.foldl`, `String.toUpper`와 같은 형식이다.

### Signatures

- **signature**: 모듈의 type
    - 모듈이 어떤 바인딩을 갖고 있는지
    - 그리고 그 각각의 바인딩이 어떤 type인지를 알려준다.
    - C로치면 일단 선언만 해두는 헤더파일 같은 느낌!

`signature`, `sig` 키워드를 이용해서 새 시그니쳐를 만들 수 있다.

```sml
signature MySignature = sig types end
```

- 모듈을 만들 때 signature를 사용하려면 `:>` 연산자를 쓰면 된다.
    - `ModuleName :> SignatureName`

```sml
signature MATHLIB =
sig
val fact: int -> int
val half_pi: real
val doubler: int -> int

structure MyMathLib :> MATHLIB =
struct
fun fact x = ...
val half_pi = Math.pi / 2.0
fun doubler x = x * 2
end
```

- 이 때, fun type은 시그니처에서는 `val`을 이용하고 있다.

module M이 signature S를 사용하겠다고 한 뒤 S에는 없는 새로운 바인딩을 사용하려고 한다면 에러가 발생한다.

### Signature Matching
`structure STR :> SIG`가 있다고 하자. 아래 조건을 모두 만족해야 allow된다.

- `SIG`의 모든 non-abstract type은 `STR`이 정의해야한다.
    - **non-abstract type**: concrete type.
    - **abstract type**: `datatype`, `type`으로 정의한 type.
- `SIG`의 모든 abstract type은 `STR`이 정의해야한다.
- `SIG`의 모든 val-binding은 `STR`이 정의해야한다.
    - 이 때, `STR`에는 more general한 type이 있을수도 있다.
    - e.g) `SIG`에 int list → int라는 signiture가 있었다면 `STR`에는 'a list → 'a가 있을 수 있다.
        - 단 `STR :> SIG`를 해주었으면 우리는 해당 함수를 int list → int로만 사용할 수 있다.
- `SIG`의 모든 exception은 `STR`에서도 제공해야한다.

---

# ML Type Checking
1. 순서대로 binding의 type을 결정한다.
    - 이후의 바인딩을 사용할 수 없도록!
2. `val`, `fun` 바인딩에 대해
    - definition을 분석해서 type을 결정한다.
        - e.g) `x > 0`을 보고 `x`가 반드시 int type이어야 함을 알 수 있다.
        - 이 때 결정되는 type은 **constrained type**이라 한다.
    - 모든 바인딩에 대해 type을 결정할 수 없다면 Type error를 발생시킨다.
3. **unconstrained type**에 대해 type variable을 사용한다.
    - e.g) `'a` type
4. 마지막으로 *value restriction*을 적용한다.
    - 이는 나중에 다룰 것이다.

예시를 통해 살펴보자.

```sml
val x = 42
fun f (y, z, w) =
	if y
	then z + x
	else 0
```

1. 순서대로 binding의 type 결정
    - `x`: T1
    - `f`: T2
    - `y`: T3
    - `z`: T4
    - `w`: T5
    - `f`: (T3 * T4 * T5) → T6
    - `z + x`: T1 = T4
2. definition을 분석해서 constrained type을 결정
    - `x = 42`: T1 = int
    - `if y`: T3 = bool
    - `then z + x else 0`: T1 = T4 = int , T6 = int
    - `f (y, z, w)`: T2 = (bool * int * T5) → int
    - `w`에 대한 constraint는 없다. 따라서 T5는 unconstrained type이다.
3. unconstrained type에 대해 type variable 사용
    - T5 = 'a
    - T6 = (bool * int * 'a) → int

∴ `x`: int, `f`: (bool * int * 'a) → int, `y`: bool, `z`: int, `w`: 'a

### Problem

위의 법칙만으로는 mutation을 완벽하게 막을 수 없다. 예제 코드를 보자.

```sml
val r = ref NONE (* val r: 'a option ref *)
r := SOME "hi"
val i = 1 + valOf (!r)
```

line 2에서는 `r`이 string type으로 쓰였지만 line 3에서는 `r`이 int type처럼 쓰이고 있다. 하지만 위의 코드는 ML에서 멀쩡하게 잘 돌아간다!

- line 2에서 `:=`는 `'a ref * 'a -> unit` type 함수이다. line 2만 놓고 보면 별 문제가 없다.
- line 3에서 `!` 는 `'a ref -> 'a` type 함수이다. line 3만 놓고 보면 별 문제가 없다!

하지만 우리가 생각하기에 위와 같은 코드를 받아들이면 아주 큰 문제가 발생하고 만다. ML에서는 이를 어떻게 해결할 수 있을까?
- 문제의 원인: 'a type reference에 대한 type checking 방식에 빈틈이 있다. 이를 악용할 가능성이 존재한다.
    - 그렇다고 이를 해결하기 위해 reference type에 대한 rule을 추가한다고 해도 별 다른 수가 없다.
        - type-checker가 모든 type synonyms에 대한 definition을 알 방법이 없기 때문이다.
- 해결책: `val` type variable을 만들 때, 함수를 이용한다면 해당 함수에게 주는 parameter는 generic type을 받을 수 없게 만든다.
    - 따라서 variable이나 value만이 polymorphic type을 가질 수 있다.
    - e.g) `val r = ref NONE`은 이제 금지되었다.
        - error까진 내지 않지만, Warning을 낸다.
    - 그러나 이 해결책에도 빈 틈이 존재한다.
        - accept 되어야 하는 것임에도 reject되는 것이 있다.

        ```erlang
        val pairWithOne = List.map(fn x => (x, 1))
        ```

        - ML에서 위 코드를 실행시키면 `pairWithOne`의 타입에 이상한 일이 일어나있는 것을 볼 수 있다.
        - 이런 경우를 'complete'하지 않다고 말한다. (자세한 이야기는 나중에!)