---  
layout: post  
title: "[Flutter] Things from the First Demo App"
categories: study
tags: study 2020-2 flutter widget
comments: true
---

[0) 예제 코드 분석](https://broccolism.github.io/study/2020/06/25/flutter-first-demo/)  
[1) 프레임워크 맛보기](#프레임워크)  
[2) 함수 맛보기](#함수)  
[3) 클래스 맛보기](#클래스)  

## 예제 코드 분석하기: Main.dart

```dart
import 'package:flutter/material.dart';

void main() {
  runApp(MyApp());
}
```

- 메인 함수가 하는 일은 간단하다. **runApp** 함수를 이용해서 **MyApp** 객체를 화면에 띄워주는 것.
  - MyApp 클래스는 아래에 정의되어있다.

```dart
class MyApp extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        // This is the theme of your application.
        //
        // Try running your application with "flutter run". You'll see the
        // application has a blue toolbar. Then, without quitting the app, try
        // changing the primarySwatch below to Colors.green and then invoke
        // "hot reload" (press "r" in the console where you ran "flutter run",
        // or simply save your changes to "hot reload" in a Flutter IDE).
        // Notice that the counter didn't reset back to zero; the application
        // is not restarted.
        primarySwatch: Colors.blue,
        // This makes the visual density adapt to the platform that you run
        // the app on. For desktop platforms, the controls will be smaller and
        // closer together (more dense) than on mobile platforms.
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      home: MyHomePage(title: 'Flutter Demo Home Page'),
    );
  }
}
```

- `StatelessWidget`을 extend하고 있다.
- flutter에서 미리 정의해놓은 color set이 있다.
  - `Colors.blue`, `Colors.green`처럼 사용할 수 있고 vscode에서 색상을 미리 보고 고를 수 있다.
  - 주석으로 적힌 내용에 따르면 **hot reload** 기능을 사용하면 앱을 재실행하지 않고도 변경사항을 업데이트 할 수 있다는데, 나는 전혀 되지 않고 있다. 원인은 아직 잘 모르겠다.
  - 위 코드를 실행시켰을 때 어플 자체의 이름은 패키지명, 그리고 화면 하나의 이름은 `home: MyHomePage(title: 'Flutter Demo Home Page')`에서 설정한 **Flutter Demo HomePage**가 뜨고 있다.
    - 그 위에서 `MatrialApp(title: 'Flutter Demo',`로 설정한 제목은 어디서 뜨는건지 아직 확인을 못 했다.

```dart
class MyHomePage extends StatefulWidget {
  MyHomePage({Key key, this.title}) : super(key: key);

  // This widget is the home page of your application. It is stateful, meaning
  // that it has a State object (defined below) that contains fields that affect
  // how it looks.

  // This class is the configuration for the state. It holds the values (in this
  // case the title) provided by the parent (in this case the App widget) and
  // used by the build method of the State. Fields in a Widget subclass are
  // always marked "final".

  final String title;

  @override
  _MyHomePageState createState() => _MyHomePageState();
}

```

- 위쪽 코드블럭을 잘 살펴보면 **MyApp** 클래스 내에서 `home`을 또다른 클래스인 **MyHomePage**로 정의해주고 있음을 볼 수 있다.
  - 그리고 이 친구는 **StatefulWidget**을 extend하고 있다. 왜지 갑자기!?
- 주석 내용을 좀 읽어보자
  - 우선 앞서 `home`을 이 클래스로 정의했기 때문에 *home page of the application*이 된다.
  - 그리고 이 친구의 일부가 *변하기* 때문에 StatefulWidget을 쓴 것 같은데
    - 아래에 있는 `_MyHomePageState`를 보자.

```dart
class _MyHomePageState extends State<MyHomePage> {
  int _counter = 0;

  void _incrementCounter() {
    setState(() {
      // This call to setState tells the Flutter framework that something has
      // changed in this State, which causes it to rerun the build method below
      // so that the display can reflect the updated values. If we changed
      // _counter without calling setState(), then the build method would not be
      // called again, and so nothing would appear to happen.
      _counter++;
    });
  }
```

- 드디어 나왔다! + 버튼을 누르면 카운팅되는 기능을 하는 함수.
  - `setState` 함수 안에 정의해두었기 때문에 이 함수를 실행하면 `_counter++`만 실행되는게 아니라, `build()` 함수도 다시 불린다고 한다.
    - 그 덕분에 UI에서 변경된 `_counter`의 값이 보이는 것이다.
    - 만약 `setState` 함수 안에 있지 않았다면 UI 업데이트는 되지 않고 `_counter` 변수의 값만 늘어났을 것이다.
- 그런데 이 친구가 어떻게 + 버튼과 연결되어있는걸까?

```dart
@override
  Widget build(BuildContext context) {
    // This method is rerun every time setState is called, for instance as done
    // by the _incrementCounter method above.
    //
    // The Flutter framework has been optimized to make rerunning build methods
    // fast, so that you can just rebuild anything that needs updating rather
    // than having to individually change instances of widgets.
    return Scaffold(
      appBar: AppBar(
        // Here we take the value from the MyHomePage object that was created by
        // the App.build method, and use it to set our appbar title.
        title: Text(widget.title),
      ),
      body: Center(
        // Center is a layout widget. It takes a single child and positions it
        // in the middle of the parent.
        child: Column(
          // Column is also a layout widget. It takes a list of children and
          // arranges them vertically. By default, it sizes itself to fit its
          // children horizontally, and tries to be as tall as its parent.
          //
          // Invoke "debug painting" (press "p" in the console, choose the
          // "Toggle Debug Paint" action from the Flutter Inspector in Android
          // Studio, or the "Toggle Debug Paint" command in Visual Studio Code)
          // to see the wireframe for each widget.
          //
          // Column has various properties to control how it sizes itself and
          // how it positions its children. Here we use mainAxisAlignment to
          // center the children vertically; the main axis here is the vertical
          // axis because Columns are vertical (the cross axis would be
          // horizontal).
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Text(
              'You have pushed the button this many times:',
            ),
            Text(
              '$_counter',
              style: Theme.of(context).textTheme.headline4,
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _incrementCounter,
        tooltip: 'Increment',
        child: Icon(Icons.add),
      ), // This trailing comma makes auto-formatting nicer for build methods.
    );
  }
```

- **Widget** 클래스에 정의된 **build** 함수를 오버라이딩해서 쓰고 있다.
  - 이 함수는 `setState` 함수가 한 번 불리면 덩달아 한 번 실행된다.
    - 그래서 코드 상에서 explicit하게 `build()`를 call하는 코드를 찾으면 하나도 나오지 않는다.
      - ~~이런걸 보면 가끔 내부 코드를 뜯어서 어떻게 생겨먹었는지 보고싶어진다. 언젠가 하지 않을까?~~
    - 다행히도 플러터는 이런식으로 아예 새로 build하는 것에 최적화되어있기 때문에 성능 걱정은 하지 않아도 된다고 주석에 적혀있다. (하지만 어느정도 하긴 해야겠지?)
- 이 함수에서는 갑자기 `Scaffold`라는 객체를 하나 return하고 있다.
  - **Scaffold**는 플러터에서 준비한 기본 레이아웃 구조에 대한 클래스다.
    - (영어사전에 scaffold를 검색하면 건설현장에서 쓰이는 비계, 그러니까 일종의 발판이 나온다.)

        ![scaffold class](https://broccolism.github.io/assets/img/flutter/2020-06-25-1.jpg)

    - 이렇게 생긴 레이아웃이다.
    - text를 보여주고 있는 **body**와 + 아이콘을 띄우고 있는 **FlatingActionButton**이 있다.
    - **appBar**의 제목은 주석에서 알 수 있듯이, `MyHomePage` 객체를 만들 때 설정한 제목이 나오고 있다.
        - 즉, `title: Text(widget.title)`에서 `widget`이 `MyHomePage` 객체라는건데... 아무래도 흐름이 이렇게 되는 것 같다.
            - ~~main → runApp → MyApp() 의 build() → MyHomePage(title: 'Flutter Demo Home Page') → _MyHomePageState createState() → _MyHomePageState 의 build()~~
                    - 아니... 생각해보면 당연한거잖아?

        - 그러니까 이 함수가 정의되어있는 **_MyHomePageState** 클래스 자체가 **State<MyHomePage>**를 extend하기 때문에
                - `widget`이 `MyHomePage` 객체가 될 수 있다.
- **Center** 역시 레이아웃 위젯이다.
  - `child` 하나를 받아서, 자기자신의 한가운데에 위치시킨다.
- **Column**도 레이아웃 위젯이다.
  - 여러개의 `children`을 받아서 수직으로 정렬한다.
    - 크기를 자동으로 조절해서 가로와 세로 모두 parent에 fit 되게 만든다.
  - Column 자기 자신의 크기와 children의 위치를 설정할 수 있는 여러 옵션이 제공된다.
    - 예제 코드에서는 `MainAxisAlignment`를 사용하고 있다.
- **FloatingActionButton**도 위젯이다. ~~이쯤되면 다 위젯~~
    - `onPressed`: 버튼을 탭하는 등의 방식으로 활성화시켰을 때 불리는 callback.
        - `null`로 설정되어있으면 버튼은 disable된다.
            - 누르면 아무 일도 일어나지 않는게 아니라, 탭을 해도 아예 눌린다는 느낌이 들지 않는다.
                - 버튼이 아주 잠깐 하얗게 변했다 돌아오는 것처럼, 눌렀을 때 나타나는 UI 자체가 보이지 않는다.
    - `tooltip`: 버튼이 눌리면 어떤 일을 하는지 설명해주는 텍스트.
        - 유저가 버튼을 길게 눌렀을 때 나타난다.
        - html에서 이미지 파일을 불러올 수 없을 때 보여주는 대체 텍스트 같은 느낌이다.
- `child: Icon(Icons.add)`에서 `add`가 의미하는건 실제 값을 올려주는게 아니라, ➕더하기 모양➕ 그림을 의미한다.

이로써 예제 코드 분석이 모두 끝났다.

- 위젯은 중요한 요소 중 하나다. 거의 모든게 위젯이다.
    - 내일은 위젯을 좀 알아보면서 이것저것 만들어봐야겠다.
- 코드 생긴걸로 보면 json파일처럼 생겼다.
    - 그만큼 간결하다.
    - 자바보다 간결한 코틀린으로 짜던 코드보다 훨씬 더!
- xml, layout 파일이 따로 필요없어서 정말 편하다.

---

## 프레임워크

### @override _MyState createState() ⇒ _MyState();

- 트리의 주어진 location에 있는 widget에게 mutable state를 만들어준다.
- 이 method는 StatefulWidget의 lifetime동안 여러번 부를 수 있다.
    - 예를 들어 widget이 트리의 여러 곳에 삽입되어있는 경우, 프레임워크는 각 location에 위치한 **State** object를 따로 만들 수 있다고 한다.
    - 비슷하게, 한 위젯이 트리에서 삭제된 후 다시 삽입되었을 경우 **State** object를 업데이트하기 위해서 **createState**를 다시 불러주면 된다.
    - 이쯤되면 대체 '트리'가 뭘 말하는건지 알고싶어진다. 그래서 공식 문서에서 이런걸 얻었다.

## Widget Tree for UI

![example UI](https://broccolism.github.io/assets/img/flutter/2020-06-25-2.jpg)

![example UI with boxes](https://broccolism.github.io/assets/img/flutter/2020-06-25-3.jpg)

이런 UI가 있을 때 사용한 위젯을 다음과 같이 트리 형식으로 나타낼 수 있다.

![tree](https://broccolism.github.io/assets/img/flutter/2020-06-25-4.jpg)

- **Row**: 버튼 3개를 감싸고 있는 전체 위젯
- **Column**: 아이콘과 텍스트를 들고 다니는 위젯. 이 예시에서 Row 안에는 총 3개의 Column 위젯이 있다.
- **Container**: 이 친구를 사용하면 child widget을 마음대로 꾸밀 수 있다고 한다.
    - e.g) 배경색 및 모양 설정, 크기 제한 등
    - `Container`라는 Widget class가 따로 있다.
        - 하위 위젯의 구성, 장식, 위치 등을 정할 수 있다.

        ```dart
        Container(
        	child: Text('Less boring'),
        	color: Colors.black,
        	padding: EdgeInsets.all(20.0),
        	decoration: BoxDecoration(
        		shape: BoxShape.circle,
        		color: Color.blue,
        	),
        	alignment: Alignment.center,
        	transfrom: Matrix4.rotationZ(0.05),
        );
        ```

        - 으악... 안드로이드 프레임워크로 작업하던 내게 이런건 완전 신세계다!! 이건 혁명이야
            - 거기서는... 그냥 circle 하나만 넣고 싶어도 새 drawable 파일을 만들어서... 넣고.. 설정해줘야했단말입니다.
            - `decoration`, `transform`만 봐도 플러터가 UI 작업에 최적화 되어있는걸 볼 수 있다.
                - 누가 이런건 생각해낸거죠? 최고다 정말
                - 아니 물론 `transform`은 실제 앱에서 쓸 일이 있을진 모르겠지만 아무튼 정말 간편해보인다.

---

## 함수

### void runApp(Widget app)

- 주어진 widget(`app`)을 inflate한 뒤 screen에 attach.
    - **widget**: 전체 화면을 채우도록 contraint가 걸려있다.
        - 스크린의 한쪽만 채우고 싶다면 `Align`을, 가운데만 채우고 싶다면 `Center` 옵션을 사용하라고 한다.
- `runApp`을 한번 더 부르면...
    - 스크린에서 이전의 root widget을 detach하고
    - 새로 주어진 widget을 그곳에 attach한다.

---

## 클래스

### abstract class Widget extends DiagnosticableTree

- **Element**를 위한 configuration을 결정한다.
    - UI의 일부
    - 한 번 설정하면 바꿀 수 없는 immutable description.
        - 따라서 이 클래스의 모든 멤버는 `final` 선언되어야 한다.
    - 하위 render tree를 관리하는 element에 inflate 될 수 있다.
- 플러터 프레임워크의 핵심 클래스!

### abstract class StatelessWidget extends Widget

- mutable state가 필요없는 widget.
    - 그도 그럴게 Widget 클래스 자체가 immutable하니까 그런거 아닐까?
- 좀 더 concrete한 다른 위젯을 모으는 역할을 하는 것 같다.
    - ("building a constellation of other widgets" 라고 적혀있다.)
    - 이 떄 building 과정은 완전히 concrete한 description을 만나기 전까지 recursive하게 이루어진다.
        - 고 한다. 아직 무슨 소린지 잘 와닿지는 않는다.
        - "완전히 concrete한 description"의 예시로는 **RenderObject**를 describe하는 **RenderObjectWidget**을 들고 있다.
- 이럴 때 유용함
    - 정의하려는 UI 파트가
        - 그 파트 자체에 대한 정의
        - 위젯이 inflate된 **BuildContext**
    - 이외의 그 어떤 것에도 의존하지 않을 때 유용하다고 한다.
        - 그러니까 자기 자신과 자신이 보여질 공간의 성질을 제외하고 다른 요소의 영향을 받지 않는 파트일 때 이 클래스를 사용하면 될 것 같다.
- 이와 반대되는 성질을 갖는 친구
    - **StatefulWidget**: 예를 들면 특정 상태에 의존하거나, 시간의 흐름에 따라 변해야 할 요소같은 경우에는 이 클래스를 사용할 것을 추천하고 있다.
- **StatelessWidget**을 **build**해야 할 때라는 것.., 그건 바로,,.
    1. 위젯이 처음으로 tree에 삽입될 때
    2. 위젯의 parent의 configuration이 바뀔 때
    3. StatelessWidget이 의존하고 있는 **InheritedWidget**이 바뀔 때
- 라는 것,...
    - 따라서 만약
        - StatelessWidget의 parent의 configuration이 일정 시간마다 바뀌거나
        - StatelessWidget이 의존하고 있는 inherited widget이 자주 바뀐다면
    - rendering performance에 신경을 잘 써줘야한다! (자세한 내용은 일단 생략한다... 하나만 너무 깊이 들어가지 않기 위해. ..다음에 알아보도록 하자 ㅎㅎㅎ)

### abstract class State<T extends StatefulWidget> with Diagnosticable

- **StatefulWidget**을 위한 logic이자 internal state를 정의한다.
- **State**는
    1. 위젯이 build 될 때 동기적으로 읽히고
    2. 위젯의 lifetime 내내 변할 수도, 그렇지 않을 수도 있다.
    - State가 바뀔 때마다 `State.setState`를 사용해서 위젯의 state가 바뀌었음을 곧바로 알려줘야 한다.
- **State** object는 `StatefulWidget.createState` 함수를 이용해서 만들 수 있다.
    - **StatefulWidget**을 트리 안에 inflate할 때 만들 수 있다.
        - **StatefulWidget** instance는 여러번 inflate 될 수 있다.