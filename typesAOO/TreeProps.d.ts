export interface TreeItemType<T = Record<string, any>> {
    name: string;
    path: string;
    checked?: boolean;
    data?: T;
    children: TreeItemType<T>[];
}