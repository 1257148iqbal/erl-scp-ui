/*
  > Title: Site Report Settings
  > Description: 
  > Author: Iqbal Hossain
  > Date: 2021-10-30
*/

import PageLoader from 'components/PageComponents/PageLoader';
import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router';

const ShiftReportSettings = ({ match }) => {
  const requestedUrl = match.url.replace(/\/$/, '');
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route exact path={`${requestedUrl}`} component={lazy(() => import('./ShiftReportSettingTabs'))} />
        <Route
          exact
          path={`${requestedUrl}/create`}
          component={lazy(() => import('./form/ShiftReportSettingsCreateForm'))}
        />
        <Route exact path={`${requestedUrl}/edit`} component={lazy(() => import('./form/ShiftReportSettingEditForm'))} />
      </Switch>
    </Suspense>
  );
};

export default ShiftReportSettings;
