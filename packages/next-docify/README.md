# next-docify &middot; [![npm version](https://img.shields.io/npm/v/next-docify.svg?style=flat)](https://www.npmjs.com/package/next-docify) [![NPM downloads](https://img.shields.io/npm/dm/next-docify.svg?style=flat-square)](http://www.npmtrends.com/next-docify)

`next-docify`是一个基于`Next.js`的静态网站生成工具

---

`next-docify`在设计上主要是参考了[Docusaurus](https://github.com/facebook/docusaurus), [gitbook](https://github.com/GitbookIO/gitbook)

- 易用性：基于`Next.js`的封装，是一个单独的功能模块，只需更改脚本启动语法糖就可以享受`markdown`数据的便捷引入
- 灵活性：可以对文档指定不同的渲染模版
- 定制化：本身模块提供的是数据层的抽象，没有`View`的引入；如果使用基于`Next.js`搭建起来的服务，渲染的文档数据只需在需要展示时通过`import`来引入。
- 按需加载：数据层面都是通过`chunk`模块来动态引入

## 安装

```bash
npm i next-docify --save
```

或者

```bash
yarn add next-docify --dev
```

## 准备工作

### 更新`package.json`文件

```json
{
  "scripts": {
    "dev": "next",
    "build": "next build",
    "export": "next export"
  }
}
```

更新为

```json
{
  "scripts": {
    "dev": "next-docify dev",
    "build": "next-docify build",
    "out": "next-docify out"
  }
}
```

### 更新`next.config.js`文件

```js
module.exports = {
  /* config options here */
}
```

更新为

```js
const withNextDocifyConfig = require('next-docify/with-next-docify-config');

module.exports = withNextDocifyConfig({
  /* config options here */
});
```

### 更新`.babelrc` file

添加`next-docify/dynamic-site-import-plugin`到`babel`配置

```json
{
  "plugins": [
    "next-docify/dynamic-site-import-plugin"
  ]
}
```

### 添加`site.config.js`文件

在根目录提供`markdown`数据源的配置文件`site.config.js`；参数详情参考[]()

```js
module.exports = [{
  site: 'next-docify template',
  component: './pages/docs',
  accessPath: '/docs',
  docDirName: 'docs',
  docBaseName: 'tutorial',
}];
```

## 快速入门

- [引入`markdown`数据](#引入markdown数据)
- [配置`site.config.js`](#配置siteconfigjs)
- [`docs`的结构控制](#docs的结构控制)
- [FAQ](#faq)

### 引入`markdown`数据

在进行文档数据渲染时，开发者比较关心的是如何能够获取想要的`markdown`数据文件；而`next-docify`就提供的是下面的`import`方式

```js
import site from 'next-docify/site';
```

`site`接受两个参数，并且返回一个`Promise`对象；

- `accessPath`(required): 需要跟`site.config.js`中的配置一致；主要是通过这个设置来获取到底`docs`数据源的位置；通过这个参数的设置，`data`数据中会包含`postmeta`和`manifest`两个对象。

```js
site({
  accessPath: '/docs',
}).then(data => {
  const { postmeta, manifest } = data;
  // ...
})
```

- `path`(optional): 作为可选参数，通过`path`的设置可以获取具体到某一个文件作为作为数据源；通过这个参数的设置，`data`数据中会再添加`dataSource`对象，`dataSource`包含的是所要渲染的`markdown`文件内容。

```js
site({
  accessPath: '/docs',
  path: '/docs/tutorial',
}).then(data => {
  const { postmeta, manifest, dataSource } = data;
  // ...
})
```

### 配置`site.config.js`

读取文档信息的配置文件，返回的数据类型`<Array|object>`；

```js
module.exports = [{
  site: 'next-docify template',
  component: './pages/docs',
  accessPath: '/docs',
  docDirName: 'docs',
  docBaseName: 'tutorial',
}];
```

- `site`(optional): 设置当前渲染页面的`name`
- `component`(required): 设置当前文档对应应该渲染到的页面组件，从而实现对不同的文档指定不同的渲染模版
- `accessPath`(required): 设置文档页面的访问路径
- `docDirName`(required): 文档根目录
- `docBaseName`(required): 文档相对目录

目录结构

```bash
├── docs
  └── tutorial
      ├── Summary.md
      └── quick-start.md
```

### `docs`的结构控制

文档的结构是通过文档的目录下的`summary.md`解析获得；它的结构来自于[gitbook](https://github.com/GitbookIO/gitbook)的处理方式。按照`offset`来区分`parent-children`的关系；通过`(quick-start.md)`的形式来指定访问`/tutorial/quick-start`路径时应当提供的文档数据。

```shell
* tutorial
  * quick-start(quick-start.md)
```

#### markdown文档格式

如果想要添加文档内容层面的`meta` data;比如说`创建时间`，`描述信息`以及`标题`之类的信息的话，可以通过下面的形式插入到`markdown`文件的开头。

```markdown
---
title: quick start
description: 新手教程
createAt: 2018-04-12
---
```

`---`和`---`之间的键值对会被解析作为`dataSource`中的`meta`对象数据。对于键没有任何的约束处理，开发者可以按照个人的需求填写想要的数据。

```js
site({
  accessPath: '/docs',
  path: '/docs/tutorial',
}).then(data => {
  const { postmeta, manifest, dataSource } = data;
  const { meta, content } = dataSource;
  const { title, description } = meta;
})
```

#### 注意点

- `accessPath`是返回对象数组中各个对象的`主键`，需要和`site`中的参数`accessPath`一致，这样才能够获取关于文档的结构信息`manifest`和文档meta数据`postmeta`.

## FAQ

### 其它静态网站生成工具的对比

- 比较流行的静态网站生成工具，比如[jekyll](https://jekyllrb.com/), [Docusaurus](https://docusaurus.io/)等，支持模版的选择和一定程度上模版自定义实现；但是如果说希望得到更高度化的自定义，都会受到使用模版的样式影响。
- `next-docify`是作为一个模块提供的是渲染数据的抽象。假如说使用的是`Next.js`作为网站的解决方案，渲染文档数据只是它的部分页面，那么就可以通过引入`next-docify`实现文档数据提供的逻辑。

### 针对的用户

- `next-docify`目前主要针对的是前端开发者并且是使用`Next.js`构建的服务。
- 如果说是普通的非前端开发者用户的话，可以通过`create-next-docify-app`按照模版的形式来选择使用自己想要的模版。