import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
// import { defaults } from 'react-sweet-state';
import { QueryParamProvider } from 'use-query-params';
import App from './App';
import './styles/custom.scss';

// if (process.env.NODE_ENV === 'development') {
//   defaults.devtools = true;
//   const whyDidYouRender = require('@welldone-software/why-did-you-render');
//   whyDidYouRender(React, {
//     trackAllPureComponents: false,
//   });
// }

export default ReactDOM.render(
  <Router>
    <QueryParamProvider ReactRouterRoute={Route}>
      <App />
    </QueryParamProvider>
  </Router>,
  document.getElementById('root'),
);
