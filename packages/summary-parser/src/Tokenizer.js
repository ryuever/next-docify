class Token {
  constructor(opts) {
    const { tag, lineNumber, startPosition, depth } = opts;

    this.tag = tag;
    this.itag = tag.replace(/[^a-zA-Z]/g, '');
    // root element will consider `depth` as 0;
    this.depth = depth || 0;
    this.lineNuber = lineNumber;
    this.startPosition = startPosition;
    this.endPosition = startPosition + tag.length;
    this.isEndTag = tag.startsWith('</');
  }
}

export class ValueToken {
  constructor(opts) {
    const { value, depth } = opts;
    this.value = value;
    this.depth = depth;
  }
}

export default class Tokenizer {
  constructor(opts = {}) {
    this.rawData = opts.rawData;
    this.depth = 0;
    // As a global token store, encount a start tag will cause `push`;
    // end tag will `pop`
    this.stack = [];
    this.valueStacks = [];

    this.content = '';
  }

  resolveTags() {
    const keys = ['ul', 'li'];
    return keys.reduce(
      (prev, cur) => prev.concat([`<${cur}>`, `</${cur}>`]),
      []
    );
  }

  /**
   * replace tag which is not <li>, </li>, <ul> </ul>;
   * For example, <p> or </p> will be replaced with empty string.
   * @param {string} line
   */
  normalizeLine(line) {
    return line.replace(/(<\/?(?!(\/|li|ul))[^>]+>)/g, '');
  }

  tokenize() {
    const lines = this.rawData.split('\n');
    lines.forEach((line, lineNumber) => this.feed(line, lineNumber));
    return this.valueStacks;
  }

  resetContent() {
    if (this.content) {
      const valueToken = new ValueToken({
        depth: this.depth,
        value: this.content,
      });

      this.valueStacks.push(valueToken);
    }

    this.content = '';
  }

  feed(rawLine, lineNumber) {
    const tags = this.resolveTags();
    const line = this.normalizeLine(rawLine);
    const length = line.length;
    const lineStack = [];

    tags.forEach(tag => {
      const startPosition = line.indexOf(tag);
      if (startPosition < 0) return;
      lineStack.push(
        new Token({
          tag,
          startPosition,
          lineNumber,
        })
      );
    });

    if (lineStack.length === 0) return;
    lineStack.sort((a, b) => a.startPosition - b.startPosition);

    // feed character one by one, In order to update token's value.
    for (let i = 0; i < length; ) {
      if (lineStack.length > 0) {
        const token = lineStack[0];
        const { startPosition, endPosition, isEndTag, itag } = token;

        // if current position will match a tag, then process continue;
        // or read next charactor and return;
        if (i === startPosition) {
          // match a tag(open or end) means a reset of 'this.content';
          if (isEndTag) {
            this.stack.pop();
            this.resetContent();
            if (itag === 'ul') {
              this.depth -= 1;
            }
          } else {
            this.stack.push(token);
            this.resetContent();
            if (itag === 'ul') {
              this.depth += 1;
            }
          }

          lineStack.shift();
          i = endPosition;
          continue;
        }
      }
      this.content += line.charAt(i);
      i++;
    }
  }
}
