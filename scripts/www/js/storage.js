// 极简封装localStorage工具，自动序列化/反序列化对象数组，无需手动JSON转换
const Storage = {
	// 存数据（支持字符串、数字、布尔、对象、数组）
	set(key, val) {
		const data = typeof val === 'object' && val !== null ? JSON.stringify(val) : val;
		localStorage.setItem(key, data);
	},

	// 取数据（自动还原对象/数组）
	get(key) {
		const str = localStorage.getItem(key);
		try {
			return JSON.parse(str);
		} catch (e) {
			return str;
		}
	},

	// 删除单条
	del(key) {
		localStorage.removeItem(key);
	},

	// 清空全部
	clear() {
		localStorage.clear();
	},

	// 批量存储 传入 {key1:val1, key2:val2}
	batchSet(obj) {
		for (let k in obj) {
			this.set(k, obj[k]);
		}
	},

	// 批量删除 传入数组 ['key1','key2']
	batchDel(arr) {
		arr.forEach(k => this.del(k));
	},

	// 批量获取，传入key数组，返回 {key:value}
	batchGet(keyArr) {
		const res = {};
		keyArr.forEach(k => {
			res[k] = this.get(k);
		})
		return res;
	}
};

/* 
使用方法
// 普通值
Storage.set('name', '小明');
console.log(Storage.get('name'));

// 数字
Storage.set('age', 18);
console.log(Storage.get('age'));

// 对象
Storage.set('user', { id: 1, name: '小红' });
console.log(Storage.get('user').name);

// 数组
Storage.set('list', [10, 20, 30]);
console.log(Storage.get('list')[0]);

// 单删
Storage.del('name');

// 批量存
Storage.batchSet({
	a: 111,
	b: [1, 2]
});

// 批量删
Storage.batchDel(['a', 'b']);

// 批量存
Storage.batchSet({
  name: "张三",
  user: { id: 1 },
  arr: [1,2,3]
})

// 批量获取
const data = Storage.batchGet(['name','user','arr']);
console.log(data.name, data.user.id, data.arr[0]);

// 批量删除
Storage.batchDel(['name','arr'])

// 清空所有
Storage.clear(); */