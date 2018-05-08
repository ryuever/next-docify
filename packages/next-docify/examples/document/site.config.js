module.exports = {
  site: 'tutorial',
  docs: [
    {
      component: './pages/docs',
      accessPath: '/docs',
      docDirName: 'docs',
      docBaseName: 'tutorial',
      showOnSidebar: true,
      title: 'tutorial',
      indexDocPath: '/docs/tutorial/quick-start',
    },
    {
      component: './pages/docs',
      accessPath: '/docs/packages',
      docDirName: 'docs',
      docBaseName: 'packages/tutorial',
      showOnSidebar: true,
      title: 'package-tutorial',
      indexDocPath: '/docs/packages/tutorial/quick-start',
    },
  ],
};
