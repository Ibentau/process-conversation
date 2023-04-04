<script lang="ts">
	import { events } from '@prisma/client';
	import { createEventDispatcher } from 'svelte';

	export let event: events;

	$: event_data = JSON.parse(event.data);

	let selected_intent = event_data?.parse_data?.intent_ranking[0].name;

	const dispatch = createEventDispatcher();

	async function save() {
		const response = await fetch('/api/update', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				intent: selected_intent,
				id: event.id,
				was_correctly_predicted: event_data.parse_data.intent_ranking[0].name === selected_intent
			})
		}).then((r) => r.json());
		if (response.success) {
			// send event to parent. use svelte event dispatching
			dispatch('update', response.data);
		}
	}

	async function deleteEvent() {
		const response = await fetch('/api/update', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				id: event.id
			})
		}).then((r) => r.json());
		if (response.success) {
			// send event to parent. use svelte event dispatching
			dispatch('update', response.data);
		}
	}
</script>

<tr>
	<td>{event_data.text}</td>
	<td>
		<select
			bind:value={selected_intent}
			name="intent"
			class="select select-bordered w-full max-w-xs"
		>
			{#each event_data.parse_data.intent_ranking as intent (intent.name + event_data.id)}
				<option value={intent.name}
					>{intent.name} ({parseFloat(intent.confidence).toFixed(2)})</option
				>
			{/each}
		</select>
	</td>
	<td>
		<div class="tooltip" data-tip="Mark Correct">
			<button on:click={save} class="btn btn-outline btn-primary btn-sm">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="w-6 h-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
			</button>
		</div>

		<div class="tooltip" data-tip="Delete">
			<button on:click={deleteEvent} class="btn btn-outline btn-primary btn-sm">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="w-6 h-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
					/>
				</svg>
			</button>
		</div>
	</td>
</tr>
