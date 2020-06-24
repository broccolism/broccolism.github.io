---  
layout: post  
title: "[OS] CPU 가상화 (3) - scheduling"
categories: study
tags: study 2020-1 os CPU virtualization process scheduling
comments: true
---
## 순서
[1) Scheduling의 정의와 비현실적 가정 4가지](#scheduling)  
[2) Scheduling의 좋고 나쁨을 판단하는 기준 3가지](#scheduling-metrics)  
[3) 스케줄링 기법 1: FIFO(FCFS)](#first-in-first-out)  
[4) 스케줄링 기법 2: SJF](#shortest-job-first)  
[5) 스케줄링 기법 3: RR](#round-robin-scheduling)  
[6) I/O를 쓰는 프로세스가 있을 때 스케줄링](#incorporating-io)  


# Scheduling
= 컴퓨터의 resources를 프로세스가 쓸 수 있도록 할당해 주는 작업
- CPU Scheduling = `CPU time`을 프로세스에게 할당해주는 작업.
    - CPU 스케쥴링을 위해 과거에 다양한 기법이 존재했다. 이번에는 그 기법들의 발전 과정을 살펴볼 것!
    - 여기에는 몇가지 기준이 있다. 하나의 스케쥴링 기법이 모든 면에 효율적일 수 없기 때문에 **상황에 따라** 적절한 기준을 먼저 고르고 스케쥴링 기법을 선택하면 된다.

### 스케쥴링을 고안하기 위해 만든 비현실적인 가정 4가지
1. 각 프로세스는 **같은 시간동안 실행**된다.
2. 모든 프로세스는 CPU에 **같은 시각에 도달**한다.
    - 즉, 모든 프로세스들이 동시에 시작한다.
3. 모든 프로세스는 **CPU만 사용**한다.
    - 즉, I/O request를 보내지도 않고 network 연결을 필요로 하지도 않는다.
4. 각 프로세스의 **run-time**은 이미 알려져있다.
    - 프로세스 시작 시각과 run-time을 모두 안다고 해서 프로세스들의 실행 종료 시각까지 알 수 있는 것은 아니다. 이는 우리가 스케줄링을 어떻게 하느냐에 따라 달라질 수 있기 때문이다.  
    
위의 가정 4가지는 모두 굉장히 비현실적인 상황이다. 앞으로 스케줄링 기법을 하나씩 알아볼텐데, 각 기법의 발전 과정에서 이 가정들을 하나씩 무너뜨리면서 보다 현실 상황에 적용하기 좋은 기법이 등장한다.

## Scheduling Metrics
1. Turnaround Time = 프로그램이 CPU에 도달한 시점부터 모든 작업을 완료하고 다시 CPU에서 나오기까지 걸린 시간.
    - 은행을 예시로 들면, 우리가 은행 입구로 들어갔을 때부터 번호표를 뽑고 기다린 후 하려던 업무를 모두 보고 은행 밖으로 나왔을 때까지의 시간이다.


    $$
    T_{turnaround} = T_{completion} - T_{arrival}
    $$


    - Average Turnaround TIme: 보통 프로세스가 여러개 *동시에* 실행되게 하고 싶은 경우가 많기 때문에 각 프로세스의 Turnaround Time의 평균을 가지고 스케줄링 기법을 평가한다.
2. Fairness = 여러개의 프로세스가 있을 때 CPU 자원을 얼마나 *공평하게* 주는지에 대한 기준.
3. Response Time = 프로그램이 CPU에 도착한 후 가장 처음으로 CPU에서 실행되기까지의 시간.


    $$
    T_{response} = T_{first\;run} - T_{arrival}
    $$


아래 스케줄링 기법은 average turnaround time 기준으로 *좋은* 스케줄링 기법이다.

# First In First Out
줄여서 FIFO! First Come, First Served를 써서 FCFS라고도 한다.
마치 큐에 각 프로세스들을 넣고 순서대로 실행하는 것과 같다. 구현하기도 간단하다.

![FIFO](https://broccolism.github.io/assets/img/OS/2020-03-31-1.png)

- 위의 [4가지 가정](#스케쥴링을-고안하기-위해-만든-비현실적인-가정-4가지)이 모두 성립할 때에는 꽤 괜찮게 작동한다.
    - 예시에서 Average turnaround time 은 (10 + 20 + 30) / 3 = 20초이다. A, B, C 모두 **동시에** CPU에 도착했다고 가정했기 때문에 각 프로세스의 turnaround time은 10, 20, 30초이다.
- 하지만 1번 가정 - 각 프로세스의 실행 시간은 같다. - 이 무너진다면 average turnaround time이 급격하게 늘어나버린다.

![problem of FIFO](https://broccolism.github.io/assets/img/OS/2020-03-31-2.png)

- turnaround time = (100 + 110 + 120) / 3 = 110초.
- **Convoy effect**
![convoy](https://broccolism.github.io/assets/img/OS/2020-03-31-3.png)
 > 구글에 convoy라고 이미지 검색을 하면 이런 거대한 트럭이 나온다. 어떤 수송 회사 이름이 convoy라고도 나온다. 정황은 잘 모르겠지만 convoy effect의 convoy가 바로 이를 일컫는 것 같다. 앞에 엄청 큰 차가 있으니까 전체적으로 뒷 차까지 천천히 가게 되는 것처럼, 앞에 실행 시간이 긴 프로세스가 있어서 전체적인 소요 시간이 늘어나는 것이다.  
- 원인: 각 프로세스의 실행 시간이 다름에도 불구하고 이를 무시하고 오로지 arrival time만 보고 선착순 스케줄링을 함.
- 그래서 이 다음에 나온 스케줄링 기법은 각 프로세스의 `job length`를 고려해서 만들어졌다.

# Shortest Job First
줄여서 SJF. 도착한 프로세스 중 실행 시간이 짧은 프로세스를 우선 실행한다.
![SJF](https://broccolism.github.io/assets/img/OS/2020-03-31-4.png)

- average turnaround time = (10 + 20 + 120) / 3 = 50초
- 그런데 이 때 [앞서 말했던 가정](#스케쥴링을-고안하기-위해-만든-비현실적인-가정-4가지)의 2 - 프로세스가 모두 동시에 CPU에 도착한다.-를 좀 더 현실적으로 바꿔버리면 A, B, C 도착 시간이 달라질 수 있다.
- 아래처럼 A가 도착한 후 10초 뒤에 B, C가 도착한다면? 이미 A를 실행시키기로 결정해버렸으니 또다시 turnaround time이 늘어난다.

![problem of SJF](https://broccolism.github.io/assets/img/OS/2020-03-31-5.png)

- 이 경우 문제의 원인은 특정 프로그램이 한번 시작하면 해당 프로세스가 끝날 때까지 다른 프로그램이 CPU를 점유할 수 없게 된다는 사실이다.

# Shortest Time to Completion First
Shortest Time-to-Completion First (STCF)
직역하면 Time-to-Completion이 가장 짧은 것, 즉 **끝내는데 걸리는 시간**이 가장 짧은 프로그램을 우선으로 스케줄링 하는 것이다.
- 방법: preemption 추가
    - preemption: 현재 동작하고 있는 프로세스의 수행을 잠시 멈추고 다른 프로그램이 동작할 수 있게 하는 것
    - 그래서 이 방법을 PSJF - Preemptive Shortest Job First라고 부르기도 한다.
    - 프로세스 A 실행 도중 새 job(프로그램)이 도달하면 A를 계속 실행시킬지, 아니면 새 프로그램에게 주도권을 줄 지 결정한다.

![STCF](https://broccolism.github.io/assets/img/OS/2020-03-31-6.png)

지금까지 본 스케줄링 기법은 `turnaround time` 측면에서는 *꽤 괜찮은* 기법이었다. 실제로 초기 OS에서 STCF 기법을 주로 써왔다고 한다. 하지만 멀티태스킹 시대가 오면서 모든 것을 바꾸어 놓았다! 새로운 기준이 생긴 것이다. 바로 `response time`! 

사용자는 프로그램 여러개를 돌리면서 각 프로그램이 바로바로 반응하기를 바랐다. 그런 점에서 STCF를 다시 살펴보면, 각 프로세스를 **순서대로** 실행시키는 것만으로는 부족하게 되었다. 바로 위의 사진만 다시 보더라도 만약 A, B, C가 동시에 CPU에 도착했다면 각각 `response time`이 0, 10, 20초로 절대 **동시에** 시작된다고 볼 수 없는 정도인 것이다.

# Round Robin Scheduling
그래서 시간을 `time slice`라는 아주 짧은 단위시간동안 각 프로세스를 실행시키는 방식을 도입했다.

- 프로그램 A, B, C는 모두 같은 시각에 CPU로 들어왔고 실행 시간은 5초라고 가정하자.

![RR](https://broccolism.github.io/assets/img/OS/2020-03-31-7.png)

하지만 보다시피 round robin 방식은 turnaround time 측면에서 좋지 못하다. 각 프로세스들의 completion time이 전체적으로 늦춰지기 때문이다. [앞서 언급했다시피](#scheduling) 모든 기준을 충족할 수는 없다. 보다 **interactive** 한 OS를 만들고 싶다면 round robin 방식을 채택하면 되는 것이다.

## Trade-Off
프로세스 A 실행 도중 프로그램 B로 넘어가는 과정은 결코 간단하지 않다. context swtiching이기 때문에 시간도 꽤 오래 걸린다.
- time slice를 끝없이 잘게 쪼개버리면
    - context switching만 하다가 시간이 다 가버릴 것이다.
- time slice를 너무 크게 만들면
    - 더이상 interactive하게 작동하지 않을 것이다.
즉 `context switching을 위한 overhead를 줄이는` 과 `response time을 줄이는 것` 은 서로 trade-off 관계에 있는 것이다. 따라서 OS 디자이너는 이를 잘 고려해 time slice의 크기를 정해야 할 것이다.

# Incorporating IO
이제 [앞서 말했던 가정](스케쥴링을-고안하기-위해-만든-비현실적인-가정-4가지) 중 3 - 모든 프로그램은 CPU 자원만 필요로 한다. - 를 깨뜨려보자. 각 프로그램은 이제 I/O request를 보내기도 한다.

![with I/O request](https://broccolism.github.io/assets/img/OS/2020-03-31-8.png)

이 때 Figure 7.8처럼 한 프로세스 기준으로 CPU와 디스크 자원을 나눈다면 당연히 속도가 굉장히 느릴 것이다. 따라서 A가 Disk를 사용 중이라면 그동안 B가 CPU를 쓸 수 있게 해주는 것이 좋다. 이렇게 하면 CPU utilization이 높아진다.
- 프로세스 A가 I/O request를 발생시켰다면
    - A는 Blocked 상태로 만들고
    - Ready 상태에 있던 B를 run 상태로 만든다.
- 프로세스 A의 I/O가 끝났다면
    - interrupt가 발생한다.
    - Blocked 상태였던 A를 다시 ready 상태로 만든다.