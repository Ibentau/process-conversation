<script>
	import '../app.postcss';
</script>

<svelte:head>
	<title>NLU data processing</title>
</svelte:head>

<header class="shadow-sm">
	<div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
		<h1 class="text-lg leading-6 font-semibold">NLU data processing</h1>
		<div class="flex gap-2">
			<a href="/" class="btn btn-ghost">Home</a>
			<a href="/stats" class="btn btn-ghost">Stats</a>
			<a href="/export" class="btn btn-ghost">Export</a>
		</div>

	</div>
</header>
<main>
	<div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
		<slot />
	</div>
</main>
