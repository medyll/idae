export   type PathDataType = {
  name: string
  path: string
  data: Record<string, any>
}

/**
 * accepts array of string or array of path with linked data */
export type PathsType =  PathDataType[];

export interface TreeItemType<T = Record<string, any>> {
  name: string,
  path: string,
  checked?: boolean,
  data?: T
  children: TreeItemType<T>[]
}