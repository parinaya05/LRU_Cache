# LRU Cache Implementation

## 📌 Overview
This project implements an **LRU (Least Recently Used) Cache** using core data structures.
An LRU Cache removes the least recently accessed element when the cache reaches its capacity.

This concept is widely used in:
- Operating Systems
- Database systems
- Web browsers
- Memory management

---

## 🎯 Objective
- To understand cache replacement policies
- To implement efficient `get` and `put` operations
- To apply data structures like Hashing and Linked Lists

---

## 🧠 How LRU Cache Works
- When an item is accessed, it becomes **most recently used**
- When the cache is full, the **least recently used** item is removed
- Both `get()` and `put()` operations work in **O(1) time**

---

## 🛠 Technologies Used
- Programming Language: Java / JavaScript (based on implementation)
- Data Structures:
  - HashMap (for fast lookup)
  - Doubly Linked List (for order tracking)

---

## ⚙️ Operations Supported
- `get(key)` → Returns value if present, else -1
- `put(key, value)` → Inserts or updates value
- Automatic eviction when capacity is exceeded

---

## 📂 Project Structure
