<script lang="ts">
	import DatePicker from '$lib/components/DatePicker.svelte';
	import type { ConfigSchema, UserSchema } from '$lib/server/db/schema';
	import AirDatepicker from 'air-datepicker';
	import { onMount } from 'svelte';
	import { Trash, Clipboard } from 'svelte-heros-v2';
	
	interface Data {
		config?: ConfigSchema;
		users?: UserSchema[];
		message?: string;
	}

	let { data: loadData }: { data: Data } = $props();
	let data = $state<Data>(loadData.message ? {} : loadData);

	let value = $state<string>();
	let message = $state<string>();
	let color = $derived(message ? 'input-error' : '');

	let button = $state<HTMLButtonElement>();
	let copyText = $state<string>();
	let copyTextTimeout = $state<NodeJS.Timeout>();

	let signupDeadlineValue = $state<string>();
	let eventDateValue = $state<string>();

	let signupPicker = $state<AirDatepicker>();
	onMount(() => {
		if (!signupPicker) return;
		if (!data.config?.signupDeadline) return;
		signupPicker.selectDate(data.config.signupDeadline);
	});

	let eventPicker = $state<AirDatepicker>();
	onMount(() => {
		if (!eventPicker) return;
		if (!data.config?.eventDate) return;
		eventPicker.selectDate(data.config.eventDate);
	});

	const deleteUser = async (user: UserSchema) => {
		const response = await fetch('/admin/delete', {
			body: JSON.stringify({
				id: user.id
			}),
			method: 'DELETE'
		});

		if (response.status === 500) return;

		data = {
			...data,
			users: data.users?.filter((i) => i.id !== user.id)
		};
	};

	const setDate = async (dates: { signup?: Date | null; event?: Date | null }) => {
		const result = await fetch('/admin/setdate', {
			body: JSON.stringify(dates),
			method: 'POST'
		});

		const { config }: { config: ConfigSchema } = await result.json();
		data.config = config;
	};

	const fetchData = async () => {
		const response = await fetch('/admin/fetch', {
			body: JSON.stringify({
				value: value
			}),
			method: 'POST'
		});

		const fetchedData = await response.json();
		if (response.type === 'error') {
			message = fetchedData.message;
		} else {
			data = fetchedData;
			value = undefined;
		}
	};
</script>

<div class="card-body">
	{#if data.config}
		<div class="stats shadow">
			<div class="stat">
				<div class="stat-title">This years code</div>
				<div class="stat-value text-2xl">
					{data.config.code}
				</div>
			</div>
		</div>
		<div class="grid grid-rows-2 md:grid-cols-2 md:grid-rows-1 md:gap-2">
			<label class="form-control w-full">
				<div class="label">
					<span class="label-text">Signup Deadline</span>
				</div>
				<DatePicker
					bind:value={signupDeadlineValue}
					bind:picker={signupPicker}
					timepicker={true}
					autoClose={true}
					isMobile={true}
					startDate={data.config.signupDeadline ?? undefined}
					onSelect={async ({ date }) => {
						const signup = Array.isArray(date) ? date[0] : date === undefined ? null : date;
						if (data.config?.signupDeadline !== signup) await setDate({ signup });
					}}
				/>
			</label>

			<label class="form-control w-full">
				<div class="label">
					<span class="label-text">Event Date</span>
				</div>
				<DatePicker
					bind:value={eventDateValue}
					bind:picker={eventPicker}
					startDate={data.config.eventDate ?? undefined}
					timepicker={true}
					autoClose={true}
					isMobile={true}
					onSelect={async ({ date }) => {
						const event = Array.isArray(date) ? date[0] : date === undefined ? null : date;
						if (data.config?.eventDate !== event) await setDate({ event });
					}}
				/>
			</label>
		</div>
	{/if}
	{#if data.users}
		<div class="overflow-x-auto">
			{#if !data.users || data.users.length === 0}
				<div class="flex items-center justify-center">
					<span>No Users</span>
				</div>
			{:else}
				<table class="table">
					<!-- head -->
					<thead>
						<tr>
							<th></th>
							<th>Name</th>
							<th>Pin</th>
							<th>Delete</th>
						</tr>
					</thead>
					<tbody>
						{#each data.users as user}
							<tr class="bg-base-200">
								<th>{user.id}</th>
								<td>{user.name}</td>
								<td><pre>{user.pin}</pre></td>
								<th>
									<button onclick={async () => await deleteUser(user)}>
										<Trash variation="solid" class="text-error" />
									</button>
								</th>
							</tr>
						{/each}
					</tbody>
				</table>
			{/if}
		</div>
	{:else}
		<div class="flex gap-2">
			<input
				type="text"
				placeholder="Type here"
				class="input input-bordered w-full max-w-xs {color}"
				data-tip={'test'}
				bind:value
				onkeydown={(event) => {
					if (event.key === 'Enter') button?.click();
				}}
			/>

			<button
				bind:this={button}
				class="btn btn-neutral"
				onclick={async () => {
					await fetchData();
				}}
			>
				Submit
			</button>
		</div>
		<div class="absolute top-[90%] -translate-y-[100%] text-sm text-error">
			{message}
		</div>
	{/if}
</div>

<style></style>
