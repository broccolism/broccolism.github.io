---  
layout: post  
title: "[CG] Numpy, OpenGL 기초"
categories: study
tags: study 2020-1 cg numpy array opengl graphics vector matrix slicing indexing
comments: true
---
# 바로가기
[- NumPy 문법](#numpy-syntax)  
[- 벡터와 행렬 연산](#vector-그리고-matrix-with-numpy)  
[- OpenGL 알아보기](#opengl)

# `왜` 그래픽스에서 Python을 사용할까?
- **Productivity** 생산성
    - 배우기 쉽다.
    - 그래서 language-specific issue가 아닌 **logic**에 집중할 수 있다.
- Powerful modules 강력한 모듈
    - NumPy, SciPy, matplotlib 등 시각화를 위한 다양한 파이썬 지원 모듈이 있다.
    - 써먹기 딱 좋음!
결론 1. 짧은 시간 안에 컴퓨터 그래픽스에 대한 중요 개념들을 익히는데 유용하다.

- **Popularity** 인기 있는 언어
    - 구글링하면 수많은 파이썬 안내 자료가 나온다.
    - 대부분의 ML/DL 프레임워크는 파이썬 API를 제공한다.
        - TensorFlow, PyTorch, Keras, Theano, ...
        - Data Science에서 가장 인기 있는 언어가 바로 파이썬!
결론 2. 머신 러닝, 데이터 사이언스 등 다른 분야와 그래픽스를 결합시키기 딱 좋다.

# NumPy
는 scientific computing을 위해 C로 짜여진 파이썬 `모듈`이다. 특히 벡터, 행렬 관련 연산이 굉장히 빠르다고 한다.
> **de-facto standard** for numerical computing in Python.

# NumPy Syntax
[깃허브 링크 바로가기](https://github.com/enthought/Numpy-Tutorial-SciPyConf-2017/blob/master/slides.pdf){: target="_blank"}  

- numpy 모듈 import하기
    ```python
        import numpy as np
    ```
    그냥 `import numpy`를 해도 되지만, 그러면 일일이 `numpy`를 적어주기 귀찮다. 그래서 줄임말인 `np`로 해당 모듈을 나타내겠다는 의미. 물론 다른 단어를 사용해도 무방하다.

## NumPy Array
```python
    #array 생성
    >>> a = np.array([0, 1, 2, 3]) 
    #array([0, 1, 2, 3])
    
    #type 체크
    >>> type(a)
    #numpy.ndarray (이 때 'nd'는 n-demensional을 의미)
    
    #elements의 type 체크
    >>>a.dtype
    #dtype('int32') (사용 환경에 따라 다를 수 있다.)
    
    #dimension 체크
    >>>a.ndim
    #1
```
파이썬 `list`와의 차이점은 처리 속도가 훨씬 빠르다는 점이다. 그이유는 `NumPy Array`에 걸린 제한사항 때문이다.

|       |Data Type of Elements|Data Size of Elements|
| :---: |:--- |:--- |
|NumPy `array`|ALL SAME|ALL SAME|
|Python `list`|can be various|can be various|


### numpy array용 다양한 연산을 제공한다.
- 두 array에서 같은 index를 갖는 원소끼리의 연산
```python
    >>>a = np.array([1, 2, 3, 4])
    >>>b = anp.array([2, 3, 4, 5])
    >>>a + b
    #array([3, 5, 7, 9])
    >>>a * b
    #array([2, 6, 12, 20])
    >>>a ** b #파이썬의 지수 표현
    #array([1, 8, 81, 1024])
```
- 한 array와 scalar 값의 연산
```python
    >>>a = np.array([1, 2, 3, 4])
    >>>0.1 * a
    #array([0.1, 0.2, 0.3, 0.4])
    >>>a *= 2 #이렇게 in-place operation도 사용 가능하다.
    >>>a
    #array([2, 4, 6, 8])
```
- function의 parameter로 array를 넘겨줄 수 있다.
```python
    >>>x = np.array([0.2, 0.4, 0.6, 0.8])
    >>>y = np.sin(x)
    >>>y
    #array([19866933, 0.38941834, 0.56464247, 0.71735609])
```
### Indexing
- python list와 유사하게 사용할 수 있다.
```python
    >>>a = np.array([0, 1, 2, 3])
    >>>a[0]
    #0
    >>>a[0] = 10
    >>>a
    #array([10, 1, 2, 3])
    >>>a[0] = 10.6
    >>>a
    #array([10, 1, 2, 3])
```
    위의 예시에서 주의해야 할 점은 NumPy array의 elements는 **모두 같은 데이터 타입을 갖는다**는 점이다. 그래서 dtype이 int인 array a에 10.6을 넣어도 자동으로 10으로 저장이 된다.

### Slicing
```python
    var[lower:upper:step]
```
말 그대로 array를 자를 수 있다.
- `var`: the name of numpy array
- `lower` 번째부터 (`upper` - 1)번째 element까지 가리킬 수 있다.
    - negative index도 지원한다.
    - 주의할 점은 upper 번째는 포함되지 않는다는 점이다.
    - 즉, 다음과 같다. `[lower, upper)` 에 속하는 index를 갖는 element를 빼낸다.
- `step` 부분을 사용하면 step만큼 건너뛰면서 가리킬 수 있다. 아래 예시를 보자.
```python
    >>>a = np.array([10, 11, 12, 13, 14])
    
    >>>a[1:3]
    #array([11, 12])
    >>>a[1:-2]
    #array([11, 12])
    '''
    positive index 0, 1, 2, 3, 4번째는 각각
    negative index -5, -4, -3, -2, -1번째에 해당한다.
    '''
    >>>a[-4:3]
    #array([11, 12])
    
    >>>a[:3]
    #array([10, 11, 12])
    >>>a[-2:]
    #array([13, 14])
    >>>a[::2]
    #array([10, 12, 14])
```
물론 다차원 배열에서도 slicing을 할 수 있다.
```python
    >>>a = np.array([[i+10*j for i in range(6)] for j in range(6)])
    
    >>>a[0, 3:5]
    #array([3, 4])
    >>>a[4:, 4:]
    #array([[44, 45],
    #       [54, 55]])
    >>>a[:, 2]
    #array([2, 12, 22, 32, 42, 52])
```
### Constructor with Data Type
원소의 타입을 지정해서 array를 만들 수도 있다.
```python
    >>>a = np.array([0, 1.0, 2, 3])
    >>>a.dtype
    #dtype('float64')
    
    >>>a = np.array([0, 1.0, 2, 3], dypte='float32')
    >>>a.dtype
    #dtype('float32')
```
### Creation Functions
선형대수에서 쓰는 단위 행렬-`identity matrix`, 영행렬-`zero matrix` 혹은 `null matrix`, 그리고 모든 원소가 1인 행렬을 간편하게 만들 수 있다.

- 이 때 기본 데이터 타입은 `float64`이다. 물론 위와같이 `dtype`을 지정해줄 수도 있다.
```python
    >>>np.identity(4)
    #array([[1., 0., 0., 0.],
    #       [0., 1., 0., 0.],
    #       [0., 0., 1., 0.],
    #       [0., 0., 0., 1.]])
    >>>np.identity(4, dtype=int)
    #array([[ 1, 0, 0, 0],
    #       [ 0, 1, 0, 0],
    #       [ 0, 0, 1, 0],
    #       [ 0, 0, 0, 1]])
    
    >>>np.ones((2, 3), dtype=int) #parameter: 행렬의 모양
    #array([[ 1, 1, 1],
    #       [ 1, 1, 1]])
    
    >>>np.zeros(3)
    #array([ 0., 0., 0.])
```
특정 구간의 숫자를 특정 간격으로 건너뛰면서 만드는 array도 있다.
```python
    >>>np.linspace(0, 1, 5)
    #array([0., 0.25, 0.5, 0.75, 1.0])
    '''
    이 때에는 start와 stop value 모두 포함된다.
    '''
```
python의 `range()`와 비슷한 역할을 하는 함수도 있다.
- 이 때 주의할 점은 slicing때와 마찬가지로 stop value는 포함되지 않는다는 점인데, 컴퓨터 특성상 소수점 이하 숫자를 가진 수를 정확하게 표현하지 못하기 때문에 약간의 오차가 있을 수 있다. 아래는 그 예시이다.
```python
    >>>np.arange(4) #parameter: 원소의 갯수
    #array([0, 1, 2, 3])
    >>>np.arange(1.5, 2.1, 0.3)
    #array([1.5, 1.8, 2.1])
    '''
    원래대로라면 stop value인 2.1은 array에 없어야 하지만
    오차로 인해 포함된 결과가 나온다.
    '''
```
### Transpose & Reshape
```python
    >>>a = np.array([[0, 1, 2], 
    				 [3, 4, 5])
    >>>a.shape
    #(2, 3)
    
    >>>a.T
    #array([[0, 3],
    #       [1, 4],
    #       [2, 5]])
    
    >>>a.reshape(3, 2)
    #array([[0, 3],
    #       [1, 4],
    #       [2, 5]])
    
    >>>a.reshapge(4, 2)
    #ValueError!
    '''
    실제 원소 개수가 reshape하려는 행렬의 원소 개수보다
    작은 경우, value error가 난다.
    그도 그럴게 컴퓨터 입장에선 빈 칸을 무엇으로 채워야 할 지
    전혀 알 수 없기 때문이다.
    '''
```
참고로 1차원 array `v`에 `v.T`를 해도 `v와 같은 array`가 된다. 1차원이라 transpose하는 의미가 없기 때문이다.

## Vector 그리고 Matrix with NumPy
- 벡터 = 1차원 배열
- 행렬 = 2차원 배열
아주... 간단하다!

### Multiplication
*신기한 곱셈 연산*을 지원한다.
```python
    >>> v = np.arange(3)
    >>> v * v
    #array([0, 1, 4])
    
    >>> M = np.arange(9).reshape(3, 3)
    >>> M * M
    #array([[ 0,  1,  4],
    #       [ 9, 16, 25],
    #       [36, 49, 64]])
```
각 원소별로 그냥 곱해주는 것이다. 그런데 보통 행렬 연산에서는 이런걸 원하는게 아니다. 내적을 해야지! 내적 기호는 `@` 이다.
```python
    >>> v @ v
    #5
    >>> M @ M
    #array([[ 15,  18,  21],
    #       [ 42,  54,  66],
    #       [ 69,  90, 111]])
    >>> M @ v
    #array([ 5, 14, 23]
```
- 이 때 좋은점은 연산자 `@` 기준으로 행렬의 shape을 맞춰줄 필요가 없다는 뜻이다.
    - 원래 내적을 하기 위해서는 `a x b matrix` 과 `b x c matrix`를 순서대로 연산자 좌, 우에 적어줘야 연산이 가능하다.
    - 하지만 파이썬이 이 부분은 알아서 하니까 우린 신경 쓸 필요 없다는 뜻!

---

# OpenGL
= `API` for graphic
L로 끝나서 라이브러리인 것 같지만 사실은 API이다.
- `Cross platform`: 윈도우, 리눅스, iOS, 안드로이드 등 OS를 가리지 않는다.
- `Language independent`: 실제로 openGL 소스를 구글링해보면 C 계열 언어로 짜여진 코드가 자주 보인다. OpenGL은 C, 파이썬, 자바, 자바스크립트 등 다양한 language binding을 갖는다.

### render() 함수
는 초당 n번 계속 실행되는 함수이다. 이 함수 안의 내용물이 화면에 나타나게 된다.

### Primitive Types
![primitive-types](https://broccolism.github.io/assets/img/CG/2020-03-25-1.png)

예제 코드
```python
    def render():
    	glClear(GL_COLOR_BUFFER_BIT) #버퍼 클리어
    	glLoadIdentity()
    	glBegin(GL_POINTS)  #"이제부터 점을 그리겠다!"
    	# glBegin(GL_LINES) #"이제부터 LINE들을 그리겠다!"
    	# glBegin(GL_LINE_STRIP) #"이제부터 LINE_STRIP을 그리겠다!"
    	# glBegin(GL_LINE_LOOP)
    	# ...
    	glVertex2f(0.0, 0.5) #"첫 번째 점은 (0, 0.5)에 위치!"
    	glVertex2f(-0.5,-0.5) #"두 번째 점은 (-0.5, -0.5)에 위치!"
    	glVertex2f(0.5,-0.5)
    	glEnd()  #"위의 애들을 그려라!"
```
- `T` 모양으로 그리려는 애들은 모두 glBegin(`T`)과 glEnd() 사이에 있어야 한다.

### Vertex Attributes
- 위치: `glVertex()`
- 색상: `glColor()`
    ![RGB color](https://broccolism.github.io/assets/img/CG/2020-03-25-2.png)
    - 색상의 경우 `glColor()`로 한 번 색상을 설정했으면 다시 `glColor()`를 지정해주기 전까지 모든 vertex에게 영향을 미친다.

### OpenGL Functions
```python
    '''
    아래의 3, f, v는 각각 특별한 의미를 갖는다.
    아래가 OpenGL 함수의 기본 형태이다.
    '''
    glVertex 3 f v(v)
```
- `3`: 3차원을 의미한다. 2, 3, 4를 사용할 수 있다.
- `f`: float 형식임을 의미한다. 물론 다른 data type도 사용가능하다.
    - b: byte
    - ub: unsigned byte
    - s: short
    - us: unsigned short
    - i: int
    - ui: unsigned int
    - f: float
    - d: double
- `v`: parameter type이 vector임을 의미한다. 생략가능하다.
    - 생략 시 스칼라 형식 데이터를 받겠다는 의미를 갖는다.