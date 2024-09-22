import { Fragment } from 'react'
import '../styles/globals.css'
import Head from 'next/head'

function MyApp({ Component, pageProps }) {
  return (
    <Fragment>
      <Head>
      <title>Omiris - Data Analytics Competition Site</title>
      <link rel="shortcut icon" href="/static/logo.jpg" />
    </Head>
    <Component {...pageProps} />
    </Fragment>
  )
}

export default MyApp
