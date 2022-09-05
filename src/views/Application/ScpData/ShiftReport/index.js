/*
  > Title: Initial file
  > Description: 
  > Author: Iqbal Hossain
  > Date: 2021-10-30
*/

import PageLoader from 'components/PageComponents/PageLoader';
import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router';

const ShiftReports = ({ match }) => {
  const requestedUrl = match.url.replace(/\/$/, '');

  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route exact path={`${requestedUrl}`} component={lazy(() => import('./ShiftReportTabs'))} />
        <Route exact path={`${requestedUrl}/create`} component={lazy(() => import('./Form/ShiftReportCreateForm'))} />
        <Route
          exact
          path={`${requestedUrl}/create-specific`}
          component={lazy(() => import('./Form/ShiftReportCreateSpecificForm'))}
        />
        <Route exact path={`${requestedUrl}/edit`} component={lazy(() => import('./Form/ShiftReportEditForm'))} />
      </Switch>
    </Suspense>
  );
};

export default ShiftReports;
