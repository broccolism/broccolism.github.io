---  
layout: post  
title: "[PL] More about Functions and Types"
categories: classes
tags: pl subtype type lexial scope function
comments: true
---

## 순서
[1) Subtype](#subtype)  
[2) Lexical Scope](#lexical-scope)  
[3) 자주 쓰는 유용한 함수들](#some-famous-functions)  
[4) 함수 합치기: Combine Functions](#combine-functions)  
[5) 함수 return하기: Currying](#currying)  

# Subtype
S와 T라는 type이 있을 때, type T의 instance가 쓰인 자리에 type S의 instance를 **safely** 사용할 수 있으면 **S는 T의 subtype**이라고 한다.

### Java VS ML
- java에서는 subclass 관계에 있으면 subtype이라고 여긴다. 그래서 `Game` class의 subclass로 `CartRider`, `TexasHoldem` 등이 있다고 하면 아래 코드가 정상 실행된다.

```java
Game g = new CartRider();
```

- 하지만 ML에서는 위와 비슷한 코드를 실행시키면 에러가 난다.
    - 만약 `CartRider`  에서만 발생시키는 exception이 있고, `Game` instance 자체에서 그것을 핸들링하는 핸들러가 없는 경우 해당 exception을  처리할 수 없기 때문이다.
    - 즉, ML에서는 subclass 관계라고 해서 subtype이라고 여기지 않는다.

---

# Lexical Scope
"scope" 자체의 정의를 찾아보았으나...

> The strict definition of the (lexical) "scope" of a name (identifier) is unambiguous—it is "the portion of source code in which a binding of a name with an entity applies"—and is virtually unchanged from its 1960 definition (출처: 위키백과)

그래서 대략 name과 그에 맞는 entity를 매핑시키는 소스코드의 일부분 이라고만 이해하고 넘어가기로 했다.

- **lexical scope**: function이 *정의*된 시점의 environment를 사용하는 방식
    - static scope이라고도 부른다.
- **dynamic scope**: function이 *호출*된 시점의 environment를 사용하는 방식

수십년 전에는 위의 두가지 방식 모두 reasonable하다고 여겨졌으나 요새는 거의 lexcial scope를 사용한다고 한다. 왤까?
1. 함수의 의미는 변수의 이름이 바뀐다고 해서 덩달아 바뀌면 안된다.

```sml
fun f y = 
	let val x = y + 1
	in fn z => x + y + z end
```

- dynamic scope를 사용하면 그저 `x`를 `q`로 바꾸는 것도 불가능해진다. 언제 어디서 `q`라는 다른 변수를 썼는지 모두 기록하고 있기 때문에 우리가 원하는 방식대로 계산하는 것이 아니라, `q`라는 값을 써버리기 때문이다. 우리가 원하는 방식은 변수 이름을 바꾸어도 함수 `z`는 `y + 1 + y + z`를 계산할 수 있게 하는 것이다.
- 하지만 lexical scope를 사용하면 `x`를 `q`로 바꾸어도 아무 문제가 없다.

2. 함수의 type checking은 함수가 define 된 시점에 이루어져야 한다.

```sml
val x = 1
fun f y =
	let val x = y + 1
	in fn z => x + y + z end
val x = "hi"
val g = f 7
val z = g 4
```

- dynamic scope를 사용하면 `val z = g 4`를 한 시점에서 이상한 일이 일어난다. 처음에 정의한 함수 `y`는 분명히 `x`, `y`, `z`를 더하는 일을 하고 그 세가지 operands는 모두 숫자였다. 그런데 `val z = g 4`를 하면 `val z = (f 7) 4`가 되고, `f`를 잘 찾아보니 `val x = "hi"` 때문에 숫자에서 string type으로 변한 `x`를 더해주고 있다!
- lexical scope를 사용하면 위와 같은 일이 발생하지 않는다. `val x = "hi"`를 불러도 fucntion definition은 `f`가 정의된 바로 그 시점을 기준으로 의미가 매핑되기 때문에 이후 `x`가 뭘로 바뀌든 상관없이 `f`에서 쓰는 `x`는 인자로 들어온 `y`에 1을 더한 값이 된다.

3. closure를 이용해서 우리가 필요한 데이터를 쉽게 저장할 수 있다.
- 자세한 설명은 [이전 포스팅](https://broccolism.github.io/classes/2020/04/13/PL-more-about-functions-and-types/#function-closures)을 참고하자.

### 그렇다면 dynamic scope를 쓰는 곳이 있을까
lexcial scope가 대부분 언어에서 기본적으로 사용하는 방식인건 맞지만, 역시 상황에 따라 dynamic scope를 쓰는 것이 편리한 경우가 있다.
- e.g) Racket이라는 언어는 dynamic scope를 사용하는 특별한 방법을 갖고 있다고 한다.
그리고 "대부분의 다른 언어"에서도 dynamic scope를 쓸 때가 있다. 바로 exception handling을 할 때다.
- `raise e`(e: error name)를 하면 control flow가 "현재 상태에서 **innermost handler**" 점프되기 때문에 dynamic scope처럼 동작한다고 볼 수 있다.

### Evaluate 되는 시점
- function body는 해당 function이 호출되기 전까지는 **evaluate 되지 않는다.**
    - 거기서 사용하는 변수의 값을 처음에는 모를 수 있기 때문
        - e.g) parameter가 필요한 함수
- function body는 해당 function이 호출될 **때마다 evaluate된다.**
- variable binding은 해당 바인딩이 evaluate 되었을 때에 evaluate된다.
    - 그러니까 variable이 사용될 때마다 evaluate되는 것이 아니라
    - variable을 바인딩했을 때 한번 evaluate된다는 뜻이다.

---

# Some Famous Functions
language 자체에 built-in된 함수는 아니지만 programming pattern으로써 많이 사용되는 함수가 있다.

### fold

```sml
fun fold(f, acc, xs) = 
	case xs of
		[] => acc
	| x :: xs_ => fold(f, f(acc, x), xs_)
```

`acc`는 accumulater의 약자다. 위의 버전을 사용하면 `xs`에 넣었던 element 중 제일 먼저 넣은 element가 가장 먼저 compute된다. 순서를 반대로 하고 싶으면 아래 버전을 사용하면 된다.

```sml
fun fold(f, acc, xs) = 
	case xs of
	  [] => acc
	| x :: xs_ => f(x, fold(f, acc, xs_))
```

이 함수의 장점은 **encapsulation**이 가능하다는 점이다. `fold` 함수는 parameter로 들어온 `f`의 정체를 모르고 그냥 실행만 하기 때문이다.

위쪽 버전을 **fold left**, 아래쪽 버전을 **fold right**라고 한다.

### map

```sml
fun map(f, xs) = 
	case xs of
	  [] => []
	| x::xs_ => f(x)::map(f, xs_)
```

이 함수를 이용하면 리스트의 각 element에 원하는 연산 `f`를 해줄 수 있다. 그리고 return type 역시 리스트이기 때문에 한 리스트 안의 모든 element에 동일한 연산을 해주고 싶을 때 유용하게 쓸 수 있다.

### filter

```sml
fun filter(f, xs) = 
	case xs of
	  [] => []
	| x::xs_ => if f x
                then x::filter(f, xs_)
                else filter(f, xs_)
```

이 함수는 리스트 `xs`의 element 중, 함수 `f`를 수행했을 때 true를 return하는 값들만 필터링 할 수 있는 함수이다.

### Application Examples

위의 세가지 함수를 활용하여 만들 수 있는 예제를 보자. 

```sml
val nums_list = [[9, 40, 75, 7],
                 [64, 34, 88, 96],
                 [91, 92, 53, 31],
                 [50, 84, 73, 65],
                 [54, 44, 75, 11],
                 [91, 71, 48, 46],
                 [70, 72, 5, 42],
                 [25, 77, 49, 56],
                 [89, 4, 73, 52],
                 [36, 56, 61, 1]] 
```

주어진 리스트별로 1. 리스트 element 중 최댓값을 구하고 2. 리스트 element 중 특정 수의 배수의 갯수를 뽑아내는 기능을 만들고 싶다. 그리고 결과값은 모두 리스트에 담겨있어야 한다.

먼저 첫 번째는 아래 코드로 구현할 수 있다.

```sml
val local_max = map(fn nums =>
    fold(Int.max, hd nums, nums),
    nums_list)
```

- `nums_list`의 각 리스트 별로 연산을 수행하고 싶기 때문에 먼저 **map** 함수를 사용하고 있다.
    - `nums`는 `nums_list` 안에 있는 각각의 리스트를 의미하게 된다.
- 첫 번째 리스트의 경우 **fold left**를 사용하면 `max(max(max(9, 40), 75), 7)` 를 수행한다.
    - 만약 두 번째 버전 **fold right**를 사용했다면 `max(max(max(75, 7), 40), 9)`를 수행한다.
- 첫 번째 리스트에 대한 **fold** function 수행이 끝났다면 결과를 빈 리스트인 `[]`에 넣고, 두번째 리스트에 대한 연산을 수행한다.
- 계속해서 연산을 수행한 후, 마지막 리스트까지 완료되면 최종적으로 `[75, 96, 92, ..., 61]` 이라는 리스트가 return된다.

두 번째는 아래 코드로 만들 수 있다.

```sml
fun count_multiples(num, nums_list) =
	map(length, 
		map(fn nums => 
			filter(fn y => y mod n = 0, nums),
			, nums_list))
```

- 배수의 갯수를 세기 위해서는 두가지 과정이 필요하다.
1. `num`의 배수로만 구성된 리스트를 만든다.
2. 해당 리스트의 길이를 잰다.
- `map(length, ~~)` 부분에서는 2번을, 그 안쪽 **map** function에서는 1번을 수행하고 있다.

---

# Combine Functions

```sml
fun compose (f, g) = fn x => f (g x)
```

위의 예시에서는 `f`와 `g`가 무엇에 바인딩 되어있는지 *기억*하는 closure를 만들고 있다. `compose` 함수의 type은 **('b → 'c) * ('a → 'b) → ('a → 'c)**가 된다.

ML standard library는 이 기능을 infix 연산자로도 제공하고 있다. `o`를 사용하면 된다.

```sml
fun sqrt_of_abs i = Math.sqrt(Real.fromInt(abs i))
fun sqrt_of_abs i = (Math.sqrt o Real.fromInt o abs) i
```

위의 두 문장은 완벽하게 같은 결과를 낸다.

```sml
val sqrt_of_abs = Math.sqrt o Real.fromInt o abs
val result = sqrt_of_abs i
```

첫번째 문장은 function 역시 value이기 때문에 가능한 문장이다. 함수 자체를 `sqrt_of_abs`라는 이름에 바인딩 시키는 것이다. 따라서 그 아래 문장의 `result` 값도 위에서 `fun sqrt_of_abs`로 정의한 함수에 `i`를 parameter로 줘서 실행한 결과값과 일치한다.

### Defining Own Infix Operator

```sml
fun sqrt_of_abs i = (Math.sqrt o Real.fromInt o abs) i
```

여기서 return value를 계산할 때에는 오른쪽에서 왼쪽으로 수행한다.

- 그러니까 `abs i`를 먼저 한 후에 차례대로 `Real.fromInt`, `Math.sqrt`를 수행해준다는 뜻이다.

하지만 대부분의 프로그래머들은 왼쪽에서 오른쪽으로 코드 흐름이 흘러가는 것을 좋아하기 때문에 ML에서는 이를 반영하여 새로운 infix operator를 정의할 수 있게 해준다.

```sml
infix |>
```

위 문장은 "`|>`를 새로운 infix operator로 지정하겠다"는 의미를 갖는다. 이렇게 만든 연산자는 기존 infix operator였던 `o`와 달리 코드의 흐름을 왼쪽에서 오른쪽으로 흘러가게 만든다.

```sml
fun sqrt_of_abs i =
	i |> abs |> Real.fromInt |> Math.sqrt

fun sqrt_of_abs i =
	Math.sqrt(Real.fromInt(abs i))
```

따라서 위의 두 함수는 같은 일을 수행한다.

- 직접 써보니까 최대 장점은 마지막에 닫는 괄호의 갯수를 신경쓰지 않아도 된다는 점이다. 괄호가 필요 없으니까!

---

# Currying
- 모든 ML function은 argument를 단 하나만 받는다.
- 여러개를 넘기고 싶을 때에는 tuple을 사용했다.

tuple을 사용하는 방법 외에 다른 방법이 하나 더 있다. 바로 currying이다.

1. argument 1을 function 1에 넘긴다.
2. function 1은 argument 2를 사용하는 function 2를 return한다.
3. function 2는 argument 3을 사용하는 function 3을 return한다.

이는 ML에서 function 역시 value로 생각하기 때문에 가능한 것이다. 아래 코드를 보자.

```sml
val sorted3 = fn x => fn y => fn z =>
                z >= y andalso y >= x
val t1 = ((sorted3 7) 9) 11
```

**sorted3** 함수는 argument `x`를 받는 함수이다. return value는 `fn y => fn z => z >= y andalso y >= x`이다. 그 안의 anonymous function 중 `y`를 argument로 받는 함수는 `fn z => z >= y andalso y >= x`를 return한다. 마지막으로 `z`를 argument로 받는 함수는 `z >= y andalso y >= x`를 return한다.

아래의 `t1`의 값을 계산하기 위해서는 다음 과정이 순서대로 이루어진다.

- **sorted3 7**: fn 7 함수가 `fn y => fn z => z >= y andalso y >= x`를 return.
    - 따라서 현재 상태는 `((fn y => fn z => z >= y andalso y >= x) 9) 11`이 된다.
- fn 9 함수가 `fn z => z >= y andalso y >= x`을 return한다.
    - 따라서 현재 상태는 `(fn z => z >= y andalso y >= x) 11`이 된다.
- 마지막으로 fn 11 함수를 수행한다.
    - 이 때, 이전 함수를 호출하면서 `x`, `y`의 값은 각각 `7`, `9`로 바인딩되어 있다.
        - 이 정보는 environment가 기억하고 있다.
    - 따라서 `fn 11 => 11 >= 9 andalso 9 >= 7`이 계산되어 최종적으로 `true`가 반환된다.

위의 예제에서 **sorted3** 함수를 정의하고 호출할 때 다른 방법을 사용해도 된다.

### Syntactic Sugar

```sml
val sorted3 = fn x => fn y => fn z =>
                z >= y andalso y >= x
val t1 = ((sorted3 7) 9) 11

fun sorted3 x y z = z >= y andalso y >= x
val t1 = sorted3 7 9 11
```

syntactic sugar를 이용해서 마치 "여러개의 argument를 받는 함수 단 하나"처럼 보이게 써도 된다. 앞서 보았던 `fold` 함수를 이를 이용해서 아래와 같이 나타낼 수 있다.

```sml
fun fold f acc xs =
	case xs of
		[] => acc
	| x::xs_ => fold f (f(acc, x)) xs_

fun sum xs = fold (fn(x, y) => x + y) 0 xs
```