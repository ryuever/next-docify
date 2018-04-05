const chalk = require('chalk');

module.exports = (name, dependencies) => {
  if (dependencies.indexOf(name) >= 0) {
    console.error(`
      You cant create project ${chalk.red(name)},
      Because it has the same name with npm dependency package
    `)

    process.exit(1);
  }
}
