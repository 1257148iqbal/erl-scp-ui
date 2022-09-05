/*
  > Title: Initial file
  > Description: 
  > Author: Iqbal Hossain
  > Date: 2021-10-09
*/

import PageLoader from 'components/PageComponents/PageLoader';
import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router';

const DecokingLogSheet = ({ match }) => {
  const requestedUrl = match.url.replace(/\/$/, '');
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route exact path={`${requestedUrl}`} component={lazy(() => import('./DecokingLogSheetTabs'))} />
        <Route exact path={`${requestedUrl}/list`} component={lazy(() => import('./List/RegularDecokingLogSheetList'))} />
        <Route exact path={`${requestedUrl}/create`} component={lazy(() => import('./Form/DecokingLogSheetCreateForm'))} />
        <Route exact path={`${requestedUrl}/edit`} component={lazy(() => import('./Form/DecokingLogSheetEditForm'))} />
      </Switch>
    </Suspense>
  );
};

export default DecokingLogSheet;
