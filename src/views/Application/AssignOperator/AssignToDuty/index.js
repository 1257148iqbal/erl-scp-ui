import PageLoader from 'components/PageComponents/PageLoader';
import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router';

const AssignGroup = ({ match }) => {
  const requestedUrl = match.url.replace(/\/$/, '');
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route exact path={`${requestedUrl}`} component={lazy(() => import('./AssignToDutyTab'))} />
        <Route exact path={`${requestedUrl}/create`} component={lazy(() => import('./Fomrs/AssingToDutyCreateForm'))} />
        <Route
          exact
          path={`${requestedUrl}/create-specific`}
          component={lazy(() => import('./Fomrs/AssingToDutyCreateSpecificForm'))}
        />
        <Route exact path={`${requestedUrl}/edit`} component={lazy(() => import('./Fomrs/AssingToDutyEditForm'))} />
      </Switch>
    </Suspense>
  );
};

export default AssignGroup;
