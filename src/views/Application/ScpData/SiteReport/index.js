/*
  > Title: Initial file
  > Description: 
  > Author: Iqbal Hossain
  > Date: 2021-10-24
*/

import PageLoader from 'components/PageComponents/PageLoader';
import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router';

const DecokingLaboratoryResult = ({ match }) => {
  const requestedUrl = match.url.replace(/\/$/, '');
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route exact path={`${requestedUrl}`} component={lazy(() => import('./SiteReportTabs'))} />
        <Route exact path={`${requestedUrl}/list`} component={lazy(() => import('./SiteReportTabs'))} />
        <Route exact path={`${requestedUrl}/create`} component={lazy(() => import('./Form/SiteReportCreateForm'))} />
        <Route
          exact
          path={`${requestedUrl}/create-specific`}
          component={lazy(() => import('./Form/SiteReportCreateSpecificForm'))}
        />
        <Route exact path={`${requestedUrl}/edit`} component={lazy(() => import('./Form/SiteReportEditForm'))} />
      </Switch>
    </Suspense>
  );
};

export default DecokingLaboratoryResult;
