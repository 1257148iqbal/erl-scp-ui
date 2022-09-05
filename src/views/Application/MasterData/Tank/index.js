import PageLoader from 'components/PageComponents/PageLoader';
import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router';

const Designation = ({ match }) => {
  const requestedUrl = match.url.replace(/\/$/, '');
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route exact path={`${requestedUrl}`} component={lazy(() => import('./TankTabs'))} />
        <Route exact path={`${requestedUrl}/list`} component={lazy(() => import('./TankTabs'))} />
        <Route exact path={`${requestedUrl}/create`} component={lazy(() => import('./Form/TankCreateForm'))} />
      </Switch>
    </Suspense>
  );
};

export default Designation;
