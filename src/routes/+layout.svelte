<script>
	import { page } from '$app/stores'
	import { onMount } from 'svelte'
	import { userStore } from '../userStore'
	import { supabase } from '../db'
	import '../global.css'

	onMount(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			userStore.set({ user: session?.user ?? null, state: 'idle' })
		})

		const { subscription: authListener } = supabase.auth.onAuthStateChange(
			(_event, session) => {
				const currentUser = session?.user
				userStore.set({ user: currentUser ?? null, state: 'idle' })
			},
		)

		return () => {
			authListener?.unsubscribe()
		}
	})
</script>

<slot />

<a class="site-url text-sm" href="/" tabindex={1}>{$page.url.host}</a>

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
