import React from 'react'
import Document, { Head, Main, NextScript } from 'next/document'
import config from 'config';
const { publicPath, antdStaticName } = config;

export default class CustomDocument extends Document {

  render () {
    return (<html lang='en-US'>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta name='robots' content='noindex' />
        <link rel="stylesheet" href={`${publicPath}static/${antdStaticName}`} />
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </html>)
  }
}
