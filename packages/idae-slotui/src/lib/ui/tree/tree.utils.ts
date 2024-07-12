import type { PathDataType, PathsType, TreeItemType } from './types.js';

export const trans2Tree = (
	paths: PathsType,
	pathKey: keyof PathDataType = 'path',
	splitter: string = '/'
): TreeItemType[] => {
	const tree: TreeItemType[] = [];

	// sort path alphabetically
	const sortedPaths = paths.sort((a, b) => (a[pathKey] > b[pathKey] ? 1 : -1));

	for (let i = 0; i < sortedPaths.length; i++) {
		const path = sortedPaths[i][pathKey];

		const pathSplice = path.split(splitter);

		let currentLevel = tree;

		for (let j = 0; j < pathSplice.length; j++) {
			const part = pathSplice[j];

			const existingPath = currentLevel.find((k) => k.name === part); //findWhere(currentLevel, 'name', part);

			if (existingPath) {
				currentLevel = existingPath.children;
			} else {
				const newPart = {
					name: part,
					path: pathSplice.slice(0, j + 1).join(splitter),
					data: {},
					children: []
				};
				//
				currentLevel.push(newPart);
				currentLevel = newPart.children;
			}
		}
	}
	return tree;
};
