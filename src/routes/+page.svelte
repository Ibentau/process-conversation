<script lang="ts">
    import type {PageData} from './$types';
    import EventListElement from '$lib/EventListElement.svelte';
    import {invalidateAll} from "$app/navigation";

    export let data: PageData;

    let refreshLoading = false;

    async function refresh() {
        try {
            refreshLoading = true;
            await invalidateAll();
        } catch (e) {
            alert(e);
        } finally {
            refreshLoading = false;
        }

    }
</script>


<div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
            <h1 class="text-xl font-semibold">User chat sentences</h1>
            <p class="mt-2 text-sm">A list of all the messages users sent to the chatbot.</p>
        </div>
        <div>
            <button class:loading={refreshLoading} disabled={refreshLoading} class="btn btn-primary" on:click={refresh}>
                Refresh
            </button>
        </div>
    </div>
    <div class="mt-8 flex flex-col">
        <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                    <div class="overflow-x-auto">
                        <table class="table w-full">
                            <!-- head -->
                            <thead>
                            <tr>
                                <th>Sentence</th>
                                <th>Predicted Intent and Confidence</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {#each data.userEvents as event}
                                <EventListElement on:update={refresh} event={event}/>
                            {/each}

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>






