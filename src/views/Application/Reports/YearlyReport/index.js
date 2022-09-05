/*
  > Title: Initial file
  > Description: Iqbal Hossain
  > Date: 2021-07-19
*/

import PageLoader from 'components/PageComponents/PageLoader';
import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router';

const YearlyReports = ({ match }) => {
  const requestedUrl = match.url.replace(/\/$/, '');
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route exact path={`${requestedUrl}/yearly-report`} component={lazy(() => import('./YearlyReport'))} />
      </Switch>
    </Suspense>
  );
};

export default YearlyReports;
