import { CustomTab, Spinner } from 'components/CustomControls';
import PageContainer from 'components/PageComponents/layouts/PageContainer';
import React from 'react';
import ActiveUser from './list/ActiveUser';
import ArchiveUser from './list/ArchiveUser';

const UserList = props => {
  const components = [
    {
      index: 0,
      heading: 'Active',
      component: (
        <React.Fragment>
          <ActiveUser {...props} />
          <Spinner />
        </React.Fragment>
      ),
      hasPermission: true
    },
    {
      index: 1,
      heading: 'Archive',
      component: (
        <React.Fragment>
          <ArchiveUser {...props} />
          <Spinner />
        </React.Fragment>
      ),
      hasPermission: true
    }
  ];
  return (
    <PageContainer heading="Users">
      <CustomTab components={components.filter(item => item.hasPermission)} />
    </PageContainer>
  );
};

export default UserList;
