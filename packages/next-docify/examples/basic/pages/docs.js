import React from 'react';

const getComponent = () => {
  const bundle = require.context('../docs', true, /\.md$/);
};

export default () => <div>hello</div>;

// import site from 'next-docify/site';

// export default class App extends React.Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       content: '',
//     };
//   }
//   componentDidMount() {
//     site({
//       path: '/docs/tutorial/quick-start',
//     }).then(data => {
//       const { dataSource } = data;
//       const { content } = dataSource;
//       this.setState({
//         content,
//       });
//     });
//   }

//   render() {
//     const { content } = this.state;
//     return (
//       <div
//         dangerouslySetInnerHTML={{
//           __html: content,
//         }}
//       />
//     );
//   }
// }
