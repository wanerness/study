/**
 * lru算法；latest recently used 最近最少使用算法（缓存淘汰算法）
 * 1. 有一个最大长度
 * 2. put 方法，可以放进一个数据，该数据位于最前面
 * 3. get方法，获取一个数据，获取之后该数据位于最前面
 * 4. put新数据时，如果超出了最大长度，删除末位的数据
 * 5. 需要实现O(1)的复杂度，故使用哈希表加双向链表（哈希链表）的数据结构
 */

// 一 需要实现一个双向链表

/**
 * 使用双向链表，是因为涉及删除操作，具体见代码
 * 该链表需要实现一个从头部插入的方法 addHead
 * 要实现一个从中间删除的方法 remove
 * 要实现一个从末位删除的方法 removeTail,需要返回删除节点
 * 需要实现一个获取长度方法 getLength
 */

class Node {
  constructor(data) {
    this.data = data;
    this.prev = null;
    this.next = null;
  }
}

class DoublyList {
  constructor() {
    this.length = 0;
    this.head = null;
    this.tail = null;
  }

  addHead(node) {
    this.head = node;
    this.length++;
  }

  remove(node) {
    if (!node.prev) {
      // 第一个

      this.head = node.next || null;
      if (this.head) {
        this.head.prev = null;
      }
    } else if (node.next) {
      // 最后一个
      node.prev.next = null;
      this.tail = node.prev || null;
    } else {
      // 中间
      const prevNode = node.prev;
      const nextNdoe = node.next;
      prevNode.next = nextNdoe;
      nextNdoe.prev = prevNode;
    }

    this.length--;
    return node;
  }

  removeTail() {
    const tail = this.tail;
    tail.prev.next = null;
    this.tail = tail.prev;
    this.length--;

    return tail;
  }

  getLength() {
    return this.length;
  }
}

// lru类
/**
 * 1. 使用map（hash）保存key，node对应关系
 * 2. 内部cache属性保存所有缓存数据，cache为上面实现的双向列表类型
 * 3. put方法：查map看是否已经存在（O(1)），如存在，更新node，从原位置删除后在头部加入链表（O(1)），如不存在，直接在头部加入链表
 * 4. get方法： 查map看是否存在,不存在直接返回-1，如存在，返回node，然后在链表中原位置先删除，后插入头部
 */

class LRU {
  constructor(size) {
    this.size = size;
    this.cache = new DoublyList();
    this.hashMap = new Map();
  }

  put(key, value) {
    const node = new Node({ key, value });
    // 查map看key是否存在
    let valueNode = this.hashMap.get(key);
    if (!valueNode) {
      //写入链表
      if (this.cache.getLength() >= this.size) {
        // 长度已满，删除最后一项再插入
        const deleteNode = this.cache.removeTail();
        this.cache.addHead(node);
        this.hashMap.delete(deleteNode.data.key); // 删除对应的key
      } else {
        this.cache.addHead(node);
      }
    } else {
      // 已存在该节点，直接更新
      this.cache.remove(valueNode);
      this.cache.addHead(node);
    }

    // 更新map
    this.hashMap.set(key, node);
  }

  get(key) {
    const valueNode = this.hashMap.get(key);
    if (!valueNode) {
      return -1;
    }

    // 如果拿到了，要把这个node放到链表头部
    this.cache.remove(valueNode);
    this.cache.addHead(valueNode);

    return valueNode;
  }
}
