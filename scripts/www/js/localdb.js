// 本地JSON对象CRUD库，自动生成唯一_id，存储在localStorage，简单粗暴
const LocalDB = {
	storeKey: "local_db_data",
	
	// 新增use方法，切换独立存储key，隔离多套数据
	use(dbName) {
	  // 拼接唯一存储键，避免冲突
	  this.storeKey = `local_db_${dbName}`;
	  // 返回自身支持链式调用
	  return this;
	}
	
	_getAllRaw() {
		const str = localStorage.getItem(this.storeKey);
		try {
			return JSON.parse(str) || [];
		} catch {
			return [];
		}
	},

	_save(arr) {
		localStorage.setItem(this.storeKey, JSON.stringify(arr));
	},

	_genId() {
		return Math.random().toString(36).slice(2) + Date.now().toString(36);
	},

	_hasId(_id) {
		const list = this._getAllRaw();
		return list.some(item => item._id === _id);
	},

	insert(row) {
		const list = this._getAllRaw();
		const newRow = { ...row, _id: this._genId() };
		list.push(newRow);
		this._save(list);
		return newRow._id;
	},

	insertBatch(rows) {
		const list = this._getAllRaw();
		const idArr = [];
		rows.forEach(item => {
			const newRow = { ...item, _id: this._genId() };
			list.push(newRow);
			idArr.push(newRow._id);
		});
		this._save(list);
		return idArr;
	},

	delete(_id) {
		const list = this._getAllRaw();
		if (!this._hasId(_id)) {
			console.warn(`[LocalDB.delete] _id:${_id} 不存在`);
			return 0;
		}
		const newList = list.filter(item => item._id !== _id);
		const delCount = list.length - newList.length;
		this._save(newList);
		return delCount;
	},

	// 改造后的update：支持两种传参形式
	// 形式1：update("_xxxid", {name:"xxx"})
	// 形式2：update({_id:"_xxxid", name:"xxx"})
	update(_id, newData) {
		let targetId;
		let updateObj;

		// 判断第一种传参：第一个参数是字符串_id，第二个是更新对象
		if (typeof _id === "string" && newData && typeof newData === "object") {
			targetId = _id;
			updateObj = newData;
		}
		// 判断第二种传参：只传一个对象，内部包含_id
		else if (typeof _id === "object" && _id._id) {
			targetId = _id._id;
			updateObj = _id;
		}
		// 参数格式非法
		else {
			console.warn("[LocalDB.update] 参数格式错误，支持两种：update(_idStr, dataObj) / update(dataObjWithId)");
			return 0;
		}

		const list = this._getAllRaw();
		if (!this._hasId(targetId)) {
			console.warn(`[LocalDB.update] _id:${targetId} 不存在`);
			return 0;
		}

		for (let i = 0; i < list.length; i++) {
			if (list[i]._id === targetId) {
				list[i] = { ...list[i], ...updateObj, _id: targetId };
				break;
			}
		}
		this._save(list);
		return 1;
	},

	updateBatch(updateArr) {
		const list = this._getAllRaw();
		let updateSuccessNum = 0;
		updateArr.forEach(item => {
			const { _id, data } = item;
			if (!this._hasId(_id)) {
				console.warn(`[LocalDB.updateBatch] _id:${_id} 不存在，跳过`);
				return;
			}
			for (let i = 0; i < list.length; i++) {
				if (list[i]._id === _id) {
					list[i] = { ...list[i], ...data, _id };
					updateSuccessNum++;
					break;
				}
			}
		});
		this._save(list);
		return updateSuccessNum;
	},

	get(_id) {
		const list = this._getAllRaw();
		return list.find(item => item._id === _id) || null;
	},

	getAll() {
		return this._getAllRaw();
	}
};

/* 
使用方法：
// 切换名为user的数据库
LocalDB.use('user');
LocalDB.insert({name:'张三'});

// 切换订单数据库，两套数据完全隔离
LocalDB.use('order');
LocalDB.insert({orderNo:'O001'});

// 链式调用
LocalDB.use('goods').insert({title:'商品'});

// 1. 单条插入，返回_id
const uid = LocalDB.insert({ id: 10, username: "aaa", age: 20 });
console.log("插入ID：", uid);

// 2. 批量插入，返回id数组
const idList = LocalDB.insertBatch([
  { username: "张三", age: 18 },
  { username: "李四", age: 22 }
]);
console.log("批量ID列表", idList);

// 3. 根据id查询
const row = LocalDB.get(uid);
console.log(row.username, row._id);

// 4. 更新单条
LocalDB.update(uid, { age: 99 });

// 5. 批量更新
LocalDB.updateBatch([
  { _id: idList[0], data: { age: 66 } },
  { _id: idList[1], data: { username: "王五" } }
]);

// 6. 删除，返回删除数量
const delNum = LocalDB.delete(uid);
console.log("删除条数", delNum);

// 7. 获取全部数据
const all = LocalDB.getAll();
console.log(all); 

=============================================================
返回值规则说明：
get(_id)
匹配到记录：返回完整对象；
无匹配：返回 null；
不输出控制台提示。

getAll()
无论有无数据，统一返回数组；
库里为空：返回 []。

delete(_id)
_id 不存在：控制台警告，返回 0；
删除成功：返回删除数字（1）。

update(_id, data)
_id 不存在：控制台警告，返回 0；
更新成功：返回 1。

updateBatch([...])
某条_id不存在：警告并跳过该条；
返回成功更新的总条数，一条都没更新返回0。
// 插入
const uid = LocalDB.insert({ name: "张三", age: 20 });

// 查询单条 存在返回对象，不存在返回null
console.log(LocalDB.get(uid));
console.log(LocalDB.get("fakeid123")); // null

// 查询全部，空库返回[]
console.log(LocalDB.getAll());

// 更新不存在id，控制台警告，返回0
let res1 = LocalDB.update("abc111", { age: 99 });
console.log(res1); // 0

// 删除不存在id，控制台警告，返回0
let res2 = LocalDB.delete("xyz789");
console.log(res2); // 0

// 批量更新包含无效id，返回成功条数
let res3 = LocalDB.updateBatch([
  { _id: uid, data: { age: 30 } },
  { _id: "fakeid", data: { name: "测试" } }
]);
console.log(res3); // 1

*/