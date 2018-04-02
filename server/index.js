import express from 'express';
import next from 'next';
import { parse as parseUrl } from 'url';
import { preCacheSourceFiles, initOutputFolder } from '../lib/prestart';
import StoreProvider from '../lib/store/Provider';
import isDocURL from '../utils/isDocURL';

export default () => {
  const port = parseInt(process.env.PORT, 10) || 3000
  const dev = process.env.NODE_ENV !== 'production'
  const app = next({
    // dir: resolve(__dirname, '..'),
    dev
  })

  preCacheSourceFiles();
  initOutputFolder();
  const storeProvider = new StoreProvider();
  storeProvider.resolveMetas();

  const handle = app.getRequestHandler()
  app.prepare()
  .then(() => {
    const siteApp = express();
    siteApp.listen(port, err => {
      if (err) throw err;
      console.log(`> Site generator ready on http://localhost:${port}`)
    })

    siteApp.get('*', (req, res) => {
      let parsedUrl = parseUrl(req.url, true)
      const { pathname } = parsedUrl;

      if (isDocURL(pathname)) {
        const parsed = (pathname.replace(/^.*(?=docs)/, '')).split('/');
        parsedUrl = {
          pathname: `/${parsed[0]}`,
          path: '/docs',
          href: '/docs',
        }
      }
      handle(req, res, parsedUrl)
    })
  })
}
