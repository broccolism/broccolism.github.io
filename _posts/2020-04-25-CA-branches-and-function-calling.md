---  
layout: post  
title: "[CA] Branch and Basic Block"
categories: study
tags: study 2020-1 ca branch basic-block condition 어셈블리
comments: true
---

## 순서
[1) Conditional Operations의 뜻](#conditional-operations)  
[2) if statements](#if-statements)  
[3) while loop](#loop-statements)  
[4) 코드의 단위: basic block](#basic-blocks)  

# Conditional Operations
**runtime 도중에** 다음 instruction을 바꾸기 위해 사용할 수 있는 operations.
- **conditional** **branch**: 프로그램이 순차적으로 실행되던 흐름을 깨고 다른 instruction을 실행하도록 만드는 instruction.
    - "a labled instruction if a condition is true"라고도 정의할 수 있다.
- e.g) if문 사용: if문의 조건 부분은 runtime에 수행되기 때문에 condition을 만족하면 어디로, 그리고 만족하지 않는다면 어디로 가야하는지 알려줘야한다.
    - 이를 **execution flow를 바꾼다**라고 표현한다.
- `beq rs, rt, L1`: `L1`이라는 lable이 매겨진 instruction으로 점프하게 만드는 `if(rs == rt)` branch.
- `bne rs, rt, L1`: `L1`이라는 lable이 매겨진 instruction으로 점프하게 만드는 `if(rs != rt)` branch.
- `j L1`: `L1`이라는 lable이 매겨진 instruction으로 점프하게 만드는 **unconditional jump**
    - 조건을 체크하지 않고 무조건 점프시키기 때문에 **unconditional** jump라고 부른다.

## Compiled MIPS code

그러면 이제 실제로 컴파일 된 어셈블리 코드를 살펴보자.

### If Statements

```c
if (i == j)
	f = g + h;
else
	f = g - h;
```

```wasm
      bne $s3, $s4, Else
      add $s0, $s1, $s2
      j Exit
Else: sub $s0, $s1, $s2
Exit: ...
```

우리의 직관과 맞지 않는 부분이 하나 있다. 어셈블리 코드의 첫 번째 줄을 보면 `bne`를 사용하고 있다. 그런데 C 코드에서는 분명히 `if (i == j)`로 `i`와 `j`가 같다는 것을 conditoin으로 주었다. 왜 이렇게 컴파일된걸까?

이유는 간단하다. 원래 코드의 흐름을 계속 유지하기 위해서이다. C 코드에서는 `i == j`인 상황이 되면 다른 어딘가로 jump하는 것이 아니라, 바로 다음 line인 `f = g + h`를 수행하게 하였다. 어셈블리 코드에서도 같은 상황이 일어나면 `add`를 수행하게 하고 있음을 알 수 있다.

### Loop Statements

```c
while(save[i] == k)
	i += 1;
```

```wasm
Loop: sll  $t1, $s3, 2
      add  $t1, $t1, $s6
      lw   $t0, 0($t1)
      bne  $t0, $s5, Exit
      addi $s3, $s3, 1
      j    Loop
Exit: ...
```

어셈블리 코드 첫줄의 `sll`은 **shift left logical**을 의미한다. 이게 갑자기 어디서 튀어나왔을까? 정답은 `save[i]`에 접근하는 부분이다. 배열의 element에 접근하려면 배열의 시작점에 해당 element의 offset을 더해야 한다.

- 이 때 offset의 크기는 단순히 `i`의 크기와 같은 것이 아니라, 해당 element 타입의 크기와 `i`의 곱과 같다.
    - e.g) int array면 offset 크기는 4바이트 * `i`가 된다.

우리는 마지막 operand가 `2`라는 점에서 이 element의 type 역시 4바이트로 표현가능한 type임을 알 수 있다.

- `sll $t1, $s3, 2`는 $s3의 이진수 표현 값을 두 칸 왼쪽으로 shifting 한 다음 $t1에 담겠다는 의미이다.
- 이후 이어지는 `add $t1, $t1, $s6`은 $t1과 $s6에 담긴 값을 더해서 $t1에 담겠다는 의미이다.

위의 두가지 사실로 미루어 보아 $s3에는 `i`값이, $6에는 `save`의 base address가 담겨있음을 알 수 있다. 이진수 표현 값을 두 칸 왼쪽으로 shifting하는 것은 곧 그 값에 4를 곱하는 것을 의미한다. 즉, offset을 얻기 위해 4를 곱해주었으니 `save`가 4바이트로 표현 가능한 type array임을 알 수 있다. `lw $t0, 0($t1)`에서는 이렇게 해서 구한 값이 담긴 $t1에서 $t0에 넣을 값을 **load**하고 있다.

- 왜 바로 4를 곱하지 않고, 이렇게 shifting을 해버리나요?
    - `mul`보다 `sll`의 속도가 훨씬 빠르기 때문!
        - 일반적인 CPU에서는 `mul`을 수행하기 위해 20cycle, `sll`을 수행하기 위해 1cycle이 필요하다고 한다.
    - 이렇게 simple multicplication을 shifting으로 퉁치는 작업은 컴파일러가 스스로 할 수 있다.
- **forward branch**: branch로 바뀐 코드 흐름의 방향이 *next instruction쪽*일 때 그 branch를 forward branch라고 부른다.
    - 위 예시에서는 `bne` branch.
    - if-then-else expression에서도 forward branch가 쓰인다.
- **backward branch**: branch로 바뀐 코드 흐름의 방향이 *previous instruction쪽*일 때 그 branch를 backward branch라고 부른다.
    - 위 예시에서는 `j` branch.
    - loop에서도 backward branch가 쓰인다.
        - 따라서 backwrad branch가 어셈블리 코드에서 보인다면 loop가 있음을 짐작할 수 있다.

# Basic Blocks

= 마지막 부분을 제외하고 branch가 없으며 처음 부분을 제외하고 branch target이 없는 instruction 덩어리.

![basic block](https://broccolism.github.io/assets/img/CA/2020-04-25-1.jpg)

위 그림에서 파랗게 칠한 덩어리가 basic block 하나를 의미한다. 왼쪽에서 덩어리의 첫 번째 칸으로 들어오는 화살표는 **branch target**을, 덩어리의 마지막 칸에서 오른쪽으로 나가는 화살표는 **branch instruction**을 의미한다.

- 파란 덩어리 바로 아랫줄부터는 또 새로운 basic block이 시작되고 있는 것이다.

다시 말해, 하나의 basic block 안에 있는 모든 instruction은 동일한 code flow를 갖는다.

- 그래서 최적화하기 딱 좋은 구조이다.
    - 컴파일러는 최적화를 위해 basic block을 찾는다.
- 그리고 code flow가 절대 변하지 않기 때문에 이 안의 instruction은 atomic하게 수행된다.
    - 그러니까 파란 덩어리 안의 어떤 줄은 실행되고, 어떤 줄은 실행되지 않는 경우는 일어날 수 없다.
    - 모두 다 실행되거나, 모두 다 실행되지 않는 두 가지 경우 밖에 없다.
- 좀 괜찮은 프로세서는 basic block의 수행을 가속화 할 수 있다고 한다.