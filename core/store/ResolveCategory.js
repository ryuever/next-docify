import fs from 'fs';
import Remarkable from 'remarkable';

const md = new Remarkable();
const stack = [];
const nextStack = [];

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
        depth: 0,
        parent: '',
        start: index,
        value: '',
        end: index + tag.length,
        line: lineNumber,
        isClosingBracket: tag.startsWith('</'),
      });
    })

    // only care <ul></ul> and <li></li>
    if (lineStack.length === 0) return;

    lineStack.sort((a, b) => a.start - b.start);

    let content = '';

    for (let i = 0; i < length;) {
      if (lineStack.length > 0) {
        const token = lineStack[0];
        const { start, end, isClosingBracket } = token;
        if (i === start) {
          if (isClosingBracket) {
            if (content) {
              const len = stack.length;
              stack[len - 1].value = content;
              content = '';
            }
            nextStack.push(stack.pop());
          } else {
            stack.push(token);
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
