import type { TplCollectionName } from '@medyll/idae-idbql';
type $$ComponentProps = {
    collection: TplCollectionName;
    collectionId?: any;
    fieldName: string;
    data: Record<string, any>;
    onGuess: (fieldName: string, value: string) => void;
};
declare const CollectionFieldGuess: import("svelte").Component<$$ComponentProps, {}, "">;
type CollectionFieldGuess = ReturnType<typeof CollectionFieldGuess>;
export default CollectionFieldGuess;
