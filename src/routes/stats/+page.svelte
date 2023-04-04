<script lang="ts">
    import {Bar} from 'svelte-chartjs'
    import 'chart.js/auto';

    let options = {
        responsive: true,
    };

    export let data;


    let dataChart = {
        labels: data.bins,

        datasets: [
            {
                borderColor: 'rgba(99,0,125, .2)',
                backgroundColor: 'rgba(99,0,125, .5)',
                label: "Number of predictions",
                data: data.histogram
            }
        ]
    };
</script>

<div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
            <h1 class="text-xl font-semibold">Statistics</h1>
            <p class="mt-2 text-sm">This is a list of all the statistics for the Chatbot.</p>
        </div>

    </div>
    <div class="mt-8 flex flex-col">
        <Bar data={dataChart} {options}/>
    </div>
</div>
