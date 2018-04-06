import fs from 'fs';
import Remarkable from 'remarkable';
import Output from './Output';
import resolveId from './utils/resolveId';
import toSlug from '../utils/toSlug';
import { resolve } from 'path';

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

  // will return an array,
  static parseSummary(config) {
    const { docPath, docBaseName, docDirName } = config;
    stack = [];
    nextStack = [];
    depth = 0;

    const file = ResolveCategory.tryPossibleSummaryName(docPath);
    if (!file) return;

    const rawContent = fs.readFileSync(file, 'utf8');
    const nextContent = md.render(rawContent);

    const lines = nextContent.split('\n');

    lines.forEach((line, lineNumber) => {
      ResolveCategory.parseLine(line, lineNumber);
    });

    const res = nextStack.filter(stack => stack.value).reduce(
      (sum, cur) => {
        const { prev, merge, accumulate } = sum;

        let nextMerge = merge;
        let nextAccumulate = accumulate;

        const { depth: prevDepth } = prev;
        const { depth, value } = cur;

        // resolve `permalink` and `title` from content
        const hasParenthesesAndWithPermalink = str => /\(.+\)/.test(str);

        cur.relativePath = '';
        const resolveTitleAndPermalink = str => {
          if (!str) throw new Error('missing content');
          const ret = {
            title: str,
            permalink: '',
          };
          if (!hasParenthesesAndWithPermalink(str)) ret.title = str;
          else {
            const matched = str.match(/([^(]*)\(([^)]*)/);
            if (matched) {
              ret.title = matched[1];
              cur.relativePath = ret.permalink = matched[2];
            }
          }

          return ret;
        };

        const { title, permalink } = resolveTitleAndPermalink(value);
        cur.cwd = escapeFilename(resolve(docPath, cur.relativePath));
        // cur.cwd = resolve(docPath, cur.relativePath);
        // cur.cwd = `${docPath}/${cur.relativePath}`;
        cur.id = resolveId(cur.cwd);
        const stats = fs.statSync(cur.cwd);
        cur.isFile = stats.isFile();

        cur.title = title;

        // TODO: should reconsider how to set `nextPermalink` value
        // let nextPermalink = `/${permalink}`;
        let nextPermalink = `/${docDirName}/${docBaseName}/${permalink}`;
        nextPermalink = nextPermalink.replace(/\/$/, '');
        cur.permalink = nextPermalink
          .split('/')
          .map(part => (part ? toSlug(part) : ''))
          .join('/');

        if (!prevDepth || prevDepth === depth) {
          nextMerge.push(cur);
        }

        if (prevDepth < depth) {
          nextAccumulate = nextAccumulate.concat(nextMerge);
          nextMerge = [];
          nextMerge.push(cur);
        }

        // if the prevDepth has a bigger value, the prev items will be consider as the cur's children
        if (prevDepth > depth) {
          if (merge.length > 0) {
            cur.children = merge.slice();
            nextMerge = [];
            nextAccumulate.push(cur);
          } else {
            const len = nextAccumulate.length;
            let i = len - 1;
            for (; i >= 0; i--) {
              const token = nextAccumulate[i];
              if (token.depth <= depth) break;
            }

            cur.children = nextAccumulate.slice(i + 1, len);
            nextAccumulate = nextAccumulate.slice(0, i + 1);

            nextAccumulate.push(cur);
          }
        }

        return {
          prev: cur,
          merge: nextMerge,
          accumulate: nextAccumulate,
        };
      },
      {
        prev: {},
        merge: [],
        accumulate: [],
      }
    );

    let accum = res.accumulate;
    const len = accum.length;
    const missing = accum[len - 1];
    const remainding = accum.slice(0, len - 1);

    let i = remainding.length - 1;
    for (; i >= 0; i--) {
      const token = remainding[i];
      if (token.depth <= missing.depth) break;
    }

    // the breaking point value `i` acctually minus one more time.
    i++;

    missing.children = [].concat(remainding.slice(i), missing.children);

    accum = remainding.slice(0, i);
    accum.push(missing);

    const filterManifests = manifests => {
      return manifests.map(manifest => {
        const keysToSave = [
          'id',
          'cwd',
          'relativePath',
          'value',
          'title',
          'isFile',
          'title',
          'permalink',
          'value',
          'depth',
        ];

        const refine = keysToSave.reduce(
          (accum, key) => ({
            ...accum,
            [key]: manifest[key],
          }),
          {}
        );

        refine.children = [];

        if (manifest.children.length > 0) {
          refine.children = filterManifests(manifest.children);
        }

        return refine;
      });
    };

    const nextData = filterManifests(accum);

    Output.getInstance().outputManifest(docBaseName, nextData);
  }

  static tagsShouldProcess() {
    return ['ul', 'li'].reduce(
      (prev, cur) => prev.concat([`<${cur}>`, `</${cur}>`]),
      []
    );
  }

  // only care <li, </li>, <ul> and </ul> tags, for else `<p></p>` will be replaced with empty.
  static normalizeLine(line) {
    return line.replace(/(<\/?(?!(\/|li|ul))[^>]+>)/g, '');
  }

  static parseLine(rawLine, lineNumber) {
    const tags = ResolveCategory.tagsShouldProcess();
    const line = ResolveCategory.normalizeLine(rawLine);
    const length = line.length;
    const lineStack = [];

    tags.forEach(tag => {
      const index = line.indexOf(tag);
      if (index < 0) return;

      lineStack.push({
        tag,
        itag: tag.replace(/[^a-zA-Z]/g, ''),
        depth: 0,
        parent: '',
        start: index,
        value: '',
        end: index + tag.length,
        line: lineNumber,
        isClosingBracket: tag.startsWith('</'),
        children: [],
      });
    });

    // only care <ul></ul> and <li></li>
    if (lineStack.length === 0) return;

    lineStack.sort((a, b) => a.start - b.start);

    let content = '';

    for (let i = 0; i < length; ) {
      if (lineStack.length > 0) {
        const token = lineStack[0];
        const { start, end, isClosingBracket, itag } = token;
        if (i === start) {
          if (isClosingBracket) {
            // 如果说碰到ul标签表示切换到了另一层
            if (itag === 'ul') {
              depth -= 1;
            }
            if (content) {
              const len = stack.length;
              stack[len - 1].value = content;
              content = '';
            }
            nextStack.push(stack.pop());
          } else {
            token.depth = depth;
            stack.push(token);
            if (itag === 'ul') {
              depth += 1;
            }
          }

          lineStack.shift();
          i = end;
          continue;
        }
      }
      content += line.charAt(i);
      i++;
    }

    if (content) {
      const len = stack.length;
      stack[len - 1].value = content;
    }
  }
}

export default ResolveCategory;
