import 'bootstrap/dist/css/bootstrap.css';
import { NextPageContext, NextComponentType } from 'next';
import Head from 'next/head';
import { Provider } from "react-redux";
import withReduxStore, { CustomAppProps } from "@lib/redux/with-redux-store";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import '@styles/main.scss';
import '@fortawesome/fontawesome-free/css/all.min.css';
//moment
import '../moment.config';
import '@lib/translation/config/i18n';

function MyApp({ Component, pageProps, store }: CustomAppProps): JSX.Element {
  if (process.env.SENTRY_URL) {
    Sentry.init({
      dsn: process.env.SENTRY_URL,
      integrations: [
        new Integrations.BrowserTracing(),
      ],
    
      // We recommend adjusting this value in production, or using tracesSampler
      // for finer control
      tracesSampleRate: 1.0,
    });
  }
  return (
    <>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,500;0,700;1,300;1,500;1,700&display=swap" rel="stylesheet" />
      </Head>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </>
  );
}

MyApp.getInitialProps = async ({ ctx, Component }: { ctx: NextPageContext, Component: NextComponentType }) => {
  if (Component.getInitialProps) {
    const pageProps = await Component.getInitialProps(ctx);
    return pageProps;
  }

  return {};
};

export default withReduxStore(MyApp);
