<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import UnknownError from '$lib/components/UnknownError.svelte';
	import { date } from 'drizzle-orm/mysql-core';
	import { CheckCircle, User } from 'svelte-heros-v2';

	let { data }: { data: { count: number } } = $props();
	let status = $state<undefined | 'loading' | 'success'>();
	let value = $state<string>();

	let submitError = $state<{ name?: string; pin?: string }>();

	let nameError = $derived(submitError?.name);
	let nameColor = $derived(nameError ? 'input-error' : '');
	let nameTooltip = $state<'tooltip-open' | undefined>();
	$effect(() => {
		nameTooltip = nameError ? 'tooltip-open' : undefined;
		setTimeout(() => {
			nameTooltip = undefined;
		}, 2000);
	});

	let pinError = $derived.by(() => {
		if (submitError?.pin) return submitError.pin;
		else if (!value) return;
		else if (value.length < 4) return 'Pin must be at least 4 digits.';
		else if (!value.match(/[0-9]+/)) return 'Pin must be only digits.';
		return;
	});
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

<div class="card-body">
	<h2 class="card-title">Sign Up</h2>
	<form
		class="mt-2 grid grid-rows-2 gap-2"
		method="POST"
		action="?/submit"
		use:enhance={() => {
			return async ({ result, update }) => {
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
		<label
			class="input input-bordered {nameColor} grid grid-cols-10 content-around gap-2 {nameError
				? 'tooltip'
				: ''} {nameTooltip} tooltip-bottom tooltip-error"
			data-tip={nameError}
		>
			<div class="flex h-full items-center">
				<User variation="solid" size="15" />
			</div>
			<input
				name="name"
				type="text"
				class="col-span-9"
				autocomplete="off"
				placeholder="Enter your name"
				oninput={() => {
					if (submitError?.name) submitError.name = undefined;
				}}
			/>
		</label>
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
				placeholder="Enter a pin"
				bind:value
				oninput={() => {
					if (submitError?.pin) submitError.pin = undefined;
				}}
			/>
		</label>
		<div class="card-actions flex-row-reverse">
			<button class="btn btn-primary w-1/4" onclick={() => (status = 'loading')} type="submit">
				{@render ButtonContent()}
			</button>
			{#if data.count > 0}
				<button class="btn btn-secondary w-1/4" formaction="?/back">Back</button>
			{/if}
		</div>
	</form>
</div>

<UnknownError {show} />

<style>
</style>
