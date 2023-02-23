import React from 'react'
import type { AppProps } from 'next/app'
import initializeStore, { ReduxState } from '@lib/redux/store'
import { NextPageContext } from 'next';
import { Store } from 'redux';
export interface CustomAppProps extends AppProps {
    store: Store;
}
declare global {
    interface Window { __NEXT_REDUX_STORE__: Store; }
}

export interface ReduxNextPageContext extends NextPageContext {
  store: Store
}
interface CustomNextPageContext extends NextPageContext {
  store?: Store
}

interface CustomAppPropsWithInitialReduxState extends AppProps {
  initialReduxState: any;
}

const __NEXT_REDUX_STORE__ = '__NEXT_REDUX_STORE__';


function getOrCreateStore(initialState?: ReduxState) {
  // Always make a new store if server, otherwise state is shared between requests
  if (typeof window === 'undefined') {
    return initializeStore(initialState)
  }

  // Create store if unavailable on the client and set it on the window object
  if (!(__NEXT_REDUX_STORE__ in window) || !window[__NEXT_REDUX_STORE__]) {
    window[__NEXT_REDUX_STORE__] = initializeStore(initialState)
  }
  return window[__NEXT_REDUX_STORE__]
}

const withReduxStore = (App: any) => {
  return class AppWithRedux extends React.Component<CustomAppPropsWithInitialReduxState> {
    static async getInitialProps(appContext: {ctx: CustomNextPageContext}) {
      
      // Get or Create the store with `undefined` as initialState
      // This allows you to set a custom default initialState
      const store = getOrCreateStore()

      // Provide the store to getInitialProps of pages
      appContext.ctx.store = store

      return {
        // La ligne suivante charge le getInitialProps, etc, de la page courante
        pageProps: {
          ...(App.getInitialProps ? await App.getInitialProps(appContext) : {}),
        },
        initialReduxState: store.getState(),
      }
    }

    render() {
      const { initialReduxState } = this.props

      return <App {...this.props} store={getOrCreateStore(initialReduxState)} />
    }
  }
}

export default withReduxStore;
