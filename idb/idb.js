const users = [
  { uid: "a", name: "wan", age: "18" },
  { uid: "b", name: "zhang", age: "18" },
  { uid: "c", name: "test", age: "18" },
];

// 创建一个idb
/*
 indexedDB.open('db name') ，如果没有，则创建
 */
var db;
var objectStore;
var request = indexedDB.open("MyDB");
request.onerror = (e) => {
  console.log("error", e);
};

request.onsuccess = (event) => {
  db = event.target.result;
  console.log("db:", db);
  // 成功后拿到数据库对象才能进行相关操作
  var objectStore = db.transaction("name").objectStore("name");
  addData();
  updateData();
  useCursor();
  getUserByIndex(objectStore);
  useCursorByRange(objectStore);
};

/* 
  创建 object store 
  每个db可以有多个object store，用于存储不同数据
  每个db在首次创建或者版本升级时，通过request.onupgradeneeded事件，创建在该版本下的object store
*/

request.onupgradeneeded = (event) => {
  db = event.target.result;
  objectStore = db.createObjectStore("name", { keyPath: "uid" });
  console.log("objectStore", objectStore);
  // 通过createIndex 建立索引,如果该属性是不可重复的，可加unique 保证唯一性
  objectStore.createIndex("name", "name", { unique: true });
  objectStore.createIndex("age", "age", { unique: false });
};

/* 
  数据库操作：transaction
  第一个参数为操作的object  store 列表，如果只有一个，可以用string而不是数组
  第二个参数为transaction模式，readonly|readwrite|versionchange, 默认为readonly
*/
function addData() {
  var transaction = db.transaction(["name"], "readwrite"); //

  transaction.oncomplete = function (event) {
    console.log("transaction done");
  };

  transaction.onerror = function (e) {
    console.log("transaction error", e);
  };

  /* 
    增.add 
    删.delete
    改.put
    查.get
  */

  var objectStoreOfName = transaction.objectStore("name");
  users.forEach((user) => {
    var request = objectStoreOfName.add(user);
    // 返回一个request对象，可以对其onsuccess做操作
    request.onsuccess = () => {
      // ...添加成功
    };
  });

  db.transaction("name", "readonly").objectStore("name").get("a").onsuccess = (
    event
  ) => {
    console.log('get value of name "a":', event.target.result);
  };
}

function updateData() {
  var objectStore = db.transaction("name", "readwrite").objectStore("name");
  var request = objectStore.get("a");
  request.onsuccess = (event) => {
    let data = event.target.result;

    // 更新数据
    data.age = "99";
    var requestUpdate = objectStore.put(data);
    requestUpdate.onsuccess = () => {
      console.log("update success");
    };
  };
}

/* 
  游标:openCursor
  用于遍历数据
*/

function useCursor() {
  var objectStore = db.transaction("name").objectStore("name");
  objectStore.openCursor().onsuccess = function (event) {
    var cursor = event.target.result;
    if (cursor) {
      console.log("cursor:", cursor.key, cursor.value);
      cursor.continue();
    } else {
      console.log("no more entries");
    }
  };
}

/* 
  使用索引进行查找
  假如想要通过name来查找一个用户，如果name不加索引，需要遍历整个数据库，非常慢，但如果加了索引则极大程度加快查找
  要使用索引，首先要保证在onupgradeneeded中创建了索引。 objectStore.createIndex("name", "name", { unique: true }); 
*/

function getUserByIndex(objectStore) {
  var index = objectStore.index("age");

  index.get("18").onsuccess = (event) => {
    console.log('value of name "wan" is ', event.target.result);
  };
}

/* 指定cursor范围 */
function useCursorByRange(objectStore) {
  const res = [];
  var index = objectStore.index("age");
  var singleKeyRange = IDBKeyRange.only("18"); // 遍历所有age=18的项
  index.openCursor(singleKeyRange).onsuccess = (event) => {
    var cursor = event.target.result;
    if (cursor) {
      // cursor:IDBCursorWithValue
      // 当匹配时进行一些操作
      res.push({ ...cursor.value });
      cursor.continue();
    }

    console.log("useCursorByRange", cursor, res);
  };
}
