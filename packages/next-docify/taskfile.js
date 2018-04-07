import copy from 'recursive-copy';

const dist = 'dist';

export async function transformBin(task) {
  await task
    .source('bin/*')
    .babel()
    .target(`${dist}/bin`, {
      mode: '0755',
    });
}

export async function transformLib(task) {
  await task
    .source('lib/**/*.js')
    .babel()
    .target(`${dist}/lib`);
}

export async function transformServer(task) {
  await task
    .source('server/**/*.js')
    .babel()
    .target(`${dist}/server`);
}

export async function copyRemaindingFiles(task) {
  await task.clear('dist/package.json');
  await task.clear('dist/next-docify.config.js');
  await copy('./package.json', 'dist/package.json');
  await copy('next-docify.config.js', 'dist/next-docify.config.js');
}

export default async function(task) {
  await task.clear('dist');
  await task.parallel([
    'transformBin',
    'transformLib',
    'transformServer',
    'copyRemaindingFiles',
  ]);

  await task.start('watchChange');
}

export async function watchChange(task) {
  await task.watch('bin/*', 'transformBin');
  await task.watch('lib/**/*.js', 'transformLib');
  await task.watch('server/**/*.js', 'transformServer');
  await task.watch(
    ['./package.json', './next-docify.config.js'],
    'copyRemaindingFiles'
  );
}
