---  
layout: post  
title: "[PL]More about Functions and Types"
categories: classes
tags: pl function programming closure polymorphism anonymous higher-order type
comments: true
---
## 순서
[1) "함수형 프로그래밍"](#functional-programming)   
[2) 함수도 값이다! First-class Functions](#first-class-functions)  
[3) 이름이 없는 Anonymous Functions](#anonymous-functions)  
[4) 새 별명 붙여주기: Type](#type)  

# Functional Programming
은 사실 사실 뜻을 5가지나 갖고 있답니다!
1. 대부분/혹은 모든 경우에서 **mutation**을 하지 않는 프로그래밍 스타일
2. function을 **value**로 생각하는 프로그래밍 스타일
3. ..등등
- recursion 및 recursive data strucutre 사용을 지향하는 스타일
- 수학적 정의에 가까운 스타일(?)
- laziness라는 개념을 활용하는 것
- something... not OOP or C?

그러니까.. functional programming에 대한 정의도 하나로 정해지지 않았을뿐더러 *Functional Language*에 대한 엄밀한 정의도 존재하지 않는다. 다만 "functional programming하기 쉽게 만들어주는 언어" 라던지 "functionla programming을 위한 언어"라던지 하는 말만 있을 뿐... 따라서 특정 언어가 functional language가 맞는지 아닌지 논하는 것도 사실상 불가능하다!

# First Class Functions
= value를 쓸 수 있는 곳이라면 어디든지 사용할 수 있는 functoin!
- 즉 함수도 value이다.
    - value처럼 다룬다는게 아니라 진짜 **value**라는 뜻이다.
- e.g) Argument, tuple의 일부, exception, datatype constructor 등등
- 가장 흔하게 쓰이는 곳은 *다른 함수*의 argument나 result로 쓰이는 것!
    - 이 때 first-class가 아닌 *다른 함수*는 **higher-order function**이라고 부른다.

## Function Closures
= 해당 함수가 정의된 scope 내에 있으면 function definition 밖에서 바인딩 된 것도 사용할 수 있는 함수

- first-class function과는 다른 개념이다.

> 클로저(closure)는 내부함수와 밀접한 관계를 가지고 있는 주제다. 내부함수는 외부함수의 지역변수에 접근 할 수 있는데 외부함수의 실행이 끝나서 외부함수가 소멸된 이후에도 내부함수가 외부함수의 변수에 접근 할 수 있다. 이러한 메커니즘을 클로저라고 한다.
(출처: [https://opentutorials.org/course/743/6544/](https://opentutorials.org/course/743/6544/))

*(2020.04.23 추가)*

예제 코드를 보자.

```sml
(* 1 *) val x = 1
(* 2 *) fun f y = x + y
(* 3 *) val x = 2
(* 4 *) val y = 3
(* 5 *) val z = f (x + y)
```

line 2를 보면 함수 `y` 의 범위 안에서는 정의되지 않은 변수 `x`를 마음대로 사용하고 있다. 그런데 이 코드를 sml에서 그대로 실행시켜도 별 다른 에러가 뜨지 않는다. 어떻게 가능한 것일까?

함수를 이렇게 정의해보자.
- function value는 두가지 부분을 갖는다.
    - **code** : 우리가 작성한 코드가 그대로 함수가 되니 당연한 말이다.
    - **environment**: 함수가 define된 시점의 environment.
- 즉, 함수는 위의 두가지 element를 갖는 **pair**라고 볼 수 있다.
    - 대신 ML의 일반적인 pair와는 다르게, 우리가 직접 access 할 방법이 없다.
    - 우리가 할 수 있는 것은 저 pair를 **call**하는 것이다. function call이다.
- **function closure**는 저 pair를 의미한다.
    - funciton call은 해당 function pair의 **environment에서 code를 evaluate**하라고 시키는 것과 같다.

다시 코드로 되돌아가보자. 함수 `y`는 이제 `x + y`라는 **code**와 line2 시점까지의 **environment**를 갖는다는 것을 알게 되었다. 이 때 이 environment에는 line 1에서 정의한 value `x`도 함께 남아있다. 따라서 environment가 `x`를 만났을 때 `1`이라는 값과 **mapping**시킬 수 있기 때문에 line 2에서 아무 문제 없이 `x` 를 쓸 수 있는 것이다.  

function closure는 이렇게 code와 environment를 모두 갖고 있는 덕분에 이루어질 수 있다.

# Polymorphism and Higher-order Functions

> 프로그램 언어의 다형성은 그 프로그래밍 언어의 자료형 체계의 성질을 나타내는 것으로, 프로그램 언어의 각 요소들이 다양한 자료형에 속하는 것이 허가되는 성질을 가리킨다. 반댓말은 단형성으로, 프로그램 언어의 각 요소가 한가지 형태만 가지는 성질을 가리킨다
(출처: [https://ko.wikipedia.org/wiki/다형성_(컴퓨터_과학)](https://ko.wikipedia.org/wiki/%EB%8B%A4%ED%98%95%EC%84%B1_(%EC%BB%B4%ED%93%A8%ED%84%B0_%EA%B3%BC%ED%95%99)))

- polymorphic type의 대표적 예시로는 `'a` 타입이 있다.
- 대부분의 higher-order functions는 polymorphic function이지만 그렇지 않은 higher-order function도 있다.
- 물론 polymorphic function이면서 higher-order function이 아닌 함수도 있다.
- 중요한 점은 이 두가지 개념은 완전히 다르다는 사실!
    - polymorphic function: `'a list -> int`처럼 polymorphism을 사용하는 함수
    - higher-order function: 다른 함수를 argument로 받거나 다른 함수를 result로 사용하는 함수

# Anonymous Functions
= **function name**이 없는 함수.
### Syntax

```sml
    fn y => 3 * y
```

- 일반 함수와는 다르게 `fn` 키워드로 시작한다.
- 그리고 바로 argument pattern을 적은 뒤 `=`가 아닌 `=>`를 사용해 function body의 시작을 나타낸다.

### Most Common Use
- higher-order function의 argument로 사용한다.

```sml
    fun triple_n_times (f, x) =
    	n_times((fn y => 3 * y, n, x)
```

위의 예시처럼 굳이 함수의 이름을 정해줄 필요가 없기 때문에 훨씬 간결해진다.

### What Cannot we do
하지만 이름이 없기 때문에 다시는 해당 함수를 call 할 수 없다. 따라서 어떤 함수 자체를 **recursive function**으로 만들고 싶을 땐 anonymous function으로 만들어선 안 될 것이다.
- 물론 다른 함수 내에서 recursive한 부분으로 사용될 수는 있다!

---

# Type
### Type Synonyms
이미 존재하는 type에 새로운 이름을 붙여줄 수 있다.

```sml
    type date = int * int * int
```

이는 앞서 살펴보았던 `datatype`과는 다른 개념이다. datatype은 없던 type을 새로 만들어내는 것이기 때문이다.

### Type Generality

```sml
    string list * string list -> string list
    'a list * 'a list -> 'a list
```

첫째 줄은 오직 string list에서만 동작하고 string list만을 반환하지만, 두 번째 줄은 다른 타입 리스트에서도 동작한다. 그렇기 때문에 우리는 `type 'a`를 **more general**하다고 한다.

> More general types "can be used" as any less general type.

이에 대한 규칙을 살펴보자.

> A type t1 is *more general* than the type t2 if you can take t1, **replace its type vaiables consistently**, and get t2.

그러니까 어떤 type t2 대신 t1을 썼는데도 여전히 잘 동작하고, t2를 얻을 수 있다면 t1은 t2보다 **more general**하다고 말할 수 있다.