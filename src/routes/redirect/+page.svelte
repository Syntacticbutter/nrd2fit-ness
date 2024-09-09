<script lang="ts">
	import Nav from '$lib/components/nav.svelte';
	import Footer from '$lib/components/footer.svelte';

	export let data;
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

	$: au = data.props.authUrl;
	const scope = async () => {
		// http://localhost:5173/redirect?state=&code=a225d345e12b6f65bfbaf4ff6923a9c0bffc2ce0&scope=read,activity:write,activity:read

		const query = window.location.search;
		const read = new URLSearchParams(query);
		if (read.get('code') != null) {
			if (read.get('scope') == 'read,activity:write,activity:read') {
				const authCode = read.get('code')!;
				console.log(authCode);
				const grant = 'authorization_code';

				const payload =
					au + `?client_id=${cl}&client_secret=${sc}&code=${authCode}&grant_type=${grant}`;

				const bd = LocalStoragePreset<Data>('bd', defaultData);
				const db = LocalStoragePreset<Data>('db', defaultData);
				try {
					console.log(payload);

					const response = await axios.post(payload, {
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						}
					});

					console.log(response.data);

					bd.update(({ messages }) => messages.pop());
					bd.update(({ messages }) => messages.push(response.data.access_token));
					let access_token = bd.data.messages[0];

					db.update(({ tokens }) => tokens.pop());
					db.update(({ tokens }) => tokens.push(response.data.refresh_token));
					let refresh_token = db.data.tokens[0];

					console.log('New Access Token:', access_token);
					console.log(refresh_token);

					goto('/home');
				} catch (error: any) {
					console.log(error);
				}
			} else {
				const authCode = read.get('code')!;
				console.log(authCode);
				const grant = 'authorization_code';

				const payload =
					au + `?client_id=${cl}&client_secret=${sc}&code=${authCode}&grant_type=${grant}`;

				const bd = LocalStoragePreset<Data>('bd', defaultData);
				const db = LocalStoragePreset<Data>('db', defaultData);

				console.log(payload);

				const response = await axios.post(payload, {
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				});

				bd.update(({ messages }) => messages.pop());
				bd.update(({ messages }) => messages.push(response.data.access_token));
				let access_token = bd.data.messages[0];

				db.update(({ tokens }) => tokens.pop());

				let deauth = `https://www.strava.com/oauth/deauthorize?access_token=${access_token}`;
				const revoke = await axios.post(deauth);

				bd.update(({ messages }) => messages.pop());
				access_token = bd.data.messages[0];

				goto('/');
			}
		} else {
			goto('/home');
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
		scope();
	});
</script>

<Nav />
<main class="width w-screen flex items-center justify-center">
	<div class="container m-4 items-center justify-center flex">
		<div class="xl:flex xl:justify-center">
			<section
				class="flex-col justify-center width w-96 p-4 border border-solid rounded-lg m-4 dark:border-neutral-800"
			>
				<h1 class="uppercase text-center text-lg font-mono mb-2">redirecting...</h1>

				<Summary />
				<Activities />
			</section>
		</div>
	</div>
</main>
<Footer />
