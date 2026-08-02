//方案2，动态改变header和content等盒模型参数,不需要额外css配合
/* (function(w) {
	let immersed = 0;

	const ua = navigator.userAgent;

	if (!ua.includes('Html5Plus/') || !ua.includes('Immersed/')) {
		console.log('当前设备不支持沉浸式或未开启');
		return;
	}
	immersed = parseInt(ua.match(/Immersed\/(\d+\.?\d*)/)[1]);

	w.immersed = immersed;

	console.log('状态栏高度:', immersed + 'px');

	// 调整 header
	const header = document.querySelector('.mui-bar-nav');
	if (header) {
		header.style.paddingTop = immersed + 'px';
		header.style.height = (44 + immersed) + 'px';
	}

	// 调整内容区
	const content = document.querySelector('.mui-content');
	if (content) {
		content.style.marginTop = immersed + 'px';
	}

	const scrollWrapper = document.querySelector('.mui-scroll-wrapper')
	if (scrollWrapper) {
		scrollWrapper.style.top = (364+immersed) + 'px'
	}
})(window); */

//针对ios下面使用这个，android也可以
function initImmersed() {
	const statusbarheight = plus.navigator.getStatusbarHeight()

	// 调整 header
	const header = document.querySelector('.mui-bar-nav');
	if (header) {
		header.style.paddingTop = statusbarheight + 'px';
		header.style.height = (44 + statusbarheight) + 'px';
	}

	// 调整内容区
	const content = document.querySelector('.mui-content');
	if (content) {
		content.style.marginTop = statusbarheight + 'px';
	}

	const scrollWrapper = document.querySelector('.mui-scroll-wrapper')
	if (scrollWrapper) {
		scrollWrapper.style.top = (98 + statusbarheight) + 'px'
	}
}

mui.plusReady(function() {
	initImmersed()
})