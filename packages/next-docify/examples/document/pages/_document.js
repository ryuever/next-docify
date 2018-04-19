import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';

export default class CustomDocument extends Document {
  render() {
    return (
      <html lang="zh-CN">
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="robots" content="noindex" />
          <link
            rel="stylesheet"
            href="/static/stylesheets/font-awesome/fontawesome-all.min.css"
          />
          <link
            rel="stylesheet"
            href="/static/stylesheets/highlight/github.css"
          />
          <link
            rel="stylesheet"
            href="/static/stylesheets/github-markdown.css"
          />
        </Head>

        <body style={{ margin: 0 }}>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
