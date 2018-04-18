/**
 *  {
 *    "id": "docs-tutorial",
 *    "cwd": "xxx/docs/tutorial/quick-start.md",
 *    "relativePath": "",
 *    "value": "tutorial(quick-start.md)",
 *    "title": "tutorial",
 *    "isFile": false,
 *    "permalink": "/docs/tutorial/quick-start",
 *    "depth": 2,
 *    children: [],
 * }
 */

import fs from 'fs';
import { resolve } from 'path';
import Remarkable from 'remarkable';
import Output from './Output';
import removeSuffix from '../utils/removeSuffix';
import toSlug from '../utils/toSlug';
import Parser from 'somia';

const escapeFilename = str => str.replace(/ /g, '\\ ');

const md = new Remarkable();
let stack = [];
let nextStack = [];
let depth = 0;

class ResolveCategory {
  static tryPossibleSummaryName(docPath) {
    const possibleValues = ['Summary.md', 'SUMMARY.md', 'summary.md'];
    for (let key of possibleValues) {
      const file = `${docPath}/${key}`;
      if (fs.existsSync(file)) return file;
    }

    return false;
  }

  static resolveTitleAndPermalink(str) {
    if (!str) throw new Error('missing content');
    const hasParentheses = str => /\(.+\)/.test(str);

    const ret = {
      title: str,
      relativePath: '',
    };
    if (!hasParentheses(str)) {
      ret.title = str;
    } else {
      const matched = str.match(/([^(]*)\(([^)]*)/);
      if (matched) {
        ret.title = matched[1];
        ret.relativePath = matched[2];
      }
    }

    return ret;
  }

  // will return an array,
  static parseSummary(config) {
    const { docPath, docBaseName } = config;
    stack = [];
    nextStack = [];
    depth = 0;

    const file = ResolveCategory.tryPossibleSummaryName(docPath);
    if (!file) return;

    const rawContent = fs.readFileSync(file, 'utf8');
    const nextContent = md.render(rawContent);

    const parser = new Parser({ rawData: nextContent });
    const result = parser.parse();

    const resultWithInfo = ResolveCategory.withAccessInfo(result, config);

    Output.getInstance().outputManifest(docBaseName, resultWithInfo);
  }

  static withAccessInfo(data, config) {
    const { docBaseName, docDirName } = config;

    return data.map(item => {
      const { children, value, depth, order } = item;
      const { title, relativePath } = ResolveCategory.resolveTitleAndPermalink(
        value
      );
      const ret = { value, depth, order };
      ret.title = title;

      if (relativePath) {
        const str = `/${docDirName}/${docBaseName}/${removeSuffix(
          relativePath
        )}`;
        ret.permalink = toSlug(str, {
          connector: '/',
          trimLeadingConnector: false,
        });
        ret.id = toSlug(str);
      } else {
        ret.permalink = '';
      }

      if (children.length > 0) {
        ret.children = ResolveCategory.withAccessInfo(children, config);
      } else {
        ret.children = children;
      }

      return ret;
    });
  }
}

export default ResolveCategory;
