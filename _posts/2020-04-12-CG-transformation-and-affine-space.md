---
layout: post
title: "[CG] 3차원 변환/OpenGL transformation function/affine space"
categories: classes
tags: cg transforamtion openGL graphics affine current
commetns: true
use_math: true
---
## 순서
[1) 3차원 affine transformation](#3d-affine-transformation)  
[2) 우리가 그린 객체에 OpenGL이 항상 붙이는 친구](#opengl-current-transformation-matrix)  
&nbsp;&nbsp;&nbsp;&nbsp;[2-1) current transformation matrix 사용](#using-current-transformation-matrix)  
[3) 두 가지 변환 방식의 성능 비교](#performance-comparison-for-transformation)  
[4) 새로운 공간: Affine Space](#affine-space)  
&nbsp;&nbsp;&nbsp;&nbsp;[4-1) 사실 지금까지 해왔던 일은...](#in-homogeneous-coordinates)  

# 3D Cartesian Coordinate System
삼차원 직교 좌표계는 Right-handed, Left-handed Cartesian Coordinates 이렇게 두가지가 있다. 그 중 OpenGL이 쓰는 건 Right-handed Cartesian Coordinates이다.
- 참고로 Right-handed가 물리/수학적 standard이기도 하고 Maya에서도 이를 쓴다.
- Left-handed를 쓰는 대표적인 프로그램은 Unity가 있다.
2D point를 표현할 때 3개의 값(x값, y값, 그리고 마지막 1)을 썼듯이 3D point를 표현할 때에는 4개의 값(x값,  y값, z값, 그리고 마지막 1)을 사용하면 된다.

# 3D Affine Transformation
2D 때와 굉장히 유사하다. homogeneouse coordinates를 사용하면 아래와 같은 형식으로 사용할 수 있다.


$$
\begin{bmatrix} l_{11} & l_{12} & l_{13} & t_{x}\\ l_{21} & l_{22} & l_{23} & t_{y}\\ l_{31} & l_{32} & l_{33} & t_{z}\\ 0 & 0 & 0& 1\end{bmatrix}
$$


- `l`로 표현된 부분은 linear transformation, `t`로 표현된 부분은 translation을 위한 부분이다.

### Scale


$$
\begin{bmatrix} S_x & 0 & 0 & 0\\ 0 & S_y & 0 & 0\\ 0 & 0 & S_z & 0\\ 0 & 0 & 0& 1\end{bmatrix}
$$


x, y, z 값에 Scale을 적용하려면 각각 `Sx`, `Sy`, `Sz` 자리를 사용하면 된다. 이를 실제 코드에서 구현할 때에는 좀 더 편하게 `np.identity(4)`를 만든 다음, 필요한 값만 바꾸면 될 것이다.

### Shear


$$
\begin{bmatrix} 1 & d_y & d_z & 0\\ 0 & 1 & 0 & 0\\ 0 & 0 & 1 & 0\\ 0 & 0 & 0& 1\end{bmatrix}
$$


위 예시는 x축을 기준으로 y, z 방향으로 기울이는 동작을 한다. 위 행렬을 실제 점을 나타내는 행렬과 내적하면 `x' = x + dy * y + dz * z` 가 되고 나머지 y, z값은 그대로이기 때문이다.

### Rotation
rotation의 경우에는 주의할 점이 있다. 이제는 총 3개의 축을 기준으로 회전할 수 있고 그에 따라 적용해야 할 행렬도 다르기 때문이다. 아래 예시는 모두 한 점을 θ만큼 반시계방향으로 돌리는 것이다.
- x축 기준 회전


$$
\begin{bmatrix} 1 & 0 & 0 & 0\\ 0 & cos\theta& -sin\theta & 0\\ 0 & sin\theta& cos\theta& 0\\ 0 & 0 & 0& 1\end{bmatrix}
$$


&nbsp;가만히 살펴보면 x 값은 절대 바뀌지 않는다.
&nbsp;x축을 기준으로 회전시키면 x값은 그대로이고 y, z값만 바뀌어야 정상이다.
- y축 기준 회전


$$
\begin{bmatrix} cos\theta & 0 & sin\theta & 0 \\ 0 & 1 & 0 & 0\\ -sin\theta & 0 & cos\theta& 0\\ 0 & 0 & 0& 1\end{bmatrix}
$$


- z축 기준 회전


$$
\begin{bmatrix} cos\theta & -sin\theta & 0 & 0\\ sin\theta & cos\theta& 0 & 0\\ 0 & 0 & 1 & 0\\ 0 & 0 & 0& 1\end{bmatrix}
$$


*(2020.04.26 추가)*
위의 연산은 기준이 되는 축을 제외한 나머지 축으로 만든 평면을 내려다보았을 때, 반시계방향으로 회전시키는 효과를 낸다.
![x](https://broccolism.github.io/assets/img/CG/2020-04-26-1.jpg){: width = "50%"}
![y](https://broccolism.github.io/assets/img/CG/2020-04-26-2.jpg){: width = "50%"}
![z](https://broccolism.github.io/assets/img/CG/2020-04-26-3.jpg){: width = "50%"}
*(여기까지)*


rotation을 구현할 때에도 마찬가지로 `np.identity(4)`를 먼저 만든 다음에 필요한 부분만 수정하면 된다. 이 때 slicing을 활용하면 편하다.
```python
R = np.identity(4)
R[:3, :3] = [[1., 0., 0.],
                            [0., np.cos(angle), -np.sin(angle)],
                            [0, np.sin(angle), np.cos(angle)]]
```

### Translation
translation 역시 numpy array가 제공하는 slicing을 이용해 간편하게 구현할 수 있다. 점들을 (4, 0, 2)만큼 평행이동 시키고 싶다면 아래 행렬을 내적해주면 된다.
```python
T = np.identity(4)
T[:3, 3] = [.4, 0., .2]
```

---

# OpenGL Transformation Functions
> OpenGL is a "state machine".

어떤 state를 위해 한번 설정한 value는 이후 그 값을 바꾸기 전까지 계속 유지된다.
- e.g) current color
- e.g) **current transformation matrix**
    - OpenGL의 `context`는 메모리 어딘가에 항상 **current transformation matrix**를 저장해둔다.

## OpenGL Current Transformation Matrix
= OpenGL이 객체를 그릴 때 ***항상*** 사용하는 행렬!
- 객체를 이루는 점들의 집합 `P`가 있다고 하자.
- OpenGL의 current transformation matrix를 `C` 라고 하면,
- OpenGL은 ***항상***  `C`와 `P`의 내적인 `CP` 를 화면에 그려준다.
    - 여기서 OpenGL function name format 의 일부를 이해할 수 있다.
    - 매번 `C`를 만들어 주어진 점들의 집합과 내적해야 하기 때문에 `C`가 몇 차원 행렬인지를 정할 필요가 있었을 것이다.
    - 그래서 `glVertext3f` 의 `3` 처럼 몇차원짜리 점인지 먼저 알려주어야 하지 않았을까?

### Setting Current Transformation Matrix
- `glLoadIdentity()`: current transformation matrix를 **identity matrix**로 셋팅한다.
    - current transformation matrix가 identity matrix가 되면 모든 오브젝트는 아래와 같은 Normalized Device Coordinate(NDC) 공간 상에 그려지게 된다.
    ![normalized device coordinate](https://broccolism.github.io/assets/img/CG/2020-04-12-1.jpg){: width="50%"}

- parameter를 이용해 affine transformation과 같은 효과를 주는 행렬로 셋팅할 수도 있다.
    - `glScale*()`
        - e.g)  `glScalef(2., .5, 0.)`
    - `glRotate*()`
        - e.g) `glRotatef(60, 1, 0, 0)`
            - argument1: **angle** of rotation ***in degrees*** (not radian)
            - argument 2, 3, 4: represents x, y, z axis
                - 위의 예시는 x축 자리가 1이므로 x축 기준으로 60도 rotation이 일어난다.
    - `glTranslate*()`
        - e.g) `glTranslatef(1., 0., 4.)`
            - 각각의 argument는 x, y, z축 방향으로 이동할 거리를 의미한다.
    - 위의 세 함수들은 current matrix C의 우측에 위치해 내적된다.
        - 위 함수를 수행하면 `C = SC`가 아니라 `C = CS`가 된다는 뜻이다.
            - 즉, 여러개의 함수를 실행시키면 마지막에 부른 함수가 만드는 효과가 가장 먼저 적용된다.
    - 단, *Shear*와 *Reflect*를 수행하는 함수는 없다.

- current transformation matrix를 직접 셋팅하려면 아래 함수를 이용하면 된다.
    - `glMultMatrix*(M)`: current transformation matrix에 M을 곱한다.(내적)
        - `C = CM`
        - 이 때 주의할 점! `M`은 **column-major** matrix이다.
            ![column-major matrix](https://broccolism.github.io/assets/img/CG/2020-04-12-2.jpg)

        - 하지만 `np.array`를 이용해 만든 행렬은 **row-major** matrix이다.
        - 그래서 `np.array`로 만든 `M`을 인자로 주려면 아래와 같이 `M`을 transpose한 `M.T`를 줘야 한다.

```python
R = np.identity(4)
R [:3, :3] = [[1., 0., 0.],
              [0., np.cos(angle), -np.sin(angle)],
              [0., np.sin(anlge), np.cos(anlge)]]

T = np.identity(4)
T[:3, 3] = [.4, 0, .2]

glMultiMatrixf((R @ T).T)
```

### Using Current Transformation Matrix

- ver.1: with current matrix

```python
# ver.1
def render():
    glColor3ub(255, 255, 255)
    glScalef(2., .5, 0.)

    glBegin(GL_TRIANGLES)
    glVertex3fx(np.array([.0, .5, 0.]))
    glVertex3fx(np.array([.0, .0, 0.]))
    glVertex3fx(np.array([.5, .0, 0.]))
    glEnd()
```

- ver.2: without current matrix

```python
# ver.2
def render():
glColor3ub(255, 255, 255)

S = np.identity(4)
S[0, 0] = 2.
S[1, 1] = .5
S[2, 2] = 0.

glBegin(GL_TRIANGLES)
glVertex3fv((S @ np.array([.0, .5, 0., 1.]))[:-1])
glVertex3fv((S @ np.array([.0, .0, 0., 1.]))[:-1])
glVertex3fv((S @ np.array([.5, .0, 0., 1.]))[:-1])
glEnd()
```

두 버전은 서로 같은 삼각형을 화면에 띄워주고 있다. 차이점은 다음과 같다.
- ver.1: current matrix를 바꾸었기 때문에 사실상 화면의 모든 오브젝트에게 Scale 효과가 적용되고 있다.
    - 만약 이 코드 아래에 계속해서 사각형을 렌더링하는 코드를 적는다면 해당 사각형도 Scale 효과가 적용된 상태로 그려질 것이다.
- ver.2: 삼각형을 렌더링 할 때 그 삼각형에만 직접 Scale 효과를 적용하고 있다.

current matrix를 바꿀 때 한가지 기억할 점은 **순서**이다. OpenGL Transformation Functions를 call한 순서와 객체의 점 집합에 가해지는 transformation의 순서는 **반대**이다. 예를 들어 아래 코드를 실행시키면..

```python
glTranslaftef(x, y, z) # T라고 하자.
glRotatef(angle, x, y, z) # R이라고 하자.
glBegin(GL_TRIANGLES)
...                    # P라고 하자.
glEnd()
```

current matrix는 아래와 같이 변경된다.
`C = TR`
그리고 변경된 current matrix는 `P`와 내적되어 아래 결과를 만들어낸다.
`P'(실제 렌더링 되는 점 집합)` = `CP(기존 점 집합)` = `TRP`
따라서 `P`는 **먼저 rotate 된 후에 translate됨**을 알 수 있다.

---

# Performance Comparison for Transformation
transformation의 가장 근본적인 아이디어는 아래와 같다.
> 원래 있던 모든 점들을 어떤 행렬 M과 내적하자!

이를 구현하기 위해서 지금까지 2가지 방법을 살펴보았다.
1. numpy matrix를 점에 직접 곱해서 그리기
    - CPU가 연산을 수행한다.
2. OpenGL transformation function으로 current matrix를 바꾸기
    - GPU가 연산을 수행한다.

CPU는 적은 양의 연산을 빠르게 수행할 수 있다는 장점이 있다. 이에 비해 GPU는 적은 양의 연산보다 대량 연산에 특화된 장치이다. 따라서 실제 상업용 게임에서는 1번과 같은 방법을 절대 쓰지 않는다. 속도가 너무 느리기 때문이다.

그렇다고 2번을 쓰는 것도 아니다. 물론 1번보다는 2번이 훨씬 빠르지만, 여전히 vertex call을 여러번 해야 하기 때문에 우리가 원하는만큼의 속도가 나오지 않는다. 실제 상업용 게임에서는 `vertex array`를 사용한다고 한다. 이에 대해서는 다음 시간에 다룰 예정이다.

---

---

# Affine Space

지금까지 우리는 vector space를 사용했다.
- 벡터 합, 스칼라값과 백터의 곱 연산을 갖는 **벡터의 집합**
    - 벡터의 linear combination 역시 벡터로 보존된다.
- point 개념이 없음. (모두 원점에서 시작하는 벡터로 표현)

하지만 affine space에서는 벡터가 아닌 점들에 초점을 맞춘다.
- Superset of vector space
- 두 점의 차, 벡터와 점의 합 연산을 갖는 **점의 집합**
- vector뿐만 아니라 point 개념을 가지고 있으며 관련 연산을 수행할 수 있다.

# Coordinate-Free Geometric Operations
Coordinate-Free: 좌표가 없는, 즉 원점이 존재하지 않는다는 뜻이다. 이런 공간에서 수행할 수 있는 연산은 총 세가지가 있다. 1. Addition 2. Subtraction 3. Scalar muliplication. 모두 *원점*의 존재와는 관련없이 해왔던 연산들이다.

## Operations
### Addition
- 벡터 + 벡터 = 벡터
- 점 + 벡터 = 점
- 점 + 점 = (수행 불가!)
### Subtraction
- 벡터 - 벡터 = 벡터
- 점 - 벡터 = 점 (점 p - 벡터 w의 경우, 벡터 w와 정확히 반대 방향을 갖고 크기가 같은 벡터를 점 p에 더한다고 생각하면 이해하기 편하다.)
- 점 - 점 = 벡터
### Scalar Multiplication
- 스칼라 • 벡터 = 벡터
- 스칼라 • 점: 스칼라값에 따라 달라진다.
    - 1 • 점 = 점
    - 0 • 점 = 벡터
    - (1, 0 이외의 스칼라값) • 점 = (수행 불가!)
        - 1, 0이 아닌 다른 상수를 곱하려면 원점이 필요하기 때문에 정의되지 않은 연산이 된다.

## Affine Frame
- frame은 vector들의 집합과 한 점으로 정의된다.
    - 벡터의 집합은 다른 벡터들의 base로 쓰이며 각각 서로 다른 독립적인 벡터들로 구성된다.
    - 한 점은 프레임의 원점 역할을 한다.
        - 그러니까 직교 좌표계에 있던 *원점*의 역할을 하는 점이라고 보면 된다.
    - 위의 두가지 요소를 이용하면 벡터와 점을 모두 정의할 수 있다.
        - point p = o(원점) + c1v1 + c2v2 + ... cnvn
        - vector v = c1v1 + c2v2 + ... cnvn

## In Homogeneous Coordinates
지금까지 2차원 점을 다루기 위해서는 3차원 값을, 3차원 점을 다루기 위해서는 4차원 값을 사용했다. 특히 점을 나타내기 위해서는 x, y, z 좌표 값을 나타내는 값 외에 1을 더 적어주었다. 그 이유가 바로 여기서 나온다.  
❕ 앞서 말한 affine space의 점, 벡터를 표현하고 있었기 때문이다!  
homogeneous coordinates에서 두 요소를 표현하려면 아래와 같이 나타내면 된다.
- point: (x, y, z, 1)
- vector: (x, y, z, 0)
끝에 정의한 1, 0 덕분에 우리는 위에서 정의한 연산을 안전하게 수행할 수 있다. 아래 수식들을 보자.
![eg1](https://broccolism.github.io/assets/img/CG/2020-04-12-3.jpg){: width="85%"}

점 + 점은 앞서 살펴보았듯이 정의되지 않은 연산이다. 이 표현법을 사용하는 상태에서 두 점을 더해버리면 맨 끝 값이 2가 되어버리는데 이는 점도 벡터도 아닌 아무 의미 없는 무언가가 되어버린다. 따라서 점과 점의 합을 막을 수 있다. 반면 점 - 점은 벡터, 점 + 벡터는 점으로 정의했는데 이 경우 0, 1이 아주 깔끔하게 맞아떨어지는 것을 볼 수 있다.

affine transformation도 이 덕분에 무사히 수행할 수 있었다.
![eg2](https://broccolism.github.io/assets/img/CG/2020-04-12-4.jpg){: width="85%"}

아래처럼 affine transformation을 점에다 적용한 결과는 여전히 점이고, 벡터에 적용한 결과는 여전히 벡터임을 알 수 있다. 게다가 벡터에는 translation이 적용되지 않은 것도 확인할 수 있다! 벡터는 점과 점의 **차이**이지, 특정 위치를 나타내는 것이 아니기 때문에 translation이 적용되지 않는다.