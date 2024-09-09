import { BASE_URL, CLIENT, SECRET } from '$env/static/private';

export async function load() {
	{
		const url = BASE_URL;
		const client_t = CLIENT;
		const secret_t = SECRET;

		return {
			props: {
				baseUrl: url,
				clientId: client_t,
				clientSecret: secret_t
			}
		};
	}
}
