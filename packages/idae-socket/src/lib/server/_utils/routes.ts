import { IRouteProps, TRoute, TRoutesConfig } from '../@types';
import cmdRoutes from '../_config/cmdRoutes.json' with { type: 'json' };

export class appRoutes {
	static getRoutes(): TRoutesConfig {
		if (!Object.keys(cmdRoutes)?.length) {
			console.error('MISSING ALLOWED ROUTES');
		}
		return cmdRoutes;
	}

	static getRoute(route: TRoute): IRouteProps {
		return cmdRoutes?.[route] ?? {};
	}
}
