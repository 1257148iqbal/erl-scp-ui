/*
  > Title: Initial file
  > Description: 
  > Author: Nasir Ahmed
  > Date: 2021-08-08
*/

import PageLoader from 'components/PageComponents/PageLoader';
import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router';

const LogSheet = ({ match }) => {
  const requestedUrl = match.url.replace(/\/$/, '');

  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route exact path={`${requestedUrl}/:operationGroup`} component={lazy(() => import('./LogSheeTabs'))} />
        <Route exact path={`${requestedUrl}/list/:operationGroup`} component={lazy(() => import('./LogSheeTabs'))} />
        <Route
          exact
          path={`${requestedUrl}/:operationGroup/create`}
          component={lazy(() => import('./Forms/LogSheetCreateForm'))}
        />
        <Route
          exact
          path={`${requestedUrl}/:operationGroup/create-specific`}
          component={lazy(() => import('./Forms/LogSheetSpecificForm'))}
        />
        <Route
          exact
          path={`${requestedUrl}/:operationGroup/edit`}
          component={lazy(() => import('./Forms/LogSheetEditForm'))}
        />
      </Switch>
    </Suspense>
  );
};

export default LogSheet;
