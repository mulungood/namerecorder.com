<script>
	import { browser } from '$app/environment'
	import { invalidate } from '$app/navigation'
	import { page } from '$app/stores'
	import { onMount } from 'svelte'
	import SendIcon from '../components/icons/SendIcon.svelte'
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

{#if $page.data?.session?.user && $page.routeId !== '/@[handle]'}
	<form method="POST" action="/login?/signout">
		<button type="submit" class="btn btn--underline text-sm" data-color="red"
			>Sign-out</button
		>
	</form>
{/if}

{#if $page.routeId === '/@[handle]'}
	<a href="/record" class="btn text-sm record-cta" data-color="neutral">
		{#if $page.data?.session && $page.data?.session?.user?.id === $page.data?.user?.user_id}
			Edit recording
		{:else}
			<SendIcon /> Record your own
		{/if}
	</a>
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

	form,
	.record-cta {
		position: fixed;
		right: var(--container-padding-x);
		bottom: var(--container-padding-bottom);
	}
</style>
