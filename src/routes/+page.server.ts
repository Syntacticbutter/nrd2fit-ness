import { CLIENT } from '$env/static/private';

export async function load() {
	{
		const client_t = CLIENT;

		return {
			props: {
				clientId: client_t
			}
		};
	}
}
