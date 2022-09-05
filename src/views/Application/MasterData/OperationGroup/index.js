import PageLoader from 'components/PageComponents/PageLoader';
import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router';

const OperatorGroup = ({ match }) => {
  const requestedUrl = match.url.replace(/\/$/, '');
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route exact path={`${requestedUrl}`} component={lazy(() => import('./OperationGroupTabs'))} />
        <Route exact path={`${requestedUrl}/list`} component={lazy(() => import('./OperationGroupTabs'))} />
      </Switch>
    </Suspense>
  );
};

export default OperatorGroup;
