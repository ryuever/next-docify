import Stat from './Stat';

class ResolveStat {
  constructor() {}

  static parse(opts) {
    return new Stat(opts);
  }
}

export default ResolveStat;
