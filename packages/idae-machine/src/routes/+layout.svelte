<script lang="ts">
	import "../app.css";
	import { machine } from '$lib/main/machine.js';
	import { App } from '$lib/shell/layout/index.js';

	const apiUrl = (import.meta.env.PUBLIC_API_URL as string | undefined) ?? 'http://localhost:7842';
	const token  = typeof window !== 'undefined'
		? (window.localStorage.getItem('auth_token') ?? '')
		: '';

	machine.init({
		org: 'demo', domain: 'machine', version: 6,
		sync: {
			mode: 'server-first',
			databaseHost: apiUrl,
			...(token && { token, headers: { Authorization: `Bearer ${token}` } }),
		},
	});
	machine.start();
	machine.initRouter({ baseUrl: '/', authEnabled: false });

	// Dev auto-login: if no token, fetch + reload (next mount picks up token).
	if (typeof window !== 'undefined' && !token) {
		fetch(`${apiUrl}/api/auth/login`, {
			method:  'POST',
			headers: { 'Content-Type': 'application/json' },
			body:    JSON.stringify({ login: 'admin', password: 'admin123' }),
		})
			.then((r) => (r.ok ? r.json() : null))
			.then((data) => {
				if (data?.token) {
					window.localStorage.setItem('auth_token', data.token);
					window.location.reload();
				}
			})
			.catch((err) => console.warn('[layout] Auto-login failed:', err));
	}
</script>

<App />
