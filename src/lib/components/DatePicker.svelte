<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import AirDatepicker, { type AirDatepickerOptions } from 'air-datepicker';
	import localeEn from 'air-datepicker/locale/en';
	import 'air-datepicker/air-datepicker.css';
	import { ArrowSmallUp, CalendarDays, MinusCircle } from 'svelte-heros-v2';

	let input = $state<HTMLInputElement>();

	let {
		value = $bindable(),
		picker = $bindable(),
		...opts
	}: {
		value?: string;
		picker?: AirDatepicker;
	} & AirDatepickerOptions = $props();

	onMount(() => {
		if (!input) return;

		if (picker) picker.destroy();
		picker = new AirDatepicker(input, {
			locale: localeEn,
			...opts
		});
	});
</script>

<label class="input input-bordered grid grid-cols-10 content-around gap-2">
	<div class="flex h-full items-center">
		<CalendarDays variation="solid" />
	</div>
	<input bind:this={input} class="col-span-9" bind:value />
</label>

<style>
	:global(.air-datepicker) {
		--adp-background-color-active: var(--fallback-b3, oklch(var(--b3) / var(--tw-bg-opacity, 1)));
		--adp-background-color-hover: var(--fallback-b2, oklch(var(--b2) / var(--tw-bg-opacity, 1)));
		--adp-background-color: var(--fallback-b1, oklch(var(--b1) / var(--tw-bg-opacity, 1)));
		--adp-color: var(--fallback-bc, oklch(var(--bc) / var(--tw-text-opacity, 1)));
		--adp-nav-color-secondary: var(--adp-color);
		--adp-accent-color: var(--fallback-p, oklch(var(--p) / var(--tw-text-opacity, 1)));
		--adp-cell-background-color-selected: var(--adp-accent-color);
		--adp-cell-background-color-selected-hover: var(--adp-accent-color);
		--adp-day-name-color: var(--fallback-s, oklch(var(--s) / var(--tw-bg-opacity, 1)));
		--adp-border-color: var(--fallback-bc, oklch(var(--bc) / var(--tw-text-opacity, 1)));
		--adp-border-color-inline: var(--adp-border-color);
		--adp-border-color-inner: var(--adp-border-color);
	}

	:global(.air-datepicker--pointer::after) {
		background-color: var(--fallback-b1, oklch(var(--b1) / var(--tw-bg-opacity, 1)));
	}
</style>
