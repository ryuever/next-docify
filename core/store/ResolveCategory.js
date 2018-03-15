import fs from 'fs';
import Remarkable from 'remarkable';

const md = new Remarkable();
const stack = [];
const nextStack = [];
let depth = 0;

class ResolveCategory {
  constructor() {

  }

  parse() {

  }

  static tryPossibleSummaryName(docsPath) {
    const possibleValues = ['Summary.md', 'SUMMARY.md', 'summary.md'];
    for (let key of possibleValues) {
      const file = `${docsPath}/${key}`;
      if (fs.existsSync(file)) return file;
    }

    return false;
  }

  static parseSummary(docsPath) {
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

    fs.writeFileSync(
      process.cwd() + `/build/manifest.js`,
      '/**\n' +
        ' * @generated\n' +
        ' */\n' +
        'module.exports = ' +
        JSON.stringify(res.accumulate, null, 2) +
        ';\n'
    );
  }

  static tagsShouldProcess() {
    return ['ul', 'li'].reduce((prev, cur) => prev.concat([`<${cur}>`, `</${cur}>`]), []);
  }

  static parseLine(line, lineNumber) {
    const tags = ResolveCategory.tagsShouldProcess();
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
}

export default ResolveCategory;
