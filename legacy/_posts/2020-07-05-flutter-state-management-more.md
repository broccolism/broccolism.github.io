---  
layout: post  
title: "[Flutter] State 관리 방법 3가지: setState/Provider/RxDart"
categories: study
tags: study 2020-2 flutter example state manage bloc setstate provider stream consumer
comments: true
---

# How To Manage State
3가지 방법이 있다.  
[1. `setState()` 사용](#using-setstate-function)  
[2. **provider** 패키지 사용](#using-provider-package)  
[3. **rxdart** 패키지 사용](#using-rxdart-package)  

---

# Using setState Function

- flutter 공식 문서에 아주 상세히 잘 나와있다.
    - flutter에서 처음으로 만들어주는 앱(counter)이 이 함수를 이용해서 state를 관리한다.
- 😎 장점
    - 코드가 간단하다.
- 😐 단점
    - 내부에서 일어나는 일도 간단하다.
        - 화면의 최상단부터 최하단까지, 전체 화면을 다시 그린다.
            - `setState()` 함수가 불릴 때마다!
            - 굉장히 메모리 낭비가 심하다.
                - e.g) 화면에서 숫자를 보여주는 위젯만 업데이트되면 충분한데도 `setState()` 함수가 호출되면 앱 바, 숫자, 텍스트, 아이콘 등 화면에 보여지는 모든 위젯이 새로 그려진다.
        - 할당받은 메모리를 해제하지 않는다.
            - 오로지 할당만한다.

단점이 엄청나기 때문에 실무에서는 잘 사용하지 않는다고 한다. 단 정말 간단하고, 앱 실행에 지장을 주지 않을 정도로 드물게 업데이트되는 UI를 구현할 때 가끔 쓴다.

- ⚠ 주의사항
    - `setState()` 함수는 state가 *mount* 되고난 후에 호출되어야한다.
        - state가 생기고 난 뒤에 업데이트되어야 한다는 당연한 이야기이지만
        - 아래 코드처럼 그냥 적을 경우 가끔 에러([예를 들면 누군가 stackoverflow에 올린 이런 에러](https://stackoverflow.com/questions/49340116/setstate-called-after-dispose){: target="_blank"})가 난다.

        ```dart
        setState() {
        	// ... things to do
        }
        ```

        - 이렇게 체크를 해주어야한다.

        ```dart
        if (mounted) {
        	setState(() {
        		// ... things to do
        	});
        }
        ```

        - 혹은 이렇게

        ```dart
        @override
        void setState(fn) {
        	if (mounted) {
        		// ... things to do
        	}
        }
        ```

---

# Using Provider Package

- 😎 특징
    - 각 역할별로 코드를 쉽게 분리할 수 있다.
        - e.g) 디자인적 요소를 담은 코드와 네트워크 연결을 위한 요소를 담은 코드를 분리할 수 있다.
            - flutter에서는 디자인도 코드이다보니 이렇게 따로 나눠주는 것이 좋다고 한다.
    - UI 변화를 위해 새로 할당했던 메모리를 알아서 해제해준다.

- 👀 라이브러리 사용 등록하기
    - **pubspec.yaml** 파일의 `dev_dependencies` 부분에 아래와 같이 코드를 한 줄 추가한다.

    ```dart
    dev_dependencies:
      flutter_test:
        sdk: flutter
      provider: ^4.1.3 // add this line.
    ```

    - 버전은 계속 바뀔 수 있으니 [공식 사이트](https://pub.dev/packages/provider#-installing-tab-){: target="_blank"}를 참고하자.

이름에서 알 수 있듯이 **Provider** 를 사용해서 input data를 제공한다. 이 데이터를 받는 쪽은 **Consumer**로 *감싸준다.* 아래 화면을 provider를 사용해서 구현하면...

![screen](https://broccolism.github.io/assets/img/flutter/2020-07-05-1.jpg)

### step 1) Notifier 정의하기

```dart
/* counter_nofitier.dart */

import 'package:flutter/material.dart';

class CounterNotifier with ChangeNotifier {
  // value for notifier
  int counter = 0;

  // getter for UI
  int get currentCounter => counter;

  // fuctions
  void increaseCounter() {
    counter++;
    notifyListeners();
  }
}
```

notifier는 안드로이드로 치면 `onDataChange()`인 셈이다. 그러니까 어떤 변화가 일어났을 때,

1. 그에 맞는 작업을 수행하고
    - `void increaseCounter()` 함수의 `counter++` 부분
        - 이 함수는 사용자가 ➕ 버튼을 누르면 실행된다.
2. 변화가 일어났음을 알려주는 역할
    - `void increaseCounter()` 함수의 `notifyListeners()` 함수가 수행한다.

을 한다. 따라서 상태를 저장하기 위한 변수와 프론트쪽에서 그 데이터를 받을 수 있도록하는 *getter*가 필요하다. 예시에서는 `counter`, `currentCounter`가 각 역할을 맡고 있다. getter가 받아온 데이터를 이용해서 UI 변화가 일어나는 부분은 `MyHomePage` 클래스, 즉 UI를 그려주는 곳에서 할 일이다. 

### step 2) Provider 정의하기

(사실 step 2, 3은 순서가 바뀌어도 전혀 상관없다.)

*Provider*는 앞서 말했듯이 정보를 제공해주는 역할을 한다. `ChangeNotifierProvider` 클래스를 이용해서

1. 어떤 종류의 `notifier`를
2. 어떤 클래스가 사용할 것인지

를 정할 수 있다.

```dart
/* main.dart */
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:managing_state_more/my_home_page.dart';
import 'package:managing_state_more/counter_notifier.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      home: ChangeNotifierProvider<CounterNotifier>(
        create: (_) => CounterNotifier(),
        child: MyHomePage(),
      ),
    );
  }
}
```

원래 `home: MyHomePage()`였던 부분이 `ChangeNotifierProvider<...>(...)`로 바뀌었다. 데이터를 전달받는 클래스가 `MyHomePage` 클래스이기 때문에 트리 구조에서 MyHomePage의 parent가 바로 provider가 되는 것이다.

⚠ `ChangeNotifierProvider` 클래스의 generic type으로 주는 `<CounterNotifier>` 부분은 반드시 명시해야한다. 그래야만 어떤 provider를 가져올 지 알아듣는다.

- `create: (_) => CounterNotifier()`
    - step 1에서 만들었던 `CounterNotifier`를 사용할 것임을 말하고있다.
        - runtime 전에 객체를 만들어야해서 함수를 호출해주는 것 같다.
            - (괄호 없이 `CounterNotifier` 라고 적지 않는다는 의미다.)
    - 즉, 어떤 notifier를 사용할지는 이런식으로 적으면 된다.
        - 원래 parameter는 context인데 사용하지 않기 때문에 언더바 `_`로 적었다.
- `child: MyHomePage()`
    - 말 그대로 트리 구조에서의 child가 `MyHomePage`임을 말하고 있다.
        - 여기도 괄호를 적어서 함수를 호출해 객체를 만들었다.
    - 어떤 클래스가 정보를 제공받을지는 이런식으로 적으면 된다.

### step 3) Consumer 정의 및 notifier 사용하기

이제 `MyHomePage` 객체 안에서 notifier를 이용해 데이터를 받고, notifier쪽으로 데이터를 넘겨주는 부분을 만들면 된다. 쉽게 말해 UI 관련 작업을 하는 것이다.

```dart
import 'package:flutter/material.dart';
import 'package:managing_state_more/counter_notifier.dart';
import 'package:provider/provider.dart';

class MyHomePage extends StatefulWidget {
  MyHomePage({Key key, this.title}) : super(key: key);

  final String title;

  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  @override
  Widget build(BuildContext context) {
    return Consumer<CounterNotifier>(builder: (_, counterNotifier, child) {
      return Scaffold(
        appBar: AppBar(
          title: Text('provider and consumer'),
        ),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              Text(
                'You have pushed the button this many times:',
              ),
              Text(
                counterNotifier.currentCounter.toString(),
                style: Theme.of(context).textTheme.headline4,
              ),
            ],
          ),
        ),
        floatingActionButton: FloatingActionButton(
          onPressed: counterNotifier.increaseCounter,
          tooltip: 'Increment',
          child: Icon(Icons.add),
        ), // This trailing comma makes auto-formatting nicer for build methods.
      );
    });
  }
}
```

`Scaffold` 클래스의 parent로 `Consumer`가 생겼다. 그렇기 때문에 두번째 `Text` 위젯에서 `counterNotifier.currentCounter`를 이용해 지금까지 ➕ 버튼을 누른 횟수를 받아올 수 있다.

- 바꿔 말하자면, 그 횟수를 받아오는 기능까지만 할 수 있다.
    - 그 횟수를 직접 바꿀 수는 없다. 그 권한은 notifier한테 있으니까!

그리고 ➕ 버튼에는 notifier 클래스에서 미리 정의한 함수 `increaseCounter`를 onPressed 옵션에 주었다. notifier에게 카운터 값을 증가시킨 후 provider에게 알려주는 작업까지를 요청하는 것이다.

⚠ provider쪽에서 그랬듯이, consumer한테도 generic type을 명시해야한다.

여기까지하면 provider를 이용한 state management 설정이 완료된다!

---

# Using RxDart Package

- 😎 특징
    - Provider와 마찬가지로, UI와 그 뒤에서 일어나는 일을 분리하여 코드를 적을 수 있게 해준다.
    - Garbage Collection을 자동으로 해주지 않는다.
        - 단점일수도, 장점일수도 있다.
        - 아무튼 프로그래머가 직접 명시해줘야만 메모리 할당 해제를 한다.
    - 구글에서는 중규모 프로젝트에선 provider를, 대규모 프로젝트에선 RxDart를 이용한 bloc 패턴 사용할 것을 권장한다고 한다.
- 👀 라이브러리 사용 등록하기
    - **pubspec.yaml** 파일의 `dev_dependencies` 부분에 아래와 같이 코드를 한 줄 추가한다.

    ```dart
    dev_dependencies:
      flutter_test:
        sdk: flutter
      provider: ^4.1.3 // not this. (it was added for Provider library)
    	rxdart: ^0.24.1 // add this line.
    ```

    - 버전은 계속 바뀔 수 있으니 [공식 사이트](https://pub.dev/packages/rxdart#-installing-tab-){: target="_blank"}를 참고하자.

RxDart는 Dart의 *Stream* API와 호환되는 reactiveX API이다. *Stream*은 데이터가 지나가는 통로라고 보면 편하다. Stream을 사용하는 가장 큰 목적은 mutation을 막기 위함이다. 그래서 이 통로 안에 한 번 들어간 값은 절대 바꿀 수 없으며 반드시 그 값을 통로에서 빼고 (= 사용하고) 새로운 값을 넣을 수 있다. Stream에 있을 수 있는 데이터는 오직 1개라는 뜻이다.

Flutter에서 Stream은 BLoC 패턴을 구현하는데에 쓰인다. BLoC(Business Logic Component)은 UI 뒤에서 일어나는 로직을 가리킨다. 예를 들어서 앞서 만들었던 예제 화면의 ➕ 버튼을 눌렀을 때 일어나는 일 전체 - `counter`가 1 증가하고, notifier에게 알려주는 일 - 이 로직을 의미한다.

### Step 1) BLoC

```dart
/* counter_bloc.dart */

import 'package:rxdart/rxdart.dart';

class CounterBloc {
  final counterSubject = BehaviorSubject<int>.seeded(0);
  Stream get counterStream => counterSubject.stream; // for UI

  void dispose() async {
    await counterSubject.close();
  }

  int _counter = 0;

  void increaseCounter() {
    _counter++;
    counterSubject.sink.add(_counter); // stream에 데이터를 던진 것!
  }
}
```

`counterSubject`가 바로 stream 역할을 하는 친구다. 그 아랫줄의 `counterStream`은 스트림에 대한 getter로, UI단에서 사용할 것이다. 이렇게 `BehaviorSubject<T>`와 `Stream getter`는 쌍으로 다녀야한다. 스트림을 3개 만들었으면 그에 일대일로 대응되는 getter를 총 3개 만들어줘야 한다. `BehaviorSubject<int>.seeded(0)`에서는 초기값을 설정해주고 있다. (지금은 `seeded(0)`이니 Stream에서 받아올 수 있는 초기값은 0이다.)

⚠ 앞서 말했듯이 rxdart에서는 GC를 자동으로 해주지 않는다. 그래서 `dispose()` 함수를 명시하고 있다. Stream을 닫는 것이다.

이후 Bloc 내부적으로 사용할 변수 `_counter`를 정의하고, UI쪽에서 이 변수의 값을 올리고 싶을 때 사용할 수 있는 함수 `increaseCounter()`를 만들어줬다.

### Step 2) Provider 정의하기

```dart
/* main.dart */

import 'package:flutter/material.dart';
import 'package:study/counter_bloc.dart';
import 'package:study/my_home_page.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      home: Provider<CounterBloc>(
        create: (_) => CounterBloc(),
        child: MyHomePage(),
      ),
    );
  }
}
```

이 부분은 앞서 Provider를 만들면서 했던 부분과 비슷하다. 사실, 사용하는 클래스명만 다르고 나머지는 같다. `MyHomePage` 화면의 parent에게 "나 stream에서 데이터 받아서 사용할거야!" 를 알려주는 부분이다. BLoC 패턴 구현 시에는 `Provider` 클래스를 사용한다.

### Step 3) BLoC 사용하기

```dart
/* my_home_page.dart */

import 'package:flutter/material.dart';
import 'package:managing_state_more/counter_bloc.dart';
import 'package:provider/provider.dart';

class MyHomePage extends StatefulWidget {
  MyHomePage({Key key, this.title}) : super(key: key);
  final String title;

  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  CounterBloc bloc;

  // for bloc
  @override
  void initState() {
    bloc = Provider.of<CounterBloc>(context, listen: false);
    super.initState();
  }

  @override
  void dispose() {
    bloc.dispose();
    super.dispose();
  }
```

bloc을 사용하기 위해 추가로 해줄 것이 있다. `initState`와 `dispose` 함수를 오버라이딩 하는 것이다. `initState`에서는 사용할 bloc을 할당받고, `dispose`에서는 사용이 끝난 bloc을 할당해제해준다.

```dart
@override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('BLoC'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Text(
              'You have pushed the button this many times:',
              style: TextStyle(color: Colors.black),
            ),
            StreamBuilder<int>(
                stream: bloc.counterStream,
                builder: (context, snapshot) {
                  if (snapshot.hasData) {
                    return Text(snapshot.data.toString());
                  } else {
                    return Container();
                  }
                }),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: bloc.increaseCounter,
        tooltip: 'Increment',
        child: Icon(Icons.add),
      ),
    );
  }
}
```

그리고 stream에서 데이터를 받아오는 쪽은 `StreamBuilder<T>`로 *감싸준다.* 이 때 generic type에는 받아올 데이터의 type을 적으면 된다. `FloatingActionButton`의 `onPressed`에서는 bloc 클래스에서 만든 함수를 사용해 state를 변경하고 (즉,  `counter`의 값을 늘려주고) 있다.