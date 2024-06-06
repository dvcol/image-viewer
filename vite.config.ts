import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { enhancedImages } from '@sveltejs/enhanced-img';

export default defineConfig({
	plugins: [enhancedImages(), sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		alias: {
			'~': new URL('./src', import.meta.url).pathname
		}
	},
	server: {
		port: 3005,
		open: true
	},
	assetsInclude: ['**/*.bmp?enhanced=true']
});
