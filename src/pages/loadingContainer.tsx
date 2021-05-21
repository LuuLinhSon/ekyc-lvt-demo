import React from 'react';

import LoadingBar from '../components/loadingBar/LoadingBar';
import { useStoreAPI } from '../api/storeAPI';

const LoadingContainer: React.FC = () => {
  const [state] = useStoreAPI();

  return <>{state.fetching && <LoadingBar />}</>;
};

export default LoadingContainer;
