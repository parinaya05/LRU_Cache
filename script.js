
const express = require("express");
const app = express();

app.use(express.json());

/* =======================
   Node (same as Java Node)
======================= */
class Node {
    constructor(key, val) {
        this.key = key;
        this.val = val;
        this.prev = null;
        this.next = null;
    }
}

/* =======================
   LRU Cache (DSA Logic)
======================= */
class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.map = new Map();

        // Dummy head & tail
        this.head = new Node(-1, -1);
        this.tail = new Node(-1, -1);

        this.head.next = this.tail;
        this.tail.prev = this.head;
    }

    // delete node from DLL
    delete(node) {
        const before = node.prev;
        const after = node.next;
        before.next = after;
        after.prev = before;
    }

    // insert node after head (MRU)
    insert(node) {
        const after = this.head.next;
        node.next = after;
        node.prev = this.head;
        after.prev = node;
        this.head.next = node;
    }

    get(key) {
        if (!this.map.has(key)) {
            return -1; // MISS
        }

        const node = this.map.get(key);
        this.delete(node);
        this.insert(node); // move to MRU
        return node.val;
    }

    put(key, value) {
        if (this.map.has(key)) {
            const node = this.map.get(key);
            node.val = value;
            this.delete(node);
            this.insert(node);
        } else {
            if (this.map.size === this.capacity) {
                const lru = this.tail.prev;
                this.map.delete(lru.key);
                this.delete(lru);
            }

            const newNode = new Node(key, value);
            this.map.set(key, newNode);
            this.insert(newNode);
        }
    }

    // for frontend visualization
    getCacheOrder() {
        const result = [];
        let curr = this.head.next;
        while (curr !== this.tail) {
            result.push({ key: curr.key, value: curr.val });
            curr = curr.next;
        }
        return result;
    }
}

/* =======================
   Global Cache Instance
======================= */
let cache = null;

/* =======================
   APIs
======================= */

// set capacity
app.post("/set-capacity", (req, res) => {
    const { capacity } = req.body;
    cache = new LRUCache(capacity);
    res.json({ message: `Capacity set to ${capacity}` });
});

// put key-value
app.post("/put", (req, res) => {
    const { key, value } = req.body;
    cache.put(key, value);
    res.json({
        message: "PUT operation successful",
        cache: cache.getCacheOrder()
    });
});

// get value
app.get("/get/:key", (req, res) => {
    const key = req.params.key;
    const value = cache.get(key);

    res.json({
        value,
        cache: cache.getCacheOrder()
    });
});
