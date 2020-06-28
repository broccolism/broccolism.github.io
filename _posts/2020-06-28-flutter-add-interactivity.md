---  
layout: post  
title: "[Flutter] State 관리하기"
categories: study
tags: study 2020-2 flutter example state manage interactivity
comments: true
---

# Stateful and stateless widgets
위젯은 stateful / stateless widget으로 나뉜다.
- *stateless* widget: 절대 변하지 않는 위젯.
    - **StatelessWidget**의 subclass로 만들 수 있다.
    - e.g) Icon, IconButton, Text
- *stateful* widget: 시각적으로 변하는 위젯.
    - 유저가 어떤 행동을 했을 때나 특정 데이터를 받았을 때와 같은 이벤트에 반응하여 appearance가 달라지는 위젯.
    - **StatefulWidget**의 subclass로 만들 수 있다.
    - e.g) Checkbox, Radio, Slider, InkWell, Form, TextField

잠깐 이름이 특이한 StatefulWidget 종류를 살펴보자.

- **InkWell** class
    - 터치했을 때 반응하는 직사각형 공간
    - 이 클래스의 오브젝트를 터치하면 아래와 같이 splash 효과가 나타난다.

    ![inkwell](https://broccolism.github.io/assets/img/flutter/2020-06-28-1.jpg)

- **Radio<T>** class
    - 동그란 단일 선택 버튼 리스트. (많이 보긴 했지만 이름이 Radio인줄은 처음 알았다.)

    ![radio](https://broccolism.github.io/assets/img/flutter/2020-06-28-2.jpg)

- **Form** class
    - 여러 필드 위젯을 합친 optional conaitner

    ![form](https://broccolism.github.io/assets/img/flutter/2020-06-28-3.jpg)

# Creating a stateful widget

### Point

- 클래스 2개를 사용해서 stateful widget을 구현할 수 있다.
    - **StatefulWidget** class의 subclass
    - **State** class의 subclass
- state class는 위젯의 *바뀔 수 있는(mutable)* state와 위젯의 `build()` method를 갖는다.
- 위젯의 state가 바뀔 때마다 state object는 `setState()` 메소드를 부른다.
    - 이 함수는 framework에게 위젯을 *새로 그릴 것*을 요청한다.

# Step 1 Subclass StatefulWidget

![step 1 goal](https://broccolism.github.io/assets/img/flutter/2020-06-28-4.jpg)

이 화면에서 빨간 별표를 StatefulWidget으로 바꿀 것이다. 유저가 클릭하면 아이콘과 숫자가 바뀔 수 있도록! 이 친구를 **FavoriteWidget**이라고 부르자.

- 사용자의 행동에 따라 appearance가 바뀔 것이기 때문에 StatefulWidget을 override한다.
    - 즉, state object와 statefulwidget object가 필요하다.

먼저 StatefulWidget object를 하나 만들어보자. 이 오브젝트는 자신의 state를 관리하기 때문에 `State` 오브젝트를 하나 만들기 위해 `createState()` 함수를 오버라이딩한다.

- 플러터는 위젯을 build하기 위해 `createState()` 함수를 호출한다.

```dart
class FavoriteWidget extends StatefulWidget {
	@override
	_FavoriteWidgetState createState() => _FavoriteWidgetState();
}
```

# Step 2 Subclass State

그리고 이 위젯의 state object를 만들어보자. 위젯의 lifetime동안 변해야하는 state에는 빨간색 별모양 아이콘과 그 옆에 나오는 까만 글자가 있다. 이를 위한 변수 2개를 정의하자.

```dart
class _FavoriteWidgetState extends State<FavoriteWidget> {
  bool _isFavorited = true;
  int _favoriteCount = 41;
}
```

이대로 가만히 있으면 클래스명에 빨간줄이 그인다. `build()` 메소드를 오버라이딩하지 않았기 때문이다. 위젯의 빌더를 마저 적어주자.

- builder는 별모양 아이콘과 숫자를 보여줘야한다.
    - 별모양 아이콘은 `_isFavorited`의 값에 따라 모양이 바뀌어야하고
        - 색상은 항상 빨간색이면 된다.
        - 또, 눌렸을 때 이전 상태에 따라 아이콘 종류를 바꿔주는 기능은 함수로 빼는 것이 좋다.
        - 그러니까 `Container`를 사용하자.
    - 숫자는 항상 크기가 고정적이어야한다.
        - 그냥 `Text`만 사용하면 `40`일 때와 `41`일 때 가로 길이가 바뀔 수 있다.
        - 그러니까 `SizedBox`를 사용하자.

```dart
class _FavoriteWidgetState extends State<FavoriteWidget> {
  // ···
  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          padding: EdgeInsets.all(0),
          child: IconButton(
            icon: (_isFavorited ? Icon(Icons.star) : Icon(Icons.star_border)),
            color: Colors.red[500],
            onPressed: _toggleFavorite,
          ),
        ),
        SizedBox(
          width: 18,
          child: Container(
            child: Text('$_favoriteCount'),
          ),
        ),
      ],
    );
  }

	void _toggleFavorite() {
	  setState(() {
	    if (_isFavorited) {
	      _favoriteCount -= 1;
	      _isFavorited = false;
	    } else {
	      _favoriteCount += 1;
	      _isFavorited = true;
	    }
	  });
	}
}
```

여기까지하면 아래 화면처럼 아이콘을 누를 수 있게 된다!

![result](https://broccolism.github.io/assets/img/flutter/2020-06-27-gif.gif)

---

# Managing State

**state**를 관리하는 방식은 여러가지가 있다.

- 그 때 그 때 상황에 맞는 방법을 적절하게 사용할 수 있어야한다.

어떤 위젯의 state는 누가 관리할까?

- 자기 자신?
- 위젯의 parent?
- 혹은 둘 다?

가장 적절한 대답은 *상황에 따라 달라진다.*이다. 위의 세가지 방법이 가장 흔하게 사용되는 state 관리 방법이다. 보통 어떨 때 각 방법을 사용하냐면,

- state가 user data에 의존하는 경우
    - e.g) 체크박스의 체크/빈칸 여부, 슬라이더의 위치 등
    - parent widget이 child widget의 state를 관리한다.
- state가 시각적 요소인 경우
    - e.g) 애니메이션 효과
    - 위젯은 자기 자신의 state를 관리한다.

공식 문서에서는 잘 모르겠으면 일단 parent가 관리하게 두라고 권장한다. 이제 state 관리 방법 3가지를 하나씩 살펴보자. 아래와 같은 박스 하나를 만들 것이고, 각 방식을 사용하는 오브젝트를 `TapboxA`, `TapboxB`, `TapboxC`라고 부를 것이다.

![box](https://broccolism.github.io/assets/img/flutter/2020-06-28-5.jpg)

### Managing own state

`_TapboxAState`클래스는..

- `TapboxA`의 state를 관리한다.
    - 박스 색깔을 정하기 위해 `_active` 변수를 갖는다.
        - `_handleTap()` 함수가 이 변수의 값을 업데이트한다.
            - 유저가 박스를 탭했을 때
            - `setState()` 함수를 부르면서 UI도 함께 업데이트한다.
- 위젯의 모든 interactive behavior를 달고 다니면서 결정한다.

```dart
//------------------------- TapboxA ----------------------

class TapboxA extends StatefulWidget {
  TapboxA({Key key}) : super(key: key);

  @override
  _TapboxAState createState() => _TapboxAState();
}

class _TapboxAState extends State<TapboxA> {
  bool _active = false;

  void _handleTap() {
    setState(() {
      _active = !_active;
    });
  }

  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: _handleTap,
      child: Container(
        child: Center(
          child: Text(
            _active ? 'Active' : 'Inactive',
            style: TextStyle(fontSize: 32.0, color: Colors.white),
          ),
        ),
        width: 200.0,
        height: 200.0,
        decoration: BoxDecoration(
          color: _active ? Colors.lightGreen[700] : Colors.grey[600],
        ),
      ),
    );
  }
}

//------------------------- MyApp -----------------------

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      home: Scaffold(
        appBar: AppBar(
          title: Text('Flutter Demo'),
        ),
        body: Center(
          child: TapboxA(),
        ),
      ),
    );
  }
}
```

여기까지 하면 이런 화면이 완성된다.

![resultA](https://broccolism.github.io/assets/img/flutter/2020-06-28-gifA.gif)

### Managing child's state

parent 위젯이 실제 state를 관리하다가 업데이트가 필요한 때에 child에게 알려주는 방식이다.

- `TapboxB`는 자신의 state를 callback을 통해 parent가 관리할 수 있도록 한다.
    - 이 클래스는 아무런 state도 관리하지 않을 것이기 때문에 **StatelessWidget**의 subclass로 만들 것이다.
    - 유저가 탭하면 parent에게 **알려준다.**
- `ParentWidgetState`는...
    - TapboxB를 위한 state인 `_active`를 관리한다.
        - 박스를 탭하면 `_handleTapboxChanged()` 함수를 부른다.
    - state가 바뀌면 `setState()`를 호출해 UI를 업데이트한다.

```dart
//------------------------ ParentWidget --------------------------------

class ParentWidget extends StatefulWidget {
  @override
  _ParentWidgetState createState() => _ParentWidgetState();
}

class _ParentWidgetState extends State<ParentWidget> {
  bool _active = false;

  void _handleTapboxChanged(bool newValue) {
    setState(() {
      _active = newValue;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      child: TapboxB(
        active: _active,
        onChanged: _handleTapboxChanged,
      ),
    );
  }
}

//------------------------- TapboxB ----------------------------------

class TapboxB extends StatelessWidget {
  TapboxB({Key key, this.active: false, @required this.onChanged})
      : super(key: key);

  final bool active;
  final ValueChanged<bool> onChanged;

  void _handleTap() {
    onChanged(!active);
  }

  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: _handleTap,
      child: Container(
        child: Center(
          child: Text(
            active ? 'Active' : 'Inactive',
            style: TextStyle(fontSize: 32.0, color: Colors.white),
          ),
        ),
        width: 200.0,
        height: 200.0,
        decoration: BoxDecoration(
          color: active ? Colors.lightGreen[700] : Colors.grey[600],
        ),
      ),
    );
  }
}

//------------------------ MyApp -----------------------
class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Managing State',
      home: Scaffold(
        appBar: AppBar(
          title: Text('Managing State'),
        ),
        body: Center(
          child: ParentWidget(),
        ),
      ),
    );
  }
}
```

코드를 보면 짐작이 가겠지만 실행 결과 자체는 `TapboxA`와 동일하다.

### A mix-and-match approach

statefulWidget이 자기 state의 일부를 관리하고, 나머지 일부는 parent widget이 관리하는 방식.

- `TapboxC`는 위의 탭 박스와 다르게 누르고 있는동안 짙은 초록색 테두리가 생기고, 손가락을 떼면 사라지도록 만들 것이다.
    - 자신의 `_active` state는 parent가 관리하도록 두고
    - `_highlight` state는 자기 자신이 관리할 것이다.
    - 이를 위해서는 State object가 2개 필요하다.
- `_ParentWidgetState` 오브젝트는
    - `_active` state를 관리한다.
    - 박스를 탭하면 `_handleTapboxChanged()` 함수를 부른다.
    - `_active` 값이 바뀌면 `setState()`를 호출해 UI를 업데이트한다.
- `_TapboxCState` 오브젝트는
    - `_highlight` state를 관리한다.
    - `GestureDetector`는 모든 탭 이벤트를 감지한다.
        - 유저가 박스를 누르고 있는 동안 highlight를 추가하고
        - 손가락을 떼면 highlight를 제거한다.
        - parent에게 state가 변화함을 알려준다.
    - `setState()` 함수는
        - 유저가 박스를 누르고 있을 때
        - 손가락을 뗄 때
        - 탭이 취소되었을 때
        - `_highlight` state가 바뀔 때
    - 호출한다.

```dart
//---------------------------- ParentWidget ------------
class ParentWidgetC extends StatefulWidget {
  @override
  _ParentWidgetStateC createState() => _ParentWidgetStateC();
}

class _ParentWidgetStateC extends State<ParentWidgetC> {
  bool _active = false;

  void _handleTapboxChanged(bool newValue) {
    setState(() {
      _active = newValue;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      child: TapboxC(
        active: _active,
        onChanged: _handleTapboxChanged,
      ),
    );
  }
}

//----------------------------- TapboxC -------------
class TapboxC extends StatefulWidget {
  TapboxC({Key key, this.active: false, @required this.onChanged})
      : super(key: key);

  final bool active;
  final ValueChanged<bool> onChanged;

  _TapboxCState createState() => _TapboxCState();
}

class _TapboxCState extends State<TapboxC> {
  bool _highlight = false;

  void _handleTapDown(TapDownDetails details) {
    setState(() {
      _highlight = true;
    });
  }

  void _handleTapUp(TapUpDetails details) {
    setState(() {
      _highlight = false;
    });
  }

  void _handleTapCancel() {
    setState(() {
      _highlight = false;
    });
  }

  void _handleTap() {
    widget.onChanged(!widget.active);
  }

  Widget build(BuildContext context) {
    // This example adds a green border on tap down.
    // On tap up, the square changes to the opposite state.
    return GestureDetector(
      onTapDown: _handleTapDown, // Handle the tap events in the order that
      onTapUp: _handleTapUp, // they occur: down, up, tap, cancel
      onTap: _handleTap,
      onTapCancel: _handleTapCancel,
      child: Container(
        child: Center(
          child: Text(widget.active ? 'Active' : 'Inactive',
              style: TextStyle(fontSize: 32.0, color: Colors.white)),
        ),
        width: 200.0,
        height: 200.0,
        decoration: BoxDecoration(
          color: widget.active ? Colors.lightGreen[700] : Colors.grey[600],
          border: _highlight
              ? Border.all(
                  color: Colors.teal[700],
                  width: 10.0,
                )
              : null,
        ),
      ),
    );
  }
}

//------------------------ MyApp -----------------------
class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Managing State',
      home: Scaffold(
        appBar: AppBar(
          title: Text('Managing State'),
        ),
        body: Center(
          child: ParentWidgetC(),
        ),
      ),
    );
  }
}
```

![resultC](https://broccolism.github.io/assets/img/flutter/2020-06-28-gifC.gif)

이제 이렇게 탭 다운하는동안 테두리가 생긴다.

출처: [플러터 공식 문서 튜토리얼](https://flutter.dev/docs/development/ui/interactive#stateful-and-stateless-widgets)