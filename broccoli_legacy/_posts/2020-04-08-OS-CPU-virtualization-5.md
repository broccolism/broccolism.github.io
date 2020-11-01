---  
layout: post  
title: "[OS] CPU 가상화 (5) - scheduling"
categories: study
tags: study 2020-1 os CPU virtualization process scheduling algorithm lottery 스케줄링
comments: true
---
## 순서
[1) 새로운 스케줄링: Proportional Share](#proportional-share)  
[2) Lottery Scheduling](#lottery-scheduling)  
&nbsp;&nbsp;&nbsp;&nbsp;[2-1) Lottery Scheduling의 문제점](#problem-of-lottery-scheduling)  
[3) 보완하기 feat.Stride Scheduling](#stride-scheduling)  

# Proportional Share

지금까지 봤던 스케줄링 기법은 Fair-share scheduler였다.
- turnaround time, response time을 기준으로 그 효과가 판단되었는데, 왜냐하면
- 목표가 최대한 여러 프로세스를 **공평하게** 실행시키는 것이었기 때문이다.

하지만 이번에 살펴볼 방식은 목표 자체가 다르다.
- 각 프로세스가 **원하는만큼** CPU를 점유할 수 있도록 해 줘야 한다.
    - 다시 말해, 각 프로세스가 특정한 비율로 CPU time을 점유할 수 있도록 하는 것이 목표다.

### Basic Concept
- Tickets
    - 모든 프로세스는 일정한 개수의 ticket을 가질 수 있다.
    - 이 티켓은 각 프로세스가 할당받을 수 있는 자원의 비율을 의미한다.
    - 만약 모든 프로세스에게 티켓을 주고 남는 티켓이 생기면 이를 어떻게 처리할지는 운영체제가 결정한다.
- e.g)운영체제에서 발급한 티켓이 총 100개일 때,  A, B라는 두 프로세스가 있고 티켓을 각각 25장, 75장 갖고 있으면
    - A는 CPU time의 25%, B는 CPU time의 75%를 점유할 수 있도록 하는 것이 목표이다.

# Lottery Scheduling
스케줄러가 **winning ticket**을 뽑는다. 그리고 그 티켓을 가진 프로세스를 실행시킨다.
e.g) 총 100개의 티켓이 있고 프로세스 A가 75개, B가 25개를 가진 경우
- 즉, A가 0부터 24, B가 25부터 99까지 번호가 매겨진 ticket을 갖는 경우에는 아래와 같이 실행된다.

![lottery e.g)](https://broccolism.github.io/assets/img/OS/2020-04-08-1.jpg)

이 방법을 사용하면 [큰 수의 법칙](https://ko.wikipedia.org/wiki/%ED%81%B0_%EC%88%98%EC%9D%98_%EB%B2%95%EC%B9%99){: target="_blank"} 에 따라 여러 프로세스가 경쟁하면서 실행되는 전체 시간이 길어질수록 각 프로세스가 원하던 비율로 실행될 가능성이 높다.

## Ticket Mechanisms
### 1 Ticket Currency
프로세스에게 주어진 global ticket의 갯수와는 별개로 내부적인 ticket currency를 가질 수 있다.
- 예)
- global currency: 티켓 총 200개
- 프로세스 A, B 각각 100개씩 배당 받은 상태.
- A: A1에게 티켓 500개, A2에게 티켓 500개를 주고자 한다.
    - 이 때 *500개*는 A의 내부적인 currency이다.
    - 따라서 실제로는 global currency 50개와 같다. 왜냐하면 A가 가진 전체 티켓 갯수가 100개이기 때문이다. 즉, 이 값은 100(global currency) * (500 / 1000) 을 계산한 값이다.
- B: B1에게 티켓 400개를 주고자 한다.
    - 이 때의 *400개*는 B의 내부적인 currency이다.
    - 따라서 실제로는 global currency 100개이다. 왜냐하면 B가 가진 전체 티켓 갯수가 100개이기 때문이다. 즉, 이 값은 100(global currency) * (400/400) 을 계산한 값이다.

### 2 Ticket Transfer
프로세스는 잠깐동안 다른 프로세스에게 자기가 갖고 있던 티켓을 나눠줄 수 있다.

### 3 Ticket Inflation
프로세스는 일시적으로 자신의 티켓 갯수를 줄이거나 늘릴 수 있다.
- 어떤 프로세스가 CPU time을 더 원한다면, 자신의 티켓 갯수를 더 늘릴 수도 있다.

### Implementation

![implementation](https://broccolism.github.io/assets/img/OS/2020-04-08-2.jpg)
- U: unfairness metric
    - lottery method는 티켓을 많이 갖고 있는 프로세스가 오래 실행되는 것이 **보장**되지 않는다. 확률적으로 그렇다는 의미이다.
    - 따라서 티켓을 많이 갖고 있을수록 실제로 오래 실행되었는지 확인하기 위한 기준이 필요한데, 그게 바로 unfairness metric이다.
    - U = (첫번째 job이 끝난 시각) / (두번째 job이 끝난 시각)
    - U가 1에 가까울수록 두 job이 비슷한 시점에 종료되었음을 나타낸다.

## Problem of Lottery Scheduling
Lottery method의 문제점이 바로 여기서 드러난다. 각각의 job들이 서로 같은 갯수의 티켓을 갖고 있는 상황을 가정해보자. job length, 즉 실행되는 전체 시간이 짧을수록 U의 값이 작아진다. 공평하지 못하다는 소리다.

![problem](https://broccolism.github.io/assets/img/OS/2020-04-08-3.jpg)

다시 말하자면 너무 **확률적**이기 때문에 좋지 못하다는 얘기다. 이 방식을 좀 더 **deterministic**하게 보완할 필요가 있었다.

# Stride Scheduling
### 프로세스마다 갖고 있는 것 세가지
- `stride`: 보폭. 이번 기법에서는 각 프로세스별로 보폭을 정해놓는다.
- 프로세스의 보폭 = (시스템에서 발급한 총 티켓의 수) / (프로세스가 갖고 있는 티켓의 수)
- 프로세스가 실행되면 해당 프로세스의 보폭에 맞게 counter를 증가시킨다. 이 값을 `pass` 라고 한다.
    - 처음 시작 할 때 모든 프로세스의 pass는 0으로 초기화된다.

        ![stride](https://broccolism.github.io/assets/img/OS/2020-04-08-4.jpg)

- lottery scheduling을 보완한 것이기 때문에, 여기서도 역시 각 프로세스는 일정한 갯수의 `ticket`을 배당받는다.

---

현재 프로세스 다음에 실행할 프로세스를 고를 때에는 pass value가 가장 낮은 프로세스를 고르면 된다.

![how to?](https://broccolism.github.io/assets/img/OS/2020-04-08-5.jpg)

이 방법을 통해 모든 프로세스가 원하던만큼 공평하게 실행될 수 있다! 정말 기발하지 않은가.