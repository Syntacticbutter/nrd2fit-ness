<script lang="ts">
	import { page } from '$app/stores';
</script>

<header
	class="flex items-center justify-center sticky top-0 z-50 w-full border-b backdrop-blur bg-sky-100 bg-opacity-15 dark:border-neutral-900 dark:bg-black dark:bg-opacity-15"
>
	<div class="container flex h-14 max-w-screen-2xl items-center justify-center lg:justify-start">
		<div class="ml-8 mr-4 flex">
			<div class="mr-3 flex items-center space-x-2">
				{#if $page.url.pathname == '/' ||  $page.url.pathname == '/redirect'}
					<div class="inline-flex items-center align-middle">
						<t class="font-mono">NRD2Fit</t>
					</div>
				{:else}
					<a class="inline-flex items-center align-middle" href="./home" rel="noopenner noreferrer">
						<img
							class="w-6 h-6 rounded-md"
							src="https://dgalywyr863hv.cloudfront.net/pictures/clubs/1282458/32725981/1/medium.jpg"
							alt="home"
						/>
					</a>
				{/if}
			</div>
			<nav class="flex items-center text-sm gap-3">
				{#if $page.url.pathname == '/home'}
					<div class="inline-flex items-center align-middle">
						<a
							class="inline-flex items-center align-middle opacity-60 hover:opacity-75 duration-100"
							href="./activities"
							rel="noopenner noreferrer"
						>
							Activities
						</a>
					</div>
					<div class="inline-flex items-center align-middle">
						<a
							class="inline-flex items-center align-middle opacity-60 hover:opacity-75 duration-100"
							href="./stats"
							rel="noopenner noreferrer"
						>
							Stats
						</a>
					</div>
					<div class="inline-flex items-center align-middle">
						<a
							class="inline-flex items-center align-middle opacity-60 hover:opacity-75 duration-100"
							href="./your-activities"
							rel="noopenner noreferrer"
						>
							Your Activities
						</a>
					</div>
				{:else if $page.url.pathname == '/activities'}
					<div class="inline-flex items-center align-middle">
						<a
							class="inline-flex items-center align-middle duration-100"
							href="./activities"
							rel="noopenner noreferrer"
						>
							Activities
						</a>
					</div>
					<div class="inline-flex items-center align-middle">
						<a
							class="inline-flex items-center align-middle opacity-60 hover:opacity-75 duration-100"
							href="./stats"
							rel="noopenner noreferrer"
						>
							Stats
						</a>
					</div>
					<div class="inline-flex items-center align-middle">
						<a
							class="inline-flex items-center align-middle opacity-60 hover:opacity-75 duration-100"
							href="./your-activities"
							rel="noopenner noreferrer"
						>
							Your Activities
						</a>
					</div>
				{:else if $page.url.pathname == '/stats'}
					<div class="inline-flex items-center align-middle">
						<a
							class="inline-flex items-center align-middle opacity-60 hover:opacity-75 duration-100"
							href="./activities"
							rel="noopenner noreferrer"
						>
							Activities
						</a>
					</div>
					<div class="inline-flex items-center align-middle">
						<a
							class="inline-flex items-center align-middle duration-100"
							href="./stats"
							rel="noopenner noreferrer"
						>
							Stats
						</a>
					</div>
					<div class="inline-flex items-center align-middle">
						<a
							class="inline-flex items-center align-middle opacity-60 hover:opacity-75 duration-100"
							href="./your-activities"
							rel="noopenner noreferrer"
						>
							Your Activities
						</a>
					</div>
				{:else if $page.url.pathname == '/your-activities'}
					<div class="inline-flex items-center align-middle">
						<a
							class="inline-flex items-center align-middle opacity-60 hover:opacity-75 duration-100"
							href="./activities"
							rel="noopenner noreferrer"
						>
							Activities
						</a>
					</div>
					<div class="inline-flex items-center align-middle">
						<a
							class="inline-flex items-center align-middle opacity-60 hover:opacity-75 duration-100"
							href="./stats"
							rel="noopenner noreferrer"
						>
							Stats
						</a>
					</div>
					<div class="inline-flex items-center align-middle">
						<a
							class="inline-flex items-center align-middle duration-100"
							href="./your-activities"
							rel="noopenner noreferrer"
						>
							Your Activities
						</a>
					</div>
				{/if}
			</nav>
		</div>
	</div>
</header>
