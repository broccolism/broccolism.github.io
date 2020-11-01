---  
layout: post  
title: "[OS] CPU 가상화 (1) - virtualization, process, mode switch"
categories: study
tags: study 2020-1 os CPU virtualization process switching fork exec
comments: true
---
## 순서
[1) OS란?](#introduction-to-operating-systems)  
[***OS 디자인 목표](#design-goals-to-make-os)  
[2) 프로세스](#the-process)  
[3) 프로세스 API](#process-api)  
[4) 메커니즘: Limited Direct Execution](#mechanism)  

# 3 Easy Pieces of Operating System
- Virtualization: 실행 중인 프로그램이 혼자 모든 자원을 쓰는 것처럼 해주는 가상화. 대상은 컴퓨터의 모든 자원
- Concurrency: 여러 프로그램이 자원을 공유할 때 안전하게 공유할 수 있도록 하는 것
- Persistence: 자원을 저장할 때 잘 구조화하여 저장해 찾기 쉽도록 함

## Introduction to Operating Systems
- 프로그램을 구동시키면...
    - 디스크로부터 프로그램을 불러와 메모리에 로딩
    - 프로세서(CPU)가 첫 번째 instruction을 가져와 **fetch**
    - 그 instruction의 의미를 **decode**
    - 해석한 instruction에 따라 **execute**
    - 프로세서가 **다음 instruction**으로 이동함

- 프로그램이 동작하는동안 OS가 책임지고...
    - 프로그램이 쉽게 **실행되게 함**
    - 많은 프로그램들이 제한적인 용량의 물리 `메모리`를 서로 **공유하게 함**
    - 네트워크, 저장 장치, 모니터 등 `장치`와 잘 **상호작용하게 함**
    - 즉, 시스템이 _안전하고 적절하게_ 실행되도록 책임짐.

### Virtualization
OS는 physical resource → virtual form 으로 변환시켜야 한다. 즉, 각 프로그램에게 자신이 모든 자원을 사용 중인 것만 같은 `illlusion`을 줘야 한다.
- OS = Resource Manager
- 전체적 이미지: 프로그램 -> 운영체제 -> 물리적 자원

    - `System call`: 운영체제를 통해 물리적 자원을 이용하기 위해 유저가 사용할 수 있는 **interface**.
        - e.g) Run programs (enter) / Access memory / access devices

### Virtualizing the CPU
: 각각의 프로그램에게 illusion을 줘야 함

- 마치 각 프로그램이 **혼자 하나의 `CPU`의 모든 자원**을 **private하게** 사용하는 듯한
- 그 여러 개의 `CPU`가 **동시에** 일하고 있는 것만 같은
- **although** 실제 CPU는 하나 뿐이더라도

**physical memory** = an **array** of bytes.
- 프로그램은 모든 데이터 구조를 `메모리`에 저장함.
- 따라서 운영체제는 제한된 `메모리`를 여러 구역으로 나누어 각 프로그램별로 그 구역을 할당&매핑 해줘야 함! ⇒ **Virtual Address** 필요!

### Concurrency
problem: 한번에 너무 많은 작업을 하다 보니 발생하는 안 좋은 'race' 현상
⇒ 이를 막기 위해 OS가 무언가 해줘야 함.
- 한 `프로세스` 내의 여러 `스레드`는 같은 가상 메모리 공간을 공유함 ⇒ **race**! ⇒ interleaved transaction 발생 가능: CPU 개수가 많아질수록 발생 가능성이 높아짐.

### Persistency
DRAM은 volatile memory: 전원을 끄는 순간 정보가 다 날아감~.~
- 하드웨어: 하드디스크, SSD와 같은 장치는 그렇지 않음.
- 운영체제: 하드웨어 - 소프트웨어(혹은 상위 프로그램) 사이에서 `illusion`을 만듦
- 소프트웨어: "와 이 persistant한 저장 장치를 내가 다 쓰는거구만? 킄킄"
    - 파일 `file` = named storage! 껐다 켜도 정보를 안전하게 저장해주는, '이름이 붙은' 저장소

- 유저가 file을 저장하고 싶어 할 때, 운영체제는...
    - 실제 물리적 메모리의 어느 `위치`에 저장할 지 결정
    - `I/O request`를 줘야 함
    - `Journaling(Logging)` 혹은 `Copy-on-Write` 유지: 유저의 데이터가 **모두** 저장되거나, 혹은 저장되지 않게 해 줌. 즉, 일부만 소실되는 일이 없게 막아줌.

### Design Goals to Make OS
- **추상화**를 잘 시켜줘야 함
    - so that 프로그램과 유저가 사용하기 편하게
- 운영체제가 개입했을 때 **속도** 저하가 나면 안됨.
    - 너무 많은 overhead는 X
- applications 간 **Protection**!
    - `Isolation`: 프로그램끼리, 그리고 프로그램 - OS 간 miss behavior가 일어나면 안됨.

---

## The Process
### CPU virtualizing
OS는 `illusion`을 줘야 함. that 많은 CPU가 존재하는 것처럼!

- Time sharing: 실제로는 CPU에 *동시에* 접근할 수 없음. 그저 각각의 프로그램이 접근하는 시간을 아주 작게 나누어 그렇게 보이는 것처럼 만들 뿐.
    - 이에 대한 cost: performance.
        - 그러므로 성능에 영향을 주지 않고 아주 효율적으로 `context switching`을 해줘야 함.

### Process
= 현재 동작하고 있는 프로그램.
- 구성
    1. CPU state (registers)
        - 프로그램 카운터
        - 스택 포인터
        - 제너럴 레지스터
    2. Memory state (address space)
        - stack
        - heap
        - code
        - data 구역
    이 두가지 구성들을 잘 저장해두면 멈췄던 프로세스를 재개할 수도, 이후 재 실행을 위해 정상적으로 멈출 수도 있음
- `Process Control Block(PCB)`: 각 프로세스에 대한 정보를 담고 있는 C-structure.

### CPU 구성
- Arithmetic / Logic Unit: 계산
- Control Unit (State Machine): instruction 디코드 / 어떤 레지스터 사용할 지 결정 등등
- Instruction Register: 프로그램의 instruction이 불려와서(= fetch 되어) 저장되는 곳
- Instruction Pointer: fetch할 instruction의 주소를 가리킴 (eip)
    - 보통 4byte처럼 일정 바이트씩 증가하면서 다음 instuction을 찾음
    - eip를 강제적으로 바꾸는 것: system call, "go to" 등
- general memory register: 계산을 위해 사용되는 레지스터 (eax, ebx 등등..)

### Process States
![status-of-process](https://broccolism.github.io/assets/img/OS/2020-03-03-1.jpg)

- `Runnning`: 프로세스가 현재 프로세서에서 실행 중임
- `Ready`: 프로세스가 실행될 준비가 됨.
    ⚠ 실제로 프로세서에서 실행하는 프로그램 개수는 **어느 순간이든** 1개 뿐임. 나머지 *동시에* 동작하는 것처럼 보이는 프로그램은 ready 상태인 것
- `Blocked`: I/O request를 기다리는 등의 이유로 기다리고 있는 상태.

---

## Process API
프로세스: 프로그램이 실행되는 **순간** 존재할 수 있음.

- 프로세스 관련 interface
    - Create / destory / Wait / Miscell. ...... 등등
    - 이런 애들은 ALL 운영체제가 제공하는 것 = 전부 `system call`

운영체제는 (~~나는~~) 아래 대표적인 system call을 수행해야 합니다. 
- System Call 1: `fork()`
    caller를 복제한 새 프로세스 생성
    - caller proccess (= parent proccess)의 모든 state(CPU + Mem) 구역을 그대로 copy해서 `child proccess`를 만듦.
        - 단, fork()가 return할 때 parent에서는 child process의 pid를 주고, child에서는 0을 줌. 이것이 유일한 차이점.
        - 먼저 CPU를 점유하는 프로세스가 먼저 실행됨.
- System Call 2: `exec()`
    caller 자체를 input 프로그램으로 바꿔버림
    - exec()이 받은 input 프로그램이 실제로 존재하는지 찾고
        - 존재하면 `해당 프로그램`의 코드, 데이터 segment부분을 완전히 복제 ⇒ 현재 프로세스가 사용한 state를 모두 가져온 값으로 initialize = 아예 새로운 프로그램으로 바꾸는 것.
            - **따라서 exec()을 호출한 프로세스는 사라짐.**
        - 이 함수의 return address는 `해당 프로그램`의 main 함수의 첫 번째 줄!
            - 따라서 exec() 이후 그 어떤 코드가 있어도 그 영역은 UnReachable 영역이 됨!

- OS 입장에서 shell의 동작
    1. 사용자가 shell에서  특정 프로그램 이름을 넘겨줌
    2. `fork()`
    3. child precess에서 `exec()`을 이용해 "특정 프로그램"을 실행
        - 그동안 parent는 `wait`!
    4. child가 끝나면 다시 parent로 돌아옴.

- Process Creation: systsem call을 이용해서 가능
    1. 프로그램의 코드(instruction)를 모두 **메모리로** **Load** 하고, virtual memory 할당
        - 프로그램은 기본적으로 **실행 가능한 형태로** 디스크에 저장되어 있음.
        - *lazily*: 실제 프로그램이 실행될 때 이 작업을 수행함. 그 전엔 안 함.
    2. 프로그램의 **stack frame** 할당
        - 지역 변수, 함수의 인자, return address 를 스택에 올림
        - argc, argv로 initialize
    3. 프로그램의 **heap** 생성
    4. 글로벌 변수 등의 **static** **데이터** initialize
    5. CPU의 eip에 프로그램의 첫 번째 instruction의 주소를 올림
    6. 그 이후에는 프로그램이 실행됨! not OS.

---

## Mechanism
### Limited Direct Execution

---
*(2020.03.25 추가)*

"Direct Execution" 무슨 의미일까? 누가 뭘 direct하게 한다는걸까?
- 프로그램이
- 컴퓨터의 resource를
direct하게 사용하는 것을 의미한다. 그런데 이게 허용되면 *큰일*이 일어나고 만다.

---

따라서 특정 프로그램이 돌아가는동안 OS가 뭔가 CPU에 대한 control을 해야 함. 
- 안 그러면 bad 프로그램의 경우 `무한루프`에 빠지거나 보안을 건드린다거나 등등... 문제가 생김
- 그러니까 간접적으로 OS가 프로그램한테 명령을 내릴 수 있어야 하죠.

### CPU에 대한 control을 하면서 어떻게 효과적으로 가상화 하지?!: time sharing에 필수적인 요소.
- 관련 이슈 1. `Performance`: 어떻게 추가적인 overhead 줄이면서 가상화하지
- 관련 이슈 2. `Control`: 내가 CPU를 점유하면서 어떻게 더 효율적으로 동작시키지
    - Direct Execution
    ![scenario](https://broccolism.github.io/assets/img/OS/2020-03-03-2.jpg)
    위 시나리오는 우리가 main 함수를 굉장히 '잘', 그리고 언젠가 끝날 수 있게 짰을 때의 경우임. BUT 만약 실수로 `infinite loop`이 포함되어 있었다면?!?!?!!?!
    ⇒ OS는 다시는 주도권을 쥘 수 없게 됨.
    ⇒ 예시) 프로그램이 돌면서 system resource를 좀 쓰고 싶은데 그걸 도와줄 방법이 없음.

### 우리의 Problem 1: Restricted Operation
프로그램이 동작하면서 메모리나 CPU 등 resource를 좀 더 점유하고싶어하면? = 높은 특권을 가진 (praviliaged operation) = Restricted Operation.

- 운영체제 입장에서 중요한 operation.
- resource에 접근 가능한 애는 오로지 OS뿐이어야 하기 때문.
    - 안 그러면 프로그램 A가 나머지 프로그램이 못 쓰게 지가 다 독점할 수도..

- 따라서 특정 프로그램 실행 도중에 **운영체제의 코드**를 수행할 수 있어야 함 + **액서스 권한**을 상승시켜야 함
    - 그러다보니 해당 운영체제의 코드를 수행하기 위해 (= function call들 필요) stack을 사용해야 함
    - 이 때 프로그램 코드가 위치한 stack을 사용하면 굉장히 위험함 (프로그램 입장에서)
    - 따라서 운영체제 코드를 수행하기 위한 stack이 별도로 만들어져 있어야 함.
- ⁂ 프로세스 실행 도중 Restricted Operation 수행을 위해서는
    1. `stack` 변화: 프로그램's ⇒ 운영체제's
    2. `코드` 변화: 프로그램's ⇒ 운영체제's
    3. 액서스 `권한`: 상승

### Mode Switch의 메커니즘
![mechanism-1](https://broccolism.github.io/assets/img/OS/2020-03-03-3.jpg)
![mechanism-2](https://broccolism.github.io/assets/img/OS/2020-03-03-4.jpg)

- `User Stack`: 우리가 이때까지 배웠던 Stack. for program.
- `Kernel Stack`: for OS. (별로 크기가 크지 않음)
- `System Call`: Mode Switch가 일어나게 하는 방법!
    - Mode Switch = User mode에서 Kernal mode로 변경
    - 따라서 system call은 OS 입장에서 일종의 안전장치인 셈.
    - System Call을 이용한 mode switch가 일어나면...
        - 현재 동작 중이던 프로세서가 p→kstack으로 `stack switch`.
            - 방법: `esp`를 Kernel Stack의 포인터(SS0: **esp0**)의 address로 값을 바꿈.
        - 각종 `레지스터`, `eip` 등 옮김
            - eip는 system call을 부른 그 다음 instruction의 address를 저장
        - `권한 상승` 시켜줘야 함.
        주의) 위의 모든 과정은 **동시에** 이루어 져야 함. 안 그러면 문제 발생.  이를 위해 `Trap` 이라는 친구가 **동시에** 해주도록 고안이 되어 있음. `Kernal` ⇒ `User`로 스위치가 일어날 때에도 마찬가지로 동시에 할 수 있는 instruction이 필요함.

- **Trap** instruction: 프로그램이 **자발적으로** OS에게 컨트롤을 넘겨주는 것
    - e.g) `divide by 0` 문제가 발생했다!! OS한테 가야겠어!!
- **Return-from-trap** instruction: 커널 모드에서 유저 모드로 스위칭
    - 커널에 저장되어있던 레지스터를 원래 유저 스택으로 옮기기 + 권한 하락 + 스택 스위칭 + 유저가 시스템 콜 호출하기 직전 address의 다음 address로 이동
- c.f) `interrupt` = 프로그램 코드와 무관한, 비동기적인 외부 이벤트를 처리하기 위해 현재 프로세스의 수행을 멈추고 커널이 그 해당 이벤트를 핸들링 해줘야 하는 이벤트. **비자발적으로** OS에게 컨트롤을 넘겨주는 것.
    - e.g) 마우스 움직이기!! 잉이라고 입력하기!!! 하하
    - 근데 일단 이것도 프로그램이 핸들링하는게 아니라 `OS`가 핸들링해줘야함.
    - 즉, 우리는 어떤 시그널이 들어오든 간에 일단 *커널로 넘어가는 과정은 공통의 루틴은 그대로 두고* 들어온 `이벤트`의 종류에 맞게 내가 적절하게 수행할 수 있는 구조를 갖춰야 함.

### **Interrupt Table**
- 각 `interrupt`에 번호를 부여하고, 이 테이블에서 해당 interrupt의 `핸들러`로 **바로** 이동할 수 있도록 핸들러의 시작 address를 기록해놓은 것.
    - 이 때 몇몇 interrupt들은 이미 정해진 `고유 number`를 가짐. 수정 불가
        - e.g) timeout: 0
    - 단 테이블 구조는 OS가 (~~내가^^~~) 만들기 나름.

- interrupt table 자체의 **base address(시작점)**는 하드웨어의 특정 레지스터에 저장시킴. 그 이후에는 CPU가 알아서 발생한 interrupt의 number를 이용해 `offsetting`을 해서 핸들러로 넘어감!
    - offsetting e.g.) base address가 000488이고 timeout 발생 시 000488번째 칸에 가서.. 뭐 어떻게든 하겠지!
    - "저장시킴" 이전에는 마우스 등 외부 입력에 전혀 반응하지 않음. 이 때에는 해당 interrupt에 어캐 반응해야한다는 테이블이 없기 때문임. "저장시키는" 순간 그 다음부터 반응 시작함.

![inside](https://broccolism.github.io/assets/img/OS/2020-03-03-5.jpg)
파란 애들은 모두 하드웨어 장치

1. `interrupt` 발생
2. 물리적으로 `PIC`가 `intr#`를 기록하고 `syscall` 발생했음을 `CPU`에 알려줌
3. 그 신호(`int 0x80` = `syscall`)를 받자마자 `CPU`는 하던 일을 멈추고 `IDTR`에 적힌 `Trap Table`의 `base address`로 뛰어감
    - 이 때 "int 0x80"은 모든 시스템 콜에 대한 instruction임. 즉 "이거 시스템콜이야!!"까지만 알려줌.
    - 우리는 "int 0x80" 전에 각 interrupt 종류마다 각각 번호를 부여해서 미리 저장해두고, 넘겨주어야 함.
4. 받은 `intr# * 8byte`로 `offsetting`을 해서 핸들러의 시작 주소를 알아냄
5. 스택 스위치 및 코드 스위치 = 핸들러 시작!