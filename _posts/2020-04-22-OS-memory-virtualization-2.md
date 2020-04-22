---  
layout: post  
title: "[OS] Memory Virtualization - Segment"
categories: classes
tags: os memory segment fragmentation allocation
comments: true
---
## 순서
[1) 기존 방식의 문제점과 원인](#inefficiency-of-the-base-and-bound-approach)  
[2) 보완: Segmented Model](#segmented-memory-model)  
&nbsp;&nbsp;&nbsp;&nbsp;[2-1) address translation](#address-translation-on-segmentation)  
&nbsp;&nbsp;&nbsp;&nbsp;[2-2) 어떻게 segment를 구분할까?](#referring-to-segment)  
&nbsp;&nbsp;&nbsp;&nbsp;[2-3) segment 사이즈는 어떻게 정하지?](#fine-grained-and-coarse-grained)  
[3) Freed 공간을 관리하는 방법](#free-space-management)  
&nbsp;&nbsp;&nbsp;&nbsp;[3-1) 메모리 한조각 드실래요? Slab Allocator](#slab-allocator)  

# Inefficiency of the Base and Bound Approach
- base and bound approach에서는 한 프로세스의 address space 전체가 physical memory에 **한 덩어리로** **모두** 올라가야만 했다.
    - 그렇지 않으면 base and bound register만 가지고는 translation을 할 수 없으니까.
- physical memory의 공간이 많이 남아 있을 때, 프로세스의 address space가 살짝이라도 더 크면 프로세스를 실행시킬 수 없는 문제 발생!

## Fragmentation Problem
- 시간이 지나면서 프로세스들의 사이즈가 서로 달라지게 되었다. 앞에서 살펴봤던 3가지 가정 중 하나가 깨진 것이다.
- 그러다보니 특정 프로세스가 종료되고 새로운 프로세스가 메모리 점유를 해야 할 때, 빈 공간에 들어갈 수 없는 경우가 생겼다.
    - 이전에 돌고 있던 프로세스 하나하나가 사용하던 메모리 공간이 새 프로세스의 것보다 더 작은 경우.
![fragmentation]](https://broccolism.github.io/assets/img/OS/2020-04-22-1.jpg)
- **External Fragmentation**: 메모리 전체의 가용 공간은 새 프로세스를 실행시키기에 충분하지만 그 공간이 fragment로 나누어져 있어서 새 프로세스를 실행시킬 수 없는 경우를 external fragmentation이 생겼다고 말한다.
    - 이런 문제는 비단 운영체제만의 문제가 아니다.
    - resource를 나눠줘야 하는 것이라면 무엇이든 생길 수 있는 문제다.

### Cause of the External Fragmentation
- base and bound approach 문제의 원인
    - base and bound register만을 사용하기 때문에 한 프로세스의 메모리 영역을 둘 이상으로 쪼갤 수 없다.
    - 그럼 왜 base and bound register만을 사용하게 되었지?
    - *비현실적인 가정* 중 **프로세스의 addres space는 physically continous**하다는 항목 때문!

### Relaxation of the Assumption
- 그렇다면 저 가정을 깨뜨려 보자.
- 어떻게 깨뜨리면 좋을까? = 어떻게 프로세스의 address space를 쪼개면 external fragmentation 문제를 해결할 수 있을까?
    - 우리가 사용하는 메모리 영역의 logical한 개념을 기준으로 잘라보자.
        - code/data/heap/stack 영역끼리는 서로 다 붙어있는게 **편하다**. (반드시 그래야만 한다는게 아니다.)

# Segmented Memory Model
## Memory Segmentation
- **Segment = a contiguous portion of the address space of a particular length.**
    - e.g) logically-different segment: code, stack, heap...
    - 그러니까 base and bound approach에서 모든 프로세스의 address space는 **큰 segment 하나**였다고 보면 된다.

### Placing Segment in Physical Memory
![segment](https://broccolism.github.io/assets/img/OS/2020-04-22-2.jpg)

프로세스의 address space 자체의 base and bound가 아닌, segment의 base and bound를 저장하는 방식!
- 한 프로세스에게 필요한 메모리 공간을 작게 쪼개어서 external fragment가 생긴 곳에도 할당할 수 있게 되었다.
- 대신 저장하는 base and bound는 각각 segment의 갯수만큼 있어야 한다. 즉, 레지스터가 그만큼 더 있어야 한다는 뜻이다.

### Segmentation Fault
**segmentation fault**: OS가 알고 있던 segment의 영역을 벗어난 곳으로 접근하려고 하면(= **illegal address**) 발생시키는 것.
- 이 오류는 segmented memory model이 생겼을 때부터 있었던, 역사가 깊은 오류였던 것이다!

## Address Translation on Segmentation
- base and bounds와 비슷하게 한다.


$$
physical\;address\;=\;offset\;+\;base
$$


- 위 식을 만족하는 경우에는 허용, 그렇지 않은 경우에는 메모리 접근을 허용하지 않는다.
- 하지만 base and bounds와 완벽하게 같은 방법을 쓰면 곤란하다. segmentation을 해버렸기 때문이다.
    - 따라서 segment별로 **relative offset**이 필요하다.
    - **code** segment의 offset은 0부터 시작해도 된다.
        - 프로세스 address space의 시작점이 code segment의 시작점이기 때문이다.
    - 하지만 **heap** segement의 offset은 그대로 사용하면 안된다.
        - virtual address space에서 heap 영역의 시작점은 4KB부터이다.
        - 그러면 physical address로 바꾸기 위한 offset은 (heap 영역의 어딘가를 가리키는 virtual address) - 4KB가 되어야 한다.
        - e.g) address 4200 의 offset = 4200 - 4K = 104
            - 이 값을 heap 영역이 시작되는 physical address에 더해주면 된다.

## Referring to Segment
어떻게 segment를 구분할 것인가?

### Explicit Approach
초창기에 사용한 방식.
- address는 14비트로 나타낸다.
    - 그 중 상위 2비트로 어떤 segment인지 구분한다.
        - **segment identifier**라고 부른다.
        - 00: Code / 01: Heap / 10: Stack / 11: -
    - 나머지 하위 12비트는 offset으로 사용한다.
- 따라서 valid check는 아래와 같이 이루어졌다.

```c
    // get top 2 bits of 14-bit VA 
    Segment = (VirtualAddress & SEG_MASK) >> SEG_SHIFT
    
    // now get offset 
    Offset = VirtualAddress & OFFSET_MASK 
    if (Offset >= Bounds[Segment])
    	RaiseException(PROTECTION_FAULT)
    else
    	PhysAddr = Base[Segment] + Offset
    	Register = AccessMemory(PhysAddr)
```

- Hardware가 주의해야 할 점
    - stack segment는 *거꾸로* 자란다. High memory에서 Low memory로 자란다는 뜻이다.
        - 나머지 segment는 그렇지 않기 때문에 하드웨어가 이를 알고 있어야 한다.
    - 또한 code sharing 등 protection 항목도 신경써줘야 하기 때문에 하드웨어는 추가 정보를 알고 있어야 한다.

![segmentation register values](https://broccolism.github.io/assets/img/OS/2020-04-22-3.jpg)

## Implementation of Multi-Segment Model
- base and bounds 모델과 비슷하게 하면 당연히 안된다.
- 각 프로세스별 base and bound가 아니라, **segment**별 base and bound를 저장해줘야 한다. 여기에 더해 valid bit 등이 추가되어야 한다.
    - 이는 OS가 설정한다.
- 하지만 여전히 간단한 로직으로 동작할 수 있다.
    1. virtual address의 상위 비트를 보고 어떤 segment인지 구분
    2. 해당 segment의 base에 offset을 더한다.
        - 만약 더한 값이 해당 segment의 bound를 넘어가면 Seg V 발생
        - 아니라면 다음 단계로
    3. 계산한 physical address가 가리키는 곳이 valid한지 확인한다.
        - 만약 invalid한 영역이라면 Seg V 발생
        - 그렇지 않다면 접근!

# Fine Grained and Coarse Grained
segment 사이즈를 얼마나 작게 할지에 대한 답은 정해져있지 않다. design choice이기 때문이다. 상황에 맞게 결정해야 할 일이다.
- Coarse-Grained: segmentation의 갯수가 작다.
    - address translation 속도가 빠르다.
- Fine-Grained: setmentation의 크기가 작다.
    - address space를 줄 때 좀 더 flexible하게 할 수 있다.
        - external fragmentation 문제를 해결할 수 있다.
        - 그렇지만 점점 finer해질수록 segment table이라고 부르는, translation을 위해 저장하는 base and bound의 갯수가 늘어난다.
        - 결론적으로 하드웨어에 부담을 주는 일이 된다.
        - 그리고 CPU의 사이즈가 정해져있기 때문에 한계가 명확하다.

그렇다고 무작정 coarse-grained쪽으로 가기에는 external fragmentation 문제가 다시 일어난다. 그래서...
- 한 번 켜지면 굉장히 오랜 시간동안 동작해야하고 수행할 일이 정해져 있는 경우
    - coarse-grained
- 작은 프로그램부터 큰 프로그램까지 모두 돌려야 하는, 범용 운영체제인 경우
    - fine-grained

## OS Supports Fragmentation
- external fragmentation이 발생한 경우 OS 입장에서 해결할 수 있는 방법이 있다.
- **compaction**: 현재 (물리적으로)메모리에 있던 segments를 다시 **재정렬**하는 것.
    ![compactoin](https://broccolism.github.io/assets/img/OS/2020-04-22-4.jpg)
    - cost가 많이 필요하다.
        1. 현재 실행 중인 프로세스를 멈춘다.
        2. 메모리에 올라와있던 데이터를 모두 복사한 후, 빈틈 없이 다시 메모리에 올린다.
        3. 각 프로세스별 base and bound register를 수정한다.
        4. 이전에 실행중이던 프로세스를 다시 실행시킨다.
    - 위 과정을 통해 *연속적인* 가용 공간을 크게 늘릴 수 있어 fragmentation 문제를 일시적으로 해결할 수 있다.
    - 단점: 모든 segment 사이의 빈틈이 아예 없다면 heap 영역을 dynamic하게 늘려야 하는 경우처럼 추가 메모리 공간이 필요한 경우 곤란하게 된다. 즉, 해당 segment가 **자라야** 하는 경우에는 전체 segment를 다시 재할당해줘야 하는 문제가 발생한다.
        - 따라서 compaction은 결코 간단한 작업이 아니다. 이래저래 고려할 부분이 많다.

---

# Free Space Management
- heap 영역의 메모리를 할당/해제하는 것은 OS도, 우리도 아닌 라이브러리이다.
- 가용 메모리 공간을 linked list 형태로 저장하는 **free list**를 관리한다.

### Splitting
free 영역을 쪼개어서 일부는 shrink, 일부는 grow하게 하는 것.
- 즉, 일부는 계속 free 상태로 두고, 나머지는 할당해주는 것.

### Coalescing
연속적인 free 영역이 여러개의 chunk로 나뉘어져 있는 경우 그들을 모두 합쳐주는 것.
- 즉, discripter(free list)에게 free chunk를 합쳤다고 알려주는 것.
- 이 개념은 위에서 보았던 *compaction*과는 다른 개념이다.
    - compaction: 연속적이지 않던 chunk를 연속적으로 합치는 것.
    - coalescing: 이미 연속적으로 존재하던 chunks를 하나의 chunk로 합치는 것.

### Tracking
무엇을 트래킹하나요? allocated regions의 size! 그 덕분에 우리가 `free`를 호출 할 때 사이즈를 parameter로 주지 않아도 알아서 적절한 구간까지만 할당이 해제될 수 있다.

- 이를 위해서는 각 chunk를 할당해주면서 요청받은 사이즈 외에 별도로 **header**를 저장하기 위한 추가 용량을 사용한다.
    - 아래는 일반적인 간단한 header의 예시 코드다.

```c
typedef struct __header_t {
    int size;
    int magic; // 메모리 침범 여부를 기록하는 magic number.
} header_t;
```

- 이 때 `magic` number는 type casting을 통해 linked list의 `next` 역할을 할 수 있다.
- 새로운 freed chunk가 생겼다면 계속해서 link함으로써 트래킹을 할 수 있다.
- free list의 각 node 역시 마찬가지로 메타 데이터가 필요하다.

```c
typedef struct __node_t {
    int size;
    struct __node_t *next;
} nodet_t;
```

## Growing the Heap
- 아무리 조절을 해도 `malloc`, `new` 등으로 동적할당을 요청한 용량을 감당해낼 수 없다면 *물리적으로* heap 영역을 확대해야 한다.

![heap](https://broccolism.github.io/assets/img/OS/2020-04-22-5.jpg)

- 즉, heap segment의 사이즈를 키워야 하기 때문에 physical memory에서 사용되지 않고 잠자고 있던 새 영역을 heap으로 만들어주면 된다.
    - 이 때 기존의 heap segment와 연속적으로 할당할 것인지, 아니면 새로운 segment를 만들 것인지는 역시 디자인 방식에 따라 달라진다.

## Basic Strategies
1. Best Fit
    - 요청받은 용량이 x일때, free list의 chunk 중 x와 가장 가까운 값을 크기로 갖는 chunk를 돌려주는 방식.
        - 즉, 가장 tight하게 fit하는 chunk를 주는 것이다.
    - 따라서 전체 free list를 한 번 순회를 해서 x보다 큰 값 중 최솟값을 크기로 갖는 chunk를 찾아야 한다.
2. Worst Fit
    - free list에서 가장 큰 chunk의 일부를 잘라 돌려주는 방식. 나머지는 다시 free list의 chunk로 들어간다.
        - 이를 구현하는 방법은 다양하다.
            - e.g) free chunk를 크기순으로 관리하는 방식
3. First Fit
    - free list를 앞에서부터 탐색하되 요청받은 용량을 만족하는 chunk를 처음 만난 순간 그 chunk를 돌려주는 방식.
4. Next Fit
    - free list를 앞에서부터 탐색하지 말고 이전에 탐색했던 위치 바로 다음 chunk부터 탐색하는 방식.

### Segregated List
위에서 살펴본 1, 2, 3, 4번은 모두 free list가 하나뿐일 경우였다. 하지만 꼭 free list가 하나만 있어야 할 필요는 없으니까 크기순으로 free list를 여러개 만드는 방식도 쓸 수 있다. 예를 들면 chunk의 크기가...
- 1 ~ 9 bytes
- 10 ~ 99 bytes
- 100 ~ 999 bytes
- ...
인 경우로 나누어 각자 free list를 만들어주어 관리하는 것이다.

### Slab Allocator
어떤 memory object의 경우에는 lifetime이 굉장히 짧을 수도 있다. 즉, `malloc`과 `free`가 매우 빈번하게 일어나는 경우를 말한다. 이 때에는 보통 그 size를 이미 알고 있는 경우가 많다. 이런 경우에는 극단적인 segregated list를 사용할 수도 있다.
- 그럴 때 만들 수 있는 것이 **a pool of pre allocated memory objects** 이다.
    - **slab allocator**가 이 slab을 관리한다.
        1. 대상 struct의 크기를 알아놓고, 메모리를 해당 크기별로 미리 잘라놓는다.
        2. `malloc` 형태로 요청이 들어가는 것이 아니라 `slab(n)` 식으로 (n은 미리 잘라놓은 칸의 갯수) 요청을 받는다.
        3. 요청받은만큼 할당을 해준다.
        - 이렇게 하면 속도가 눈에 띄게 향상된다.
    - 그러니까 메모리 전체를 pool of memory objects로 보겠다는 방식이다.
    - 각 object를 **slab**이라고 부른다.
        - 우리가 흔히 말하는 "슬라브"와 같다.
        - 똑같은 크기를 갖는 memory objects를 말한다.
- 주요 대상: `task_struct` . 즉, 프로세스의 메타 데이터를 말한다.
    - 리눅스로 치면 `PCB`: process control block
    - xv6로 치면 `proc` 구조체!
굉장히 실용적인 디자인이라 대부분의 회사에서 이 방식을 사용하고 있다고 한다.

### Buddy Allocation
리눅스 초창기 버전에서 사용된 방식. freed 메모리 청크를 쪼갤 때 계속해서 **절반**으로 쪼개고, 요청받은 값보다 너무 크면 또다시 **절반**으로 쪼개어 나가는 방식.

- 이 방식은 **coalescing**을 위한 overhead를 효과적으로 줄여준다.
- 하지만 이 방식의 단점은 실제 필요한 메모리 용량보다 훨씬 많은 양을 할당해줄 수 있다는 사실이다.
    - 예를 들어 513KB 요청이 들어오면 반드시 절반으로 나누어야 하기 때문에 512KB를 못 주면 바로 1024BK를 할당해버리게 된다.
    - 이런식으로 한 chunk의 일부 공간이 남아돌아서 사용가능함에도 불구하고 이미 주인이 존재하는 fragmentation 문제를 **internal fragmentation**이라고 한다.