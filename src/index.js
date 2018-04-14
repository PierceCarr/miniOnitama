import React from 'react';
import ReactDOM from 'react-dom';
import Menu from './onitama/menu.js';
// import Portfolio from './portfolio/portfolio.js';
import './index.css';
// import Game from './onitama/onitama.js';
// import Keys from './keys.js';
// import TestButton from './test.js';
// import GameTest from './onitest.js';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Menu />, document.getElementById('root'));
registerServiceWorker();
