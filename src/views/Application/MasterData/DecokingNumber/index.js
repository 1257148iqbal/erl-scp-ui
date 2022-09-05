import PageLoader from 'components/PageComponents/PageLoader';
import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router';

const DockingLogSheet = ({ match }) => {
  const requestedUrl = match.url.replace(/\/$/, '');
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route exact path={`${requestedUrl}`} component={lazy(() => import('./DecokingNumbersTabs'))} />
        <Route exact path={`${requestedUrl}/list`} component={lazy(() => import('./DecokingNumbersTabs'))} />
      </Switch>
    </Suspense>
  );
};

export default DockingLogSheet;
