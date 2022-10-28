<script>
	import { browser } from '$app/environment'
	import { invalidate } from '$app/navigation'
	import { page } from '$app/stores'
	import { onMount } from 'svelte'
	import { supabase } from '../db'
	import '../global.css'

	onMount(() => {
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(() => {
			invalidate('supabase:auth')
		})

		return () => {
			subscription.unsubscribe()
		}
	})

	$: if ($page.data?.session?.user && browser) {
		localStorage.setItem('has-logged-before', 'true')
	}
</script>

<svelte:head>
	<link rel="icon" href="/favicons/{$page.data.pageColor || 'emerald'}.png" />
</svelte:head>

<slot />

<a class="site-url text-sm" href="/" tabindex={1}>{$page.url.host}</a>

{#if $page.data?.session?.user}
	<form method="POST" action="/login?/signout">
		<button type="submit" class="btn btn--underline text-sm" data-color="red"
			>Sign-out</button
		>
	</form>
{/if}

<style>
	.site-url {
		color: var(--color-tailwind-gray-500);
		text-decoration: none;
		position: fixed;
		left: var(--container-padding-x);
		bottom: var(--container-padding-bottom);
		z-index: 8;
	}

	form {
		position: fixed;
		right: var(--container-padding-x);
		bottom: var(--container-padding-bottom);
	}
</style>
