# next-docify

`next-docify` is a monorepo, which mainly consists of following package :

- `next-docify` : A static site generator intergrated with [next.js](https://github.com/zeit/next.js/) seamlessly. `next.js` is an amazing React `ssr` resolution and support page render HMR. It almost satisfy any requirement to create a single page. So for the question, what does this project settle down. In short it provides an abstraction of `markdown` files data, and let you can import these `meta` data and `source content` data. So make it clear, it only acts as an data provider, the `UI` elements is not its business. If you perfer with `theme/template` supplement, like [jekyll](https://jekyllrb.com/), you can continue to reading and would find a reasonable answer.

- `create-next-docify-app`: It highly inspired by [create-react-app](https://github.com/facebook/create-react-app) and [create-next-app](https://github.com/segmentio/create-next-app). As the name means, it give you a method to create your own `doc site` quickly. Through, the commnd line, you can choose the prefer `template` to install and you can also create your own `template` under very little constraints.

[中文README](README-zh_CN.md)