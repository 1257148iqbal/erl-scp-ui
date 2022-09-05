/*
  > Title: Initial file
  > Description: 
  > Author: Nasir Ahmed
  > Date: 2021-09-21
*/

import PageLoader from 'components/PageComponents/PageLoader';
import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router';

const DataSheetSettings = ({ match }) => {
  const requestedUrl = match.url.replace(/\/$/, '');
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route exact path={`${requestedUrl}`} component={lazy(() => import('./DailyDataSheetSettingTabs'))} />
        <Route
          exact
          path={`${requestedUrl}/create`}
          component={lazy(() => import('./form/DailyDataSheetSettingsCreateForm'))}
        />
        <Route exact path={`${requestedUrl}/edit`} component={lazy(() => import('./form/DailyDataSheetSettingsEditForm'))} />
      </Switch>
    </Suspense>
  );
};

export default DataSheetSettings;
