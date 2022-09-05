import PageLoader from 'components/PageComponents/PageLoader';
import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router';

const Users = ({ match }) => {
  const requestedUrl = match.url.replace(/\/$/, '');
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route exact path={`${requestedUrl}`} component={lazy(() => import('./UserTabs'))} />
        <Route exact path={`${requestedUrl}/list`} component={lazy(() => import('./UserTabs'))} />
      </Switch>
    </Suspense>
  );
};

export default Users;
