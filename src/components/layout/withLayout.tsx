import React from 'react';
import { RouteProps } from 'react-router-dom';

const withLayout = (Layout: React.FC, Component: React.FC) => (props: RouteProps) => (
  <Layout>
    <Component {...props} />
  </Layout>
);

export default withLayout;
