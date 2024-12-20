<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import UnknownError from '$lib/components/UnknownError.svelte';
	import { CheckCircle } from 'svelte-heros-v2';

	let { data } = $props();

	let status = $state<undefined | 'loading' | 'success'>();
	let submitError = $state<{ name?: string; pin?: string }>();

	let nameError = $derived<string | undefined>(submitError?.name);
	let nameColor = $derived(nameError ? 'select-error' : '');
	let nameTooltip = $state<'tooltip-open' | undefined>();
	$effect(() => {
		nameTooltip = nameError ? 'tooltip-open' : undefined;
		setTimeout(() => {
			nameTooltip = undefined;
		}, 2000);
	});

	let pinError = $derived<string | undefined>(submitError?.pin);
	let pinColor = $derived(pinError ? 'input-error' : '');
	let pinTooltip = $state<'tooltip-open' | undefined>();
	$effect(() => {
		pinTooltip = pinError ? 'tooltip-open' : undefined;
		setTimeout(() => {
			pinTooltip = undefined;
		}, 2000);
	});
	let show = $state(false);
</script>

{#snippet ButtonContent()}
	{#if status === undefined}
		Submit
	{:else if status === 'success'}
		<CheckCircle />
	{:else}
		<span class="loading loading-spinner text-neutral"></span>
	{/if}
{/snippet}

<h2 class="card-title">Login</h2>
<p>Pick your name from the dropdown below and enter your pin.</p>
<form
	class="grid grid-rows-2 gap-2"
	method="POST"
	action="?/submit"
	use:enhance={() => {
		return async ({ result }) => {
			setTimeout(() => {
				if (result.type === 'failure') {
					if (result.data) {
						submitError = result.data;
					} else {
						show = true;
					}

					status = undefined;
				} else if (result.type === 'success') {
					status = 'success';
					setTimeout(() => {
						goto('/');
					}, 100);
				} else if (result.type === 'redirect') {
					goto(result.location);
				} else {
					status = undefined;
					show = true;
				}
			}, 100);
		};
	}}
>
	<div
		class="{nameError ? 'tooltip' : ''} tooltip-bottom tooltip-error {nameTooltip}"
		data-tip={nameError}
	>
		<select
			class="select w-full max-w-xs {nameColor}"
			name="name"
			oninput={() => {
				if (submitError?.name) submitError.name = undefined;
			}}
		>
			<option disabled selected>Select your name</option>
			{#each data.users as user}
				<option value={user.id}>{user.name}</option>
			{/each}
		</select>
	</div>

	<label
		class="input input-bordered {pinColor} grid grid-cols-10 content-around gap-2 {pinError
			? 'tooltip'
			: ''} {pinTooltip} tooltip-bottom tooltip-error"
		data-tip={pinError}
	>
		<div class="flex h-full items-center">#</div>
		<input
			name="pin"
			type="text"
			class="col-span-9"
			autocomplete="off"
			oninput={() => {
				if (submitError?.pin) submitError.pin = undefined;
			}}
		/>
	</label>
	<div class="card-actions flex-row-reverse">
		<button class="btn btn-primary w-1/4" onclick={() => (status = 'loading')}>
			{@render ButtonContent()}
		</button>
		<button class="btn btn-secondary w-1/4" formaction="?/back">Back</button>
	</div>
</form>

<UnknownError {show} />

<style>
</style>
