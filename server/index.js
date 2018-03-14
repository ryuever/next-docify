import express from 'express';
import next from 'next';
import { parse as parseUrl } from 'url';
import ResolveFileMeta from '../core/fs/ResolveFileMeta';

export default () => {
  const port = parseInt(process.env.PORT, 10) || 3000
  const dev = process.env.NODE_ENV !== 'production'
  const app = next({ dev })
  const handle = app.getRequestHandler()

  let fileMetas = null;
  fileMetas = ResolveFileMeta.walk();

  app.prepare()
  .then(() => {
    const siteApp = express();
    siteApp.listen(port, err => {
      if (err) throw err;
      /* eslint-disable no-console */
      console.log(`> Site generator ready on http://localhost:${port}`)
      /* eslint-enable no-console */
    })

    siteApp.get('*', (req, res) => {
      const parsedUrl = parseUrl(req.url, true)
      const { pathname, query } = parsedUrl

      if (pathname.startsWith('docs')) {
        return app.render(req, res, 'docs', query);
      } else {
        handle(req, res, parsedUrl)
      }
    })
  })
}
