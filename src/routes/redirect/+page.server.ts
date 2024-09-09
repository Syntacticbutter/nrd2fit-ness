import { CLIENT, SECRET, AUTH } from '$env/static/private';

export async function load() {
	{
		const client_t = CLIENT;
		const secret_t = SECRET;
		const auth_url = AUTH;

		return {
			props: {
				clientId: client_t,
				clientSecret: secret_t,
				authUrl: auth_url
			}
		};
	}
}
