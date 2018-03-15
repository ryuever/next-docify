let singleton = null;

class Output {
  constructor(opts) {
    if (singleton) return singleton;

    const {
      outputPath,
    } = opts;

    this.outputPath = outputPath || process.cwd();
    singleton = this;
  }

  static instance() {
    if (singleton) return singleton;
  }

  static createSingleton(opts) {
    if (singleton) return singleton;
    return new Output(opts);
  }
}

export default Output;
