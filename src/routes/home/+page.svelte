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
	import Activities from '$lib/components/activities.svelte';
	import Summary from '$lib/components/summary.svelte';
	import { goto } from '$app/navigation';

	type Data = {
		tokens: string[];
		messages: string[];
	};

	const defaultData: Data = { tokens: [], messages: [] };

	let items = '';
	let members: any[] = [];
	const club_id = 1282458;

	let page = 1;
	let pageSize = 30;

	let name = '';
	let sport_type = '';
	let location = '';
	let club_type = '';
	let member_count = '';
	let cover_img = '';
	let club_avatar = '';
	let following_count = '';
	let desc = '';

	const grant_type = 'refresh_token';

	let hasRun: boolean = false;

	const getClub = async () => {
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
			// Club Overview
			let club = `https://www.strava.com/api/v3/clubs/${club_id}`;
			const call = await axios.get(club, {
				headers: {
					Authorization: `Bearer ${access_token}`
				}
			});
			items = call.data;
			name = call.data.name;
			sport_type = call.data.localized_sport_type;
			location = call.data.city + ', ' + call.data.country;
			club_type = call.data.club_type;
			member_count = call.data.member_count;
			following_count = call.data.following_count;
			club_avatar = call.data.profile_medium;
			cover_img = call.data.cover_photo_small;
			desc = call.data.description;

			// Club Members
			let member = `https://www.strava.com/api/v3/clubs/${club_id}/members?page=${page}&per_page=${pageSize}`;
			const get = await axios.get(member, {
				headers: {
					Authorization: `Bearer ${access_token}`
				}
			});
			members = get.data;
			console.log('tried');
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

			// Club Overview
			let club = `https://www.strava.com/api/v3/clubs/${club_id}`;
			const call = await axios.get(club, {
				headers: {
					Authorization: `Bearer ${access_token}`
				}
			});
			items = call.data;
			name = call.data.name;
			sport_type = call.data.localized_sport_type;
			location = call.data.city + ', ' + call.data.country;
			club_type = call.data.club_type;
			member_count = call.data.member_count;
			following_count = call.data.following_count;
			club_avatar = call.data.profile_medium;
			cover_img = call.data.cover_photo_small;
			desc = call.data.description;

			// Club Members
			let member = `https://www.strava.com/api/v3/clubs/${club_id}/members?page=${page}&per_page=${pageSize}`;
			const get = await axios.get(member, {
				headers: {
					Authorization: `Bearer ${access_token}`
				}
			});
			members = get.data;
			console.log('caught');
		}
	};

	const deauthorize = async () => {
		const bd = LocalStoragePreset<Data>('bd', defaultData);
		let access_token = bd.data.messages[0];

		let deauth = `https://www.strava.com/oauth/deauthorize?access_token=${access_token}`;
		const revoke = await axios.post(deauth);

		bd.update(({ messages }) => messages.pop());
		access_token = bd.data.messages[0];

		goto('/');
	};

	onMount(() => {
		getClub();
	});
</script>

<Nav />
<main class="width w-screen flex items-center justify-center">
	<div class="container m-4 items-center justify-center flex">
		<div class="xl:flex xl:justify-center">
			<section class="w-96 p-4 border border-solid rounded-lg m-4 dark:border-neutral-800">
				<img class="mb-2 rounded-md" src={cover_img} alt="cover-img" />
				<p class="capitalize mb-1">{club_type}</p>
				<div class="columns-2 flex align-middle">
					<div class="display inline-flex items-center w-full">
						<img class="rounded-md mr-2 w-6 h-6" src={club_avatar} alt="nrd2fit-avatar" />
						<a
							class="font font-semibold text text-lg hover:text-blue-500 hover:underline hover:decoration-blue-500 duration-200"
							href="https://www.strava.com/clubs/nrd2fit"
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
					<div class="flex items-end justify-end w-full">
						<div>
							<button
								on:click={deauthorize}
								class="inline-flex items-center justify-end align-middle rounded-md bg-[#fc4c02] bg-opacity-10 padding px-3 py-0 text-[#fc4c02]
							 active:text-white active:bg-[#fc4c02] text-xs font-bold h-8"
							>
								Logout
							</button>
						</div>
					</div>
				</div>
				<p class="font font-light text text-xs">{sport_type} · {location}</p>
				<div class="flex items-center justify-evenly my-2">
					<div>
						<div class="flex align-baseline justify-evenly font font-bold text-4xl">
							{member_count}
						</div>
						<div class="flex align-baseline justify-evenly text-sm">members</div>
					</div>
					<div>
						<div class="flex align-baseline justify-evenly font font-bold text-4xl">
							{following_count}
						</div>
						<div class="flex align-baseline justify-evenly text-sm">followers</div>
					</div>
				</div>
				<div class="flex items-center justify-center">
					<div class="flex gap-4"></div>
				</div>
				<div class="mt-2 mb-2">
					<textarea
						readonly
						class="dark:bg-neutral-950 select-none outline-none font font-sans text-pretty break-words w-full h-72 max-h-max resize-none"
						>{desc}</textarea
					>
				</div>
			</section>
			<section
				class="flex-col justify-center width w-96 p-4 border border-solid rounded-lg m-4 dark:border-neutral-800"
			>
				<Summary />
				<Activities />
			</section>
			<section class="width w-96 p-4 border border-solid rounded-lg m-4 dark:border-neutral-800">
				<div class="lg:flex row justify-evenly capitalize">
					<div>
						<div class="mb-2">
							<h1 class="text-lg font-semibold">Owner</h1>
							{#each members as m}
								<ul>
									{#if m.owner}
										<li>
											{m.firstname + ' ' + m.lastname}
										</li>
									{/if}
								</ul>
							{/each}
							<div />
						</div>
						<div class="mb-2">
							<h1 class="text-lg font-semibold">Administrators</h1>
							{#each members as m}
								<ul>
									{#if m.admin}
										<li>
											{m.firstname + ' ' + m.lastname}
										</li>
									{/if}
								</ul>
							{/each}
							<div />
						</div>
					</div>
					<div>
						<h1 class="text-lg font-semibold">Members</h1>
						{#each members as m}
							<ul>
								{#if !m.admin && !m.owner}
									<li>
										{m.firstname + ' ' + m.lastname}
									</li>
								{/if}
							</ul>
						{/each}
					</div>
				</div>
			</section>
		</div>
	</div>
</main>
<Footer />
