---  
layout: post  
title: "[xv6] xv6에 새 system call 만들기"
categories: classes
tags: os system-call xv6
comments: true
---
[1. User program이 system call을 부르는 방법](#user)  
[2. Kernal이 system call을 처리하는 방법](#kernal)  

# What is System Call
- System call = 프로그램이 OS의 kernel로부터 어떤 `service`를 요구하는 programmatic way.
    - `service`의 예시
        - 새로운 프로세스 이용: CPU 자원 필요
        - 파일 생성 후 저장: 저장 공간 접근 필요
        - xv6에서...
            - `ls`: 프로그램의 목록을 확인해야 함
            - `echo`: 저장공간에 접근해야 함
    - 유저 프로그램은 아래 두가지 방법으로 시스템 콜을 호출할 수 있다.
        1. 직접 호출
        2. 라이브러리 함수를 호출 (해당 함수 내에서 시스템 콜 호출)

# Distinguish Who Did it
`exit()` 같은 경우 유저가 부를수도 있지만 커널모드에서 실행되는 경우도 있다. 그런데 커널모드에서 실행될 때에는 모드 스위치 등이 필요없기 때문에(이미 커널모드니까!) 어디서 함수를 call했는지 구분할 필요가 있다.

그래서 xv6에서는 user mode, kernal mode에서 같은 함수를 호출하더라도 call path가 달라질 수 있게 각각의 경우의 `linking`을 다르게 만들었다.

## User
### 가 system call을 call하는 방법 세 줄 요약
...까진 어렵고 세미 네 줄 요약
1. `user.h` 를 include한 유저 프로그램에서 특정 system call을 사용
2. `user.h` 에서 해당 함수 선언 확인
3. `usys.S` 로 linking되어 어셈블리 명령어로 mode switch
4. (이후 OS가 kernal mode로 해당 system call 수행)

### 자세한 과정
`user.h`, `usys.S` 파일을 보고 함수를 호출한다. 이 때 `user.h` 파일의 내용이 `usys.S` 파일로 linking 된다.
- `user.h`: 시스템 콜이 정의된 헤더
    - 즉 유저 프로그램을 짤 때 시스템콜을 호출하려면 해당 헤더를 include해야 한다.
- `usys.S`: 아래 내용이 적혀 있다. (`.S` 확장자를 가진 파일은 어셈블리어로 적힌 파일이다.)

```c
#include "syscall.h"
#include "traps.h"

#define SYSCALL(name) \
    .globl name; \
    name: \
        movl $SYS_ ## name, %eax; \
        int $T_SYSCALL; \
        ret

SYSCALL(fork)
SYSCALL(exit)
SYSCALL(wait)
...
```

`fork` 함수를 call했다고 하면 위에서 정의한 매크로는 아래와 같이 풀린다. (주의: xv6에서는 어셈블리어로 쓴 문장이 `opcode src, dst` 형식으로 해석된다. 즉 데이터 방향이 좌→우 인것.)

```elm
.globl fork;
    fork:
    movl $SYS_fork, %eax;
    int $T_SYSCALL;
    ret
```

- 그런데 여기서 이상한 점은 `SYS_fork` 라는 키워드를 썼다는 점이다. 어셈블리어는 이런 키워드를 기본으로 제공하지 않는다. 그렇다면 이는 무언가를 줄여서 나타낸 매크로일 것이다.
- 정답은 `usys.S` 파일이 include했던 `syscall.h` 파일에 있다. 해당 파일에는 아래 내용이 적혀있다.

```c
//System call numbers
#define SYS_fork    1
#define SYS_exit    2
#define SYS_wait    3
...
#define SYS_close  21
```

- `T_SYSCALL` 역시 매크로이다. 위와 마찬가지로 `usys.S` 파일이 include한 `traps.h` 파일에 아래 내용이 적혀있다.

```c
...
#define T_SYSCALL      64    // system call
...
```

다시 `usys.S` 에 적힌 매크로를 보자.
- `.globl fork; \ fork:` : 라벨을 통한 함수 정의 방법. 이 줄 아래부터는 'fork'라는 이름을 가진 함수의 내용임을 뜻한다.
- `movl $SYS_fork, %eax;` : %eax 레지스터에 1을 저장한다. 여기에 저장하는 값은 각 시스템콜에게 미리 부여된 일종의 고유 번호이다. 이 번호를 보고 **어떤 종류의** 시스템 콜을 불렀는지 알 수 있다.
- `int $T_SYSCALL;` : system call이 call 되었음을 알린다.
    - 여기서의 `int`는 **interrupt**의 약자로, 해당 번호를 interrupt number로 갖고 있는 interrupt를 발생시키겠다는 것을 의미한다.
    - `fork()` 함수는 시스템 콜이기 때문에 $T_SYSCALL 을 적어주었고 이는 64, 즉 xv6에서 정의해 둔 시스템 콜의 interrupt number이다.
    - 따라서 이 명령어를 수행하면서 mode switch가 일어나고, 그 이후부터는 커널 모드로 실행이 되는 것이다.

## Kernal
### 이 system call을 처리하는 방법 세 줄 요약
1. `defs.h` 파일에서 함수 선언 확인
2. %eax 레지스터를 보고 어떤 종류의 system call인지 확인
3. wrapper function call

### 자세한 과정
`defs.h` 파일을 보거나 같은 파일 내의 함수 정의를 보고 함수를 호출한다. 이 때에는 linking 시 실제 파일에 정의된 소스코드와 매핑된다. 이 linking은 Makefile에 옵션으로 정의되어 있다.

- `syscall.c` : 아래 내용이 적혀있다. 일부는 system call function의 wrapper function, 일부는 그 wrapper functions를 참조할 수 있는 포인터, 나머지는 main 함수로 구성되어 있음을 알 수 있다.

```c
...

int sys_fork(void)
{
    return fork();
}

int sys_exit(void)
{
    exit();
    return 0; // not reached
}

...

static int (*syscalls[]) (void) = {
[SYS_fork]    sys_fork,
[SYS_exit]    sys_exit,
[SYS_wait]    sys_wait,
...
[SYS_close]   sys_close,
};

void
syscall (void)
{
    int num;
    struct proc *curproc = myproc();
    
    num = curproc -> tf -> eax;
    if (num > 0 && num < NELEM(syscalls) && syscalls[num]) {
        curproc -> tp -> eax = syscalls[num]();
    } else {
        cprintf("%d %s: unknown sys call %d\n",
                        curproc -> pid, curproc -> name, num);
        curproc -> tf -> eax = -1;
    }
}
```

`curproc -> tf -> eax` 는 %eax 레지스터이다. 여기에 각 system call별로 미리 정해진 매크로 값(`syscall.h` 파일에 정의되어 있다.) 을 담아서 **어떤 종류의 system call이 불렸는지** 를 알아낼 수 있다!

이후 그에 맞게 wrapper funciton을 call하면 비로소 그 system call이 실행되고 그 결과값을 return한다. 이 때 진짜 system call funciton의 코드는 `.c` 파일로 따로 만들어져 있다. 예를 들어 `fork()` 는 `proc.c` 에 정의되어 있다. 그렇기 때문에 새로운 system call 함수를 하나 만들면 Makefile을 수정해야 할 수도, 그럴 필요가 없을 수도 있다. 이미 Makefile에 등록된 `.c` 파일에 정의를 했다면 필요가 없는 것이다.