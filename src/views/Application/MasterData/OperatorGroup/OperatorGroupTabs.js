import { CustomTab, Spinner } from 'components/CustomControls';
import PageContainer from 'components/PageComponents/layouts/PageContainer';
import { OPERATOR_GROUPS } from 'constants/permissionsType';
import React from 'react';
import { useSelector } from 'react-redux';
import ActiveOperatorGroups from './List/ActiveOperatorGroups';
import ArchiveOperatorGroups from './List/ArchiveOperatorGroups';

const OperatorGroupList = () => {
  //#region Action Button Permission Check
  const { userPermission } = useSelector(({ auth }) => auth);
  //#endregion

  const components = [
    {
      index: 0,
      heading: 'Active',
      component: (
        <React.Fragment>
          <ActiveOperatorGroups />
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
          <ArchiveOperatorGroups />
          <Spinner />
        </React.Fragment>
      ),
      hasPermission: userPermission?.includes(OPERATOR_GROUPS.ARCHIVE)
    }
  ];
  return (
    <PageContainer heading="Operator Groups">
      <CustomTab components={components.filter(item => item.hasPermission)} />
    </PageContainer>
  );
};

export default OperatorGroupList;
