/*
  > Title: Entry page for Shift
  > Description: This file invoked first when '/shift' hitted
  > Author: Nasir Ahmed
  > Date: 2021-07-07
*/

import PageLoader from 'components/PageComponents/PageLoader';
import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router';

const Factor = ({ match }) => {
  const requestedUrl = match.url.replace(/\/$/, '');
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route exact path={`${requestedUrl}`} component={lazy(() => import('./FactorTabs'))} />
        <Route exact path={`${requestedUrl}/list`} component={lazy(() => import('./FactorTabs'))} />
        <Route exact path={`${requestedUrl}/create`} component={lazy(() => import('./FactorForm'))} />
      </Switch>
    </Suspense>
  );
};

export default Factor;
