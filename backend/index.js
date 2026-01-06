const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

/* =======================
   Node (DLL Node)
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
   LRU Cache
======================= */
class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.map = new Map();

        this.head = new Node(-1, -1);
        this.tail = new Node(-1, -1);

        this.head.next = this.tail;
        this.tail.prev = this.head;
    }

    delete(node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    insert(node) {
        node.next = this.head.next;
        node.prev = this.head;
        this.head.next.prev = node;
        this.head.next = node;
    }

    get(key) {
        if (!this.map.has(key)) return -1;

        const node = this.map.get(key);
        this.delete(node);
        this.insert(node);
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

    getCacheOrder() {
        const res = [];
        let curr = this.head.next;
        while (curr !== this.tail) {
            res.push({ key: curr.key, value: curr.val });
            curr = curr.next;
        }
        return res;
    }
}

/* =======================
   Global Cache
======================= */
let cache = null;

/* =======================
   APIs
======================= */

app.post("/set-capacity", (req, res) => {
    const { capacity } = req.body;
    cache = new LRUCache(Number(capacity));
    res.json({ message: `Capacity set to ${capacity}` });
});

app.post("/put", (req, res) => {
    const { key, value } = req.body;
    cache.put(key, value);
    res.json({
        message: "PUT successful",
        cache: cache.getCacheOrder()
    });
});

app.get("/get/:key", (req, res) => {
    const key = req.params.key;
    const value = cache.get(key);
    res.json({
        value,
        cache: cache.getCacheOrder()
    });
});

/* =======================
   Start Server
======================= */
app.listen(3000, () => {
    console.log("Backend running at http://localhost:3000");
});
