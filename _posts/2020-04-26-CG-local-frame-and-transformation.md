---
layout: post
title: "[CG] Local Frame & 3차원 변환을 바라보는 관점"
categories: classes
tags: cg transforamtion openGL graphics affine local global frame cooridnate
commetns: true
use_math: true
---
## 순서
[1) "좌표계" 이야기](#coordinate-system-and-reference-frame)  
[2) 3차원 변환의 순서 다시보기](#interpretation-of-a-series-of-transformations)  
&nbsp;&nbsp;&nbsp;&nbsp;[2-1) 내적의 순서 다시보기](#left-and-right-multiplication)  

# Coordinate System and Reference Frame
### Terms
- **coordinate system**: 수학적인 개념. 관찰한 것을 어떤식으로 기술하냐의 문제.
    - 좀 더 general한 의미로 쓰인다.
- **reference frame**: 물리적인 개념. 관찰자의 기준이 되는 좌표계.
- coordinate system이 reference frame 안에 있는 각 움직임을 어떻게 표현할 것인지 결정한다고 생각하면 된다.
- 하지만 이 두가지 용어는 자주 혼용되어 쓰이기 때문에 엄청 엄격하게 구분할 필요는 없다고 한다.

## Global and Local Coordinate System
- **global coordinate system**(= **global frame**): **world**에 붙어있는 좌표계.
    - **world coordinate system**, **fixed coordinate system**이라고도 부른다.
- **local coordinate system**(= **local frame**): 움직이는 물체에 붙어있는 좌표계.

---

# Meanings of an Affine Transformation Matrix
앞서 배웠던 affine transformation matrix를 해석하는 방법은 무려 3가지나 된다. 하나씩 살펴보자.

### Transforms a Geometry with respect to Global Frame
affine transformation matrix를 어떤 object에 내적한다는 것은 해당 object를 **global frame**에 대해 affine transformation을 수행한다는 것과 같다고 해석하는 방법이다. 지금껏 생각해오던 방식이다.

### Defines an Affine Frame with respect to Global Frame
이 방법은 새로운 방식이다. 어떤 object에 transformation을 수행한다는 것을 *해당 object의 **local frame**을 움직히는 것*이라고 생각한다.

![pic 1](https://broccolism.github.io/assets/img/CG/2020-04-26-4.jpg)

즉, affine transformation matrix M이 새로운 local frame이 된다고 보는 것이다. 이 때 각 열은 차례대로 x, y, z축 벡터와 원점을 의미한다.
- 지난 시간에 보았던 "벡터는 0, 점은 1로 표현"한다는 법칙이 완벽하게 들어맞는다!

### Transforms a Point Represented in an Affine Frame to the Point Represented in Global Frame
global frame에 점 P가 하나 있다고 하자. 이 방식에서는 affine transformation을 수행하면 그 점 P를 global frame에 대해 transformation을 한 것이라고 해석한다.
- 잘 생각해보면 결국 첫 번째와 똑같은 소리이다.

# Interpretation of a Series of Transformations
아래와 같은 affine transformation matrix가 있다고 하자.

```python
M = T(x, 3) @ R(-90)
```

**[global frame을 기준으로 해석]**
![global](https://broccolism.github.io/assets/img/CG/2020-04-26-5.jpg)

`T(x, 3)`은 x축으로 3만큼 평행이동, `R(-90)`은 시계 반대 방향으로 -90도만큼 회전시키는 행렬이다. 앞서 우리는 이렇게 생긴 `M`을 어떤 점 p와 내적하면 rotation이 먼저 수행된 후 translation이 되는 것으로 배웠다. 

**[local frame을 기준으로 해석]**
![local](https://broccolism.github.io/assets/img/CG/2020-04-26-6.jpg)

하지만 이를 왼쪽에서부터 순서대로 해석할 수 있는 방법이 있다! 바로 **local frame을 기준으로 하면** 위의 행렬은 translation을 한 후 rotation을 수행하는 행렬이 된다. 지금까지 우리가 써왔던 해석 방식은 **global frame**을 기준으로 했을 때의 얘기였던 것이다!

### Standing at the Local Frame

```python
p' = M1 @ M2 @ M3 @ M4 @ p
```

이 코드는 어떻게 해석할 수 있을까? 생각보다 많은 방법이 있다.

![first](https://broccolism.github.io/assets/img/CG/2020-04-26-7.jpg)

`M1 @ M2 @ M3`을 global frame에 대해 수행했을 때의 모습을 {3}이라고 하면 이렇게 볼 수 있다. {3}에 서서 {4}에 있는 점 p를 바라보는 것. 그러면 이 때 p'는 `M4 @ p`가 된다.

![second](https://broccolism.github.io/assets/img/CG/2020-04-26-8.jpg)

`M1`만 global frame에 수행했을 때의 모습을 {1}이라고 하면 이렇게 보인다. {1}에 서서 {4}에 있는 점 p를 바라보는 것. 그러면 이 때 p'는 `M2 @ M3 @ M4 @ p`가 된다.

![third](https://broccolism.github.io/assets/img/CG/2020-04-26-9.jpg)

마침내 `p' = M1 @ M2 @ M3 @ M4 @ p`을 모두 수행하면, global frame인 {0}에 서서 p를 바라보는 것이 된다. 지금까지의 이야기는 모두 내적 연산을 오른쪽부터 왼쪽으로 해석한 결과이다. global frame에서 서서 바라보는 모습은 위의 과정과 반대가 된다.

### Left and Right Multiplication
- **left multiplication**


$$
p' = RTp
$$


위의 경우 p가 **left-multiplication by R**되었다고 말한다.

- **right multiplication**


$$
p' = TRp
$$


위의 경우 p가 **right-multiplication by R**되었다고 말한다.

지금까지 한 것을 바탕으로, 우리는 행렬의 내적을 두가지 관점으로 바라볼 수 있다. 아래 코드는...

```python
p' = RTp
```

1. 점 p를 global frame에 대해 T를 적용한 다음 R을 적용
2. 점 p를 local frame에 대해 R을 적용한 다음 T를 적용