---  
layout: post  
title: "[PL] SML 기초(2) - Tuple, Pair, List, Mutation"
categories: study
tags: study 2020-1 pl sml basic syntax type-checking evaluation let tuple pair list mutation programming 
comments: true
---
## 순서
[1) Tuple 알아보기](#tuples-and-lists)  
[2) List 알아보기](#lists)  
[3) local binding - 'let'](#let-expressions)  
[4) 새로운 타입: Option](#options)  
[5) SML에서는 항상 safe copy](#safe-to-copy)  

## SML does NOT have Mutation
- mutation: 변수에 값을 할당하는 것
- 그렇기 때문에 변수의 값이 어떻게 변하는지 지켜보고, sharing 및 aliasing 할 때 주의를 기울일 필요가 전혀 없다.
    - Java와는 반대되는 얘기이다.

# Tuples and Lists
### Pairs
= 2차원 tuple과 동일하다.
이 때 pairs를 **build**하는 방법과 **access**하는 방법 모두 필요하다.

**[build]**  
- Syntax
```sml
    (e1, e2)
```
- Type-cheking
    e1이 `t1` type, e2가 `t2` type이라면 위의 페어는 `t1 * t2` 라는 type을 갖는다.
    - 즉 페어의 원소는 서로 다른 type을 가질 수 있다.
- Evalution
    e1이 `v1`, e2가 `v2` 라는 value를 가지면 위의 페어는 `(v1, v2)` 라는 value를 갖는다.

**[access]**  
- Syntax
```sml
    (* e = (e1, e2) 일 때*)
    #1 e
    #2 e
```
- `#1 e`, `#2 e` 를 이용해 각각 페어의 첫 번째, 두 번째 값에 접근할 수 있다.

### Tuples
튜플은 페어의 generalized form이라고 볼 수 있다. 그러니까 원소가 3개 이상일 수 있다는 뜻이다.
- 페어와 튜플은 모두 nested form을 가질 수 있다.
```sml
    val x1 = (7, (true, 9)) (* type: int * (bool * int) *)
    val x2 = #1 (#2 x1) (* type: bool *)
```
- 튜플의 원소 역시 각자 다른 type을 가질 수 있다.
- 튜플의 원소 개수는 한 번 정해진 후 바꿀 수 없다.

### Lists
- list의 성질은 tuple의 것과 반대이다.
    - 리스트의 원소는 모두 같은 type이어야 한다.
    - 리스트의 원소 개수는 언제든지 바뀔 수 있다.
리스트 역시 **build**하는 방법과 특정 값에 **access** 하는 방식이 필요하다.

*(2020.04.07 추가)*
튜플과 리스트를 좀 더 비교해보자.
- 튜플 A, B가 있고 서로 같은 type이라면 각 튜플의 원소의 갯수도 같다.
    - 튜플의 type 자체가 `(int * int * bool)` 처럼 원소의 갯수를 포함하고 있기 때문이다.
- 리스트 A, B가 있고 서로 같은 type이라면 각 튜플의 원소의 갯수는 다를 수 있다.
    - 튜플과 달리 리스트의 경우에는 `int list` 처럼 각 원소의 type만 알 수 있기 때문이다.
- 다시 말하자면 튜플의 type을 통해서는 원소의 갯수까지 알 수 있으나 리스트는 그렇지 않다.

**[build]**  
- Syntax
```sml
    [] (* empty list *)
    [e1, e2, ..., en] (* 이렇게 평범하게 정의할 수 있다 *)
    
    e1 :: l1 (* called "cons" *)
```
- Concatenation: 위의 예시에서 마지막 줄을 보면 새로운 연산자 `::` 를 사용하고 있다. 이 연산자의 왼쪽에는 value, 오른쪽에는 list가 있어야 하며 해당 value를 list 가장 앞 쪽 원소로 추가해준다.
- Type-checking
    - `T` type의 원소를 가진 리스트는 `T list` type을 갖는다.
    - 단, 빈 리스트 `[]` 는 `'a list` 라는 type을 갖는다.
        - `'a list` : 'alpha list'라고 읽는다. 이후 **any** type을 가질 수 있다. 이렇게 정의해두었기 때문에 type-checking을 무사히 통과 할 수 있다.
```sml
    val value1 = 3 (* type: int *)
    val list1 = [] (* type: 'a list *)
    value1::list1 (* type: int list *)
```
- Evaluation
    - list의 각 원소 e1, e2, ..., en이 v1, v2, ..., vn이라는 value를 갖고 있으면 그 list는 `[v1, v2, ..., vn]` 이라는 value를 갖는다.

**[access]**  
다른 언어와 다르게, SML에서는 list의 각 원소를 `iterator`로 접근하지 않는다. 특정 `value` 로도 접근할 수 없다. 아래 두가지 방식을 사용한다.

- Head of the List
```sml
    >>> val list1 = [1, 2, 3, 4, 5]
    >>> hd list1
    (* 1 *)
```
즉 리스트의 가장 첫 번째 원소에 접근할 수 있다. 이 때 `hd list1` 의 type은 `int` 이다. `list1` 이 `int list` type이었기 때문이다.

- Tail of the List
```sml
    >>> val list1 = [1, 2, 3, 4, 5]
    >>> tl list1
    (* [2, 3, 4, 5] *)
```
리스트의 head를 제외한 나머지 원소들로 이루어진 list에 접근할 수 있다. 이 때 `list1`이 `int list` 였기 때문에 `tl list1` 역시 `int list` 이다.

- iterator를 사용하지 않으니 리스트의 모든 원소에 접근하기 어려운 것처럼 보일 수도 있다. 하지만 `recursion` 을 사용하면 충분히 접근할 수 있다.
- 위의 두 경우는 모두 `list1`이 `[]`가 아닐 경우에만 사용할 수 있다. 그렇지 않으면 exception이 발생한다. 어떤 리스트가 비어있는지 아닌지를 확인하는 방법은 아래와 같다.

- null checking
```sml
    >>> val list1 = []
    >>> null list1
    (* true *)

    >>> val list2 = [1]
    >>> null list2
    (* false *)
    >>> null (tl list2)
    (* true *)
```
즉 `null` 키워드는 input type이 `'a list` type이고 output type은 `bool` 인 셈이다.

---

# Let Expressions
- Syntax
```sml
    let b1 b2 ... bn in e end
```
- Type-checking: `b1`, `b2`, `...`, `bn` 과 `e` 는 모두 static enviornment에서 type checking을 한다. 전체 let-expression의 type은 `e` type이 된다.
- Evaluation:  `b1`, `b2`, `...`, `bn` 과 `e` 는 모두 dynamic environment에서 evaluation한다. 전체 let-expression의 value는 `e`의 value가 된다.

---

# Options
`t option` 이라는 새로운 타입이 등장했다. 어떤 함수의 return 값이 valid 하지 않을 경우를 위해 만든 type이다. 아무 `t` type에 적용할 수 있다.

**[build]**  
- `NONE` : `'a option` 이라는 type을 갖는다.
- `SOME e`: `e` 가 `t` type일 때, `t option` type을 갖는다.

**[access]**  
- `isSome`: `'a option -> bool` type을 갖는다.
- `valOf`: `'a option -> 'a` type을 갖는다. 만약 `NONE` 에 이 연산을 적용하려고 하면 exception을 발생시킨다.

option type을 return하는 함수의 예시를 살펴보자.
```sml
fun worse_max (xs: int list) = 
    if null xs
    then NONE
    else
        let val tl_ans = worse_max(tl xs)
        in
            if isSome tl_ans (* 이걸 안 하면 NONE일 때 exception! *)
                    andalso valOf tl_ans > hd xs
            then tl_ans
            else SOME (hd xs)
        end
```
- 함수 `worse_max` 는 `int list -> int option` type을 갖는다. 이 때 함수는 `int option` type을 return해야 하기 때문에 `NONE` 과 `SOME` type을 return하는 것을 볼 수 있다.
- 만약 여기서 `xs`가 `[]`일 때 `NONE` 대신 0을 return하면 어떻게 될까? 언뜻 보기에 괜찮아보이지만 전혀 그렇지 않다. 아래 경우가 구분되지 않기 때문이다.
    - `xs` 가 `[]` 인 경우
    - 실제로 최댓값이 0인 경우

## for Performance
위의 예시에서 함수 이름이 `worse_max` 인 이유가 따로 있다. `tl_ans`라는 변수를 굳이 사용해서 값을 불필요하게 wrapping 후 unwrapping하고 있기 때문이다. 그런 부분을 없애기 위해서는 새로운 함수를 정의하는게 좋다.
```sml
fun better_max(xs: int list) =
    if null xs
    then NONE
    else let
        fun max_nonempty(xs: int list) = 
            if null (tl xs)
            then hd xs
            else
                let val tl_ans = max_nonempty(tl xs)
                in
                    if hd xs > tl_ans
                    then hd xs
                    else tl_ans
                end
    in
        SOME (max_nonempty(xs))
    end
```

---

# Safe to Copy
```sml
    pr
    (#1 pr, #2 pr)
```
java에서 유의해야하는 deep copy, shallow copy 문제가 SML에서는 전혀 없다. 위의 두 line은 정확히 같은 것을 의미한다. SML 입장에서는 구분할 수 없는 것이다.
- 왜냐하면 SML에서는 기본적으로 value mutation이 불가능하기 때문!
    - mutation = 변수에 값을 할당한 후 그 값을 바꾸는 것