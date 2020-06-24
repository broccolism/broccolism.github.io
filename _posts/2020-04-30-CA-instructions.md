---  
layout: post  
title: "[CA] Branch and Basic Block"
categories: study
tags: study 2020-1 ca sign instruction MIPS operation format 
comments: true
---

# 🔥Review: Operands
- **register**: fast  small  1 cycle  variables
- **memory**: slow  large  ~100 cycles  `load`, `store`
- **immediate**: constatant values  embedded in instructions  cannot be 32 bit data

## 순서
[1) Sign Extension, 왜 배우나요?](#sign-extension)  
[2) MIPS Instructions into Machine Code](#representing-instructions)  
&nbsp;&nbsp;&nbsp;&nbsp;[2-1) MIPS Operation Codes](#operation-codes)  
&nbsp;&nbsp;&nbsp;&nbsp;[2-2) MIPS R-format Instructionns](#mips-r-format-instructions)  
&nbsp;&nbsp;&nbsp;&nbsp;[2-3) MIPS I-format Instructions](#mips-i-format-instructions)  
&nbsp;&nbsp;&nbsp;&nbsp;[2-4) MIPS Logical Operations](#mips-logical-operations)  

# Signed and Unsigned Numbers
- Unsigned Binary Integers: 0부터 2^n - 1까지 표현 가능
- 2's-Complement Signed Integers: -2^(n - 1)부터 2^(n - 1) - 1까지 표현 가능
    - **MSB**: Most Significant Bit = 최상위 비트(bit 31) = **sign bit**
    - -1 = 1111 1111 ... 1111
    - Most-negative number = 1000 0000 ... 0000
    - Most-positive number = 0111 1111 ... 1111

### Sign Extension
= 어떤 수를 더 많은 갯수의 bit로 표현하는 작업.
- 왜 필요한가요?
    1. operands 중에서 immediate data를 계산하기 위해서.
        - 해당 데이터는 integer이지만 그를 표현하기 위해서 4바이트를 모두 사용하지 않는다. 그의 절반인 16비트만 사용하는데, 다른 나머지 operands는 모두 32비트이기 때문에 비트 갯수를 늘려 자릿수를 맞춰줘야 한다.
    2. `load`, `store` instruction 에서 더 많은 data를 가져오거나 저장할 수 있게 하기 위해서.
        - (사실 정확한 의미는 아직까진 안 나와서 잘 모르겠다.)
- 어떻게 하나요?
    - 최상위 비트를 계속해서 복사하면 됩니다.
    - e.g) -2: **1**111 1110 ⇒ **1111 1111 1**111 1110

# Representing Instructions
- **machine code** = instruction이 binary number로 인코딩 된 것

### MIPS instructions
- 32비트 instruction **word**로 인코딩 된다.
    - 그 이유는 32비트 운영체제를 사용하기 때문인데
    - 모든 instruction은 결국 main *memory*에 저장되어 있고,
    - 그 *memory*에서 하나의 변수를 나타내기 위해 32비트를 사용하기 때문이다.
    - operation code("opcode"), register numbers, operands 등으로 구성된다.
        - 이 때 register number는 몇 번 레지스터를 봐야하는지를 알려주는 숫자로(e.g: operands를 저장한 레지스터를 알고 싶을 때), 5비트를 사용한다.
            - 레지스터 총 갯수가 32개니까 0부터 31번까지, 5비트만 있으면 된다.

### Register numbers
- temproal values: `$t0` - `$t9`
    - `$t0` - `$t7` = register 8 - 15
    - `$8`, `$9` = register 24, 25
- saved variables: `$s0` - `$s7` = register 16 - 23

mapping table이 있기 때문에 굳이 따로 외울 필요는 없다.

### Operation Code
![table](https://broccolism.github.io/assets/img/CA/2020-04-30-1.jpg)
빠르게 찾아보기 위한 예시!

### MIPS R format Instructions

![R-format]((https://broccolism.github.io/assets/img/CA/2020-04-30-2.jpg))

- **rs**, **rt**, **rd**: operands.
    - 레지스터는 한번에 최대 3항 연산을 할 수 있다.
    - 레지스터 operands는 순서가 중요하다.
        - **rs**: first source register number
            - "register source"
        - **rt**: second source register number
            - "register temporary"의 줄임말.
                - 이 부분은 destination으로도 쓰일 수 있기 때문이다.
        - **rd**: destination register number
            - "register destination"
- **op**: operation code = opcode
- **funct**: function code: **op**를 extend.
    - **op**와 **funct**를 이용해서 operation을 표현할 수 있다.
    - 따라서 레지스터 opertaion은 최대 2^12 종류까지 가질 수 있다.
- **shamt**: shift amount (지금은 00000)

예시)

아래 코드는 ...

```wasm
add $t0, $s1, $s2
```

![assembly code]((https://broccolism.github.io/assets/img/CA/2020-04-30-3.jpg))

이렇게 매핑된다!
- 주의할 점은 어셈블리 코드에서의 operands 순서와 instruction에서의 operands 순서가 다르다는 점이다.
- `add`: **op = 0, funct = 32**
    - 라고 약속해두었다.

### MIPS I-format Instructions

![I-format]((https://broccolism.github.io/assets/img/CA/2020-04-30-4.jpg))

**Immediate**을 사용한다는 의미로 **I-format**이라고 한다.
- **op**: operation을 표현하는 부분.
- **rs**, **rt**는 R-format에서와 동일하다.
    - 단, 여기서는 **rt**가 destination / source register 역할 두가지를 한다.
        - `load`일 때에는 destination,
        - `store`일 때에는 source 역할!
- **constant or address**: immediate를 나타낸다.
    - 따라서 immediate의 최댓값은 2^15 - 1, 최솟값은 -2^15이다.
    - 앞서 언급했듯이, 이 부분 때문에 sign extension이 필요하다.

대부분의 instruction은 R-format, I-format 이 두가지만을 사용하여 표현할 수 있다. 따라서 레지스터 32개라는 적은 양의 하드웨어 리소스만 써도 되기 때문에 하드웨어 디자인 시 굉장히 편리한 방법이다.

하지만 서로 다른 format을 쓰는 경우 **decoding**을 복잡하게 만들 수 있다. 이 decoding 작업은 심지어 하드웨어에서 일어난다. 애써 간단하게 만든 하드웨어 디자인을 다시 복잡하게 만들어버릴 수 있다는 말이다. 이런 hardware overhead를 줄이기 위해 format을 최소한으로 사용하는 것이 좋다.

## Stored Program Computers
= 프로그램을 구성하는 모든 instruction을 메인 메모리에 저장해두고, 프로그램 실행 시 그 instruction들을 다시 불러와 수행하는 컴퓨터.

- instructions는 data와 마찬가지로 여겨진다.
    - 따라서 메모리에 binary 형태로 저장된다.
- 프로그램은 다른 프로그램을 operate 할 수 있다.
    - e.g) by compilers, linkers, ...
- **Binary compatibility** 덕분에 한번 컴파일된 내용을 다른 컴퓨터에서도 실행시킬 수 있다.
    - Standardized ISA를 사용하는 컴퓨터끼리는 공유 가능!
        - Standardized ISA의 예) Intel(AMD), ARM
        - 그러니까 AMD 아키텍처에서 컴파일한 프로그램은 AMD 아키텍처의 모든 컴퓨터에서 돌릴 수 있고, ARM도 마찬가지이다.
- 프로세스는 그저 메인 메모리에 접근만 하면 프로그램을 실행할 수 있다.

## MIPS Logical Operations
- `sll`: shift left logical
- `srl`: shift right logical
- `and`, `andi`: bitwise AND
    - `andi` 는 immediate operands가 있을 때 사용
- `or`, `ori`: bitwise OR
- `nor`: bitwise NOT

### Shift Operations
R-format과 동일한 형식을 취한다.

![shift](https://broccolism.github.io/assets/img/CA/2020-04-30-5.jpg)

다만 다른 점은 **shamt**를 사용한다는 점이다. 다른 R-format을 사용하는 instruction은 **shamt**가 0이다.

- 이 때 **shamt**가 5비트만 있어도 충분한 이유는?!
    - shifting 해야 할 비트의 최대 갯수는 31개이기 때문!
        - 그 이유는, 32-bit 아키텍처이기 때문이다.
        - 그 이상 shifting을 하면 원본 값의 의미를 완벽하게 잃어버릴 수 있다.
- shifting에도 종류가 있다.
    - **shift right logical**: MSB를 0으로 채운다.
    - **shift right arithmetic**: MSB를 기존의 sign bit로 채운다.
        - 이렇게 하면 기존에 표현하던 수의 부호를 그대로 보존할 수 있다.
    - **shift left**는 logical하게 해도 arithmetic하게 해도 LSB를 0으로 채운다.

### AND Operations
- 특정 자리의 비트를 mask하는데 쓸 수 있다.

### OR Operations
- 특정 자리의 비트를 1로 만드는데 쓸 수 있다.

### NOT Operations
사실 이 부분 때문에 AND와 OR도 쓰고 있었다. MIPS에서는 *NOT operation이 없다.* 대신 **NOR 3-operand instruction**으로 바꾸어 해석한다.
- a NOR b == NOT (a OR b)

임을 사용하면 NOR로 NOT을 표현할 수 있다.
- e.g) `$t1`에 있는 값에 bitwise NOT을 하겠다고 했다면
    - `nor $t0, $t1, $zero`로 해석된다.
    - 어차피 `$1 OR $zero`는 `$1`이기 때문에 그냥 `NOT $1`과 동일한 결과를 낸다.