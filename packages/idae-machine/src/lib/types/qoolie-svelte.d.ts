declare module '@medyll/qoolie/svelte' {
	export function useQoolieCollection<T = any>(
		qoolie: import('@medyll/qoolie').QoolieInstance,
		collection: string
	): { items: T[] };
	export function useQoolieQuery<T = any>(
		qoolie: import('@medyll/qoolie').QoolieInstance,
		collection: string,
		query: import('@medyll/qoolie').Where
	): { items: T[] };
}
