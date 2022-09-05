/*
  > Title: Initial file
  > Description: 
  > Author: Iqbal Hossain
  > Date: 2021-10-14
*/

import PageLoader from 'components/PageComponents/PageLoader';
import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router';

const DecokingLaboratoryResult = ({ match }) => {
  const requestedUrl = match.url.replace(/\/$/, '');
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route exact path={`${requestedUrl}`} component={lazy(() => import('./DecokingLaboratoryTabs'))} />
        <Route exact path={`${requestedUrl}/list`} component={lazy(() => import('./DecokingLaboratoryTabs'))} />
        <Route exact path={`${requestedUrl}/create`} component={lazy(() => import('./Forms/DecokingLaboratoryForm'))} />
      </Switch>
    </Suspense>
  );
};

export default DecokingLaboratoryResult;
