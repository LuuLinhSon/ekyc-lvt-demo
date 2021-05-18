import React, { Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import withLayout from '../components/layout/withLayout';
import AnonymousUserLayout from '../components/layout/AnonymousUserLayout/AnonymousUserLayout';
import Spinner from 'components/spinner/Spinner';
import RoutesString, { Pages } from './routesString';
import PrivateRoute from './privateRoute';

const Routes: React.FC = (): JSX.Element => {
  return (
    <Switch>
      <Route
        path={RoutesString.StepOne}
        exact={true}
        component={withLayout(AnonymousUserLayout, () => (
          <Suspense fallback={<Spinner />}>
            <Pages.StepOne />
          </Suspense>
        ))}
      />
      <PrivateRoute path={RoutesString.StepTwo} exact={true} component={Pages.StepTwo} />
      <PrivateRoute path={RoutesString.StepTwoTwo} exact={true} component={Pages.StepTwoTwo} />
      <PrivateRoute path={RoutesString.StepTwoThree} exact={true} component={Pages.StepTwoThree} />
      <PrivateRoute path={RoutesString.StepThreeOne} exact={true} component={Pages.StepThreeOne} />
      <PrivateRoute path={RoutesString.StepTreeTwo} exact={true} component={Pages.StepThreeTwo} />
      <PrivateRoute path={RoutesString.StepThreeThree} exact={true} component={Pages.StepThreeThree} />
    </Switch>
  );
};

export default Routes;
