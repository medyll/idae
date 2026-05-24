declare module '@medyll/qoolie/svelte' {
	export function useQoolieCollection<T = any>(
		qoolie: any,
		collection: string
	): { items: T[] };
	export function useQoolieQuery<T = any>(
		qoolie: any,
		collection: string,
		query: Record<string, unknown>
	): { items: T[] };
}
