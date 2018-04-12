#!/usr/bin/env node

const execSync = require('child_process').execSync;

const exec = (command, extraEnv) => execSync(command, { stdio: 'inherit' });

exec('babel src -d lib', { BABEL_ENV: 'cjs' });
exec('babel src -d es', { BABEL_ENV: 'es' });
