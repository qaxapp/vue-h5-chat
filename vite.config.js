import {
	defineConfig
} from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
// https://vitejs.dev/config/
// 生成时间戳
const timestamp = new Date().getTime();
const isH5 = process.env.UNI_PLATFORM === 'h5';
export default defineConfig({
	// 相当于 vue.congif.js 里面的 pubicPath，可配置为 cdn 地址，将资源文件放到 cdn，能大幅提升页面加载速度
	// base: 'https://static.wildfirechat.cn/h5',
	base: '/',
	plugins: [
		uni(),
	],
	rollupOptions: {
		output: isH5 ? {
			// 为JS文件添加时间戳
			chunkFileNames: `static/js/[name].${timestamp}.js`,
			entryFileNames: `static/js/[name].${timestamp}.js`,
			assetFileNames: `static/[ext]/[name].${timestamp}.[ext]`
		} : {}
	}
})