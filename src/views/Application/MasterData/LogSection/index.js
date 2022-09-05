import PageLoader from 'components/PageComponents/PageLoader';
import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router';

const Section = ({ match }) => {
  const requestedUrl = match.url.replace(/\/$/, '');
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route exact path={`${requestedUrl}`} component={lazy(() => import('./LogSectionTabs'))} />
        <Route exact path={`${requestedUrl}/list`} component={lazy(() => import('./LogSectionTabs'))} />
      </Switch>
    </Suspense>
  );
};

export default Section;
