---  
layout: post  
title: "[PL]효율적으로 만들기 - Pattern Matching/Exception/Tail-Recursion"
categories: classes
tags: pl pattern match exception tail recursive function
comments: true
---
## 순서
[1) Pattern Matching](#pattern-matching)  
&nbsp;&nbsp;&nbsp;&nbsp;[1-1) 좀 더 깊게!: Nested Patterns](#nested-patterns)  
[2) ML에서도 Exception 발생시키기](#exceptions)  
[3) 새로운 recursion: Tail Recursion](#tail-recursion)  
&nbsp;&nbsp;&nbsp;&nbsp;[3-1) 필요성](#필요성)  
&nbsp;&nbsp;&nbsp;&nbsp;[3-2) How to?](#어떻게-쓰나요)  
&nbsp;&nbsp;&nbsp;&nbsp;[3-3) 한계점: 항상 쓸 순 없어요](#하지만-이럴-땐-쓸-수-없어요)  
[4) Tail Position](#또다른-tails)  

# Pattern Matching
- definition: pattern *p* 와 value *v*가 서로 **match** 되는지 확인한 후 match 된다면 variable binding 하는 것.
    - pattern 도 nest 될 수 있기 때문에 정의 자체도 꽤나 recursive하다고 한다. 그 규칙을 몇개 가져오면:
        - *p*가 변수 *v*라면 match는 **성공**하고 *x* 가 *v* 로 바인딩 된다.
        - *p*가 `_` 라면 match는 **성공**하고 아무런 값도 바인딩되지 않는다.
        - *p*가 *(p1, p2, ..., pn)*이고 *v*가 *(v1, v2, ..., vn)*이라면 *p1*이 *v1*, *p2*가 *v2*, ... , *pn*이 *vn* 으로 모두 성공적으로 match 되어야만 전체 match는 성공한다. 전체 패턴의 바인딩은 각 세부 패턴이 바인딩 된 것의 union과 같다.
            - 즉 `(p1, p2, ..., pn)`이라는 패턴을 매칭시키려면 그 안에 있는 `p1`, `p2`와 같은 sub-pattern에 대한 매칭이 이루어져야 한다는 뜻이다. 마치 recursive function처럼!
- 좀 덜 엄밀한 definition: 패턴을 어떤 값와 비교하고 변수를 **right parts(정말 말 그대로 우측 부분)**로 바인딩 하는 것.
    - 개인적인 의견을 덧붙이자면, 변수를 할당하는 것과 비슷하다.
        - 절대 같지는 않다. 변수를 할당하는 것과 달리
            - 서로 같은 shape을 갖고 있어야 하고
            - 어딘가에 저장하는 것이 아니기 때문이다.
        - 다만 특정 표현을 다른 어떤 표현으로 대체하는 기능을 한다는 점은 같다.
            - 변수 `a`에 3이라는 값을 할당하면 이후에 `a` 를 쓰면 3을 의미하는 것이 되듯이
            - pattern matching 역시 바인딩을 해주기 때문이다.

### Syntactic Sugar of Pattern Matching
아래 두 코드는 완벽히 같은 의미를 갖는다. 아래쪽 코드가 case expression의 syntactic sugar를 사용한 것이다.
```sml
fun eval e = 
    case e of 
        Constant i => i 
    | Negate e2 => ~ (eval e2) 
    | Add(e1,e2) => (eval e1) + (eval e2) 
    | Multiply(e1,e2) => (eval e1) * (eval e2)
```
```sml
fun eval(Constant(i)) = i
    | eval(Negate(e)) = ~ (eval e) 
    | eval(Add(e1, e2)) = (eval e1)+(eval e2) 
    | eval(Multiply(e1, e2)) = (eval e1)*(eval e2)
```

### Nested Patterns
- expression을 원하는만큼, 얼마든지, 계속해서! nest 할 수 있듯이 pattern 역시 그렇게 할 수 있다.
- 그리고 nested pattern을 사용하면 가독성이 굉장히 높아진다.
```sml
fun zip3 lists =
    case lists of
        ([], [], []) => []
    | (hd1::tl1, hd2::tl2, hd3::tl3) =>
                (hd1, hd2, hd3)::zip3(tl1, tl2, tl3)
    | _ => raise ListLengthMismatch
```
```sml
fun unzip3 triples =
    case triples of
                [] => ([], [], [])
            | (a, b, c)::tl =>
                let val (l1, l2, l3) = unzip3 tl
                in
                    (a::l1, b::l2, c::l3)
                end
```

### Pattern Matching Examples
- `a::b::c::d` 라는 패턴은 3개 **이상**의 원소를 갖는 모든 list와 매칭된다.
    - 마지막 `d`가 `[]`일 수도 있기 때문이다.
- `a::b::c::[]` 라는 패턴이 원소가 딱 3개인 list와 매칭된다.
- `((a, b), (c, d))::e` 라는 패턴은 "pairs의 pairs" list 타입을 갖는 모든 리스트와 매칭된다. 이 때 원소의 갯수는 하나 이상이다.

---

# Exceptions
exception binding을 이용해 새로운 종류의 exception을 정의할 수 있다.
- Syntax
```sml
exception MyFirstException
execption MySecondException of int * int
```

- Access
    - exception에 접근한다는 말은 곧 exception을 발생시킨다는 의미일 것이다. 아래와 같이 `raise` 키워드를 쓰면 된다.
```sml
raise MyFirstException
raise (MySecondException(7, 9))
```

- Handling
    - exceptoin을 발생시켰다는 말은 곧 exception을 처리하겠다는 의미이다. 아래와 같이 `handle` 키워드를 쓰면 된다.
```sml
e1 handle MyFirstException => e2
        | MySecondException(x, y) => e3
```

---

# Tail Recursion
### 아니 그게 뭔가요
ML에서 recursion 속도를 좀 더 빠르게 올려주는 기법입니다!

ML은 함수형 프로그래밍 언어와 달리 변수에 값을 할당하고, 그 값을 바꿔주는 식으로 프로그램을 짜는 것을 지양한다. 대신 recursion을 적극 활용하는게 일반적이다. 그런데 그 recursion을 잘못 사용하면 속도가 굉장히 느려지는 치명적인 단점이 있으니 . .. 아래 예시를 보자.

### 필요성
- 한 줄 요약: recursion의 속도 향상을 위해 필요합니다.
```sml
fun fact n = if n = 0 then 1 else n * fact(n - 1)
val x = fact 3
```
이 코드를 실행시키면 한번에 최대 4개의 **call-stack**이 만들어져 있게 된다.
- **call-stack**: 어떤 함수가 call되면 return되기 전까지 계속해서 함수 내의 local variable과 parameter, 그리고 "더 처리할거 남았어요!"에 해당하는 정보를 저장하는 공간.
    - **activation record**라고도 부른다.
    - recursion이 일어나면 한 함수에 대한 call-stack이 여러개 생긴다. 그럴 때마다 함수의 local variable, parameter, 그리고 남은 instruction들을 저장하는 call-stack이 쌓이게 되는 것이다.
    - 함수가 return하면 비로소 해당 call-stack이 pop될 수 있다.

recursion 때문에 속도가 느려지는 경우가 바로 이런 경우다. `fact 3` 의 call-stack을 그림으로 나타내면 아래와 같다.

![slow fact](https://broccolism.github.io/assets/img/PL/2020-04-09-1.jpg)

만약 `fact 3` 이 아니라 `fact 33`, `fact 3333`을 불렀다면? 속도는 눈에 띄게 느려진다. `fact 33`까지만 가도 보통 컴퓨터에서 체감할 수 있을 정도로!

### 어떻게 쓰나요
그럼 이제 tail recursion을 활용해서 `fact` 함수를 고쳐보자.
```sml
fun fact n = 
    let fun aux(n, acc) =
                if n = 0
                then acc
                else aux(n - 1, acc * n)
    in
        aux(n, 1)
    end

val x = fact 3
```
코드는 훨씬 길어졌다. `fact` 안에 helper function으로 `aux`를 만들었기 때문이다. 그런데 자세히 보면 이제 recursive하게 실행되는 함수가 `fact` 가 아닌 `aux` 이다. 이렇게 하면 새롭게 생성되는 call-stack의 갯수를 효과적으로 줄일 수 있다. 왜냐하면 기존에 만들어졌던 call-stack을 **재활용**할 수 있기 때문이다.

ML 컴파일러는 tail call을 감지한다. call-stack을 재활용한다는 소리는...
- caller는 callee가 끝나지 않아도 pop될 수 있다.
- 대신 callee가 caller의 스택을 사용할 수 있다.
- 최적화를 적절히 활용하면 그냥 while-loop, for-loop처럼 일반적인 loop와 비슷한 성능을 낸다.

즉 위의 예시로 설명하자면 `else aux(n - 1, acc * n)` 이 실행되는 순간 새로운 call-stack이 만들어지는게 아니라, while-loop 하나가 끝났을 때 다시 while문의 최상단으로 올라가듯이 다시 `fun aux(n, acc) =` 부분으로 **jump**한다는 뜻이다. call-stack이 저장하고 있어야 할 parameter는 `n - 1`, `acc * n` 으로 바뀐 채로!

그래서 이 경우의 call-stack을 그림으로 나타내면...

![faster fact](https://broccolism.github.io/assets/img/PL/2020-04-09-2.jpg)

이렇게 된다! 딱히 더 나타낼 것도 없이 그냥 스택 하나로 쭉 쓰는 것이다.

### 방법론
그렇다면 내가 작성한 recursive function을 tail recursion으로 쉽게 바꾸는 방법을 알아보자.

1. 함수 안에 helper function을 추가하고, 인자로 받는 값은 계속 축적되게 한다.
2. 이전 함수의 base case는 initial accumulator가 되고
3. 새로운 base case는 final accumulator가 된다.

위에서 만들었던 `aux` 함수 역시 위의 규칙을 따르고 있다.

### 하지만 이럴 땐 쓸 수 없어요
퀵 소트, 트리 탐색처럼 한 번에 2 덩어리에서 recursion이 일어나야 하는 경우에는 tail-recursion으로 구현이 불가능하다. 그러니 다른 최적화 방법을 찾아보는 것이 좋다.

### 또다른 Tails
사실 tail recursion은 *tail call*을 여러번 하는 것과 같다.
- tail call: *tail position*에서 함수를 호출하는 것.

그렇다면 tail position이 어딘지를 알아야 할 것이다. 수많은 tail 부분 중 일부를 살펴보자.
- funciton body: `fun f p = e` 에서 `e` 에 해당하는 부분이 tail.
- if문이 tail position에 있을 때, then과 else 뒷부분: `if e1 then e2 else e3` 이 tail position 안에 있다면 `e2` 와 `e3`도 tail이다.
- let 구문이 tail position에 있을 때, let 구문에서 in과 end 사이 내용: `let b1 ... bn in e end` 이 tail position 안에 있다면 `e` 도 tail이다.
- arguments는 tail이 아니다.