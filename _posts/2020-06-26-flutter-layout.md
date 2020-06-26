---  
layout: post  
title: "[Flutter] 기초 - 레이아웃 만들기"
categories: study
tags: study 2020-2 flutter layout example
comments: true
---

### 목표
- 플러터의 레이아웃 메커니즘
- 위젯을 수직/수평으로 정렬하는 방법
- 플러터 레이아웃을 만드는 과정
- ![goal](https://broccolism.github.io/assets/img/flutter/2020-06-26-1.jpg){: width="50%" }

- 출처: [https://flutter.dev/docs/development/ui/layout/tutorial#step-1-diagram-the-layout](https://flutter.dev/docs/development/ui/layout/tutorial#step-1-diagram-the-layout)

# Step 1 Diagram the layout

레이아웃을 기본 구성 요소로 쪼개는 과정.

- row, column이 쓰일 곳은 어딘가?
- 레이아웃에 그리드가 필요한가?
- 다른 요소를 덮어씌우는 요소가 있는가?
- UI에 탭이 필요한가?
- 정렬, 테두리, 여백 등은 어디에 어떻게 줄 것인가?

구성 요소를 파악할 때에는 큰 것부터 단계적으로 깊이 들어가면 된다.

![layout](https://broccolism.github.io/assets/img/flutter/2020-06-26-2.jpg){: width="50%" }

- 위 화면에서 가장 큰 구성요소는 Column이다.
    - 그 안에 총 4개의 row가 있고
    - 각 row에는 사진, 제목, 파란 버튼 3개, 그리고 내용이 들어간다.

다음으로 각 row의 레이아웃을 파악한다.

![row1](https://broccolism.github.io/assets/img/flutter/2020-06-26-3.jpg)
![row2](https://broccolism.github.io/assets/img/flutter/2020-06-26-4.jpg)

간단해보이지만 생각보다 많은 요소가 숨어있는 것을 볼 수 있다.

- 각 레이아웃을 이런 방식으로 나타내면 bottom-up approach를 사용하기 편해진다.

이후 각 row를 순서대로 구현하는 과정을 살펴보자.

# Step 2 Implement the title row

![row1](https://broccolism.github.io/assets/img/flutter/2020-06-26-3.jpg)

title section은 하나의 커다란 Row 안에 children 3개가 들어있는 형태이다. 각 child들은

- Text 2개가 들어가는 Column
- Icon
- Text

를 갖고 있다. 이 내용을 구현한 코드는 아래와 같다.

```dart
Widget titleSection = Container(
  padding: const EdgeInsets.all(32),
  child: Row(
    children: [
      Expanded(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.only(bottom: 8),
              child: Text(
                'Oeschinen Lake Campground',
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            Text(
              'Kandersteg, Switzerland',
              style: TextStyle(
                color: Colors.grey[500],
              ),
            ),
          ],
        ),
      ),
      Icon(
        Icons.star,
        color: Colors.red[500],
      ),
      Text('41'),
    ],
  ),
);
```

그리고 **Scaffold** 클래스의 body에 Column을 하나 추가하여 이 위젯을 넣으면 아래 화면이 나온다.

```dart
import 'package:flutter/material.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'title',
      home: Scaffold(
        appBar: AppBar(
          title: Text('Flutter layout demo'),
        ),
        body: Column(
          children: [
            titleSection,
          ],
        ),
      ),
    );
  }
}
```

![result1](https://broccolism.github.io/assets/img/flutter/2020-06-26-5.jpg){: width="50%" }

# Step 3 Implement the button row

![row2](https://broccolism.github.io/assets/img/flutter/2020-06-26-4.jpg)

구현에 들어가기 전에 추가로 파악할 것들이 있다.

- 각 Column에는 아이콘과 텍스트가 하나씩 들어가고
- 모두 앱의 primary color로 칠해져있다.
- 즉, 구조 및 특성이 같다.

따라서 버튼의 색, 아이콘, 텍스트를 parameter로 받아서 Column 하나를  return하는 helper function을 만들 것이다.

- 각 Column은 좌우로 같은 크기의 여백을 두고 있어야 한다.

그렇기 때문에 Row의 특성에 `MainAxisAlignment.spaceEvenly` 옵션을 줄 것이다.

그러면 먼저 helper function을 만들어보자. `MyApp`에서만 쓰일 helper function이기 때문에 private method로 만드는 것이 좋다.

- 함수 이름 앞쪽의 언더바 `_`는 이 함수가 private method임을 나타낸다.

```dart
class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // ···
  }

	// 이렇게 private method로 정의해주자.
  Column _buildButtonColumn(Color color, IconData icon, String label) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Icon(icon, color: color),
        Container(
          margin: const EdgeInsets.only(top: 8),
          child: Text(
            label,
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w400,
              color: color,
            ),
          ),
        ),
      ],
    );
  }
}
```

helper function을 사용하면 buttonSection의 코드가 아주 간결하게 끝난다.

```dart
Color color = Theme.of(context).primaryColor;

Widget buttonSection = Container(
  child: Row(
    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
    children: [
      _buildButtonColumn(color, Icons.call, 'CALL'),
      _buildButtonColumn(color, Icons.near_me, 'ROUTE'),
      _buildButtonColumn(color, Icons.share, 'SHARE'),
    ],
  ),
);
```

그리고 `Scaffold` 클래스의 Column에 buttonSection도 추가하면 아래 화면이 나온다.

```dart
return MaterialApp(
      title: 'title',
      home: Scaffold(
        appBar: AppBar(
          title: Text('Flutter layout demo'),
        ),
        body: Column(
          children: [
            titleSection,
            buttonSection,
          ],
        ),
      ),
    );
```


![result2](https://broccolism.github.io/assets/img/flutter/2020-06-26-6.jpg){: width="50%" }

# Step 4 Implement the text section

이제 설명이 들어갈 부분을 구현해보자.

![text](https://broccolism.github.io/assets/img/flutter/2020-06-26-2.jpg){: width="50%" }

설명이 들어갈 부분에는 다른 추가 레이아웃이 필요없다. 그냥 텍스트만 적어주면 된다.

```dart
Widget textSection = Container(
      padding: const EdgeInsets.all(32),
      child: Text(
        'Lake Oeschinen lies at the foot of the Blüemlisalp in the Bernese '
        'Alps. Situated 1,578 meters above sea level, it is one of the '
        'larger Alpine Lakes. A gondola ride from Kandersteg, followed by a '
        'half-hour walk through pastures and pine forest, leads you to the '
        'lake, which warms to 20 degrees Celsius in the summer. Activities '
        'enjoyed here include rowing, and riding the summer toboggan run.',
        softWrap: true,
      ),
    );
```

코드에서 볼만한 건 `softWrap` 옵션인데,

![diff](https://broccolism.github.io/assets/img/flutter/2020-06-26-7.JPG)

이런 차이점이 생긴다. 자동 줄바꿈 기능이다. 그리고 위의 코드에서는 한 줄씩 일일이 다른 string을 사용하고 있는데 이걸 하나의 string으로 합치면...

![diff](https://broccolism.github.io/assets/img/flutter/2020-06-26-8.JPG)

아무런 변화가 없다. (ㅋㅋ) 그냥 편의를 위해 나눠서 쓴 것 같다.

# Step5 Implement the image section

이제 이미지가 들어갈 row만 만들면 된다. 그런데 이미지를 삽입하려면 이 이미지 파일이 프로젝트 폴더 내에 있어야 한다.

![folder](https://broccolism.github.io/assets/img/flutter/2020-06-26-9.jpg){: width="35%" }

- 프로젝트 최상위 폴더에 **images** 폴더를 만든다.
- 그리고 그 폴더 안에 사진을 넣는다.

- 이후 **pubspec.yaml** 파일에 `assets` 태그를 추가한다.

    ```dart
    flutter:
      uses-material-design: true
      assets:
        - images/lake.jpg
    ```

    - 이렇게 하면 코드 내에서 이미지를 다룰 수 있다.
    - (마크다운 마냥 앞쪽에다 그냥 `-` 와 띄어쓰기 하나를 입력하고 추가하면 된다길래 에러가 날 거라고 예상했지만 한번에 잘 실행됐다.)

이제 전체 Column의 children으로 이미지를 추가해주자.

```dart
return MaterialApp(
      title: 'title',
      home: Scaffold(
        appBar: AppBar(
          title: Text('Flutter layout demo'),
        ),
        body: Column(
          children: [
            Image.asset(
              'images/lake.jpg',
              width: 600,
              height: 150,
              fit: BoxFit.cover,
            ),
            titleSection,
            buttonSection,
            textSection,
          ],
        ),
      ),
    );
```

![result](https://broccolism.github.io/assets/img/flutter/2020-06-26-10.jpg){: width="50%" }

# Step 6 Final touch

지금껏 사용한 방식의 문제점은 화면 스크롤이 안된다는 점이다. 그래서 사진 세로 길이를 늘려 overflow가 나게 만들면...

![error](https://broccolism.github.io/assets/img/flutter/2020-06-26-11.jpg)

이렇게 에뮬레이터와 플러터 모두 싫어하는 모습을 볼 수 있다. 좀 놀랐던 점은 이렇게 정확히 몇 픽셀만큼 오버플로우가 났는지도 알려준다는 사실이다.

![pixel](https://broccolism.github.io/assets/img/flutter/2020-06-26-12.jpg)

아무튼 이대로 둘 순 없으니 스크롤이 되게 만들어야 한다. 방법은 아주 간단하다. 모든 레이아웃의 root 역할을 하고 있는 Column을 ListView로 바꿔주면 된다.

![gif](https://broccolism.github.io/assets/img/flutter/2020-06-26-gif.gif)
