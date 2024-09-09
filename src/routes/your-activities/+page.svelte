<script lang="ts">
	import Nav from '$lib/components/nav.svelte';
	import Footer from '$lib/components/footer.svelte';

	export let data;
	$: base = data.props.baseUrl;
	$: cl = data.props.clientId;
	$: sc = data.props.clientSecret;

	import axios from 'axios';
	import { LocalStoragePreset } from 'lowdb/browser';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	type Data = {
		tokens: string[];
		messages: string[];
	};

	const defaultData: Data = { tokens: [], messages: [] };

	let items: any[] = [];
	const grant_type = 'refresh_token';

	let page = 1;
	let pageSize = 30;

	let hasRun: boolean = false;

	const getAct = async () => {
		const bd = LocalStoragePreset<Data>('bd', defaultData);
		// bd.update(({ messages }) => messages.pop());
		let access_token = bd.data.messages[0];

		if (access_token == null) goto('/');

		const db = LocalStoragePreset<Data>('db', defaultData);
		let refresh_token = db.data.tokens[0];

		const data = new URLSearchParams();
		data.append('client_id', cl);
		data.append('client_secret', sc);
		data.append('grant_type', grant_type);
		data.append('refresh_token', refresh_token);

		try {
			hasRun = true;
			let api = `https://www.strava.com/api/v3/athlete/activities?page=${page}&per_page=${pageSize}`;
			const call = await axios.get(api, {
				headers: {
					Authorization: `Bearer ${access_token}`
				}
			});
			items = call.data;
			console.log(items);

			console.log('tried', hasRun);
		} catch (error: any) {
			hasRun = true;
			const response = await axios.post(base, data.toString(), {
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			});
			bd.update(({ messages }) => messages.pop());
			bd.update(({ messages }) => messages.push(response.data.access_token));
			access_token = bd.data.messages[0];

			db.update(({ tokens }) => tokens.pop());
			db.update(({ tokens }) => tokens.push(response.data.refresh_token));
			refresh_token = db.data.tokens[0];

			let api = `https://www.strava.com/api/v3/athlete/activities?page=${page}&per_page=${pageSize}`;
			const call = await axios.get(api, {
				headers: {
					Authorization: `Bearer ${access_token}`
				}
			});
			items = call.data;

			console.log('caught', hasRun);
		}
	};

	function formatTime(seconds: number): string {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const remainingSeconds = seconds % 60;

		if (remainingSeconds < 10) {
			return `${hours}h ${minutes}m 0${remainingSeconds}s`;
		} else {
			return `${hours}h ${minutes}m ${remainingSeconds}s`;
		}
	}

	onMount(() => {
		getAct();
	});

	async function nextPage() {
		page += 1;
		hasRun = false;
		await getAct();
	}

	async function prevPage() {
		page -= 1;
		hasRun = false;
		await getAct();
	}
</script>

<Nav />
<main class="width w-screen flex items-start justify-center">
	<div class="container column m-4 items-center lg:justify-start justify-center flex">
		<div>
			<div class="lg:flex lg:justify-center flex-wrap">
				{#each items as i}
					<section class="w-96 p-4 rounded-lg m-4 border border-solid dark:border-neutral-800">
						<div class="columns-2 align-middle">
							<p class="font font-normal text text-sm">
								{i.start_date_local.substring(0, i.start_date_local.indexOf('T'))}
							</p>
							<div class="flex justify-end">
								<p class="font-normal text-sm">
									{i.start_date_local.substring(
										(i.start_date_local.substring(0, i.start_date_local.indexOf('T')) + 'T').length,
										19
									)}
									<span class="opacity-50">
										{i.timezone.substring(1, 7)}
									</span>
								</p>
							</div>
						</div>
						<h1 class="font font-semibold text text-lg">{i.name}</h1>
						<h2 class="font font-light text text-xs">{i.sport_type}</h2>
						<div class="flex items-center justify-center">
							<p class="font-bold text-5xl p-4">{formatTime(i.moving_time)}</p>
						</div>
						<div class="flex items-center justify-evenly my-2">
							<div>
								{#if i.distance / 1000 > 0}
									<div class="flex align-baseline justify-evenly font-bold text-4xl">
										{(i.distance / 1000).toFixed(2)} km
									</div>
								{:else}
									<div class="flex align-baseline justify-evenly font-thin text-4xl">--</div>
								{/if}
								<div class="flex align-baseline justify-evenly text-sm">distance</div>
							</div>
							<div>
								{#if i.total_elevation_gain > 0}
									<div class="flex align-baseline justify-evenly font-bold text-4xl">
										{i.total_elevation_gain} m
									</div>
								{:else}
									<div class="flex align-baseline justify-evenly font-thin text-4xl">--</div>
								{/if}
								<div class="flex align-baseline justify-evenly text-sm">elevation</div>
							</div>
						</div>
					</section>
				{/each}
			</div>
			<div class="sticky bottom-1">
				<div class="flex items-center justify-center">
					<div
						class="backdrop-blur bg-sky-100 bg-opacity-15 w-96 m-4 flex items-center justify-evenly border border-solid rounded-lg dark:border-neutral-900 dark:bg-black dark:bg-opacity-15"
					>
						{#if page <= 1}
							<button disabled class="rounded-md padding px-2 py-1 m-4 opacity-0">Prev</button>
						{:else}
							<button
								on:click={prevPage}
								class="dark:bg-neutral-950 dark:border-neutral-800 dark:active:bg-black border border-solid border-neutral-300 m-4 rounded-md shadow-md bg-white padding px-2 py-1 active:bg-neutral-200 active:shadow-none"
							>
								Prev
							</button>
						{/if}
						<div class="w-4">
							{page}
						</div>
						{#if items.length < pageSize}
							<button disabled class="m-4 rounded-md padding px-2 py-1 opacity-0">Next</button>
						{:else}
							<button
								on:click={nextPage}
								class="dark:bg-neutral-950 dark:border-neutral-800 dark:active:bg-black border border-solid border-neutral-300 m-4 rounded-md shadow-md bg-white padding px-2 py-1 active:bg-neutral-200 active:shadow-none"
							>
								Next
							</button>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
</main>
<Footer />
