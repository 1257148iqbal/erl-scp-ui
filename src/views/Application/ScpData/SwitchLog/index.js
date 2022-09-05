/*
  > Title: Initial file
  > Description: 
  > Author: Nasir Ahmed
  > Date: 2021-08-08
*/

import PageLoader from 'components/PageComponents/PageLoader';
import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router';

const SwitchLog = ({ match }) => {
  const requestedUrl = match.url.replace(/\/$/, '');
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route exact path={`${requestedUrl}`} component={lazy(() => import('./SwitchLogTabs'))} />
        <Route exact path={`${requestedUrl}/list`} component={lazy(() => import('./SwitchLogTabs'))} />
        <Route exact path={`${requestedUrl}/create`} component={lazy(() => import('./Forms/SwitchLogCreateForm'))} />
        <Route
          exact
          path={`${requestedUrl}/create-specific`}
          component={lazy(() => import('./Forms/SwitchLogSpecificForm'))}
        />
        <Route exact path={`${requestedUrl}/edit`} component={lazy(() => import('./Forms/SwitchLogEditForm'))} />
        <Route exact path={`${requestedUrl}/view`} component={lazy(() => import('./Forms/SwitchLogViewForm'))} />
      </Switch>
    </Suspense>
  );
};

export default SwitchLog;
