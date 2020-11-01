---
layout: post
title: "[CG] OpenGL glfw mouse drag event"
categories: study
tags: study 2020-1 cg graphics opengl glfw mouse drag event
commetns: true
---

과제를 하던 도중 큰 문제가 발생했다. 마우스를 상하좌우 방향으로 드래그해서 화면을 이동할 수 있어야 했는데, 마우스 **드래그** 이벤트를 받는 방법을 전혀 모르고 있었다! 지금 실습 때 쓰는 라이브러리가 glfw라는 오래된 친구라 구글링을 아무리 해도 나오질 않았다. 나온다 해도 모두 404 not found만을 보여주는 웹페이지 뿐이었다...  
그러던 중 교수님이 준 예제 코드를 설명하실 때 "이거 사용하면 웬만한건 다 될거에요.ㅎㅎ"라고 말씀하셨던게 문득 떠올라서 그 코드만 열심히 노려보고 있었다.

처음 내가 하려던건 아래와 같다.

```python
def main():
    # ...
    glfw.make_context_current(window)
    glfw.set_key_callback(window, keyCallback)
    glfw.set_mouse_button_callback(window, buttonCallback)
    glfw.set_cursor_pos_callback(window, cursorCallback)
    # ...

def buttonCallback(window, button, action, mod):
    global gMouse, gPos, gCamHeight
    if button == glfw.MOUSE_BUTTON_MIDDLE:
        if action == glfw.PRESS or action == glfw.REPEAT:
            pos_y = glfw.get_cursor_pos(window)[1]
            if pos_y < gPos[1]:
                gCamHeight += -.1
            elif pos_y > gPos[1]:
                print("up")
                gCamHeight += .1

def cursorCallback(window, xpos, ypos):
    global gPos
    gPos = (xpos, ypos)
```
- cursorCallback 함수에서 항상 마우스 커서의 위치를 저장한다.
- buttonCallback 함수에서 마우스 휠을 클릭하면 그 위치를 받아와 마우스 휠을 누른 바로 그 시점에서의 y좌표와 `gPos`에 저장된 y좌표를 비교한다.
- "바로 그 시점"의 y 좌표가 더 작으면 카메라 시점을 감소시킨다.
    - 더 크면 반대로!

이 방식의 가장 큰 문제점은 **mouse event의 `glfw.REPEAT` 상태는 없다**는 것이었다.ㅋㅋ. stack overflow의 누군가가 말해줬다. 이 부분에서 이 문제가 "큰 문제"라고 생각했던 것이다. 드래그 효과를 주려면 계속해서 마우스 커서의 움직임을 따라가야하는데 repeat이 안된다니? 그럼 어떻게 해야 하지!?  
실제로 위의 코드에 `print`문을 넣어서 출력해보면 마우스를 처음 클릭했을 때 딱 한번만 출력이 되고 계속 꾹 누르고 있을 때에는 아무런 일도 일어나지 않았다.  
게다가 **cursorCallback**과 **buttonCallback**이 거의 동시에 수행되기 때문에 `pos_y < gPos[1]`의 효과는 프로그램 실행 직후 딱 한 번 말고는 효력이 없었다. 저 두 변수는 항상 같은 값을 저장하고 있었기 때문이다.  
또다시 구글링을 하고 또다시 구글링에 실패하여 코드를 노려보던 중 한가지 방법이 떠올랐다. 두 함수의 역할을 바꾸는 것이다. 이전까지는 **cursorCallback**이 마우스 커서의 위치를 저장하고 **buttonCallback**이 마우스 클릭 여부를 판단했다.
- 하지만 마우스의 위치를 계속해서 추적할 수 있는 함수는 **cursorCallback**이다. 
    - `glfw.set_cursor_pos_callback(window, cursorCallback)` 이렇게 해주었으니까!
    - 그러면 이 함수에서 마우스 드래그를 시도 중인지 확인하고
    - **buttonCallback**에서 마우스 위치를 추적하기로 했다.

```python
def buttonCallback(window, button, action, mod):
    global gMouse
    if button == glfw.MOUSE_BUTTON_MIDDLE:
        if action == glfw.PRESS:
            gMouse = 1
        elif action == glfw.RELEASE:
            gMouse = 0
            
def cursorCallback(window, xpos, ypos):
    global gMouse, gCamHeight
    if gMouse == 1:
        #print(1)
        cur_y = glfw.get_cursor_pos(window)[1]
        if  cur_y < ypos:
            gCamHeight += -.01
        elif cur_y > ypos:
            gCamHeight += .01
```

결과는 아주 만족스러웠다. 드래그가 부드럽게 잘 된다!
그런데 한가지 이상한 점은 주석처리해놓은 `print(1)`이 있으면 잘 되고 없으면 굉장히 버벅거린다는 점이다... 이제 남은 이 문제를 해결해야겠다.

*(2020.04.27 21:33 추가)*
고작 프린트문 하나 추가했다고 해서 결과가 완전히 달라지는게 이해가 안 되어서 결국 조교님께 메일을 드렸다. 원인은 바로 print문이 만들어내는 delay였다!  
cursorCallback 함수가 `ypos`를 받을 때 `glfw.get_cursor_pos`와 거의 동시에 그 위치를 받는데 중간에 print문이 껴있으면 print문의 실행을 위해 잠깐의 시간 차이가 생겼던 것이다. 애초에 제대로 동작하지 않는 코드였는데 우연히 print문이 들어가서 잘 작동되는 것처럼 보였던 셈이다.  
그래서 대신 코드를 아래처럼 수정하면...

```python
# buttonCallback
if action == glfw.PRESS:
    gMouse = 1
    gPos = glfw.get_cursor_pos(window)
elif action == glfw.RELEASE:
    gMouse = 0
            
#cursorCallback
if gMouse == 1:
    if  gPos[1] < ypos:
        gCamHeight += -.01
    elif gPos[1] > ypos:
        gCamHeight += .01
```

잘 작동한다!
~~역시 대학원은 아무나 가는게 아니야..~~