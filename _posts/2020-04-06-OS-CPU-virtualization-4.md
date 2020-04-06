---  
layout: post  
title: "[OS] CPU 가상화 (4) - scheduling"
categories: classes
tags: os CPU virtualization process scheduling algorithm MLFQ
comments: true
---
# 지금까지 무엇을 배웠나요
- STCF (PSJF) scheduler: turnaround time 기준으로 좋은 알고리즘.
    - 하지만 response time 기준으로는 별로 좋지 않으며
    - 각 프로세스의 runtime을 미리 알아야 한다는 한계점이 있다.
        - 즉, 아직 [4가지 비현실적인 가정](https://broccolism.github.io/classes/2020/03/31/OS_CPU-virtualization-3/#scheduling) 중 마지막 가정이 깨지지 않았다.
- RR scheduler: response time 기준으로 좋은 알고리즘.
    - STCF와 다르게 각 프로세스의 runtime을 미리 몰라도 된다.
    - 하지만 turnaround time 기준으로는 별로 좋지 않다.
- 남은 과제
    > perfect knowledge 없이 어떻게 좀 더 효율적으로 스케줄링 할 수 있을까?

# 순서
[1) MLFQ: Multi-Level Feedback Queue](#mlfq-multi-level-feedback-queue)  
&nbsp;&nbsp;&nbsp;&nbsp;[1-1) MLFQ의 초기 규칙 4가지](#basic-rules-of-mlfq)  
&nbsp;&nbsp;&nbsp;&nbsp;[1-2) MLFQ의 문제점](#problems-with-the-basic-mlfq)  
&nbsp;&nbsp;&nbsp;&nbsp;[1-3) MLFQ의 문제점 보완 방식](#better-mlfq)  


# MLFQ Multi-Level Feedback Queue
> 미래를 예측하기 위해 과거의 데이터를 학습하자!
(요즘 뜨고 있는 인공지능과 꽤 유사한 .. 방식인 것 같다.)

past data를 가지고 프로세스가 필요로 한 시간에 반비례하게 우선순위를 부여하여 순위가 높은 프로세스부터 먼저 실행시킨다.
- 목표
    - response time 최소화
        - RR scheduling을 이용하면 해결할 수 있다.
    - turnaround time을 위한 최적화
        - 쉽지 않다. turnaround time을 가장 쉽게 줄일 수 있는 상황은 바로 각 프로세스의 runtime을 미리 일고 있을 때이기 때문이다.
        - 하지만 대학원생의 힘은 굉장하다.
위의 목표 두가지를 모두 달성할 수 있는 방법을 고안해냈다. SJCF만큼은 아니지만 그에 준하는 정도로 괜찮은 퍼포먼스를 보여준다고 한다.

## Feature of MLFQ
- 이름에서도 알 수 있듯이 MLFQ에서는 기본적으로 큐를 사용한다.
    - 각각의 큐는 서로 다른 우선순위 레벨을 의미한다.
    - e.g.) 큐가 총 4개 있으면 해당 운영체제에서는 프로세스 실행을 위한 우선순위를 4단계로 구분함을 의미한다.
    - 이 때 각 큐로 분류하는 기준 과거에 사용한 CPU time이며, 구체적인 값은 OS 디자이너가 정한다.

- 우선순위가 높은 큐에 속한 프로세스부터 먼저 실행한다.
    - 프로세스 입장에서 우선순위가 높은 큐에 속하는 방법은 CPU 점유 시간을 줄이는 것이다.
    - OS 입장에서 이를 확인하려면 각 프로세스별로 behavior를 **관찰**해야한다.
    - 좀 더 엄밀히 말하자면 각 큐마다 "이 정도 범위에 해당하는 시간동안 동작하는 프로세스는 이 그룹에 넣어주자" 와 같은 기준이 있을 것이다. 그 `기준`을 만족시킬 정도로 충분히 짧게 실행되는 프로세스라면 해당 그룹에 속할 수 있다. 그렇지 않으면 하위 큐의 기준과 비교하여 그 그룹에 속할지 말지를 결정한다.
    - 만약 어떤 프로세스가 계속해서 I/O 작업을 수행하느라 CPU 점유권을 양보한다면 해당 프로세스는 원래 우선순위에 계속 남아있을 수 있다. `기준` 보다 짧은 시간동안 CPU를 수행하고, 나머지 시간은 다른 프로세스에게 양보하는 셈이 되기 때문이다. 따라서 자연스럽게 I/O 수행 프로세스의 우선순위가 높아지게 되고, response time도 짧아질 수 있다.

## Basic Rules of MLFQ
1. 두 프로세스 A, B 중 A의 우선순위가 더 높다면 A를 run.
2. 두 프로세스 A, B의 우선순위가 같다면 (= 같은 큐에 속해있다면) A와 B를 RR 방식으로 run.
3. 과거에 실행된 적 없는 프로세스가 처음으로 system에 들어오면, 최상위 우선순위를 부여한다.
4. 각 그룹(큐) 별로 해당 우선순위 그룹에 속한 프로세스가 CPU를 점유할 수 있는 시간을 time slice로 미리 정해놓고,
    - 프로세스가 자신이 속한 그룹의 time slice에 해당하는 길이를 넘긴 시간동안 실행되고 있다면 우선순위를 한 단계 낮춘다.
    - 프로세스가 자신이 속한 그룹의 time slice에 해당하는 길이보다 짧은 시간 안에 CPU 점유를 포기한다면 그 그룹에 계속 머무를 수 있다.

### Problems with the Basic MLFQ
- **Starvation**: 자연스럽게 생기는 문제
    - 무엇을 굶나요? CPU 자원입니다.
    - 앞서 보았던 정책 때문에 너무 많은 interactive job이 돌고 있으면 우선순위가 낮은 프로세스들은 계속해서 CPU 점유에 실패하게 된다.
    - 어차피 우선순위가 낮은 프로세스인데 좀 오래 기다려도 되지 않을까요?
        - 안됩니다. 그렇게 되면 일에 전혀 진전이 없게 되기 때문에 영원히 기다려야겠죠?
- **Game the schduler**: 정책을 악용해서 생기는 문제
    - 어떻게 악용하나요?
        - 주어진 time slice의 99%까지 사용한 다음 I/O operation을 발생시킨다면...?!
            - 스케줄러 입장에선 해당 프로세스가 주어진 time slice 안에 CPU 점유를 포기하는 것만 보일테니 그 프로그램은 계속해서 높은 우선순위를 갖게 된다

위의 두 문제점을 해결하기 위해 1. 새로운 규칙을 추가하는 것과 2. 기존 규칙을 수정하는 것이 사용된다.

### Better MLFQ
> "5. 주기적으로 모든 job을 최상위 우선순위를 갖는 큐에 올린다."

- Starvation을 해결하기 위해 앞서 살펴보았던 4가지 규칙에 5번째 규칙을 추가한다.
- 이 때 한 주기는 각 큐에 주어진 time slice보다 훨씬 길다.
- 이렇게 하면 최하위 우선순위를 갖는 프로세스라도 각 주기마다 적어도 한 번은 실행이 된다. 따라서 조금씩 job의 진전이 생길 수 있다.

![better1](https://broccolism.github.io/assets/img/OS/2020-04-06-1.jpg)

---

> "4. (4-1과 4-2를 수정) 주어진 time slice를 모두 사용한 프로세스는 CPU 점유를 포기한 횟수에 관계없이 무조건 우선순위를 하나 내린다."

- Gaming of Scheduler를 해결하기 위해서는 앞서 보았던 4가지 규칙 중 4번을 고쳤다.
- 이렇게 하면 time slice를 활용할 수 있는만큼 쓰고, 일부러 I/O request를 보내 오랫동안 CPU를 점유하는 악성 프로세스를 막을 수 있다.
    - 단, 고의가 아니라 어쩔 수 없이 time slice를 다 써버린 경우에도 우선순위를 낮춘다.
    ![better2](https://broccolism.github.io/assets/img/OS/2020-04-06-2.jpg)