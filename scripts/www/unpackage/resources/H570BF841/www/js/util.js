function injectSafeareaStyle() {
	if (!document.getElementById('style4safearea')) {
		let style = document.createElement('style')
		style.id = 'style4safearea'
		style.textContent = `.safe-area {
				position: fixed;
				bottom: 0;
				left: 0;
				right: 0;
				width: 100%;
				height: 35px;
				background-color: #efeff4; 
				z-index: 99;
			}`
		document.head.appendChild(style)
	}
}

/**
 * 万能打印函数
 * @param {*} data 要打印的数据
 * @param {boolean} showType 是否显示类型标注 true显示/false不显示
 */
function logX(data, showType = false) {
	let output = data;
	// 对象/数组处理
	if (typeof data === 'object' && data !== null) {
		output = JSON.stringify(data, null, 2);
	}
	if (showType) {
		console.log(`【${typeof data}】`, output);
	} else {
		console.log(output);
	}
}