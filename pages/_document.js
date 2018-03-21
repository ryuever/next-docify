import React from 'react'
import Document, { Head, Main, NextScript } from 'next/document'
import config from 'config';
import normalizeUrlPath from 'utils/normalizeUrlPath';

const { publicPath, antdStaticName } = config;

export default class CustomDocument extends Document {

  render () {
    const cssPath = normalizeUrlPath(`./static/stylesheets/${antdStaticName}`, publicPath);

    return (<html lang='en-US'>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta name='robots' content='noindex' />
        <link rel="stylesheet" href={cssPath} />
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </html>)
  }
}
