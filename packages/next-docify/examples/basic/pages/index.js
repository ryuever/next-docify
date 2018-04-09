import React from 'react';

const bundle = require.context('../docs', true, /\.md$/);

const App = () => <div>Next-docify template</div>;

export default App;
