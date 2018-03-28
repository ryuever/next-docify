import Meta from './Meta';

class Category extends Meta {
  constructor(opts) {
    super({
      cwd: opts.cwd,
    });

    this.isDIR = false;

    // data created from reading `summary.md` should be considered as a criteria,
    // if `summary.md` is present, only display file listed in file
    this.origin = 'default';

    this.show = true;
  }
}

export default Category;
