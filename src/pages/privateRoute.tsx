import React, { Suspense } from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import RoutesString from './routesString';
import LoggedInLayout from '../components/layout/LoggedInLayout/LoggedInLayout';
import Spinner from 'components/spinner/Spinner';
import useAuthentication from 'stores/AuthenticationStore/authentication';
interface IProps {
  component: React.FC;
  path: string;
  exact?: boolean;
  pageName?: string;
  title?: string;
}

const renderRoute = (Component: React.FC) => (props: RouteProps) => {
  return (
    <Suspense fallback={<Spinner />}>
      <Component {...props} />
    </Suspense>
  );
};

const PrivateRoute: React.FC<IProps & RouteProps> = ({ component, ...rest }) => {
  const Layout = LoggedInLayout;
  const [state] = useAuthentication();

  if (!state.loggedIn) {
    return (
      <Redirect
        to={{
          pathname: RoutesString.StepOne,
          state: { from: rest.location?.pathname },
        }}
      />
    );
  }

  if (state.loggedIn) {
    return (
      <Layout>
        <Route {...rest} render={renderRoute(component)} />
      </Layout>
    );
  }

  return <Redirect to={{ pathname: RoutesString.AccessDenied, state: { from: '' } }} />;
};

export default PrivateRoute;
