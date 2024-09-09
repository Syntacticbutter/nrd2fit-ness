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
	let statistics: any[] = [];

	let id = '';
	let name = '';
	let user = '';
	let location = '';
	let profile_pic = '';

	let a_ride: number;
	let a_run: number;
	let a_swim: number;
	let a_ride_d: number;
	let a_run_d: number;
	let a_swim_d: number;
	let a_ride_e: number;
	let a_run_e: number;
	let a_swim_e: number;
	let a_ride_t: number;
	let a_run_t: number;
	let a_swim_t: number;

	let r_ride: number;
	let r_run: number;
	let r_swim: number;
	let r_ride_d: number;
	let r_run_d: number;
	let r_swim_d: number;
	let r_ride_e: number;
	let r_run_e: number;
	let r_swim_e: number;
	let r_ride_t: number;
	let r_run_t: number;
	let r_swim_t: number;

	let y_ride: number;
	let y_run: number;
	let y_swim: number;
	let y_ride_d: number;
	let y_run_d: number;
	let y_swim_d: number;
	let y_ride_e: number;
	let y_run_e: number;
	let y_swim_e: number;
	let y_ride_t: number;
	let y_run_t: number;
	let y_swim_t: number;

	const grant_type = 'refresh_token';

	const getUser = async () => {
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
			// Athlete
			let club = `https://www.strava.com/api/v3/athlete`;
			const call = await axios.get(club, {
				headers: {
					Authorization: `Bearer ${access_token}`
				}
			});
			id = call.data.id;
			name = call.data.firstname + ' ' + call.data.lastname;
			user = call.data.username;
			location = call.data.state + ', ' + call.data.country;
			profile_pic = call.data.profile;

			items = call.data;
			console.log(items);

			// Athlete stats
			let stats = `https://www.strava.com/api/v3/athletes/${id}/stats`;
			const read = await axios.get(stats, {
				headers: {
					Authorization: `Bearer ${access_token}`
				}
			});
			statistics = read.data;
			console.log(statistics);

			// LOOK AT ALL THESE VARIABLEES
			a_ride = read.data.all_ride_totals.count;
			a_run = read.data.all_run_totals.count;
			a_swim = read.data.all_swim_totals.count;
			a_ride_d = read.data.all_ride_totals.distance;
			a_run_d = read.data.all_run_totals.distance;
			a_swim_d = read.data.all_swim_totals.distance;
			a_ride_e = read.data.all_ride_totals.elevation_gain;
			a_run_e = read.data.all_run_totals.elevation_gain;
			a_swim_e = read.data.all_swim_totals.elevation_gain;
			a_ride_t = read.data.all_ride_totals.time;
			a_run_t = read.data.all_run_totals.time;
			a_swim_t = read.data.all_swim_totals.time;

			r_ride = read.data.recent_ride_totals.count;
			r_run = read.data.recent_run_totals.count;
			r_swim = read.data.recent_swim_totals.count;
			r_ride_d = read.data.recent_ride_totals.distance;
			r_run_d = read.data.recent_run_totals.distance;
			r_swim_d = read.data.recent_swim_totals.distance;
			r_ride_e = read.data.recent_ride_totals.elevation_gain;
			r_run_e = read.data.recent_run_totals.elevation_gain;
			r_swim_e = read.data.recent_swim_totals.elevation_gain;
			r_ride_t = read.data.recent_ride_totals.time;
			r_run_t = read.data.recent_run_totals.time;
			r_swim_t = read.data.recent_swim_totals.time;

			y_ride = read.data.ytd_ride_totals.count;
			y_run = read.data.ytd_run_totals.count;
			y_swim = read.data.ytd_swim_totals.count;
			y_ride_d = read.data.ytd_ride_totals.distance;
			y_run_d = read.data.ytd_run_totals.distance;
			y_swim_d = read.data.ytd_swim_totals.distance;
			y_ride_e = read.data.ytd_ride_totals.elevation_gain;
			y_run_e = read.data.ytd_run_totals.elevation_gain;
			y_swim_e = read.data.ytd_swim_totals.elevation_gain;
			y_ride_t = read.data.ytd_ride_totals.time;
			y_run_t = read.data.ytd_run_totals.time;
			y_swim_t = read.data.ytd_swim_totals.time;

			console.log('tried');
		} catch (error: any) {
			const response = await axios.post(base, data.toString(), {
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			});
			// console.log(response.data);
			bd.update(({ messages }) => messages.pop());
			bd.update(({ messages }) => messages.push(response.data.access_token));
			access_token = bd.data.messages[0];

			db.update(({ tokens }) => tokens.pop());
			db.update(({ tokens }) => tokens.push(response.data.refresh_token));
			refresh_token = db.data.tokens[0];

			// Athlete
			let club = `https://www.strava.com/api/v3/athlete`;
			const call = await axios.get(club, {
				headers: {
					Authorization: `Bearer ${access_token}`
				}
			});
			id = call.data.id;
			name = call.data.username;
			user = call.data.username;
			location = call.data.state + ', ' + call.data.country;
			profile_pic = call.data.profile;

			items = call.data;

			// Athlete stats
			let stats = `https://www.strava.com/api/v3/athletes/${id}/stats`;
			const read = await axios.get(club, {
				headers: {
					Authorization: `Bearer ${access_token}`
				}
			});
			statistics = read.data;

			console.log('caught');
		}
	};

	onMount(() => {
		getUser();
	});

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
</script>

<Nav />
<main class="width w-screen flex items-start justify-center">
	<div class="container column m-4 items-center lg:justify-start justify-center flex">
		<div>
			<div class="lg:flex lg:justify-center">
				<!-- Profile -->
				<section
					class="w-96 h-64 p-4 text-center rounded-lg m-4 border border-solid dark:border-neutral-800"
				>
					<div class="columns-2 align-middle mb-5">
						<p class="text-left font-semibold text-lg">Profile</p>
						<div class="flex justify-end">
							<p class="font-normal text-sm opacity-50">{user}</p>
						</div>
					</div>
					<div class="row">
						<div class="items-center mb-2">
							<img class="m-auto h-16 w-16 rounded-full" alt="profile-pic" src={profile_pic} />
						</div>
					</div>
					<div class="display inline-flex items-center mb-2">
						<a
							class="font font-semibold text text-lg hover:text-blue-500 hover:underline hover:decoration-blue-500 duration-200"
							href="https://www.strava.com/athletes/nrd2fit_nrd"
							rel="noreferrer noopenner"
							target="_blank"
							>{name}
						</a>
						<svg
							class="ml-2 w-4 h-4"
							viewBox="0 0 15 15"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							><path
								d="M3 2C2.44772 2 2 2.44772 2 3V12C2 12.5523 2.44772 13 3 13H12C12.5523 13 13 12.5523 13 12V8.5C13 8.22386 12.7761 8 12.5 8C12.2239 8 12 8.22386 12 8.5V12H3V3L6.5 3C6.77614 3 7 2.77614 7 2.5C7 2.22386 6.77614 2 6.5 2H3ZM12.8536 2.14645C12.9015 2.19439 12.9377 2.24964 12.9621 2.30861C12.9861 2.36669 12.9996 2.4303 13 2.497L13 2.5V2.50049V5.5C13 5.77614 12.7761 6 12.5 6C12.2239 6 12 5.77614 12 5.5V3.70711L6.85355 8.85355C6.65829 9.04882 6.34171 9.04882 6.14645 8.85355C5.95118 8.65829 5.95118 8.34171 6.14645 8.14645L11.2929 3H9.5C9.22386 3 9 2.77614 9 2.5C9 2.22386 9.22386 2 9.5 2H12.4999H12.5C12.5678 2 12.6324 2.01349 12.6914 2.03794C12.7504 2.06234 12.8056 2.09851 12.8536 2.14645Z"
								fill="currentColor"
								fill-rule="evenodd"
								clip-rule="evenodd"
							></path></svg
						>
					</div>
					<p class="font font-light text text-xs">{location}</p>
				</section>
			</div>
			<div class="lg:flex lg:justify-center flex-wrap">
				<!-- Run -->
				<section class="w-96 p-4 rounded-lg m-4 border border-solid dark:border-neutral-800">
					<div class="columns-2 align-middle">
						<p class="font-semibold text-lg">Run Totals</p>
						<div class="flex justify-end">
							<p class="font-normal text-sm opacity-50">All</p>
						</div>
					</div>
					<div class="flex items-center justify-center">
						{#if a_run_t > 0}
							<p class="font-bold text-5xl p-4">{formatTime(a_run_t)}</p>
						{:else}
							<p class="font-thin text-5xl p-4">--</p>
						{/if}
					</div>
					<div class="flex items-center justify-evenly my-2">
						<div>
							{#if a_run > 0}
								<div class="flex align-baseline justify-evenly font-bold text-4xl">
									{a_run}
								</div>
							{:else}
								<div class="flex align-baseline justify-evenly font-thin text-4xl">--</div>
							{/if}
							<div class="flex align-baseline justify-evenly text-sm">count</div>
						</div>
						<div>
							{#if a_run_d / 1000 > 0}
								<div class="flex align-baseline justify-evenly font-bold text-4xl">
									{(a_run_d / 1000).toFixed(2)} km
								</div>
							{:else}
								<div class="flex align-baseline justify-evenly font-thin text-4xl">--</div>
							{/if}
							<div class="flex align-baseline justify-evenly text-sm">distance</div>
						</div>
						<div>
							{#if a_run_e > 0}
								<div class="flex align-baseline justify-evenly font-bold text-4xl">
									{a_run_e} km
								</div>
							{:else}
								<div class="flex align-baseline justify-evenly font-thin text-4xl">--</div>
							{/if}
							<div class="flex align-baseline justify-evenly text-sm">elevation</div>
						</div>
					</div>
				</section>
				<section class="w-96 p-4 rounded-lg m-4 border border-solid dark:border-neutral-800">
					<div class="columns-2 align-middle">
						<p class="font-semibold text-lg">Run Totals</p>
						<div class="flex justify-end">
							<p class="font-normal text-sm opacity-50">Recent</p>
						</div>
					</div>
					<div class="flex items-center justify-center">
						{#if r_run_t > 0}
							<p class="font-bold text-5xl p-4">{formatTime(r_run_t)}</p>
						{:else}
							<p class="font-thin text-5xl p-4">--</p>
						{/if}
					</div>
					<div class="flex items-center justify-evenly my-2">
						<div>
							{#if r_run > 0}
								<div class="flex align-baseline justify-evenly font-bold text-4xl">
									{r_run}
								</div>
							{:else}
								<div class="flex align-baseline justify-evenly font-thin text-4xl">--</div>
							{/if}
							<div class="flex align-baseline justify-evenly text-sm">count</div>
						</div>
						<div>
							{#if r_run_d / 1000 > 0}
								<div class="flex align-baseline justify-evenly font-bold text-4xl">
									{(r_run_d / 1000).toFixed(2)} km
								</div>
							{:else}
								<div class="flex align-baseline justify-evenly font-thin text-4xl">--</div>
							{/if}
							<div class="flex align-baseline justify-evenly text-sm">distance</div>
						</div>
						<div>
							{#if r_run_e > 0}
								<div class="flex align-baseline justify-evenly font-bold text-4xl">
									{r_run_e} km
								</div>
							{:else}
								<div class="flex align-baseline justify-evenly font-thin text-4xl">--</div>
							{/if}
							<div class="flex align-baseline justify-evenly text-sm">elevation</div>
						</div>
					</div>
				</section>
				<section class="w-96 p-4 rounded-lg m-4 border border-solid dark:border-neutral-800">
					<div class="columns-2 align-middle">
						<p class="font-semibold text-lg">Run Totals</p>
						<div class="flex justify-end">
							<p class="font-normal text-sm opacity-50">Year-to-Date</p>
						</div>
					</div>
					<div class="flex items-center justify-center">
						{#if y_run_t > 0}
							<p class="font-bold text-5xl p-4">{formatTime(y_run_t)}</p>
						{:else}
							<p class="font-thin text-5xl p-4">--</p>
						{/if}
					</div>
					<div class="flex items-center justify-evenly my-2">
						<div>
							{#if y_run > 0}
								<div class="flex align-baseline justify-evenly font-bold text-4xl">
									{y_run}
								</div>
							{:else}
								<div class="flex align-baseline justify-evenly font-thin text-4xl">--</div>
							{/if}
							<div class="flex align-baseline justify-evenly text-sm">count</div>
						</div>
						<div>
							{#if y_run_d / 1000 > 0}
								<div class="flex align-baseline justify-evenly font-bold text-4xl">
									{(y_run_d / 1000).toFixed(2)} km
								</div>
							{:else}
								<div class="flex align-baseline justify-evenly font-thin text-4xl">--</div>
							{/if}
							<div class="flex align-baseline justify-evenly text-sm">distance</div>
						</div>
						<div>
							{#if y_run_e > 0}
								<div class="flex align-baseline justify-evenly font-bold text-4xl">
									{y_run_e} km
								</div>
							{:else}
								<div class="flex align-baseline justify-evenly font-thin text-4xl">--</div>
							{/if}
							<div class="flex align-baseline justify-evenly text-sm">elevation</div>
						</div>
					</div>
				</section>

				<!-- Ride -->
				<section class="w-96 p-4 rounded-lg m-4 border border-solid dark:border-neutral-800">
					<div class="columns-2 align-middle">
						<p class="font-semibold text-lg">Ride Totals</p>
						<div class="flex justify-end">
							<p class="font-normal text-sm opacity-50">All</p>
						</div>
					</div>
					<div class="flex items-center justify-center">
						{#if a_ride_t > 0}
							<p class="font-bold text-5xl p-4">{formatTime(a_ride_t)}</p>
						{:else}
							<p class="font-thin text-5xl p-4">--</p>
						{/if}
					</div>
					<div class="flex items-center justify-evenly my-2">
						<div>
							{#if a_ride > 0}
								<div class="flex align-baseline justify-evenly font-bold text-4xl">
									{a_ride}
								</div>
							{:else}
								<div class="flex align-baseline justify-evenly font-thin text-4xl">--</div>
							{/if}
							<div class="flex align-baseline justify-evenly text-sm">count</div>
						</div>
						<div>
							{#if a_ride_d / 1000 > 0}
								<div class="flex align-baseline justify-evenly font-bold text-4xl">
									{(a_ride_d / 1000).toFixed(2)} km
								</div>
							{:else}
								<div class="flex align-baseline justify-evenly font-thin text-4xl">--</div>
							{/if}
							<div class="flex align-baseline justify-evenly text-sm">distance</div>
						</div>
						<div>
							{#if a_ride_e > 0}
								<div class="flex align-baseline justify-evenly font-bold text-4xl">
									{a_ride_e} km
								</div>
							{:else}
								<div class="flex align-baseline justify-evenly font-thin text-4xl">--</div>
							{/if}
							<div class="flex align-baseline justify-evenly text-sm">elevation</div>
						</div>
					</div>
				</section>
				<section class="w-96 p-4 rounded-lg m-4 border border-solid dark:border-neutral-800">
					<div class="columns-2 align-middle">
						<p class="font-semibold text-lg">Ride Totals</p>
						<div class="flex justify-end">
							<p class="font-normal text-sm opacity-50">Recent</p>
						</div>
					</div>
					<div class="flex items-center justify-center">
						{#if r_ride_t > 0}
							<p class="font-bold text-5xl p-4">{formatTime(r_ride_t)}</p>
						{:else}
							<p class="font-thin text-5xl p-4">--</p>
						{/if}
					</div>
					<div class="flex items-center justify-evenly my-2">
						<div>
							{#if r_ride > 0}
								<div class="flex align-baseline justify-evenly font-bold text-4xl">
									{r_ride}
								</div>
							{:else}
								<div class="flex align-baseline justify-evenly font-thin text-4xl">--</div>
							{/if}
							<div class="flex align-baseline justify-evenly text-sm">count</div>
						</div>
						<div>
							{#if r_ride_d / 1000 > 0}
								<div class="flex align-baseline justify-evenly font-bold text-4xl">
									{(r_ride_d / 1000).toFixed(2)} km
								</div>
							{:else}
								<div class="flex align-baseline justify-evenly font-thin text-4xl">--</div>
							{/if}
							<div class="flex align-baseline justify-evenly text-sm">distance</div>
						</div>
						<div>
							{#if r_ride_e > 0}
								<div class="flex align-baseline justify-evenly font-bold text-4xl">
									{r_ride_e} km
								</div>
							{:else}
								<div class="flex align-baseline justify-evenly font-thin text-4xl">--</div>
							{/if}
							<div class="flex align-baseline justify-evenly text-sm">elevation</div>
						</div>
					</div>
				</section>
				<section class="w-96 p-4 rounded-lg m-4 border border-solid dark:border-neutral-800">
					<div class="columns-2 align-middle">
						<p class="font-semibold text-lg">Ride Totals</p>
						<div class="flex justify-end">
							<p class="font-normal text-sm opacity-50">Year-to-Date</p>
						</div>
					</div>
					<div class="flex items-center justify-center">
						{#if y_ride_t > 0}
							<p class="font-bold text-5xl p-4">{formatTime(y_ride_t)}</p>
						{:else}
							<p class="font-thin text-5xl p-4">--</p>
						{/if}
					</div>
					<div class="flex items-center justify-evenly my-2">
						<div>
							{#if y_ride > 0}
								<div class="flex align-baseline justify-evenly font-bold text-4xl">
									{y_ride}
								</div>
							{:else}
								<div class="flex align-baseline justify-evenly font-thin text-4xl">--</div>
							{/if}
							<div class="flex align-baseline justify-evenly text-sm">count</div>
						</div>
						<div>
							{#if y_ride_d / 1000 > 0}
								<div class="flex align-baseline justify-evenly font-bold text-4xl">
									{(y_ride_d / 1000).toFixed(2)} km
								</div>
							{:else}
								<div class="flex align-baseline justify-evenly font-thin text-4xl">--</div>
							{/if}
							<div class="flex align-baseline justify-evenly text-sm">distance</div>
						</div>
						<div>
							{#if y_ride_e > 0}
								<div class="flex align-baseline justify-evenly font-bold text-4xl">
									{y_ride_e} km
								</div>
							{:else}
								<div class="flex align-baseline justify-evenly font-thin text-4xl">--</div>
							{/if}
							<div class="flex align-baseline justify-evenly text-sm">elevation</div>
						</div>
					</div>
				</section>

				<!-- Swim -->
				<section class="w-96 p-4 rounded-lg m-4 border border-solid dark:border-neutral-800">
					<div class="columns-2 align-middle">
						<p class="font-semibold text-lg">Swim Totals</p>
						<div class="flex justify-end">
							<p class="font-normal text-sm opacity-50">All</p>
						</div>
					</div>
					<div class="flex items-center justify-center">
						{#if a_swim_t > 0}
							<p class="font-bold text-5xl p-4">{formatTime(a_swim_t)}</p>
						{:else}
							<p class="font-thin text-5xl p-4">--</p>
						{/if}
					</div>
					<div class="flex items-center justify-evenly my-2">
						<div>
							{#if a_swim > 0}
								<div class="flex align-baseline justify-evenly font-bold text-4xl">
									{a_swim}
								</div>
							{:else}
								<div class="flex align-baseline justify-evenly font-thin text-4xl">--</div>
							{/if}
							<div class="flex align-baseline justify-evenly text-sm">count</div>
						</div>
						<div>
							{#if a_swim_d / 1000 > 0}
								<div class="flex align-baseline justify-evenly font-bold text-4xl">
									{(a_swim_d / 1000).toFixed(2)} km
								</div>
							{:else}
								<div class="flex align-baseline justify-evenly font-thin text-4xl">--</div>
							{/if}
							<div class="flex align-baseline justify-evenly text-sm">distance</div>
						</div>
						<div>
							{#if a_swim_e > 0}
								<div class="flex align-baseline justify-evenly font-bold text-4xl">
									{a_swim_e} km
								</div>
							{:else}
								<div class="flex align-baseline justify-evenly font-thin text-4xl">--</div>
							{/if}
							<div class="flex align-baseline justify-evenly text-sm">elevation</div>
						</div>
					</div>
				</section>
				<section class="w-96 p-4 rounded-lg m-4 border border-solid dark:border-neutral-800">
					<div class="columns-2 align-middle">
						<p class="font-semibold text-lg">Swim Totals</p>
						<div class="flex justify-end">
							<p class="font-normal text-sm opacity-50">Recent</p>
						</div>
					</div>
					<div class="flex items-center justify-center">
						{#if r_swim_t > 0}
							<p class="font-bold text-5xl p-4">{formatTime(r_swim_t)}</p>
						{:else}
							<p class="font-thin text-5xl p-4">--</p>
						{/if}
					</div>
					<div class="flex items-center justify-evenly my-2">
						<div>
							{#if r_swim > 0}
								<div class="flex align-baseline justify-evenly font-bold text-4xl">
									{r_swim}
								</div>
							{:else}
								<div class="flex align-baseline justify-evenly font-thin text-4xl">--</div>
							{/if}
							<div class="flex align-baseline justify-evenly text-sm">count</div>
						</div>
						<div>
							{#if r_swim_d / 1000 > 0}
								<div class="flex align-baseline justify-evenly font-bold text-4xl">
									{(r_swim_d / 1000).toFixed(2)} km
								</div>
							{:else}
								<div class="flex align-baseline justify-evenly font-thin text-4xl">--</div>
							{/if}
							<div class="flex align-baseline justify-evenly text-sm">distance</div>
						</div>
						<div>
							{#if r_swim_e > 0}
								<div class="flex align-baseline justify-evenly font-bold text-4xl">
									{r_swim_e} km
								</div>
							{:else}
								<div class="flex align-baseline justify-evenly font-thin text-4xl">--</div>
							{/if}
							<div class="flex align-baseline justify-evenly text-sm">elevation</div>
						</div>
					</div>
				</section>
				<section class="w-96 p-4 rounded-lg m-4 border border-solid dark:border-neutral-800">
					<div class="columns-2 align-middle">
						<p class="font-semibold text-lg">Swim Totals</p>
						<div class="flex justify-end">
							<p class="font-normal text-sm opacity-50">Year-to-Date</p>
						</div>
					</div>
					<div class="flex items-center justify-center">
						{#if y_swim_t > 0}
							<p class="font-bold text-5xl p-4">{formatTime(y_swim_t)}</p>
						{:else}
							<p class="font-thin text-5xl p-4">--</p>
						{/if}
					</div>
					<div class="flex items-center justify-evenly my-2">
						<div>
							{#if y_swim > 0}
								<div class="flex align-baseline justify-evenly font-bold text-4xl">
									{y_swim}
								</div>
							{:else}
								<div class="flex align-baseline justify-evenly font-thin text-4xl">--</div>
							{/if}
							<div class="flex align-baseline justify-evenly text-sm">count</div>
						</div>
						<div>
							{#if y_swim_d / 1000 > 0}
								<div class="flex align-baseline justify-evenly font-bold text-4xl">
									{(y_swim_d / 1000).toFixed(2)} km
								</div>
							{:else}
								<div class="flex align-baseline justify-evenly font-thin text-4xl">--</div>
							{/if}
							<div class="flex align-baseline justify-evenly text-sm">distance</div>
						</div>
						<div>
							{#if y_swim_e > 0}
								<div class="flex align-baseline justify-evenly font-bold text-4xl">
									{y_swim_e} km
								</div>
							{:else}
								<div class="flex align-baseline justify-evenly font-thin text-4xl">--</div>
							{/if}
							<div class="flex align-baseline justify-evenly text-sm">elevation</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	</div>
</main>

<Footer />
