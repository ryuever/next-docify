# next-docify

`next-docify`是一些仓库的集合，其中主要包含下面几部分

- `next-docify`力求能够无缝衔接`next.js`以实现静态网站的构建。[next.js](https://github.com/zeit/next.js/)提供了针对React的`ssr`最佳解决方案并且包含热更新等一系列比较吸引人的利好。现在静态网站生成的工具是比较多的，比如[jekyll](https://jekyllrb.com/), [Docusaurus](https://docusaurus.io/)等，他们确实提供了很多模版，然后也可以让你在一定程度上书写模版；也就是他们总是会有约束，尤其是在牵涉到自定义话模版的时候，你会受到他们一些提供的样式的影响；并且还有一个问题，他们都是一个个的项目，不能够融合到我们自己的项目中；比如说我现在只是让项目的其中两个页面中的一部分是显示文档内容，其它比如`Header`, `Footer`都是使用自己原有的页面，这个时候其实`jekyll` 和`docusaurus`是没有办法整合进来的。而现在`next-docify`就是来解决这种场景问题；它只是提供数据层面的抽象，只有`metadata`和`content`这两类的数据，不会牵涉到任何UI的部分；然后有因为它无缝整合`next.js`，所以假如说`next.js`正好符合框架设定，然后同时需要支持解析`markdown`，并且包含各个文件的层级结构的话，可以通过引入`next-docify`这个模块，然后做些许改动就可以实现动态的`按需加载`相应的文档数据。