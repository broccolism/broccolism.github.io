---  
layout: post  
title: "[LeetCode] 7.Reverse Integer"
categories: others
tags: algorithm overflow integer leetcode
comments: true
---

# Reverse Integer
[see detail on LeetCode](https://leetcode.com/problems/reverse-integer/){: target="_blank"}     
Given a 32-bit signed integer, reverse digits of an integer.
#### Note:
Assume we are dealing with an environment which could only store integers within the 32-bit signed integer range: [−231,  231 − 1]. For the purpose of this problem, assume that your function returns 0 when the reversed integer overflows.

**Example:**
```
Input: 1200
Output: 21
```

# Solution in C++

```cpp
class Solution {
/* 1. there must be some reason for giving the range of the input...
        1) maybe doing mod operation repeatedly can be a solution.
        - possible input value is not bigger than 2147483647.
        ** or, i can use stack! **
        ** NO, i don't need anything but just a WHILE LOOP!! **
        
    2. how can i return 0 if overflow happened?
        => well....
        1) 2147483647 is 2^31 - 1. Use this.
        2) isn't there some clever method..? */
    
public:
    int reverse(int x) {
        int bound = 2147483647;
        int input = x;
        long long output = 0;
        int tmp = 0;
        while(input != 0) {
            tmp = input % 10;
            output = output * 10 + tmp;
            input /= 10;
        }
        
        // check overflow.
        if(output > bound || output < -1 * bound - 1)
            return 0;
        return output;
    }
};
```

# How I solved
## Hint from Problem
- **overflow**: I must not have thought about the overflow unless the **"Note"** was given. But I didn't deeply consider about it, which made me spend more time than I thought...

## At first,
- **stack**: I was thinking about using stack, because we need to pop elements(= digits) with reversed order of when we push elements. But I found out that there is some other way to solve this.
- **pushing left and right**: is what I chose. It means literally *push __digits__ left and right side* to get reversed integer.
    1. do `%` by `10` on `input`.
        - so that we can get the units digit.
    2. add it to `output`.
        - before adding, we need to *push one digit to the left* on `output`.
    3. do *push one digit to the right* on `input`.
        - so that we can get the tens digit when we do step 1. again.
    4. repeat step 1. - 3. until `input` is bigger than 10.
    - ...and we can implement these *push* operations by using `% 10` and `/ 10`.

## What I learned
- I need to check the overflow **before it happens**. Because once it happens, there is no way to detect it.
    - There are several ways to do this, but the simples one is using another data type which can represent more numbers than the given type.
        - e.g) `long long` for `int`
    - However, when I cannot find another data type, I should do it by writting additional code.
        - The answer from the website is below.

```cpp
class Solution {
public:
  int reverse(int x) {
    int rev = 0;
    while (x != 0) {
        int pop = x % 10;
        x /= 10;
        if (rev > INT_MAX/10 || (rev == INT_MAX / 10 && pop > 7)) return 0;
        if (rev < INT_MIN/10 || (rev == INT_MIN / 10 && pop < -8)) return 0;
        rev = rev * 10 + pop;
    }
    return rev;
  }
};
```