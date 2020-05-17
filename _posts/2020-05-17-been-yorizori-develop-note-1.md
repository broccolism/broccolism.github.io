---  
layout: post  
title: "[project] YoriZori: 자취생 재료 관리 및 레시피 추천 어플"
categories: been
tags: been develop-note android team project
comments: true
---

2020-1학기 테크노 경영 과목을 수강하며 칠면조(7조)에서 내놓은 사업 아이템! android 개발 경험은 많지 않지만 구글링만큼은 자신이 있기에 겁도 없이 3주 안에 서비스 가능한 어플을 만드는 것을 목표로 하게 되었다.

### first step.
기본 UI는 이미 짜놓은 상태다. 가장 먼저 구현해야 할 탭 2가지를 우선적으로 만들기로 하고 구현할 파트를 나누었다. 다음주부터는 서버 파트를 건드리게 될 것 같다. 신난다! ~~난 안드로이드가 싫어~~

### what i have had known related with this project
- activity, fragment
    - commons & differences
        - when to use fragment or not
    - life cycle
    - intent
- view
    - list view
    - grid view
- layout
    - linear layout
        - pros and cons
    - constraint layout
        - pros and cons
- little bit about kotlin syntax
- little bit about firebase

### today, i made...

![img](https://broccolism.github.io/assets/img/been/2020-05-17-1.jpg)  
real-time searching! using AutoCompleteTextView!

단점은 한글로 입력하면 제대로 작동하지 않는다는 점이다. 사진의 두 번째 화면을 보면 **양ㅅ**까지만 입력했을 때 아무 것도 안 뜨는 것을 볼 수 있다. **양사**까지만 쳐도 마찬가지로 아무 결과도 보여주지 않는다. **양상**까지 입력해야만 비로소 보인다. 영어는 우리나라처럼 초성-중성-종성 개념이 없어서 그런가 더미 데이터를 모두 영어로 바꾸고 영어로 검색어를 입력하면 한 글자씩 잘 나왔다.

사실 이를 고치기 위한 방법이 있긴 하다. 저번 어플 만들 때 썼던 방식인데, AutoCompleteTextView를 사용하지 않고 그냥 TextEdit을 사용하는 것이다. 대신 이것을 사용하면 결과를 보여주는 창을 연결할 때 어댑터를 사용할 수 없게 된다. 그리고 뭔가 새로운 도구를 써보자!라는 의미에서 AutoCompleteView를 써봤는데 그래도 좀 아쉽긴 하다.

#### problem i met
처음에는 결과 창이 위의 그림처럼 위쪽으로 나오지 않았다. 아래쪽으로 나와서 키보드와 겹쳤다. 사실 저 검색 바가 앱 화면의 가장 아래쪽에 있기 때문이다. 처음에는 `android.R.layout.simple_list_item_1`이 항상 아래쪽으로만 나오게 설정이 되어있는건가? 싶었는데 구글링을 해보았더니 같은 레이아웃을 썼는데도 위쪽으로 결과가 잘 나오는 사진이 있었다.

원인은 다른 곳에 있었다. 바로 activity 자체의 성질! manifest file에 아래 속성을 추가하니 위 그림처럼 잘 작동되었다.

```xml
<activity
    android:windowSoftInputMode="adjustResize"/>
```

글자 입력을 받으려고 키보드를 띄우면 보여지고 있는 레이아웃을 조정할지 말 지에 대한 속성이다. 기본 값은 `adjustResize`가 아니었나보다. 이 값으로 설정하면 키보드 크기에 맞추어 레이아웃을 조정해준다.

#### what i learn
- "context" in the fragment
    - `requireContext()` 를 사용하면 된다.(kotlin)
- how to use AutoCompleteView
    - 굉장히 간단하다.
    1. 뷰를 만들고
    2. 어댑터를 만들고
    3. `threshold`를 비롯한 속성을 설정한 후
    4. 뷰에 어댑터를 연결한다.
- 어댑터: `val searchAdapter = ArrayAdapter<[T]>([context], [layout], [list])`
    - `T`: 찾을 변수들의 type
    - `context`: 현재 context(fragment의 경우 위 함수 사용하여 activity의 context를 가져올 수 있다.)
    - `layout`: 결과를 보여줄 layout
        - `android.R.layout.simple_list_item_1`처럼 친절한 안드로이드가 미리 만들어놓은 친구들이 있다.
    - `list`: 결과를 찾을 데이터 셋.
        - 이후 서버와 연결할 때 이 리스트에 서버의 데이터를 끌어다 넣으면 될 것 같다.
    
#### what is left
내일 할 일은 나온 결과값을 선택하면 새 다이얼로그를 띄우는 것이다. 지금은 그 결과를 선택하면 위 사진의 마지막 화면처럼 그냥 입력 창에 결과값이 그대로 들어간다.