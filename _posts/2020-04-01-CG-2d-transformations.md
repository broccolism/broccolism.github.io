---
layout: post
title: "[CG] 2차원 변환 총집합! 2D Transformations"
categories: classes
tags: cg transforamtion translation affine matrix rigid linear graphics
commetns: true
use_math: true
---
## 순서
[1) 2D Transformations는 무엇일까](#2d-transformations-2차원-기하-변환)  
[2) Linear Transformation: 선형 변환](#linear-transformation-선형-변환)   
[3) 2D Translation: 평행이동](#2d-translation-평행이동)  
[4) Affine Transformation](#affine-transformation)  
[4-1) Rigid Transformation](#rigid-transformation)  
[5) Transformation 시 주의!](#be-cautious-composing-transformations)  
[6) Homogeneous Coordinates: 새로운 표현 방법](#homogeneous-coordinates)   

# 2D Transformations 2차원 기하 변환
= 도형을 이루는 점들의 집합을 다른 점들의 집합으로 일대일 대응 시키는 일종의 함수. 즉 어떤 도형의 모든 점을 옮기는 것이라고 보면 편하다.
- e.g) Translate(자리 이동), Rotate(회전), Scale(크기 변환), Shear(기울이기), Reflect(반사)
- 어디에 쓰이나요?
    - e.g) 움직임 표현, 이미지 및 사물 생성, 시점 변환 등등
- 어떻게 하나요?
    - 행렬을 사용하여 표현할 수 있습니다.

# Linear Transformation 선형 변환
transformation을 정의하는 한 가지 방법은 행렬 곱을 사용하는 것이다. 물론 모든 transformation을 나타낼 수는 없다. **행렬 곱으로 표현할 수 있는 변환**을 `Linear Transformation` 이라고 하며, 그 종류는 다음과 같다.
- [uniform scale: 가로, 세로 같은 비율로 크기 변환](#uniform-scale)  
- [non-uniform scale: 가로, 세로 다른 비율로 크기 변환](#nonuniform-scale)  
- [rotation: 회전](#rotation)  
- [shear: 기울이기](#shear)  
- [reflection: 반사](#reflection)  
(각 항목을 누르면 해당 항목에 대한 설명으로 바로 이동할 수 있다.)

---

### Uniform Scale
아래 그림처럼 가로, 세로 같은 비율로 크기를 조절하는 것을 말한다.

![uniform scale e.g.](https://broccolism.github.io/assets/img/CG/2020-04-01-1.jpg)

왼쪽의 R을 이루는 점들을 나타내는 어떤 행렬이 있었다고 하자. 그 행렬을 **M** 이라고 하면 아래 수식을 이용해 uniform scale로 1.5배 크기를 키울 수 있다.


$$
\begin{bmatrix} 1.5 & 0 \\ 0 & 1.5 \end{bmatrix}  \bullet M
$$


원리는 아래와 같다.


$$
\begin{bmatrix} 1.5 & 0 \\ 0 & 1.5 \end{bmatrix}  \bullet M
=\begin{bmatrix} 1.5 & 0 \\ 0 & 1.5 \end{bmatrix}  \bullet \begin{bmatrix} x \\ y \end{bmatrix}
=\begin{bmatrix} 1.5x\\ 1.5y \end{bmatrix}
$$


즉 내적을 이용해 원하는 스칼라 값만큼 원래 점들의 좌표값을 조절할 수 있는 것이다.

### Nonuniform Scale
가로, 세로 길이를 서로 다른 비율로 조절하는 것으로, 앞서 uniform scale을 보았다면 간단히 구현할 수 있다. 내적할 행렬에 서로 다른 스칼라 값을 주면 된다.

![nonuniform scale e.g.](https://broccolism.github.io/assets/img/CG/2020-04-01-2.jpg)

### 따라서 Scale function은


$$\begin{bmatrix} Scale_x & 0 \\ 0 & Scale_y \end{bmatrix}$$


위 행렬과 원래 행렬을 내적하면 만들 수 있다.
- `Scale_x`: x축 방향으로 몇 배 조정할까?
- `Scale_y`: y축 방향으로 몇 배 조정할까?

---

### Rotation
삼각함수를 씁니다. 와! 점점 신나죠? 원리는 다음과 같아요.

![rotation](https://broccolism.github.io/assets/img/CG/2020-04-01-3.jpg)

원래 극 좌표계에서 x축, y축은 각각 수평, 수직인데 이 두 축을 회전함으로써 원래 도형 역시 회전시키는 효과를 얻을 수 있다. (1, 0)을 base vector로 갖고 있었던 x축을 **반시계 방향**으로 \theta만큼 회전시키면 위에서 알 수 있듯이 (cos\theta, sin\theta)라는 vector를 갖게 된다. 마찬가지로 (0, 1)이 base vector였던 y축을 회전시키면 (**-sin\theta**, cos\theta)가 새로운 base vector가 된다. 이를 수식으로 나타내면 다음과 같다.  


$$
\begin{bmatrix} cos\theta & -sin\theta \\ sin\theta & cos\theta \end{bmatrix}
\bullet \begin{bmatrix} x \\ y \end{bmatrix}
= \begin{bmatrix} xcos\theta - ysin\theta \\ xsin\theta + ycos\theta \end{bmatrix}
$$


---

### Shear
*이렇게 글자의 기울임꼴 역시 이와 같은 원리로 만들어진게 아닐까요?*
기울이기! 역시 내적으로 표현할 수 있다. 굉장해


$$
\begin{bmatrix} 1 & a \\ 0 & 1 \end{bmatrix}
 \bullet \begin{bmatrix} x \\ y \end{bmatrix}
= \begin{bmatrix} x + ay \\ y \end{bmatrix}
$$


우항을 잘 뜯어보면, `y = 0` 일 때에는 `x = x'` 이다. 변화가 없다는 뜻이다. 하지만 만약 a > 0 이라면 y가 커질수록 x값도 커진다. 즉, 기존 x 좌표보다 Shear function 적용 후의 x좌표가 크다는 소리고 그 뜻은 오른쪽으로 더 이동했다는 뜻이다. 오른쪽으로 기울어진 것이다. 그리고 그 기울어지는 정도는 위로 갈수록 점점 심애진다. y좌표가 커지면 `x + ay` 값 역시 커지기 때문이다.

![shear e.g.](https://broccolism.github.io/assets/img/CG/2020-04-01-4.jpg)

이 원리를 적용해서 대문자 R을 사방으로 밀 수 있을 것이다. **오른쪽**으로 미려면 위와 같이 a 자리에 양수를 넣으면 되고, **왼쪽**으로 미려면 shear function 적용 후의 x좌표 값이 작아질 수 있도록 a 자리에 음수를 넣으면 된다. **위쪽**으로 미려면 내적해준 행렬의 `0` 자리, 즉 2행 1열에 양수를 넣으면 되고 **아래쪽**으로 미려면 같은 자리에 음수를 넣어주면 된다.

---

### Reflection
말이 reflection이지, 사실 위에서 나온 function에 넣어주는 값만 달라지면 reflection이 된다. 바로 scale function이다.


$$
\begin{bmatrix} Scale_x & 0 \\ 0 & Scale_y \end{bmatrix}
$$


일단 크기 자체는 바꾸고 싶지 않을테니 `Scale_x` , `Scale_y` 의 절댓값은 각각 1이다. 그리고 각 사분면에서의 x, y 부호에 따라 sign만 잘 지정해주면 된다.
- x축 반사: `Scale_x` = 1, `Scale_y` = -1
- y축 반사: `Scale_x` = -1, `Scale_y` = 1
- x축 반사 + y축 반사(원점 대칭): `Scale_x` = -1, `Scale_y` = -1

---

# 2D Translation 평행이동
은 `Linear Translation` 이 아니다. 앞서 말했듯이 Linear Transformation은 행렬곱으로 나타낼 수 있어야 하는데 평행이동은 그걸로는 도저히 나타낼 수 없기 때문이다. 대신 `벡터 합` 을 이용해 간단히 나타낼 수 있다.

![2d translation](https://broccolism.github.io/assets/img/CG/2020-04-01-5.jpg)

너무 간단하니 수식은 생략. 중요한건 평행이동은 Linear Transformation에 속하지 않는다는 사실이다.

---

# Affine Transformation
= Linear Transformation + 2D Translation
즉 수식으로 요약하자면 다음과 같다.

*v*, *u*, 이 각각 벡터이고 *M* 이 행렬일 때
- Linear Transformation: T( *v* ) = *Mv*
- 2D Translation: T( *v* ) = *v* + *u*
- Affine Transformation: T( *v* ) = *Mv* + *u*

한글로는 아핀 변환, 어파인 변환이라고 읽는다. 이 변환의 성질은 다음과 같다.
1. Preserves Lines
    - 어떤 line에 affine 변환을 적용하면 결과는 항상 line이다.
    - line → point, line → curve 같은 경우는 없다는 의미이다.
2. Preserves parallel lines
    - affine 변환을 적용하기 전에 서로 평행했던 직선들은 적용 후에도 여전히 평행하다.
3. Preserves ratios of distance along a line
    - affine 변환을 적용하기 전에 직선들이 어떤 관계(비율)를 갖고 있었다면 적용 후에도 유지된다.
이 세가지 성질을 잘 들여다보면 사실 `linear transformation` 에서도 마찬가지임을 알 수 있다. 즉 affine transformation의 성질은 linear transformation에서 비롯된 것이라고 할 수 있다.

# Rigid Transformation
여기, 또다른 변환이 있다.

- Rigid Transformation: T( *v* ) = *Rv* + *u*

*M*이 *R*이 되었다는 것을 빼면 affine transformation의 수식과 완벽히 같다. 여기서 *R* 은 rotation matrix이다. 즉 위에서 보았던 linear transformation의 한 종류였던 rotation을 translation과 함께 적용한 것을 rigid transformation이라고 부르는 것이다.

성질은 다음과 같다.
1. Preserves distances between all points
    - 각 점들 사이의 거리가 모두 유지된다.
2. Preserves cross product for all vectors
    - cross product는 벡터곱, 즉 외적이다. 이게 preserve 된다는 말은 곧 reflection이 일어나지 않는다는 뜻이다.

사실 `또다른 변환` 이라고 하긴 했지만 rigid transformation은 `affine transformation의 subset` 이다. 그 중에서도 rotation을 적용하는 경우에는 도형의 형태가 완벽히 유지되기 때문에 따로 구분짓는게 아닌가 싶다.

---

# Be Cautious Composing Transformations
about the ORDER!
행렬의 내적은 마치 함수처럼 오른쪽부터 먼저 연산된다. 무슨 뜻인가 하면...


$$
\begin{aligned}
   &(S \bullet  T)(p) = M_SM_Tp = (M_SM_T)p = M_S(M_Tp)\\
   &where\;T(p)=M_T\;and\;S(p)=M_S
\end{aligned}
$$


그리고 아래 성질도 주의해야 한다.

A, B, C가 행렬일 때,
- (AB)C = A(BC)
- AB ≠ BA

---

# Homogeneous Coordinates
위처럼 곱연산, 합연산을 이용해 변환을 나타낼 수도 있지만 훨씬 더 간단한 방법이 있다. 바로 2차원 점을 3차원 행렬을 이용해 나타내는 것! `Homogeneous Coordinates` 는 `n차원` 좌표를 `숫자 n + 1개` 를 써서 표현하는 방식을 말한다.
이 때 2차원 상의 점 [x, y] 는 [x, y, 1]처럼 마지막에 항상 1을 넣어 표현할 수 있다.

### Linear Transformations in Homogeneous Coordinates


$$
\begin{bmatrix}a&b&0\\c&d&0\\0&0&1\end{bmatrix} \bullet \begin{bmatrix}x\\y\\1\end{bmatrix}=\begin{bmatrix}ax+by\\cx+dy\\1\end{bmatrix}
$$


그러니까 위에서 원래 좌표와 내적했던 행렬을 이제는 저 a, b, c, d에 나타내면 된다. 그러면 동일한 결과를 얻을 수 있다.

### Translations in Homogeneous Coordinates


$$\begin{bmatrix}1&0&t\\0&1&s\\0&0&1\end{bmatrix} \bullet \begin{bmatrix}x\\y\\1\end{bmatrix}=\begin{bmatrix}x+t\\y+s\\1\end{bmatrix}$$


평행이동을 위해 더해줬던 값 역시 하나의 행렬 안에 같이 넣을 수 있게 되었다. t, s에 각각 x축, y축 방향으로 얼마나 이동할지를 적으면 된다.

### Affine Transformatinos in Homogeneous Coordinates

![affine_homo](https://broccolism.github.io/assets/img/CG/2020-04-01-6.jpg)

결론적으로 affine transformation은 위와 같이 나타낼 수 있다. 아주 깔끔하게! 그리고 이전과 달리 **consistent**하게 다룰 수 있다!
- **consistent** 하다는 뜻은...
    - homogeneous coordinates를 쓰기 전에는 transformation은 곱셈, translation은 덧셈을 이용해 각자 다른 방식을 사용해서 나타내야 했다.
    - 하지만 이 방법을 사용하면 그저 3차원 행렬을 내적한다! 라는 한가지 방식만으로 두가지 모두를 나타낼 수 있는데
    - 이를 두고 하는 말이다.