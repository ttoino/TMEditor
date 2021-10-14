// @flow

import type { ChartTypes } from './charts'
export * from './charts'

export type GlobalState = {
  platformMainConfig: MainConfigState,
  user: UsersState,
  pages: PagesState
};

export type MainConfigState = {
  title: string,
  pages: [],
  dashboard: {},
  usersLocation: [],
  isLoadingConfig: boolean,
  isAuthenticating: boolean,
  authenticated: boolean,
  authToken: ?string
};

export type UsersState = {
  identifiers: Object[],
  isLoadingUsers: boolean,
  error: any
};

export type PagesState = {
  isLoading: boolean,
  data: {
    title: string,
    components: UIComponent[],
    params: {
      from?: string,
      to?: string
    }
  }
};

export type UIComponent = {
  type: ChartTypes,
  title: string,
  specifications: any,
  mappedAttributes: Object
};
