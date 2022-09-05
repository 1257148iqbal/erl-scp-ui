/*
  > Title: Entry page for Shift
  > Description: This file invoked first when '/shift' hitted
  > Author: Nasir Ahmed
  > Date: 2021-07-07
*/

import PageLoader from 'components/PageComponents/PageLoader';
import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router';

const Shift = ({ match }) => {
  const requestedUrl = match.url.replace(/\/$/, '');
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route exact path={`${requestedUrl}`} component={lazy(() => import('./LogShiftTabs'))} />
        <Route exact path={`${requestedUrl}/list`} component={lazy(() => import('./LogShiftTabs'))} />
      </Switch>
    </Suspense>
  );
};

export default Shift;
