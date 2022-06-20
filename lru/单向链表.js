// 节点类
class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

// 单向链表类
class SinglyList {
  constructor() {
    this.length = 0;
    this.head = null;
    this.current = null;
  }

  // 遍历所有节点
  interator() {
    let i = 0;
    let currentNode = this.head;
    while (i < this.length) {
      console.log(currentNode);
      currentNode = currentNode.next;
      i++;
    }
  }

  // add :添加节点
  add(value) {
    const node = new Node(value);
    if (this.length === 0) {
      this.head = node;
      this.current = node;
    } else {
      this.current.next = node;
      this.current = node;
    }

    this.length++;
    return node;
  }

  // 删除节点
  delete(index) {
    if (index >= this.length) return;
    let i = 0;
    let curNode = this.head;
    let prevNode = null;
    while (i < index) {
      prevNode = curNode;
      curNode = curNode.next;
      i++;
    }
    if (i === 0) {
      // 第一个
      this.head = curNode.next || null;
      this.current = curNode.next || null;
    } else {
      // 其他位置
      if (curNode.next) {
        prevNode.next = curNode.next;
      } else {
        // 尾节点，调整current指针到前一位
        prevNode.next = null;
        this.current = prevNode;
      }
    }

    this.length--;
  }

  findByIndex(index) {
    if (index >= this.length) return;
    let i = 0;
    let curNode = this.head;
    while (i < index) {
      curNode = curNode.next;
      i++;
    }
    return curNode;
  }
}

// test
const s = new SinglyList();
s.add(1);
s.add(2);
s.add(3);
s.delete(0);
console.log(1111111, s.findByIndex(1));
s.interator();
