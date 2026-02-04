export type TRouteKey = keyof allowedRoutes;
export type TRoute = string;

type TCrudOpt = 'post' | 'patch' | 'put' | 'delete';

export interface IReceivedDataByPost {
	rooms: string[];
	sender: {
		roles: any[];
		token?: string;
		/**
		 * Origine session identifiers
		 * (e.g. PHPSESSION, cookie, external system ID)
		 */
		cookie?: string;
		sessionId?: string;
		[key: string]: any;
	};
	payload: {
		own?: string;
		action?: TCrudOpt;
		[key: string]: any;
	};
}

export type TRoutesConfig = Record<TRouteKey, IRouteProps>;

export interface IRouteProps {
	route: TRoute;
}
