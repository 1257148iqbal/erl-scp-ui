/*
  > Title: Initial file
  > Description: 
  > Author: Nasir Ahmed
  > Date: 2021-08-08
*/

import PageLoader from 'components/PageComponents/PageLoader';
import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router';

const Roles = ({ match }) => {
  const requestedUrl = match.url.replace(/\/$/, '');
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route exact path={`${requestedUrl}`} component={lazy(() => import('./RoleList'))} />
        <Route exact path={`${requestedUrl}/list`} component={lazy(() => import('./RoleList'))} />
      </Switch>
    </Suspense>
  );
};

export default Roles;
