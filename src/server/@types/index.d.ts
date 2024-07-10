export type TRouteKey = keyof allowedRoutes
export type TRoute = string

type TCrudOpt = 'post' | 'patch' | 'put' | 'delete'

export interface IReceivedDataByPost {
  rooms: string[]
  sender: {
    roles: any[]
    token: string
  }
  payload: {
    own: string
    action: TCrudOpt
  }
}

export type TRoutesConfig = Record<TRouteKey, IRouteProps>

export interface IRouteProps {
  route: TRoute
}