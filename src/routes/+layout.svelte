<script lang="ts">
	import { page } from '$app/state';
	import '../app.css';
	let { children } = $props();
</script>

<div class="knee-background fixed flex h-screen w-screen blur-sm"></div>
<div class="flex h-screen w-screen flex-col items-center justify-center">
	<div class="card h-min w-96 bg-base-100 shadow-xl md:w-max">
		{@render children()}
	</div>

	<div class="link-footer flex items-center justify-center gap-4 p-2">
		<a class="text-primary-content" href="/"
			>{#if page.url.pathname.startsWith('/admin')}
				Home
			{:else}
				<b>Home</b>
			{/if}</a
		>
		<a class="text-primary-content" href="/admin"
			>{#if page.url.pathname.startsWith('/admin')}
				<b>Admin</b>
			{:else}
				Admin
			{/if}</a
		>
	</div>
</div>

<style>
	.knee-background {
		background-image: url('/knee-surgery.jpg');
		background-size: 100% 100%;
	}

	.link-footer {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		text-align: center;
	}
</style>
