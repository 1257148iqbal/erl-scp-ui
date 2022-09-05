/*
  > Title: Log Sheet Report
  > Description: 
  > Author: Iqbal Hossain
  > Date: 2021-11-18
*/

import PageLoader from 'components/PageComponents/PageLoader';
import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router';

const LogSheetReports = ({ match }) => {
  const requestedUrl = match.url.replace(/\/$/, '');
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route exact path={`${requestedUrl}/logs-sheet-report`} component={lazy(() => import('./LogSheetReports'))} />
      </Switch>
    </Suspense>
  );
};

export default LogSheetReports;
