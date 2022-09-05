import { CustomTab, Spinner } from 'components/CustomControls';
import PageContainer from 'components/PageComponents/layouts/PageContainer';
import { OPERATION_GROUPS } from 'constants/permissionsType';
import React from 'react';
import { useSelector } from 'react-redux';
import ActiveOperationGroups from './List/ActiveOperationGroups';
import ArchiveOperationGroups from './List/ArchiveOperationGroups';

const OperationGroupsList = () => {
  //#region Action Button Permission Check
  const { userPermission } = useSelector(({ auth }) => auth);
  //#endregion

  const components = [
    {
      index: 0,
      heading: 'Active',
      component: (
        <React.Fragment>
          <ActiveOperationGroups />
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
          <ArchiveOperationGroups />
          <Spinner />
        </React.Fragment>
      ),
      hasPermission: userPermission?.includes(OPERATION_GROUPS.ARCHIVE)
    }
  ];
  return (
    <PageContainer heading="Operation Groups">
      <CustomTab components={components.filter(item => item.hasPermission)} />
    </PageContainer>
  );
};

export default OperationGroupsList;
