<script lang="ts">
	import Nav from '$lib/components/nav.svelte';
	import Footer from '$lib/components/footer.svelte';

	export let data;
	$: cl = data.props.clientId;

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

	const authorize = async () => {
		const uri = 'https://nrd2fit-ness.pages.dev/redirect';
		// const uri = 'http://localhost:5173/redirect';
		const type = 'code';
		const scope = 'read,activity:read,activity:write';

		const prompt: string = 'auto';
		const auth = `https://www.strava.com/oauth/authorize?approval_prompt=${prompt}&client_id=${cl}&redirect_uri=${uri}&response_type=${type}&scope=${scope}`;

		window.location.href = auth;
	};

	const home = async () => {
		const bd = LocalStoragePreset<Data>('bd', defaultData);
		bd.update(({ messages }) => messages.pop());
		let access_token = bd.data.messages[0];
		const db = LocalStoragePreset<Data>('db', defaultData);
		// db.update(({ tokens }) => tokens.pop());
		let refresh_token = db.data.tokens[0];

		if (access_token != null) goto('/home');
	};

	onMount(() => {
		home();
	});
</script>

<Nav />
<main class="width w-screen flex items-center justify-center">
	<div class="container m-4 items-center justify-center flex">
		<div class="xl:flex xl:justify-center">
			<section class="w-96 p-4 border border-solid rounded-lg m-4 dark:border-neutral-800">
				<!-- <div class="mb-2 h-[176px] rounded-md bg-slate-100"></div> -->
				<img class="mb-2 w-full h-[176px] rounded-md" src="tv_static.gif" alt="cover-img" />
				<!-- <img class="mb-2 w-full h-[176px] rounded-md" src="color_static.gif" alt="cover-img" /> -->
				<p class="capitalize mb-1 font-thin">--</p>
				<div class="columns-2 flex align-middle">
					<div class="display inline-flex items-center w-full">
						<!-- <div class="rounded-md mr-2 w-6 h-6 bg-slate-100" /> -->
						<img class="rounded-md mr-2 w-6 h-6" src="tv_static.gif" alt="club-avatar" />
						<!-- <img class="rounded-md mr-2 w-6 h-6" src="color_static.gif" alt="club-avatar" /> -->
						<t class="font-thin text-lg">--</t>
					</div>
					<!-- <div class="flex items-end justify-end w-full">
						<div>
							<button
								on:click={authorize}
								class="inline-flex items-center justify-end align-middle rounded-md bg-[#fc4c02] padding px-3 py-0 text-white active:text-[#fc4c02] active:bg-opacity-10 text-xs font-bold h-8"
							>
								Connect with
								<svg class="ml-1 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 432 91"
									><style type="text/css">
										.st0 {
											fill: currentColor;
										}
									</style><path
										class="st0"
										d="M74.5 49.5c1.6 2.8 2.5 6.3 2.5 10.4v0.2c0 4.2-0.8 8-2.5 11.4 -1.7 3.4-4.1 6.2-7.1 8.6 -3.1 2.3-6.8 4.1-11.2 5.4 -4.4 1.3-9.3 1.9-14.7 1.9 -8.2 0-15.9-1.1-23-3.4 -7.1-2.3-13.2-5.7-18.3-10.2l14.4-17.1c4.4 3.4 9 5.8 13.8 7.2 4.8 1.5 9.6 2.2 14.4 2.2 2.5 0 4.2-0.3 5.3-0.9 1.1-0.6 1.6-1.5 1.6-2.5v-0.2c0-1.2-0.8-2.1-2.4-2.9 -1.6-0.8-4.5-1.6-8.8-2.4 -4.5-0.9-8.8-2-12.9-3.2 -4.1-1.2-7.7-2.8-10.8-4.7 -3.1-1.9-5.6-4.3-7.4-7.2C5.4 39 4.5 35.4 4.5 31.2V31c0-3.8 0.7-7.4 2.2-10.7 1.5-3.3 3.7-6.2 6.6-8.6 2.9-2.5 6.5-4.4 10.7-5.8 4.2-1.4 9.1-2.1 14.7-2.1 7.8 0 14.7 0.9 20.5 2.8 5.9 1.8 11.1 4.6 15.8 8.3L61.9 33c-3.8-2.8-7.9-4.8-12.1-6.1 -4.3-1.3-8.3-1.9-12-1.9 -2 0-3.5 0.3-4.4 0.9 -1 0.6-1.4 1.4-1.4 2.4v0.2c0 1.1 0.7 2 2.2 2.8 1.5 0.8 4.3 1.6 8.5 2.4 5.1 0.9 9.8 2 14 3.3 4.2 1.3 7.8 3 10.9 5C70.5 44.2 72.9 46.6 74.5 49.5zM75.5 28.1h23.7v57.8h26.9V28.1h23.7V5.3H75.5V28.1zM387.9 0.3l-43.3 85.6h25.8l17.5-34.6 17.6 34.6h25.8L387.9 0.3zM267.3 0.3l43.4 85.6h-25.8l-17.5-34.6 -17.5 34.6h-17.5 -8.3 -22.4l-15.2-23h-0.2 -5.5v23h-26.9V5.3H193c7.2 0 13.1 0.8 17.8 2.5 4.6 1.6 8.4 3.9 11.2 6.7 2.5 2.4 4.3 5.2 5.5 8.3 1.2 3.1 1.8 6.7 1.8 10.8v0.2c0 5.9-1.4 10.9-4.3 14.9 -2.8 4.1-6.7 7.3-11.6 9.7l14 20.4L267.3 0.3zM202.5 35.6c0-2.6-0.9-4.5-2.8-5.8 -1.8-1.3-4.3-1.9-7.5-1.9h-11.7v15.8h11.6c3.2 0 5.8-0.7 7.6-2.1 1.8-1.4 2.8-3.3 2.8-5.8V35.6zM345.2 5.3L327.6 40 310 5.3h-25.8l43.4 85.6 43.3-85.6H345.2z"
									/></svg
								>
							</button>
						</div>
					</div> -->
				</div>
				<p class="font-thin text-xs">-- · --</p>
				<div class="flex items-center justify-evenly my-2">
					<div>
						<div class="flex align-baseline justify-evenly font font-mono text-4xl">N/A</div>
						<div class="flex align-baseline justify-evenly text-sm">members</div>
					</div>
					<div>
						<div class="flex align-baseline justify-evenly font font-mono text-4xl">N/A</div>
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
						>Our company internal multi sports Strava club. For support, motivate, and inspire each
						other.</textarea
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
				<div class="lg:flex row justify-evenly">
					<div>
						<div class="mb-2">
							<h1 class="text-lg font-semibold mb-2">
								NRD2Fit API
								<span class="text-red-500"> requires </span>
								the following permissions:
							</h1>
							<div class="ml-4">
								<bl>
									<li>View data about your activities</li>
									<li>Upload your activities from NRD2Fit API to Strava</li>
								</bl>
							</div>
							<div class="mt-4 flex items-center justify-center">
								<button
									on:click={authorize}
									class="inline-flex items-center justify-end align-middle rounded-md bg-[#fc4c02] padding px-3 py-0 text-white active:text-[#fc4c02] active:bg-opacity-10 text-xs font-bold h-8"
								>
									Connect with
									<svg class="ml-1 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 432 91"
										><style type="text/css">
											.st0 {
												fill: currentColor;
											}
										</style><path
											class="st0"
											d="M74.5 49.5c1.6 2.8 2.5 6.3 2.5 10.4v0.2c0 4.2-0.8 8-2.5 11.4 -1.7 3.4-4.1 6.2-7.1 8.6 -3.1 2.3-6.8 4.1-11.2 5.4 -4.4 1.3-9.3 1.9-14.7 1.9 -8.2 0-15.9-1.1-23-3.4 -7.1-2.3-13.2-5.7-18.3-10.2l14.4-17.1c4.4 3.4 9 5.8 13.8 7.2 4.8 1.5 9.6 2.2 14.4 2.2 2.5 0 4.2-0.3 5.3-0.9 1.1-0.6 1.6-1.5 1.6-2.5v-0.2c0-1.2-0.8-2.1-2.4-2.9 -1.6-0.8-4.5-1.6-8.8-2.4 -4.5-0.9-8.8-2-12.9-3.2 -4.1-1.2-7.7-2.8-10.8-4.7 -3.1-1.9-5.6-4.3-7.4-7.2C5.4 39 4.5 35.4 4.5 31.2V31c0-3.8 0.7-7.4 2.2-10.7 1.5-3.3 3.7-6.2 6.6-8.6 2.9-2.5 6.5-4.4 10.7-5.8 4.2-1.4 9.1-2.1 14.7-2.1 7.8 0 14.7 0.9 20.5 2.8 5.9 1.8 11.1 4.6 15.8 8.3L61.9 33c-3.8-2.8-7.9-4.8-12.1-6.1 -4.3-1.3-8.3-1.9-12-1.9 -2 0-3.5 0.3-4.4 0.9 -1 0.6-1.4 1.4-1.4 2.4v0.2c0 1.1 0.7 2 2.2 2.8 1.5 0.8 4.3 1.6 8.5 2.4 5.1 0.9 9.8 2 14 3.3 4.2 1.3 7.8 3 10.9 5C70.5 44.2 72.9 46.6 74.5 49.5zM75.5 28.1h23.7v57.8h26.9V28.1h23.7V5.3H75.5V28.1zM387.9 0.3l-43.3 85.6h25.8l17.5-34.6 17.6 34.6h25.8L387.9 0.3zM267.3 0.3l43.4 85.6h-25.8l-17.5-34.6 -17.5 34.6h-17.5 -8.3 -22.4l-15.2-23h-0.2 -5.5v23h-26.9V5.3H193c7.2 0 13.1 0.8 17.8 2.5 4.6 1.6 8.4 3.9 11.2 6.7 2.5 2.4 4.3 5.2 5.5 8.3 1.2 3.1 1.8 6.7 1.8 10.8v0.2c0 5.9-1.4 10.9-4.3 14.9 -2.8 4.1-6.7 7.3-11.6 9.7l14 20.4L267.3 0.3zM202.5 35.6c0-2.6-0.9-4.5-2.8-5.8 -1.8-1.3-4.3-1.9-7.5-1.9h-11.7v15.8h11.6c3.2 0 5.8-0.7 7.6-2.1 1.8-1.4 2.8-3.3 2.8-5.8V35.6zM345.2 5.3L327.6 40 310 5.3h-25.8l43.4 85.6 43.3-85.6H345.2z"
										/></svg
									>
								</button>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	</div>
</main>
<Footer />
