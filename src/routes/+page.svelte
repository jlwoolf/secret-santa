<script lang="ts">
	import type { PairingSchema, UserSchema } from '$lib/server/db/schema';
	import {
		differenceInDays,
		differenceInHours,
		differenceInMinutes,
		differenceInSeconds,
		format
	} from 'date-fns';

	let counter = $state({
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0
	});

	let {
		data
	}: {
		data: {
			mode?: 'signup' | 'buy';
			date?: Date;
			message?: string;
			pair?: {
				giver: UserSchema;
				receiver: UserSchema;
			};
		};
	} = $props();
	const { mode, date, message, pair } = data;

	setInterval(() => {
		if (mode && date) {
			counter.days = differenceInDays(date, new Date());
			counter.hours = differenceInHours(date, new Date()) % 24;
			counter.minutes = differenceInMinutes(date, new Date()) % 60;
			counter.seconds = differenceInSeconds(date, new Date()) % 60;
		}
	}, 250);

	const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	let nameSpanElement = $state<HTMLSpanElement>();
	let nameDecryptInterval: NodeJS.Timeout | null = null;
	let nameDecryptDone = false;

	const decrypt = (value: string) => {
		if (nameDecryptDone) return;

		let iteration = 0;

		if (nameDecryptInterval) clearInterval(nameDecryptInterval);

		nameDecryptInterval = setInterval(() => {
			if (!nameSpanElement) return;
			const target = nameSpanElement;

			target.innerText = target.innerText
				.split('')
				.map((letter, index) => {
					if (index < iteration) {
						return value[index];
					}

					return letters[Math.floor(Math.random() * 26)];
				})
				.join('');

			if (iteration >= value.length && nameDecryptInterval) {
				clearInterval(nameDecryptInterval);
				nameDecryptDone = true;
			}

			iteration += 1 / 3;
		}, 30);
	};
</script>

{#snippet encrypted(name: string)}
	<button class="encrypted btn btn-outline" onclick={() => decrypt(name)}>
		<span class="select-none" bind:this={nameSpanElement}
			>{Array.from(Array(name.length))
				.map(() => letters[Math.floor(Math.random() * 26)])
				.join('')}</span
		>
	</button>
{/snippet}

<div class="card-body">
	<div class="flex w-full items-center justify-center pb-2">
		{#if mode === 'signup' && date}
			<h1 class="card-title">Signup ends in</h1>
		{:else if mode === 'buy' && date}
			<h1 class="card-title">Secret Santa starts in</h1>
		{:else}
			{message ?? "Error: you shouldn't be seeing this"}
		{/if}
	</div>
	<div class="grid w-full auto-cols-max grid-flow-col justify-center gap-5 text-center">
		<div class="flex flex-col rounded-box bg-neutral p-2 text-neutral-content">
			<span class="countdown font-mono text-4xl md:text-5xl">
				<span style="--value:{counter.days};"></span>
			</span>
			days
		</div>
		<div class="flex flex-col rounded-box bg-neutral p-2 text-neutral-content">
			<span class="countdown font-mono text-4xl md:text-5xl">
				<span style="--value:{counter.hours};"></span>
			</span>
			hours
		</div>
		<div class="flex flex-col rounded-box bg-neutral p-2 text-neutral-content">
			<span class="countdown font-mono text-4xl md:text-5xl">
				<span style="--value:{counter.minutes};"></span>
			</span>
			min
		</div>
		<div class="flex flex-col rounded-box bg-neutral p-2 text-neutral-content">
			<span class="countdown font-mono text-4xl md:text-5xl">
				<span style="--value:{counter.seconds};"></span>
			</span>
			sec
		</div>
	</div>
	{#if mode}
		<div class="divider"></div>
	{/if}

	{#if pair}
		<div class="flex w-full flex-col items-center justify-center gap-2 text-center">
			<div>Click the button to reveal your Secret Santa</div>
			{@render encrypted(pair.receiver.name)}
		</div>
		<div class="divider"></div>
	{/if}

	<div class="flex w-full items-center justify-center text-center">
		{#if mode === 'signup' && date}
			<h2>
				Signup ends on <b>{format(date, 'MM/dd/yyyy')}</b> at <b>{format(date, 'hh:mm aa')}</b>
			</h2>
		{:else if mode === 'buy' && date}
			<h2>
				The Secret Santa gift exchange begins <b>{format(date, 'MM/dd/yyyy')}</b> at
				<b>{format(date, 'hh:mm aa')}</b>
			</h2>
		{/if}
	</div>
</div>

<style>
	.encrypted span {
		font-family: 'Space Mono', monospace;
		border-radius: clamp(0.4rem, 0.75vw, 1rem);
	}
</style>
