import PageLoader from 'components/PageComponents/PageLoader';
import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router';

const TimeSlot = ({ match }) => {
  const requestedUrl = match.url.replace(/\/$/, '');
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route exact path={`${requestedUrl}`} component={lazy(() => import('./TimeSlotTabs'))} />
        <Route exact path={`${requestedUrl}/list`} component={lazy(() => import('./TimeSlotTabs'))} />
      </Switch>
    </Suspense>
  );
};

export default TimeSlot;
