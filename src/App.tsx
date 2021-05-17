import React from 'react';
import Routes from 'pages/routes';
import withAuthPersist from 'stores/AuthenticationStore/withAuthPersist';
import '../src/stores/middlewares/logger';
import '../src/stores/middlewares/persistent';

export const App: React.FC = () => {
  return <Routes />;
};

export default withAuthPersist(App);
