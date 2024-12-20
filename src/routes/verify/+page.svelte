<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import UnknownError from '$lib/components/UnknownError.svelte';
	import { LockClosed, LockOpen, Key } from 'svelte-heros-v2';
	let year = new Date('2024-12-25').getFullYear();

	let status = $state<'locked' | 'loading' | 'unlocked'>('locked');

	let error = $state<string | undefined>();
	let color = $derived(error ? 'input-error' : '');

	let tooltip = $state<'tooltip-open' | undefined>();
	$effect(() => {
		tooltip = error ? 'tooltip-open' : undefined;
		setTimeout(() => {
			tooltip = undefined;
		}, 2000);
	});

	let show = $state(false);
</script>

{#snippet ButtonContent()}
	{#if status === 'locked'}
		<LockClosed />
	{:else if status === 'unlocked'}
		<LockOpen />
	{:else}
		<span class="loading loading-spinner text-neutral"></span>
	{/if}
{/snippet}

<div class="card-body">
	<h2 class="card-title">Secret Santa {year}</h2>
	<p>
		Please enter this years code. If you don't know the code, contact
		<span class="tooltip text-primary" data-tip="Jonathan">me</span> and I will send it to you.
	</p>
	<form
		class="grid grid-cols-10 gap-2"
		method="POST"
		use:enhance={() => {
			return async ({ result, update }) => {
				setTimeout(() => {
					if (result.type === 'failure') {
						if (result.data) {
							const { missing, invalid } = result.data;
							if (missing) error = 'Please input a code.';
							else if (invalid) error = 'Invalid code.';
						} else {
							show = true;
						}

						status = 'locked';
					} else if (result.type === 'success') {
						status = 'unlocked';
						setTimeout(() => {
							goto('/enter');
						}, 100);
					} else {
						status = 'locked';
						show = true;
					}
				}, 100);
			};
		}}
	>
		<label
			class="{error
				? 'tooltip'
				: ''} tooltip-bottom tooltip-error {tooltip} input input-bordered col-span-8 {color}  grid grid-cols-10 content-around gap-2"
			data-tip={error}
		>
			<div class="flex h-full items-center">
				<Key variation="solid" size="15" />
			</div>
			<input name="code" type="password" class="col-span-9" autocomplete="off" />
		</label>

		<button
			aria-label="verify"
			class="btn btn-primary col-span-2"
			onclick={() => (status = 'loading')}
		>
			{@render ButtonContent()}
		</button>
	</form>
</div>

<UnknownError {show} />

<style>
</style>
