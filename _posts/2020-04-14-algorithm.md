---  
layout: post  
title: "[LeetCode] Add Two Numbers"
categories: others
tags: algorithm linked-list leetcode
comments: true
---

# Add Two Numbers
[go to the page](https://leetcode.com/problems/add-two-numbers/)  
You are given two **non-empty** linked lists representing two non-negative integers. The digits are stored in **reverse order** and each of their nodes contain a single digit. Add the two numbers and return it as a linked list.

You may assume the two numbers do not contain any leading zero, except the number 0 itself.

**Example:**
```
Input: (2 -> 4 -> 3) + (5 -> 6 -> 4)
Output: 7 -> 0 -> 8
Explanation: 342 + 465 = 807.
```

# Solution in C++

```cpp
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode(int x) : val(x), next(NULL) {}
 * };
 */

/*
1. should consider about carry.
2. should consider.. making new node
3. what if length of each lists is different?
    => check the list is not empty first.
*/

class Solution {
public:
    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
        ListNode *trip1 = l1, *trip2 = l2;
        ListNode *head = new ListNode;
        ListNode *trip3 = head;
        
        int i1, i2, i3, carry = 0;
        while(trip1 != NULL || trip2 != NULL) {
            i1 = (trip1 != NULL) ? trip1->val : 0;
            i2 = (trip2 != NULL) ? trip2->val : 0;
            
            i3 = i1 + i2 + carry;
            if(i3 >= 10) {
                i3 -= 10;
                carry = 1;
            } else {
                carry = 0;
            }
            
            trip3->next = new ListNode(i3);
            trip3 = trip3->next;
            if(trip2 != NULL) {
                trip2 = trip2->next;    
            }
            if(trip1 != NULL) {
                trip1 = trip1->next;    
            }
        }            
        if (carry > 0) {
            trip3->next = new ListNode(1);
        }
    return head->next;
    }
};
```

# How I solved
## Hint from Problem
- **non-empty** linked lists: we don't need extra computation for some special case.
- **reverse order**: actually this is kind of helper for us i think, because we can easily deal with carries.
## At first,
- Tried to save that next node for the next step, not just start to travel from the head. I think this approach was very good.
However,
- I was totally forgot about *traveler* of linked list.
- And tried to implement all the cases with *for loop*.
## What I learned
- I surely need **traveler** node.
- Sometimes **ternary operator** works so efficiently.