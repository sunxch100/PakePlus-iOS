//方案1，修改css var --statusbar-height数值，需配合immersed.css使用
function initImmersed() {
	if (plus.navigator.isImmersedStatusbar()) {
		const statusbarHeight = plus.navigator.getStatusbarHeight();
		//console.log('状态栏高度：' + statusbarHeight + 'px');

		document.documentElement.style.setProperty('--statusbar-height', statusbarHeight + 'px');

		// 如果需要物理像素高度
		//const realHeight = statusbarHeight * plus.screen.scale;
		//console.log('真实物理高度：' + realHeight + 'px');
	}
}

mui.plusReady(function() {
	initImmersed()
})