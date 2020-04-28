---  
layout: post  
title: "[CA] Instrucion Operands"
categories: classes
tags: ca instruction operand register memory immediate hardware
comments: true
---

## 순서
[0) 레지스터란?](#register)  
[1) Memory Operands](#memory-operands)  
[2) 레지스터 vs 메모리 속도 비교](#registers-vs-memory)  
[3) Immediate Operands](#immediate-operands)  

# 🔥 Review: RISC vs. CISC
**this is really important thing in this class**
- RISC = Reduced instruction set computer
    - ARM, MIPS
    - instruction e.g) add/sub/mul 처럼 모두 very simple하고 하나의 일만 수행함
    - 그래서 power efficiency가 높음.
    - SIMPLE 하드웨어
        - ALU 안에 Adder랑 Multipler만 있으면 끝!
- CISC = Complex instruction set computer
    - Intel, AMD
    - instruction e.g) muladd/addmul 처럼 complex한게 많음. 레지스터 하나만 갖고 계속 수행함.
        - 이런걸 수행하기 위해 multiple 하드웨어의 도움이 필요함.
    - 그래서 좀 더 빠름.
    - COMPLEX 하드웨어
        - ALU 안에 MulAdder + AddMuler: 그래서 ALU가 더 큼.
RISC 가 more power efficient하기 때문에 요새 CISC보다 더 널리 쓰임!
- Intel machine도 CPU 내부에는 RISC를 사용하고 있음.
    - 그래서 CISC instruction을 RISC instruction으로 바꿔주는 **instruction decorder**가 있음.

# Register Operands
- Operands = input/output data of instructions
    - data가 저장되어 있는 위치에 따라 operand style이 달라진다.
        - **register operands**: register에 저장된 operands.
        - **memory operands**: memory에 저장된 operands.

### Register
= CPU core 안에 있는 **the fastest and the smallest memory**.
- Memory Hierarchy
    1. 레지스터 (in CPU)
    2. 캐시
    3. DRAM (메인 메모리)
    4. storage
    - 아래로 내려올수록 size가 커지고, access 속도가 느려진다.
- 1 *cycle*마다 접근 가능하다.
- **register file**: CPU안에 레지스터들을 모아 놓은 array.
    - MIPS: 32 X 32-bit register file 사용 - 0번~31번
    - ARM: 16 X 32-bit register file 사용 - 0번~15번
        - 하지만 register file의 크기가 2배가 되었다고 해서 성능이 그만큼 곧바로 향상되는 것은 아니다.
        - 뒤쪽의 '32'는 register 하나에 저장되는 데이터의 크기가 32-bit라는 것을 의미한다. 이를 **word**라는 단위로 셀 수 있다.
    - **Assembler Names**
        - $t0 ~ $t9: 일시적으로 사용하는 값을 저장하는 레지스터.
        - $s0 ~ $s7: 저장된 변수.

### Backup to the Memory
register가 아닌 메모리에 값을 저장하고 메모리에서 값을 불러오는 경우는...
- 함수를 call하기 전!
    - register → memory
    - 왜냐하면 해당 함수를 실행하기 위해서는 역시 레지스터가 필요한데, 그 전에 사용하던 레지스터의 값을 다른 어딘가에 저장해두지 않으면 그대로 잃어버리는 셈이니까.
- 함수가 return한 후!
    - memory → register
    - 해당 함수를 call 하기 전에 메모리에 옮겨뒀던 값들을 다시 레지스터로 복구.
위의 두가지 경우 모두 꽤나 cost가 높은 작업이다. 이에 대한 최적화 방법 중 하나는 **function inling**이다. 컴파일 타임에 해당 함수의 body 부분을 function call을 한 부분에 그대로 갖다넣는 효과를 주기 때문에 새로운 function stack이 필요없고, 따라서 레지스터를 초기화 시킬 필요가 없기 때문이다.

또한 위의 과정에서 모든 register에 있던 값을 backup하는 것은 아니다. 앞서 보았듯이 레지스터에도 종류가 있는데 그 중 **saved variables**(저장된 변수)만 메모리에 백업해주면 된다. 일시적으로 쓰는 값은 버려져도 되기 때문이다.

# Memory Operands
Main memory는 레지스터보다 훨씬 큰 용량의 데이터를 저장한다.        
- 따라서 big, composite data가 들어가게 된다.
    - e.g) arrays, structures, dynamic data
- 그런데 사칙연산은 오직 register에서만 일어날 수 있기 때문에
    - 해당 데이터들을 다루기 위해서는
    1. `Load`: memory에서 register로 계산하려는 operands를 불러오고
    2. register에서 계산을 한 뒤
    3. `Store`:결과값을 다시 memory로 옮겨줘야(= 저장) 한다. 
- 메모리의 주소값
    - 8-bit 데이터값 하나를 가리킨다.
    - word 단위로 증감하기 때문에 **memory address는 반드시 4의 배수**여야 한다.
- Endian
    - Big Endian: 큰 단위의 바이트가 앞에 오는 방법.
        - 사람이 숫자를 쓰는 방법과 같다.
        - MIPS, 초기 ARM에서 사용
    - Little Endian: 작은 단위의 바이트가 앞에 오는 방법.
        - 최근에는 ARM에서 big endian과 little endian을 모두 사용할 수 있다. (big endian mode/littme endian mode가 따로 있다고 한다.)
- e.g 1)

```c
g = h + A[8];
```

위의 문장이 MIPS에서 컴파일된 결과는 아래와 같다.

```wasm
lw  $t0, 32($s3)   # load word
add $s1, $s2, $t0
```

`lw`는 "load word"를 의미한다.
어셈블리 코드의 첫번째 줄을 살펴보자. `$t0` 레지스터에 `A[8]`의 값을 **load**하고 있다. `A`는 array이기 때문에 레지스터에 그 내용물이 담겨있는게 아니라 메모리에 담겨있기 때문이다. 그리고 `A`의 "8번째"(실제로는 9번째) 요소를 빼오기 위해서는 `32($s3)`을 사용하고 있다. `$s3`은 `A`의 base address이다. `8`이 아니라 `32`만큼 인덱싱을 하는 이유는 *1 word의 크기가 4바이트*이기 때문이다. 따라서 base address로부터 4 * 8 = 32 바이트를 가야 우리가 원하는 `A[8]`의 값을 볼 수 있다.

두번째 줄의 `add`는 레지스터에서 일어난 연산을 다시 레지스터로 저장해주는 작업이다.

- e.g 2)

```c
A[12] = h + A[8];
```

위의 문장은 아래와 같이 컴파일된다.

```wasm
lw  $t0, 32($s3)   # load word
add $t0, $s2, $t0
sw  $t0, 48($s3)   # store word
```

# Registers VS Memory
- 레지스터로의 접근 속도가 메모리로 접근하는 속도보다 훨씬 빠르다.
    - 즉, 우리는 *가능하다면* 메모리 대신 레지스터를 쓸 수 있도록 해야 한다.
- 메모리 데이터를 다루는 데에는 레지스터 데이터를 다룰 때보다 훨씬 많은 instructions이 실행된다.
    - `load` , `store` 때문!
- 컴파일러가 변수를 다룰 때에는 레지스터를 *최대한* 활용해야 한다. (= 컴파일러 최적화가 필요하다.)
    - 즉, 레지스터의 수가 모자라서 어떤 변수를 담을지 결정해야 하는 상황이라면 접근해야 하는 빈도가 적은 변수를 메모리로 옮기는게 좋다.

---

# Immediate Operands
= data의 address가 아닌 실제 값을 갖는 operands

```wasm
addi $s3, $s3, 4
```

- 빼기 연산은 없다. 대신 음수를 `addi` 하는 것으로 처리한다.
- 데이터를 `load`해올 필요가 없다는 장점이 있지만, register의 크기가 제한적이기 때문에 나타낼 수 있는 수의 최대값이 그다지 크지 않다.
    - 아니 register는 32비트짜리라고 하지 않았나요?
        - 맞습니다. 하지만 그 중 일부는 "opcdoe", "operand 0", "operand 1"의 자리로 쓰여서 실제로 상수를 나타낼 수 있는 공간은 남은 16bit뿐입니다.
- 그렇지만 여전히 이런 디자인은 문제가 없다. 왜냐하면 **Common things**를 **fast**하게 처리할 수 있으면 되기 때문이다.
    - 대부분의 경우 상수의 값은 그렇게 크지 않다.
    - 레지스터 하나만으로 연산하는게 더 이득이란 뜻이다.

### The Constant Zero
- MIPS의 0번 레지스터는 상수 0으로 여긴다.
    - 해당 레지스터의 값은 overwritten 될 수 없다.
    - 이렇게 설정해놓으면 **common operations**를 처리할 때 유용하다.
        - e.g) 두 레지스터의 값을 바꿀 때 `add $t1, $s1, $zero`를 수행하면 간단하게 해결된다.