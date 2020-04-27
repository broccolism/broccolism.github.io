---  
layout: post  
title: "[OS] Memory 가상화 (1) - Virtual Address와 하드웨어의 도움"
categories: classes
tags: os memory virtualization
comments: true
---
## 순서
[1) 옛날옛적엔... ](#history-of-memory-management)  
[2) 가상 주소? Virtual Address](#virtual-address) 
[3) 메모리를 다루게 해 주는 Memory API](#memory-api)  
[4) 소프트웨어만으론 부족해!](#need-for-help-from-hardware)  
[5) 메모리 관리 기법 1: base and bounds](#dynamic-relocation)  

# Memory Virtualization
- OS는 physical memory를 가상화할 필요가 있다.
- OS는 각 프로세스에게 마치 자신이 메모리 공간 전체를 사용하는 것만 같은 착각을 일으켜 줘야 한다.

### Benefit of Memory Virtualization

1. 프로그래밍을 훨씬 쉽게 할 수 있다.
    - 프로그램이 컴파일되어 메모리에 올라갈 때 어느 위치에서 동작할지 아는 것과 모르는 것은 아주 큰 차이가 있음!
    - 예를 들어 데이터가 로드 되는 메모리 주소가 어디일지를 알 때와 모를 때는 완전히 달라진다. (....고 하는데 아직 내가 아는게 너무 없어서인지 .. ... 이 말이 크게 와닿지는 않는다.....)
2. 메모리를 효율적으로 사용할 수 있다.
    - 메모리를 효율적으로 쓴다는 말은...
        - 각 프로그램이 원하는 양의 메모리를 할당해주고
        - 실행되지 않을 프로그램한테는 메모리를 할당해주지 않는 것.
        - fragment를 최대한 줄일 수 있다.
            - Fragment: 누군가에게 할당되어서 다른 프로그램이 쓸 수 없지만, 동시에 그 주인도 사용하지 않아서 결국 아무 쓸모가 없게 된 메모리 공간
3. 프로세스가 잘못된 접근을 유발하는 것을 막을 수 있다.
    - 프로세스끼리의 잘못된 접근은 물론,
    - 프로세스가 OS에 잘못된 접근을 시도하는 경우도 방지할 수 있다.
    - 즉, **isolation**을 보장한다.

# History of Memory Management
### OS in the Early System

완전 초창기: 60년대 이야기.

- 운영체제, 프로그램 모두 사이즈가 굉장히 작았다.(GUI 기반 프로그램이 없고 단순 계산만 수행하는 프로그램이 대다수였다.)
- 그래서 메모리에 단 한가지 프로세스만 load했다.
    - 당연히 memory utilization, efficiency가 매우 낮을 수 밖에 없다. 왜지?
    - **Internal Fragmentation**이 커지기 때문이다.
        - 한 프로그램에게 OS가 점유한 메모리 영역을 제외한 나머지 모든 영역을 할당해주었다고 하자.
        - 그런데 실제로 그 프로그램이 사용하는 code/data/heap/stack 영역이 굉장히 좁은 경우가 있을 수 있다.
            - 즉, 놀고 먹고 있는 메모리 공간이 많아 그 공간을 모두 합치면 다른 프로세스까지 돌릴 수 있지만 이미 그 공간의 주인이 있어서 다른 프로세스가 쓸 수 없는 경우.
    - c.f) External Fragmentation: 남아있는 메모리 영역의 합은 한 프로세스를 돌리기에 충분한 양이지만 그 영역들이 너무 작게 쪼개져 있어서 실제로는 다른 프로세스를 돌릴 수 없는 경우.

### Multiprogramming and Time Sharing

초창기 시스템에서 발생한 문제의 원인은 *한 프로그램이 모든 메모리 영역을 차지*하고 있는 것이었다. 그래서 이를 해결하기 위해 *여러*프로그램에게 각자의 영역을 나눠주기로 했다! 또한 프로그램이 여러 영역으로 나뉜 메모리를 점유하고 있으니 마치 *동시에* 동작하는 것처럼 만들려 했다!

- *동시에* 동작하게 하기 위해서는
    - 한 프로세스를 아주 짧은 시간동안 실행시키고
    - 다른 프로세스로 바꿔치기 한 다음에
    - 다시 그 프로세를 아주 짧은 시간동안 실행시키는 과정을 반복해야 했다.

그런데 초창기에는 physical address에 직접 접근할 수 있도록 했더니 프로세스들이 다른 프로세스의 영역을 침범해서 뭔가 엉뚱한 짓을 할 수도 있게 되어버렸다. 즉 *isolation*이 되지 않아 **protection issue**가 발생했던 것이다.

### Address Space

위에서 생긴 이슈를 해결하기 위해 OS 디자이너들이 새로운 방식을 고안해냈다.

> CPU 자원은 프로세스별로 구분되게 나눠줄 수 있는데, 메모리는 어떻게 못 할까?

CPU는 시간 개념을 나누어 주는 것이었다. 반면 메모리는 물리적인 공간(= 진짜 "넓이)"를 나눠준다는 점이 달랐다. 하지만 CPU time을 **프로세스별로** 쪼개어 나누어 줬듯이, 메모리 공간도 **추상화**를 통해 접근할 수 있도록 함으로써 해결했다!

즉 모든 프로세스가 남들은 침범할 수 없는 자기만의 메모리 공간을 할당받고 해당 공간을 완전히 점유할 수 있도록 해주는 것이 목표였다. CPU 추상화를 위해 '프로세스'를 만들었듯이 메모리 추상화를 위한 개념인 'address space: 주소 공간'이라는 단위를 도입했다.

- 이 때 각 프로세스가 갖는 address space가 physical memory의 어느 부분에 있는지는 누군가 알고 있어야 한다! 그래야 데이터를 실제로 저장하고 빼올 수 있으니까.
- 즉 **mapping**에 대한 정보를 OS가 갖고 있어야 한다.

CPU 추상화와 조금 더 비교해보자면,

- CPU 추상화의 핵심 개념 = 스케줄링 (이를 위해 프로세스 개념 도입)
- 메모리 추상화의 핵심 개념 = address translation (이를 위해 address space 개념 도입)

우리가 흔히 배우고 있는 data/code/heap/stack 영역으로 나뉜 왼쪽과 같은 메모리 영역은 이렇게 해서 탄생한 것이다!

# Virtual Address

따라서 virtual address는 자신의 메모리 영역에만 접근할 수 있도록 만들어준 추상적인 개념이다. 이를 직접 확인할 수 있는 코드가 있다.

```c
#include <stdio.h>
#include <stdlib.h>

int main(int argc, char *argv[]) {
    printf("location of code: %p\n", (void *) main);
    printf("location of heap: %p\n", (void *) malloc(1));
    int x = 3;
    printf("location of stack: %p\n", (void *) &x);

    return x;
}
```

이 코드를 64비트 리눅스 머신에서 실행시키면 **어떤 프로그램이 실행하든 상관없이 항상** 아래와 같은 결과가 나온다.

```c
location of code: 0x40057d
location of heap: 0xcf2010
location of stack: 0x7fff9ca45fcc
```

만약 프로그램 2개에서 모두 위의 코드를 실행시켰다면 아래의 동일한 결과를 얻을 수 있다는 의미이다. 이게 무슨 뜻이냐하면...

- 우리 둘이 쓰는 code 영역의 시작점은 `0x40057d`에요!
- 우리 둘이 쓰는 heap 이 `0xcf2010`이라는 주소까지 자랐어요!
- 우리 둘이 쓰는 stack이 지금은 `0x7fff9ca45fcc`까지 자랐어요!

가 된다. 그런데 이상하다? 애초에 **우리 둘이 쓰는** 메모리 영역이 있다는 것 자체가 말이 안 된다. 한 프로세스당 주어진 메모리 영역은 하나만 있어야 정상적으로 동작하니까!

그 이유는 바로 위에서 나온 주소들이 모두 **virtual address**이기 때문이다. 모든 프로세스의 virtual address는 서로 같다. 여기서 다른건 physical address이고 그 실제 주소는 OS만 알 수 있다!

### Who will going to do Mapping

예전에는 virtual address를 physical address로 바꿔주는 작업을 OS가 해야 한다고 여겼다고 한다. 그러나 이 작업은 너무나도 빈번하게 일어난다. OS가 매핑을 담당하게 되면 컴퓨터의 속도가 굉장히 느려진다.

그래서 요즘에는 하드웨어의 도움이 필수가 되었다. translation을 하기 위한 **mapping table**은 OS가 만들어주지만, 그 매핑 테이블을 보고 실제로 바꾸는 역할은 하드웨어가 담당하고 있다.

c.f) 더 최근에는.... virtual 머신의 OS( = 게스트 OS)를 위한 translation을 누가 하느냐? 에 대한 논의도 일어나고 있다고 한다. 지금은 호스트 운영체제 소프트웨어가 해주고 있는데 이것 역시 하드웨어의 도움이 필요한지가 현재 연구거리라고 한다.

---

# Memory API

= system call.

- 사실 우리가 알고있는 C++의 new, C의 malloc은 라이브러리 함수이지 실제 system call은 아니다.
- 메모리 할당/해제를 맡는 `vrk`, `svrk`라는 함수가 따로 존재한다. 이 함수에서 힙을 증가/감소 시키는 작업을 한다.
    - 하지만 우리가 이 함수를 직접 호출하게 되면 굉장히 위험한 일이 발생할 수 있다.
        - 왜냐하면 저 함수들이 lib.c 안에서 "여기는 할당되어있고, 여기는 써도 되고.." 등등을 파악하고 있는데 이를 망가트리는 셈이 되기 때문이다.
    - new, malloc은 저 함수들의 wrapper function이다.

### Detect Memory Leack

`:>valgrind` 를 입력하면 다양한 memory leak를 감지해서 알려준다고 한다.

### Dangling Pointer

= 포인팅하고 있는 대상이 이미 사라지고 없는 포인터.

- 그러니까 `int *im_pointer = 4` 를 해줬다면 `4`를 담고 있는 메모리 공간이 먼저 `free` 되어버려서 결국에는 `im_pointer`가 가리키고 있는 공간이 사라지게 되는 경우, `im_pointer`를 dangling pointer라고 부른다.
- dangling pointer가 예전에 가리키던 영역이 재할당 된 경우 아주 큰 에러가 발생하고 만다.

---

# Address Translation

### Memory Virtualizing with Hardware

CPU 가상화와 마찬가지로 메모리 가상화 역시

- OS가 메모리의 주도권을 쥘 수 있으면서
- OS가 너무 많은 메모리를 차지하지 않도록
- 또한 **메모리를 효율적으로 사용**할 수 있도록 해야한다.

앞서 메모리 가상화를 위해서는 하드웨어의 도움이 필수적이라고 했는데, 사실 그 도움을 받지 않더라도 할 수는 있다.

- 하지만 그런 경우는 굉장히 mission-critical한 운영체제의 경우이다.
    - e.g) 전투기에 올라가는 비행 제어 소프트웨어, 발전소에 올라가는 프로그램들
    - 평생 해야 하는 일이 단 한가지 밖에 없는 OS이다.
    - 이럴 때는 어느 address에 접근하고 얼마나 할당해야하는지 이미 정해져있다. 그래서 direct execution을 안전하게 할 수 있다고 한다.
- 결국 범용 운영체제(general OS)는 여전히 하드웨어의 도움이 필요하다.

그렇다면 어떤 하드웨어의 도움이 필요하단걸까?

- register 중에는 **control register number3:** `cr3`의 도움이 필요하다.
    - mapping table의 base address를 이곳에 저장한다.
- `TLB`: **Translation Look-aside Buffer**
    - 위의 `cr3`을 보고 매핑 테이블이 어디에 있는지 알아낼 수 있다.
    - 그러면 이제 그 매핑 테이블이 있는 곳으로 가야하는데 그러기 위해서는 메모리에 한번 더 접근해야 한다.
        - 매핑 테이블은 메모리에 있으니까!
    - 그러면 mapping table을 *물리적으로* CPU와 가깝게 두면 속도가 향상될 수 있을 거야! 라는 생각을 기반으로 만들어진 것이 바로 TLB이다.
    - 따라서 이 곳에는 mapping table의 entry가 들어있다.
- `page-table` = mapping table.
    - mapping table에도 여러가지 종류가 있는데 이친구가 제일 많이 쓰인다.
    - paging 아키텍처에서 page-table을 사용한다.

# Assumptions

memory virtualization을 위한 **비현실적인** 가정 3가지. 간단한 방식부터 시작해서 마지막에는 이 가정을 모두 없애서 만든, 우리가 현재 사용하고 있는 메모리 추상화 기법을 알아볼 것이다.

이런 과정이 중요한 이유는 실제로 "비현실적인" 가정이 성립하는 경우도 이씩 때문이다. (e.g: 앞서 언급한 범용 OS가 아닌 경우) 이럴 때에는 굳이 가정을 무너뜨리고 만든 복잡한 방법을 쓸 필요가 없을테니 simplify 된 버전을 알아두는 것도 중요하다.

1. 유저의 address space는 실제 physical memory에서 **연속적**으로 되어 있어야 한다.
    - OS 입장에선 굉장히 편안한 가정이다. 프로세스 하나당 mapping entry table을 하나만 만들면 되니까!
2. address space의 크기는 physical memory의 용량보다 작아야 한다.
3. 모든 address space의 크기는 서로 같다.

놀랍게도 위의 가정 1, 2, 3을 모두 파괴한게 우리가 지금 쓰고 있는 OS이다.

1. physical address는 전혀 연속적이지 않고
2. 노트북 메모리가 16기가뿐이더라도 30기가를 malloc하면 어떻게든 돌아가긴 하며
3. address space의 크기는 물리적 메모리 용량보다 크다.

# Need for Help from Hardware

아래 C 코드를 보자.

```c
void func()
    int x;
    ...
    ...
    x = x + 3; // we will focus on here.
```

`x = x + 3;` 부분을 컴파일한 어셈블리 코드는 다음과 같다.

```asm
128: movl 0x0(%ebx), %eax   ;Load
132: addl $0x03, %eax       ;Add
135: movl %eax, 0x0(%ebx)   ;Store
```

그러니까 1. 기존의 `x` 값을 불러오고 2. 3을 더하고 3. 다시 x에 저장하는 총 3가지 과정이 필요하다.

- 왼쪽의 `128`, `132`, `135`는 프로세스 address space의 **code** 영역의 주소다.
- %ebx에는 `x`의 주소값이 들어있는 상태다.

이 과정을 address translation 관점에서 좀 더 자세히 살펴보자. address translation은 **메모리에 한 번 접근 할 때마다 1번씩** 일어난다. 모든 메모리 주소는 virtual address이기 때문에 실제 데이터의 위치에 접근하려면 physical address로 바꿔야 하기 때문이다.

## 메모리에 얼마나 자주 접근하나요

어셈블리 명령어가 3개라는 뜻은 각 명령어를 fetch, execute하는 과정이 3번 일어난다는 의미이다. 따라서 총 6단계가 필요할텐데..!

### 1. `movl` 명령어 fetch

1. PC(Program Counter: 프로그램 카운터)가 128을 가리키고 있다.
    - PC는 다음에 실행될 명령어의 주소를 저장하는 역할을 한다.
2. "128"은 virtual address이기 때문에 이를 physical address로 바꾸는 **translation**이 한 번 일어난다.
3. physical address에 저장되어 있던 "movl" instruction을 IR(Instruction Register)에 담는다.
4. 이후 PC가 1 증가하여 다음 instruction의 주소(= 132)를 가리킨다.

### 2. `movl` 명령어 execute

1. IR을 보고 %ebx가 가리키고 있는 곳(= `x` 값이 저장된 곳)으로 간다.
    - 이 때 %ebx가 가리키고 있는 곳이 결국 메모리이기 때문에 **translation**이 한 번 일어난다.
2. 그리고 그 값을 %eax에 넣으면 instruction 수행이 끝난다.

### 3. `Addl` 명령어 fetch

1. "132"를 physical address로 바꾸는 **translation**이 한 번 일어난다.
2. physical address에 저장되어 있던 "Addl" instruction을 IR에 담는다.
3. 이후 PC가 1 증가하여 다음 instruction의 주소(= 135)를 가리킨다.

### 4. `Addl` 명령어 execute

1. IR을 보고 %eax에 있던 값과 상수 0x03을 더하면 instruction 수행이 끝난다.

### 5. `movl` 명령어 fetch

1. "135"를 physical address로 바꾸는 **translation**이 한 번 일어난다.
2. physical address에 저장되어 있던 "movl" instruction을 IR에 담는다.
3. 이후 PC가 1 증가하여 다음 instruction의 주소를 가리킨다.

### 6. `movl` 명령어 execute

1. IR을 보고 %ebx가 가리키고 있는 곳(= 기존 `x`에 해당하는 값이 저장된 곳)의 physical address를 얻는다.
    - 즉, **translation**이 한 번 일어난다.
2. %eax 레지스터에 있던 값(= `x + 3` 값이 저장된 상태)을 해당 메모리 영역에 저장하면 instruciton 수행이 끝난다.

여기까지가 `x = x + 3;` 에 해당하는 동작을 수행하는 과정이었습니다! tada~~~

그러니까 이렇게 간단한 과정에서도 5번이나 메모리에 접근을 해야 했는데... 더 큰 프로그램에서 address translation이 필요한 경우에 OS가 수행하면? 현재 동작 중인 프로세스를 멈추고 모드 스위치를 해서 할 일을 다 끝낸 다음 다시 프로세스로 모드 스위치를 한다는 의미인데 그러면 너무너무너무 느려서 견딜 수 없을 것이다. 진짜 완전 느리겠죠?

그래서 하드웨어의 도움이 절실하다!

---

# Dynamic Relocation

프로세스를 여러개 돌리면 각 프로세스의 physical memory 시작 지점은 달라질 수밖에 없다.

## Base and Bounds Register

굉장히 빠르다. 지금까지 나온 translateion 방식 중 이 방식보다 빠른게 없을 정도로 빠르다. 로직도 굉장히 간단하다.

초창기에는 모든 프로세스가 크기가 고정되어 있었고 물리적으로 **연속적**인 메모리 공간을 할당받았기 때문에 프로세스의 physical memory의 시작점&끝점만 알고 있으면 전혀 문제될 것이 없었다.

- Base and Bounds: 프로세스의 메모리 영역 시작점과 끝점만 알고 있으면 쉽게 나머지 주소를 translate할 수 있겠군! 이란 생각으로 만든 방법.
    - Base, Bound 주소값을 저장하는 register 두개만 있으면 프로세스의 메모리 영역을 완벽하게 나타낼 수 있다.


$$
\begin{aligned}
&physical \; address = virtual \; address + base\\
&0 < virtual \; address < bounds
\end{aligend}
$$

아래의 조건(virtual address의 범위)을 확인할 때에는 virtual address로 미리 확인해도 되고, 거기에 base 값을 더한 physical address 값으로 확인해도 무방하다. 그리고 이 조건을 만족하기만 하면 바로 메모리에 접근가능하다.

### Hardware Requirements

- Privileged mode: 유저모드 프로세스가 그보다 높은 권한을 필요로 하는 operation을 동작시키는 것을 막을 수 있어야 한다.
- Base/Bounds registers: 프로세스의 base, bounds를 저장하는 레지스터.
- Ability to translate virtual addresses and check if within bounds: 이 방식의 경우에는 굉장히 간단하다.
- Privilieged instructions to update base/bounds: OS만 가능해야 한다.
- Privilieged instructions to register exception handlers: OS만 가능해야 한다.
    - virtual address가 기준 범위를 벗어난 경우에 핸들러가 적절한 처리를 해 줘야 한다는 의미이다.
- Ability to raise exceptions: 프로세스가 그보다 높은 권한이 필요한 operation 동작을 하려고 하거나 virtual address가 기준 범위를 벗어난 경우에는 exception을 발생시킬 수 있어야 한다.

### OS Requirements

- 프로세스가 **running 되기 시작할 때**:
    - physical memory 상의 공간을 찾아야 한다.
    - 즉, base/bound register를 줄 수 있어야 한다.
- 프로세스가 **terminate 되었을 때**:
    - 메모리 사용권을 회수할 수 있어야 한다.
    - 즉, base/bound register를 다시 회수할 수 있어야 한다.

- context **switch가 일어났을 때**:
    - 실행되고 있던 프로세스의 base/bound register를 저장하고 있어야 한다.
    - 즉, 그 두 레지스터도 함께 switch 해줘야 한다.