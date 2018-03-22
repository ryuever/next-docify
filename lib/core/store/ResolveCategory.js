import fs from 'fs';
import Remarkable from 'remarkable';
import Output from './Output';
import Provider from './Provider';
import resolveId from './utils/resolveId';
import removeSuffix from './utils/removeSuffix';
import readJSON from '../../utils/readJSON';
import toSlug from '../../utils/toSlug';

const md = new Remarkable();
let stack = [];
let nextStack = [];
let depth = 0;

class ResolveCategory {
  static tryPossibleSummaryName(docsPath) {
    const possibleValues = ['Summary.md', 'SUMMARY.md', 'summary.md'];
    for (let key of possibleValues) {
      const file = `${docsPath}/${key}`;
      if (fs.existsSync(file)) return file;
    }

    return false;
  }

  static parseSummary(docsPath, rootDir) {
    stack = [];
    nextStack = [];
    depth = 0;

    const file = ResolveCategory.tryPossibleSummaryName(docsPath);
    if (!file) return;

    const rawContent = fs.readFileSync(file, 'utf8');
    const nextContent = md.render(rawContent);

    const lines = nextContent.split('\n');

    lines.forEach((line, lineNumber) => {
      ResolveCategory.parseLine(line, lineNumber);
    })

    const res = nextStack.filter(stack => stack.value).reduce((sum, cur) => {
      const { prev, merge, accumulate } = sum;

      let nextMerge = merge;
      let nextAccumulate = accumulate;

      const { depth: prevDepth } = prev;
      const { depth } = cur;

      if (!prevDepth || prevDepth === depth) {
        nextMerge.push(cur);
      }

      if (prevDepth < depth) {
        nextAccumulate = nextAccumulate.concat(nextMerge);
        nextMerge = [];
        nextMerge.push(cur);
      }

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
      }
    }, {
      prev: {},
      merge: [],
      accumulate: [],
    })

    Output.getInstance().outputManifest(rootDir, res.accumulate);
  }

  static tagsShouldProcess() {
    return ['ul', 'li'].reduce((prev, cur) => prev.concat([`<${cur}>`, `</${cur}>`]), []);
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
    })

    // only care <ul></ul> and <li></li>
    if (lineStack.length === 0) return;

    lineStack.sort((a, b) => a.start - b.start);

    let content = '';

    for (let i = 0; i < length;) {
      if (lineStack.length > 0) {
        const token = lineStack[0];
        const { start, end, isClosingBracket, itag } = token;
        if (i === start) {
          if (isClosingBracket) {
            if (itag === 'ul') depth -= 1;
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

  static refineManifestAfterResolvePostMeta(docsPath, rootDir, postmeta) {
    const path = `${Output.getInstance().outputPath}/${rootDir}/manifest.js`;
    const manifest = readJSON(path);

    return manifest.map(fest => {
      const refine = (parent, fest) => {
        const { children, value, depth } = fest;
        const nextParent = `${parent}/${value}`;

        const cwd = `${Provider.getInstance().context}${nextParent}`;
        const id = resolveId(cwd);

        const resolveUrl = nextParent.split('/').map(part => part ? toSlug(part) : '').join('/');
        const slimTitle = removeSuffix(value);
        const mf = {
          name: value,
          isFile: false,
          depth: depth,
          title: slimTitle,
          slug: toSlug(slimTitle),  // should based on the original title value.
          permalink: resolveUrl,
        };

        if (postmeta[id]) {
          const { title } = postmeta[id];
          mf.title = title;
          mf.isFile = true;
        }

        mf.children = [];
        if (children.length > 0) {
          mf.children = children.map((child) => refine(nextParent, child))
        }

        return mf;
      }

      return refine('/docs', fest);
    })
  }
}

export default ResolveCategory;
