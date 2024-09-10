import { BASE_URL, CLIENT } from '$env/static/private';
import { env } from '$env/dynamic/private';

export async function load() {
	{
		const url = BASE_URL;
		const client_t = CLIENT;
		const secret_t = env['SECRET'];

		return {
			props: {
				baseUrl: url,
				clientId: client_t,
				clientSecret: secret_t
			}
		};
	}
}
