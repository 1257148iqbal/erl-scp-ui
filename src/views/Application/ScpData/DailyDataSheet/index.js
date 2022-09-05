/*
  > Title: Initial file
  > Description: 
  > Author: Iqbal Hossain
  > Date: 2021-10-24
*/

import PageLoader from 'components/PageComponents/PageLoader';
import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router';

const DailyDataSheet = ({ match }) => {
  const requestedUrl = match.url.replace(/\/$/, '');
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route exact path={`${requestedUrl}`} component={lazy(() => import('./DailyDataSheetTabs'))} />
        <Route exact path={`${requestedUrl}/create`} component={lazy(() => import('./Form/DailyDataSheetCreateForm'))} />
        <Route
          exact
          path={`${requestedUrl}/create-specific`}
          component={lazy(() => import('./Form/DailyDataSheetCreateSpecificForm'))}
        />
        <Route exact path={`${requestedUrl}/edit`} component={lazy(() => import('./Form/DailyDataSheetEditForm'))} />
      </Switch>
    </Suspense>
  );
};

export default DailyDataSheet;
