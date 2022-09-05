import PageLoader from 'components/PageComponents/PageLoader';
import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router';

const Operator = ({ match }) => {
  const requestedUrl = match.url.replace(/\/$/, '');
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route exact path={`${requestedUrl}`} component={lazy(() => import('./OperatorTabs'))} />
        <Route exact path={`${requestedUrl}/list`} component={lazy(() => import('./OperatorTabs'))} />
      </Switch>
    </Suspense>
  );
};

export default Operator;
