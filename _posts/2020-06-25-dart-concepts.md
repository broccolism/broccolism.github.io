---  
layout: post  
title: "[Dart] 저.. 다트 처음 배우는데요"
categories: study
tags: study 2020-2 dart programming
comments: true
---

- 출처: [Dart docs](https://dart.dev/guides/language/language-tour)
- (출처 사이트의 내용의 번역본이라고 보시면 됩니다.)

# Important Concepts of Dart
- 모든 variable은 *object*이며, 모든 object는 특정 *class*의 instance 이다.
    - `42`와 같은 상수, 함수, `null` 역시 모두 object.
    - 모든 object는 **Object** 클래스를 상속받는다.
- Dart는 strongly typed language!
    - 하지만 type을 명시하지 않아도 된다. Dart가 알아챌 수 있다.
    - 만약 "어떤 타입이든 상관없음"을 명시하고 싶으면 `dynamic` 타입을 사용하면 된다.
- genric types를 지원한다.
    - e.g) `List<int>`, `List<dynamic>`
- 아래와 같은 function을 지원한다.
    - top-level functions
        - e.g) `main()`
    - *static method*: 특정 클래스에서만 사용 가능한 함수
    - *instance method*: 특정 오브젝트만 사용 가능한 함수
    - *nested function* or *local function*: 함수 안의 함수
- 아래와 같은 variable을 지원한다.
    - top-level variables
    - *static variable*: 특정 클래스에서만 사용 가능한 변수
    - *instance variable*: 특정 오브젝트만 사용 가능한 변수
        - 이 친구들은 *field*나 *property*라고도 불린다.
- Java와 다른 점은 `public`, `protected`, `private` 과 같은 키워드가 없다는 것이다.
    - 어떤 identifier가 언더바 (`_`)로 시작한다면 이는 해당 라이브러리에 대해 private함을 의미한다.
- *expression*과 *statement* 모두 사용할 수 있다.
    - *expression*: runtime value를 갖는 친구
        - e.g) `condition ? expr1 : expr2`는 `expr1` 또는 `expr2`라는 값을 갖게 된다.
    - *statement*: 그렇지 않은 친구
        - e.g) if-else statement는 아무런 value도 갖지 않는다.
    - statement 안에 여러 expression을 쓸 수 있으나 expression 안에 statement를 쓸 수는 없다.
- Dart tool은 두가지 problem을 알려줄 수 있다.
    1. *warning*: 어? 야 이거 왠지 안될 것처럼 생겼는데? 그래도 일단 실행은 시켜줄게.
    2. *error*: compile time이나 run-time에 발생하는 에러.
        - *compile-time error*: 야 이거 실행 안돼.
        - *run-time error*: 어? 나 실행 중이었는데 이거 이상한데? exception 발생!


# Variables

### Default Value

- 변수에 값을 할당하지 않고 선언만 할 경우, 기본값은 `null`로 설정된다.

### Final and Const

- 한 친구의 값을 절대 바꿀 일이 없다면 `var` 대신 `const`, `final` 키워드를 사용하면 된다.
- *final variable*: 값을 단 한 번만 할당할 수 있는 변수.
    - instance variable은 `final`일순 있지만 `const`일 수는 없다.
- *const variable*: compile-time constant.

# Built-in Types
- numbers
    - int, double
- strings
- booleans
    - true, false
- lists (arrays)
    - `[]`를 사용한다.
    - 모든 원소의 type은 같아야한다.
    - *collection if*와 *collection for*를 지원한다.

```dart
var nav = [
    'Home',
    'Furniture',
    'Plants',
    if (promoActive) 'Outlet'
];
```

- sets
    - `{}`를 사용한다.
    - 모든 원소의 타입은 같아야한다.
- maps
    - `{}`를 사용한다.
    - key와 value로 구성된 object.
        - key, value의 타입은 무엇이 되든 상관없다.
- runes (유니코드 글자를 string으로 표현하기 위함)
- symbols
    - 다트에 내장된 연산자나 identifier를 나타내는 object.
    - 직접 사용할 일은 잘 없을거라고 한다.

# Functions
### Syntax

```dart
bool isNoble(int atomicNumber) {
    return _nobleGases[atomicNumber] != null;
}
```

- return type을 명시하지 않아도 작동하긴 한다.
- 함수 안에 expression이 하나만 있을 경우 줄여서 아래처럼 사용해도 된다.

```dart
bool isNoble(int atomicNumber) => _nobleGases[atomicNumber] != null;
```

- 이 때 주의할 점은 오직 expression만 화살표와 세미콜론 사이에 올 수 있다는 것이다.
    - statement는 올 수 없다.
    - e.g) if statement는 올 수 없지만, conditional expression은 올 수 있다.

## Parameters
- 함수가 받는 parameter에는 두가지 종류가 있다.
    1. *required*
    2. *optional*
    - required parameter가 먼저 적힌다.

### Optional Parameter
*named*이거나 *positional*이어야 한다. 둘 다는 안된다!
- *named parameter*: `paramName: value`와 같은 형식으로 정하는 parameter.

```dart
enableFlags(bold: true, hidden: flase);
```

- 함수를 정의 할 때에는 `{param1, param2, ... }`와 같은 형식을 사용하면 된다.

```dart
void enableFlags({bool bold, bool hideen}) {...}
```

- 이 때 유저가 반드시 넘겨줘야하는 parameter에는 `@required` 표시를 해주면 된다.

```dart
const Scrollbar({Key key, @required Widget child})
```

- *positional parameter*: `[ ]`로 감싸는 parameter.

```dart
String say(String from, String msg, [String device]) {
    var result = '$from says $msg';
    if (device != null) {
        result = '$result with a $device';
    }
    return result;
}
```

- 이 함수를 부를 때에는...

```dart
assert(say('Bob', 'Howdy') == 'Bob says Howdy');

assert(say('Bob', 'Howdy', 'smoke signal') == 'Bob says Howdy with a smoke signal');
```

- 이렇게 부르면 된다!

### Difference
- 만약 위의 함수에서 positional parameter로 `[String device, String ps]`가 들어갔다면
    - `ps`를 넘겨주기 위해선 반드시 `device` 값도 넘겨주어야 한다.
    - 즉 함수를 부를 때 넘겨주는 parameter의 순서가 항상 positional parameter를 정하는 `[ ]` 안의 순서와 동일해야 하는 것이다.
    - 하지만 named parameter에서는 이름을 이용해 parameter 종류를 구분하기 때문에 순서에 관계없이 원하는 parameter만 넘겨줄 수 있다.

### Default Parameter Values
- `=`을 이용해서 기본값을 정할 수 있으며, 그 값은 반드시 compile-time constant여야 한다.
- 만약 아무 값도 넘겨주지 않으면 `null`이 된다.

```dart
// Sets the [bold] and [hidden] flags ...
void enableFlags({bool bold = false, bool hidden = false}) {...}

// bold will be true; hidden will be false.
enableFlags(bold: true);
```

- 예전 코드에서는 `=` 대신 `:`을 사용했을수도 있다고 적혀있는데, 그 이유는 named parameter에 대해서 `:` 만 지원이 되었기 때문이라고 한다.
    - 이 방식은 현재 deprecate되었기 때문에 `=`를 사용하는걸 권장하고 있다.

### Functions as first-class objects
- function을 object로 보기 때문에
    - 다른 함수를 위한 parameter로 사용하거나
    - variable에 함수를 할당할 수 있다.

### Anonymous Functions
- 말 그대로 이름이 없는 함수! 아래 형식에 맞춰 쓰면 된다.
- `([[Type] param1[, ...]]) { // body }`

```dart
var list = ['apples', 'bananas', 'oranges'];
list.forEach((item) {
    print('${list.indexOf(item)}: $item');
});
```

- 여기서 더 줄여쓰면 다음과 같이 적을 수 있다. 현재 `item`을 받는 함수 안에 expresison이 하나밖에 없기 때문이다.

```dart
list.forEach(
    (item) => print('${list.indexOf(item)}: $item'));
```

### Lexical Scope
- Dart는 lexically scoped language!!
- lexical closure 역시 사용할 수 있다.
- (참고: [lexical scope & closure 관련 포스팅](https://broccolism.github.io/study/2020/04/13/PL-more-about-functions-and-types/#first-class-functions))

# Operators
- 처음보거나 익숙하지 않은 친구들 정리

|Operator|Meaning|
|  :---  |  :--- |
|as      |타입 캐스팅|
|is      |object가 특정 타입이 맞으면 True|
|is!     |object가 특정 타입이 맞으면 False|
|e1 ?? e2|e1이 null이 아니면 e1의 value를 계산하여 return, 그렇지 않으면 e2의 value를 계산하여 return|
|..      |하나의 object를 여러번 참조할 수 있음|
|?.      |앞쪽 expression이 null이 아닐 경우 해당 property를 불러옴|

# Assert
- 특정 조건을 만족하지 않으면 실행을 멈추고 싶을 때 사용하는 statement.

```dart
// Make sure the variable has a non-null value.
assert(text != null);
```

- 뒤에 메세지를 추가해서 사용할수도 있다.

```dart
assert(urlString.startsWith('https'),
    'URL ($urlString) should start with "https".');
```

- 플러터는 디버그 모드에서 assertion을 허용한다.

# Callable Classes
- 특정 class instance를 함수처럼 사용하고 싶을 땐 `call()` 함수를 쓰면 편하다.

```dart
class WannabeFunction {
  String call(String a, String b, String c) => '$a $b $c!';
}

var wf = WannabeFunction();
var out = wf('Hi', 'there,', 'gang');

main() => print(out);
```

- 사실 docs에는 'To allow an instance of your Dart class to be called like a function,' 라고 적혀있긴하지만 어떤 object 내의 field에 좀 더 빨리 접근하고 싶을 때 이 기능을 쓰면 될 것 같다.