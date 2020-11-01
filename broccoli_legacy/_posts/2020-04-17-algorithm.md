---  
layout: post  
title: "[LeetCode] 20. Valid Parentheses"
categories: others
tags: algorithm stack leetcode
comments: true
---

# Valid Parentheses
[see detail on LeetCode](https://leetcode.com/problems/valid-parentheses/)  
Given a string containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.

Note that an empty string is also considered valid.

**Example:**
```
Input: "{[]}"
Output: true
```

# Solution in C++

```cpp
#include <stack>
#include <string>

using namespace std;

class Solution {
/* umm....
1. Use Queue NOPE. STACK!!
2. What if the input is empty?
    => check it first. It should be considered as true case.
*/
public:
bool isValid(string s) {
    // check the input is empty or not...
    if (s.length() == 0) {
        return true;
    }
    
    char *input = new char[(s.length() + 1) * sizeof(char)];
    strcpy(input, s.c_str());
    
    int idx = 0;
    char next = input[idx];
    stack<char> S;
    char top = '_';
    while (next) {
        // push
        if (next == '(' || next == '[' || next == '{') {
            S.push(next);
        } else { // pop
            if (S.empty()) {
                return false;
            } else {
                top = S.top();
                
                if (top == '(' && next != ')') {
                    return false;
                }
                else if (top == '[' && next != ']') {
                    return false;
                }
                else if (top == '{' && next != '}') {
                    return false;
                }
                
                S.pop();
            }
        }
        
        next = input[++idx];
    }
    
    if (!S.empty()) {
        return false;
    }
    
    return true;
}
};
```
- **Runtime**: 0 ms, faster than 100.00% of C++ online submissions for Valid Parentheses.
- **Memory Usage**: 6.5 MB, less than 100.00% of C++ online submissions for Valid Parentheses.

# How I solved
## Hint from Problem
- **correct order**: means that I need to sort input characters as an order of they came in and when I check them, the order needs to be reversed.
    - e.g) If I got `(` and then `[`, I should check `]` before check `)`.
    - I can achieve this by using *stack*.

## At first,
- Returned without checking if the `S` is empty or not. But I immediately came up with the necessity of it.
    - Cause if i don't check, wrong input `[` was also considered as **true**.
    
## What I learned
- I need to keep considering of exceptions which means something that gives me some special case.