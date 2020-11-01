---  
layout: post  
title: "[OS] CPU 가상화 (2) - context switch, protocol"
categories: study
tags: study 2020-1 os CPU virtualization process switching mode context protocol register
comments: true
---

[CPU 가상화 (1) - virtualization, process, mode switch](https://broccolism.github.io/study/2020/03/23/OS-CPU-virtualization-1/){: target="_blank"}에서 이어집니다.

## 순서
[1) Limited Direct Execution (continued)](#limited-direct-execution)  
[2) 새 프로세스 실행: Context Swtich](#context-switch)  
[3) 프로토콜 뜯어보기](#limited-direction-execution-protocol)

## Limited Direct Execution
### 우리의 Problem 2: 프로세스 간 Switching
OS가 어떻게 프로그램으로부터 주도권을 가져올 수 있나?
1. A cooperative approach: 프로그램이 자발적으로 OS에게 시그널을 보내주는 경우.
    - 이 때 OS는 그저 system call이 들어오길 기다릴 뿐...  
    프로그램이 **주기적으로** CPU 주도권을 *포기*하면서 OS에게 넘겨주는 방식.
    - 초기 OS는 이런 방법을 썼으나
        1. 프로그램이 **주기적으로** CPU 주도권을 포기하는것을 구현하기 어려움
        2. 혹시나 프로그램 설계 시 이 부분을 까먹으면? ㅋㅋ..
        3. 딱히 안전하지 않음
        4. 프로세스가 무한 루프에 빠지면 재부팅하는 것 외엔 방법이 없음
    - 등의 이유로 더이상 쓰지 않는다.
2. A Non-Cooperative Approach: OS가 강제로 주도권을 가져오는 것
    - 현재 사용하는 방식.
    - **A Timer Interrupt**
        - 시스템 부팅 단계에서 OS가 `timer`를 셋팅
        - `timer`는 수 milliseconds마다 `interrupt`를 발생시킴
        - `interrtup` 발생 시,
            1. 현재 프로세스의 실행을 중단하고
            2. 현재 프로세스가 쓰던 `register`를 모두 `kernal stack`에 저장  
            (이 때 사용하는 `kernal stack`은 각 프로세스마다 부여된 것을 사용.  
            그래서 각자 무사히 핸들러를 호출할 수 있다.)
            3. OS안에 미리 만들어둔 `interrupt handler`가 실행됨
        - 따라서 timer interrupt가 **주기적으로** OS에게 CPU 주도권을 줄 수 있다.

---

`Scheduler`는 `timer interrupt`를 받았을 때 이전에 진행 중이던 프로세스를 계속 실행시킬지, 아니면 다른 프로세스에게 CPU 주도권을 줄 지 결정한다. 이 때 이전 프로세스가 이미 충분한 시간 동안 돌고 있었다면 다른 프로세스에게 CPU 주도권을 주겠다고 결정한다. 그러면 OS는 `context switch` 를 수행한다.

# Context Switch
- `Mode Switch`와의 차이점
    - Mode Switch: user mode → kernal mode
    - Context Switch: `mode switch`가 일어난 후에" = "이미 프로세스 A의  `kernal mode`로 바뀐 후에" 다른 프로세스 B의 `kernal mode` 로 교체!
        - 즉, context switch가 일어나기 위해서는 먼저 mode switch가 일어나야 한다.
        - context switch의 핵심적인 부분은 바로 `OS`가 하는 것!

### 무슨 일이 일어나나요? 프로세스 A → 프로세스 B일 때
1. A가 사용 중이던 `register`의 값을 A의 kernal stack에 저장
    - `proc` 구조의 `context` 구조체에 모두 저장합니다.
2. B의 kernal stack에서 다시 `register`의 값을 가져옴
3. B의 kernal stack으로 stack switch

# Limited Direction Execution Protocol
OS가 프로그램으로부터 주도권을 가져오고 다른 프로그램이 CPU에서 실행되게 만드는 전체적인 큰 그림을 확인해보자!
시간의 흐름은 아래쪽 방향이다.

|OS(`kernal mode`)|Hardware|Program(`user mode`)|
| :--- |:--- |:--- |
|부팅 중 interrupt timer 시작| | |
| | 수ms마다 timer interrupt 발생 | |
| | | 프로세스 A 실행|
| |timer interrupt 발생| |
| |regs(A)→k-stack(A)| |
| |mode-switch| |
| |trap handler로 *jump*| |
|timer interrupt handler 호출
(이 때 A의 kernal stack 사용)| | |
|프로세스 B 실행 결정| | |
|*call `swtich()`*| | |
| |k-stack(B)에서 regs(B) 복구| |
| |user mode로 전환| |
| |B의 PC로 *jump*| |
| | |프로세스 B 실행|

이 때, call `swtich()`를 하면
    1. regs(A)→proc(A)
    2. proc(B)의 regs(B)를 실제 CPU register에 리스트화
    3. k-stack(B)로 switch
이 순서대로 일어난다.

- 프로그램 입장에서는 *저절로* 프로세스가 바뀐 것처럼 보이지만 사실상 context swtich의 핵심적인 부분은 `OS`가 수행한다.
- 아래 이미지는 `switch 함수` 안의 switch routine의 어셈블리 코드.
    - xv6에서 context는 각 프로세스마다 갖고 있는 `procs` 안에 있는 context이다.
    - `switch` 함수의 parameter는 그 친구의 포인터를 갖고 온 것.

![code](https://broccolism.github.io/assets/img/OS/2020-03-27.jpg)

- 코드를 보면 크게 두 부분으로 나뉜다. 레지스터를 save하고, load하는 부분.

### Save Old Registers
이 때 지금 실행 중인 프로세스의 k-stack에는 순서대로  new(새로 실행할 프로세스)와 old(현재 프로세스)의 *proc* 구조체의 시작 주소,  *return address* 가 쌓여있다. 즉 %esp는 *return address*를 갖고 있는 셈이다.  

1. `movl 4(%esp), %eax`: (현재 스택 포인터 + 4) 에 위치한 값을 %eax에 저장한다.
    - 그 값은 현재 프로세스의 proc 구조체 안의 context의 시작 주소이다.
2. `popl 0(%eax)`: (현재 스택 포인터)가 가리키고 있는 값을 pop하여 %eax에 저장한다.
    - 그 값은 switch()를 부른 caller의 "call swtich()" 바로 다음 instrcution의 주소이다.
3. `movl ~`: %esp부터 %ebp까지 사용 중이던 모든 레지스터들을 **순서대로** 저장한다. 이 순서를 지키는 것이 중요하다. 나중에 복구할 때 역순으로 복구하기 때문이다.
    - 저장하는 위치는 현재 프로세스의 proc 구조체 안의 context 구조체의 .esp, .ebx, ... , .ebp 변수이다. 모두 *int* 타입 변수이다.

이제 old 프로세스의 %esp에는 자기자신, 그러니까 old 의 *proc* 구조체의 시작 주소값이 저장되어 있다. register saving 단계가 끝나면 %esp에는 자기 자신의 주소가 담겨있는 셈이다.  

### Load new registers
위와 마찬가지로, 새로 실행하려는 프로세스 역시 %esp에는 자기 자신을 가리키는 주소값이 저장되어 있다. 그리고 이 프로세스의 k-stack에도 역시 new와 old 가 있고 %esp는 old를 가리키고 있다. 단, 이 때의 old가 이전 프로세스의 new이다.  

1. `movl 4(%esp), %eax`: 여기서 %esp는 아직 이전 프로세스의 k-stack의 일부를 가리키고 있다. 바로 old! 그래서 `4(%esp)` 에는 이제 막 실행하려는 프로세스, 즉 new 의 context 구조체의 시작 주소가 있다. 이를 %eax에 저장한다.  
2. `mov ~`: 앞에서 언급했듯이 각 레지스터를 역순으로 복구한다. 실제 CPU의 레지스터에 올린다는 말이다.  
3. `movl 4(%eax), %esp`: 이제서야 비로소 *stack switch* 가 일어났다. 아주 환상적인 부분이다.  
4. `pushl 0(%eax)`: push의 목적지는 새 프로세스의 k-stack이다. 여기에 return address를 저장한다.  