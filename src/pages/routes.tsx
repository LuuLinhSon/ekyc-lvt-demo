import React, { Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import withLayout from '../components/layout/withLayout';
import ServiceLayout from '../components/layout/ServiceLayout/ServiceLayout';
import AnonymousUserLayout from '../components/layout/AnonymousUserLayout/AnonymousUserLayout';
import Spinner from 'components/spinner/Spinner';
import { ToastContainer } from 'react-toastify';
// import { positions, Provider } from 'react-alert';
// import AlertTemplate from 'react-alert-template-basic';
import RoutesString, { Pages } from './routesString';
import PrivateRoute from './privateRoute';
import LoadingContainer from './loadingContainer';
import { DURATION,  POSITION } from 'constants/enum';

const Routes: React.FC = (): JSX.Element => {
  return (
    <div>
      <LoadingContainer />
      <ToastContainer
        position={POSITION.TOP_CENTER}
        autoClose={DURATION.TOAST}
        hideProgressBar={false}
        closeButton
        closeOnClick
        pauseOnHover
        draggable={false}
        limit={1}
        style={{ height: 30 }}
      />
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
        <Route
          path={RoutesString.OrcFace}
          exact={true}
          component={withLayout(ServiceLayout, () => (
            <Suspense fallback={<Spinner />}>
              <Pages.OrcFace />
            </Suspense>
          ))}
        />
        <Route
          path={RoutesString.FaceCompare}
          exact={true}
          component={withLayout(ServiceLayout, () => (
            <Suspense fallback={<Spinner />}>
              <Pages.FaceCompare />
            </Suspense>
          ))}
        />
        <PrivateRoute path={RoutesString.StepTwo} exact={true} component={Pages.StepTwo} />
        <PrivateRoute path={RoutesString.StepTwoTwo} exact={true} component={Pages.StepTwoTwo} />
        <PrivateRoute path={RoutesString.StepTwoThree} exact={true} component={Pages.StepTwoThree} />
        <PrivateRoute path={RoutesString.StepEditKYC} exact={true} component={Pages.StepEditKYC} />
        <PrivateRoute path={RoutesString.StepThreeOne} exact={true} component={Pages.StepThreeOne} />
        <PrivateRoute path={RoutesString.StepTreeTwo} exact={true} component={Pages.StepThreeTwo} />
        <PrivateRoute path={RoutesString.StepFour} exact={true} component={Pages.StepFour} />
      </Switch>
    </div>
  );
};

export default Routes;
