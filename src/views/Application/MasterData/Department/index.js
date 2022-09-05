/*
  > Title: Entry page for Operator Group
  > Description: This file invoked first when '/operator-group' hitted
  > Author: Nasir Ahmed
  > Date: 2021-07-07
*/

import PageLoader from 'components/PageComponents/PageLoader';
import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router';

const Department = ({ match }) => {
  const requestedUrl = match.url.replace(/\/$/, '');
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route exact path={`${requestedUrl}`} component={lazy(() => import('./DepartmentTabs'))} />
        <Route exact path={`${requestedUrl}/list`} component={lazy(() => import('./DepartmentTabs'))} />
      </Switch>
    </Suspense>
  );
};

export default Department;
