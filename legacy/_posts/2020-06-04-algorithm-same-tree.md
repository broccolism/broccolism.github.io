---  
layout: post  
title: "[LeetCode] 100. Same Tree"
categories: others
tags: algorithm leetcode tree stack queue
comments: true
---
👀 Found out something interesting about LeetCode's C++ compiler.  
👩‍💻 Total 3 solutions using recursin(mine) or iteration(not my idea).

# Same Tree
[see detail on LeetCode](https://leetcode.com/problems/same-tree){: target="_blank"}  

Given two binary trees, write a function to check if they are the same or not.

Two binary trees are considered the same if they are structurally identical and the nodes have the same value.

**Example**
```
Input:     1         1
          /           \
         2             2

        [1,2],     [1,null,2]

Output: false
```

# Solution 1 in C++ Using Recursion

```cpp
class Solution {
public:
    bool isSameTree(TreeNode* p, TreeNode* q) {
        
        TreeNode* pt = p;
        TreeNode* qt = q;
        
        // gonna do preorder traversal
        if (pt != NULL && qt != NULL)
        {
            // check node
            if (pt->val != qt->val)
                return false;
            // go left
            if (!isSameTree(pt->left, qt->left))
                return false;
            // go right
            if (!isSameTree(pt->right, qt->right))
                return false;
        }
        else if (pt != NULL)
            return false;
        else if (qt != NULL)
            return false;
        else
            return true;
    }
};
```

It's a simple solution doing pre-order traversal using recursion. This solution beats 43% of other C++ solutions. And then, **I found out something interesting**. Let's see the solution 2 below.

# Solution 2 in C++ Using Recursion

```cpp
class Solution {
public:
    bool isSameTree(TreeNode* p, TreeNode* q) {
        
        TreeNode* pt = p;
        TreeNode* qt = q;
        
        // gonna do preorder traversal
        if (pt != NULL && qt != NULL)
        {
            if (pt->val != qt->val
                || !isSameTree(pt->left, qt->left)
                || !isSameTree(pt->right, qt->right))
                return false;
        }
        else if (pt != NULL || qt != NULL)
            return false;
        else
            return true;
    }
};
```

The difference between solution 1 and 2 is just the number of `if` statement. In solution 2, all conditions that leads to the same behavior in solution 1 are merged into one `if` statement. Specifically, `if (pt->val != qt->val || ... || ...)` and `else if (pt != NULL || qt != NULL)`. However, the runtime was significantly reduced.

![results](https://broccolism.github.io/assets/img/others/2020-06-04-1.JPG)

From the top, the 1st and the 3rd are results by the solution 2 and the 2nd and the 4th are by the solution 1. When there's less number of `if` statement, runtime even became `0ms`, which is faster than 100% of other C++ online submissions.

😎 I guess this is becuase of the *branch instruction*. If you learned about computer architecture ││ compiler ││ assemble language, you may understand what I mean. *Branch instruction*, a kind of instructions that compilers make, is yield from `if` ││ `while` ││ `goto`(in C) and other statements like them. It is pretty convenience for us to use such statements, but not for the hardware becuase of the high cost of executing the instruction. For example, CPU needs to compute an address of where to jump for each branch instruction.

👀 Some compilers can optimize lots of code that a programmar wrote. But I think the LeetCode Compiler does not that much of optimization for this time. Maybe I should keep observing runtime differences resulted by the difference of branch instructions with many other problems.

# Solution 3 in C++ using iteration
The main idea of this solution is not mine. It's from the LeetCode solution tab.

```cpp
#include <stack>
using namespace std;

class Solution {
public:
    bool check(TreeNode* p, TreeNode* q) {
        if (p == NULL || q == NULL)
            return false;
        else if (p->val == q->val)
            return true;
        else
            return false;
    }
    
    bool isSameTree(TreeNode* p, TreeNode* q) {
        TreeNode* pt = p;
        TreeNode* qt = q;
        
        stack<TreeNode*> next; 
        
        next.push(pt);
        next.push(qt);
        
        while (!next.empty()) {
            pt = next.top();
            next.pop();
            qt = next.top();
            next.pop();
            
            if (pt == NULL && qt == NULL)
                continue;
            
            if (!check(pt, qt)) return false;
            
            next.push(pt->right);
            next.push(qt->right);
            next.push(pt->left);
            next.push(qt->left);
        }
        
        return true;
    }
};
```

This is iteration ver. of tree traversal. Nothing so special!