<script lang="ts">
    import type {events} from '@prisma/client';
    import {createEventDispatcher} from "svelte";

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
        }).then(r => r.json());
        if (response.success) {
            // send event to parent. use svelte event dispatching
            dispatch('update', response.data);

        }
    }
</script>

<tr>
    <td>{event_data.text}</td>
    <td>

        <select bind:value={selected_intent} name="intent" class="select select-bordered w-full max-w-xs">
            {#each event_data.parse_data.intent_ranking as intent}
                <option value={intent.name}>{intent.name} ({parseFloat(intent.confidence).toFixed(2)})</option>
            {/each}
        </select>

    </td>
    <td>
        <div class="tooltip" data-tip="Mark Correct">
            <button on:click={save} class="btn btn-outline btn-primary btn-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                     stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>

            </button>
        </div>
    </td>
</tr>
