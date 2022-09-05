/*
  > Title: Decoking Report
  > Description: 
  > Author: Iqbal Hossain
  > Date: 2022-06-14
*/

import PageLoader from 'components/PageComponents/PageLoader';
import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router';

const DecokingReport = ({ match }) => {
  const requestedUrl = match.url.replace(/\/$/, '');
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route exact path={`${requestedUrl}`} component={lazy(() => import('./DecokingReport'))} />
      </Switch>
    </Suspense>
  );
};

export default DecokingReport;
