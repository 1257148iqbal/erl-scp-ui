/*
  > Title: Initial file
  > Description: 
  > Author: Iqbal Hossain
  > Date: 2021-09-28
*/

import PageLoader from 'components/PageComponents/PageLoader';
import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router';

const LabTest = ({ match }) => {
  const requestedUrl = match.url.replace(/\/$/, '');
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route exact path={`${requestedUrl}`} component={lazy(() => import('./LabTestTabs'))} />
        <Route exact path={`${requestedUrl}/create`} component={lazy(() => import('./Forms/LabTestCreateForm'))} />
        <Route
          exact
          path={`${requestedUrl}/create-specific`}
          component={lazy(() => import('./Forms/LabTestCreateSpecificForm'))}
        />
        <Route exact path={`${requestedUrl}/edit`} component={lazy(() => import('./Forms/LabTestEditForm'))} />
      </Switch>
    </Suspense>
  );
};

export default LabTest;
