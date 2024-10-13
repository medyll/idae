import { cssDom } from '@medyll/idae-dom-events';

let a = {
	name: 'toggler',
	selector: 'data-toggler',
	actions: (element, changes) => {
		// toggler-for

		return {
			attrs: {
				'[toggler-for]': ''
			}
		};
	}
};
let b = {
	name: 'shower',
	selector: 'data-toggler',
	actions: (element, changes) => {
		// toggler-for
		const withAttr = () => {};

		return {
			withAttr: ['[show]', withAttr],
			attrs: {
				'[toggler-for]': () => {}
			}
		};
	}
};

let test = b.actions('element', 'changes');
console.log(Object.getOwnPropertyNames(b.actions));
console.log(Object.getOwnPropertyNames(test));

console.log({ test });

/* detectAndAct('.application-container', {
        attributes: ['data-action', 'class', 'style'],
        trackCharacterData: false,
        trackChildList: false,
        trackResize: false,
    }).actions((element, changes) => { 
        changes?.onResize;
        console.log('.application-container', element, changes);
    }); */

type DetectAndActCallback = (
	element: Element,
	changes: {
		attributes?: string[];
		childList?: boolean;
		characterData?: boolean;
		resize?: boolean;
	},
	mutation?: MutationRecord
) => void;

export function detectAndAct(
	selector: string,
	{ attributes, trackChildList, trackCharacterData, trackResize }
) {
	const api = {
		resize: () => {
			trackResize = true;
			return api;
		},
		childList: () => {
			trackChildList = true;
			return api;
		},
		characterData: () => {
			trackCharacterData = true;
			return api;
		},
		actions: (callback: DetectAndActCallback) => {
			const options = {
				onlyNew: false,
				trackResize,
				trackChildList,
				trackAttributes: attributes,
				trackCharacterData
			};

			const cssObserver = cssDom(selector, options).each((element, mutation) => {
				const changes = {
					resize: trackResize,
					attributes: attributes ? [mutation?.attributeName!] : undefined,
					childList: mutation?.type === 'childList',
					characterData: mutation?.type === 'characterData'
				};
				console.log(element, changes, mutation);
				callback(element, {
					attributes: mutation,
					childList: mutation,
					characterData: mutation,
					resize: changes.resize
				});
			});

			return {
				stop: () => {
					cssObserver.destroy();
				}
			};
		}
	};

	return api;
}

cssDom('#myElement', { trackResize: true, trackAttributes: ['class'], trackChildList: true }).each(
	(element, changes) => {
		console.log('Element resized:', element);
	}
);
