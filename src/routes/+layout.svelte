<script>
	import '../global.css'
	import { page } from '$app/stores'
</script>

<slot />

<a class="site-url text-md" href="/" tabindex={1}>{$page.url.host}</a>

<style>
	.site-url {
		color: var(--color-tailwind-gray-500);
		text-decoration: none;
		position: fixed;
		left: var(--container-padding-x);
		bottom: var(--container-padding-bottom);
		z-index: 8;
	}
</style>
