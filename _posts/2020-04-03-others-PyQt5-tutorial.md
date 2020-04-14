---  
layout: post  
title: "[UI] PyQt5 아이콘 바꾸고 UI 연결하기"
categories: others
tags: others pyqt5 python ui icon event tutorial
comments: true
---
## 순서
[1) PyQt5 코드로 창 띄우기](#창-하나-띄우기)  
[2) 앱 아이콘 변경하기](#앱-아이콘-변경하기)  
&nbsp;&nbsp;&nbsp;&nbsp;[2-1) PyQt5 기본 제공 아이콘](#1-pyqt5-기본-제공-아이콘-목록)  
&nbsp;&nbsp;&nbsp;&nbsp;[2-2) 두 가지 방법으로 프로그래밍하기](#2-procedural-and-oop-style)  
[3) 미리 만든 .ui 파일과 코드 연결하기](#미리-만들어둔-ui-파일과-연결하기)  

> 출처
- 내용의 절반: [http://zetcode.com/gui/pyqt5/firstprograms/](http://zetcode.com/gui/pyqt5/firstprograms/){: target="_blank"}
- 나머지 절반: 글쓴이 (broccolism)
- PyQt5 기본 제공 아이콘 리스트 및 적용법: [https://joekuan.wordpress.com/2015/09/23/list-of-qt-icons/](https://joekuan.wordpress.com/2015/09/23/list-of-qt-icons/){: target="_blank"}

# 창 하나 띄우기
```python
    """
    ZetCode PyQt5 tutorial 
    
    In this example, we create a simple
    window in PyQt5.
    
    Author: Jan Bodnar
    Website: zetcode.com 
    Last edited: August 2017
    """
    
    import sys
    from PyQt5.QtWidgets import QApplication, QWidget
    
    if __name__ == '__main__':
        
        app = QApplication(sys.argv)
    
        w = QWidget()
        w.resize(250, 150)
        w.move(300, 300)
        w.setWindowTitle('Simple')
        w.show()
        
        sys.exit(app.exec_())
```

- `QWidget` 은 PyQt5에서 유저 인터페이스를 제공하는 모든 오브젝트의 base class입니다. `QWidget()` 은 해당 클래스의 default constructor이며 parent를 갖지 않습니다. 이처럼 parent를 갖지 않는 위젯을 `window` 라고 부릅니다.
- `w.move(300, 300)` 은 무엇을 이동시킨다는걸까요? 바로 window 그 자체입니다. `w` 라는 위젯의 위치를 x = 300, y = 300으로 만들겠다는 뜻입니다.
- `show()` 는 위젯을 화면에 보여주는 역할을 합니다. 즉, 이 줄이 실행되기 전까지 `w` 는 메모리에서 생성만 되어 있고 이후 해당 함수가 호출되면 유저에게 보여집니다. 그 후 앱의 main loop가 시작됩니다.
- 프로그램은 그 시점부터 event handling을 시작합니다. 마우스 클릭, 키보드 입력 등 여러 이벤트를 처리하다가 `exit()` 함수가 호출되거나 메인 위젯이 destroy 되면 메인 루프가 작동을 멈춥니다. `sys.exit()` 함수는 보다 확실하게 (아마도 OS에게) 프로그램의 종료를 알려줍니다.

![e.g 1](https://broccolism.github.io/assets/img/others/2020-04-03-1.JPG)

# 앱 아이콘 변경하기
위의 예제에서 만든 창에서 제일 먼저 고치고 싶은 부분은 아마도 앱 아이콘일 것입니다. 아래 예시도 [출처](http://zetcode.com/gui/pyqt5/firstprograms/){: target="_blank"}에서 가져온 코드입니다.
```python
    #!/usr/bin/python3
    # -*- coding: utf-8 -*-
    
    """
    ZetCode PyQt5 tutorial 
    
    This example shows an icon
    in the titlebar of the window.
    
    Author: Jan Bodnar
    Website: zetcode.com 
    Last edited: August 2017
    """

    import sys
    from PyQt5.QtWidgets import QApplication, QWidget
    from PyQt5.QtGui import QIcon
    
    class Example(QWidget):
        
        def __init__(self):
            super().__init__()
            
            self.initUI()
             
        def initUI(self):
            
            self.setGeometry(300, 300, 300, 220)
            self.setWindowTitle('Icon')
            self.setWindowIcon(QIcon('web.png'))        
        
            self.show()
            
    if __name__ == '__main__':
        
        app = QApplication(sys.argv)
        ex = Example()
        sys.exit(app.exec_())
```
여기서 새롭게 추가한 모듈이 있습니다.
```python
    from PyQt5.QtGui import QIcon
```
창에서 보여지는 아이콘을 바꾸려면 간단하게 line 하나만 추가하면 됩니다.
```python
    self.setWindowIcon(QIcon('web.png'))
```
여기서 알아야 할 것이 두가지 있습니다.
1. `QIcon('web.png'))` 의 정체
2. 아까는 `w` 로 하더니 갑자기 웬 `self` ?

### 1 PyQt5 기본 제공 아이콘 목록
먼저 위 코드는 `'web.png'` 라는 파일이 있어야 정상적으로 아이콘을 보여줍니다. 그러니까 직접 만든 파일로 아이콘 객체를 만든 후, 창에 적용해준 것이지요. 하지만 굳이 이렇게 그림 파일을 구하는게 귀찮다면 기본 제공 아이콘을 사용해도 될 것 같습니다.

![default icons](https://broccolism.github.io/assets/img/others/2020-04-03-2.JPG)

위 아이콘을 사용하는 방법은 [이곳에서 예제 링크를 통해 확인](https://joekuan.wordpress.com/2015/09/23/list-of-qt-icons/){: target="_blank"}할 수 있습니다. 여기서는 길게 다루지 않겠습니다.

### 2 Procedural and OOP Style
사실 이 부분 때문에 글을 쓰고 있습니다. 파이썬의 특징을 잘 활용할 수 있기 때문이죠. 절차지향 프로그래밍과 객체지향 프로그래밍을 모두 할 수 있다는 점입니다.
[첫 번째 예시 코드](#창-하나-띄우기)는 절차 지향 프로그래밍 스타일을, [두 번째 예시 코드](#앱-아이콘-변경하기)는 객체 지향적 프로그래밍 스타일을 따라 만들었다고 합니다.

# 미리 만들어둔 UI 파일과 연결하기
필자는 PyQt5 Designer를 써서 ui 파일을 먼저 만들어두고 시작하는 편입니다. 구글링을 해보니 보통 이런 경우에는 OOP 스타일로 UI 파일의 각 객체를 코드의 변수에 연결하여 사용한다고 합니다. ui 파일을 만들 때 모두 객체로 생성해서 그런 것 같습니다.
```python
    import sys
    from PyQt5.QtWidgets import *
    from PyQt5 import uic
    
    ui_file = uic.loadUiType("파일 이름.ui")[0]
    
    class MainWindow(QMainWindow, ui_file) :
        def __init__(self) :
            super().__init__()
            self.setupUi(self)
    
    if __name__ == "__main__" :
        app = QApplication(sys.argv) 
        w = MainWindow() 
        w.show()
    		sys.exit(app.exec_())
```
⚠ 이 때 사용하려는 ui 파일은 소스코드 파일과 같은 폴더 내에 있어야 합니다. 위 코드를 그대로 사용하시려면 `파일 이름` 부분을 본인이 만든 ui 파일 이름으로 바꿔주세요.

메인함수를 확인해봅시다. 아까와 동일하게 `QApplication` 을 만든 다음에 창을 지정해주고 있습니다. 이 때 사용한 constructor는 위에서 미리 정의해놓은 `MainWindow` 라는 클래스의 생성자입니다. 이 클래스를 만들 때 `ui_file` 이 필요하고, 이것은 미리 생성해둔 ui 파일을 불러온 것입니다.  
이렇게 연결을 하는데 성공했다면 이제 메인 루프에서 사용한 이벤트 핸들러를 정의할 차례입니다. 그러니까 유저가 클릭을 하거나 무언가 입력했을 때 프로그램이 어떻게 동작할 지 정해주는 것이죠.  
PyQt5에서는 여러가지 `virtual function`을 제공하고 있습니다. 이를 override해서 원하는 동작을 수행하도록 하면 됩니다. 예시로는 유저가 엔터키를 쳤을 때 호출할 핸들러를 만들어보았습니다.  
![e.g last](https://broccolism.github.io/assets/img/others/2020-04-03-3.JPG)
```python
    import sys
    from PyQt5.QtWidgets import *
    from PyQt5 import uic, QtCore
    
    ui_file = uic.loadUiType("dialog.ui")[0]
    
    class MainWindow(QMainWindow, ui_file) :
        def __init__(self) :
            super().__init__()
            self.setupUi(self)
    
        def keyPressEvent(self, event):
            if event.key() == QtCore.Qt.Key_Return:
                print("You pressed: Enter")
        
    if __name__ == "__main__" :
        app = QApplication(sys.argv) 
        window = MainWindow()
        window.show()
        sys.exit(app.exec_())
```