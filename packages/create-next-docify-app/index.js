#!/usr/bin/env node

const program = require('commander');
const chalk = require('chalk');
const pkg = require('./package.json');
const createNextDicifyApp = require('./lib/createNextDocifyApp');

let name;

program
  .version(pkg.version)
  .usage(`${chalk.green('<app-directory>')} [options]`)
  .arguments('<app-directory> [template]')
  .option(
    '-t, --templateName <template-name>',
    'supplied template name',
    'default'
  )
  .option('-v, --verbose <verbose>', 'print additional logs', true)
  .action(function(app) {
    name = app;
    console.log(chalk.cyan('Start to init an application ' + app + '!'));
  })
  .on('--help', function() {
    console.log('  Examples:');
    console.log('    $ create-next-docify-app app');
    console.log();
  });

program.parse(process.argv);

createNextDicifyApp({
  name,
  templateName: program.templateName,
  verbose: program.verbose,
});
