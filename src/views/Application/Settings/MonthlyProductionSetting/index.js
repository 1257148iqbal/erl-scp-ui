/*
  > Title: Initial file
  > Description: 
  > Author: Iqbal Hossain
  > Date: 2021-10-02
*/

import PageLoader from 'components/PageComponents/PageLoader';
import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router';

const DataSheetSettings = ({ match }) => {
  const requestedUrl = match.url.replace(/\/$/, '');
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route exact path={`${requestedUrl}`} component={lazy(() => import('./list/ActiveMonthlyProductionSetting'))} />
        <Route
          exact
          path={`${requestedUrl}/edit`}
          component={lazy(() => import('./form/MonthlyProductionSettingEditForm'))}
        />
      </Switch>
    </Suspense>
  );
};

export default DataSheetSettings;
