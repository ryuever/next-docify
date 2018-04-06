import express from 'express';
import next from 'next';
import { parse as parseUrl } from 'url';
import { preCacheSourceFiles, initOutputFolder } from '../lib/prestart';
import StoreProvider from '../lib/store/Provider';
import siteConfig from '../lib/siteConfig';

const dev = process.env.NODE_ENV !== 'production'
export const app = next({
  dev
})

export default (port) => {
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
      console.log(`> Starting next-docify server on port http://localhost:${port}`)
    })

    siteApp.get('*', (req, res) => {
      let parsedUrl = parseUrl(req.url, true)
      const { pathname } = parsedUrl;

      const routeGateWay = siteConfig.resolveGatewayRoutes();

      if (routeGateWay.has(pathname)) {
        const value = routeGateWay.get(pathname);
        parsedUrl = {
          pathname: value,
          path: value,
          href: value,
        }
      }

      handle(req, res, parsedUrl)
    })
  })
}
