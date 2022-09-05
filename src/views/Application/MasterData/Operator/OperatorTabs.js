import { CustomTab, Spinner } from 'components/CustomControls';
import PageContainer from 'components/PageComponents/layouts/PageContainer';
import { OPERATORS } from 'constants/permissionsType';
import React from 'react';
import { useSelector } from 'react-redux';
import ActiveOperator from './List/ActiveOperator';
import ArchiveOperator from './List/ArchiveOperator';

const OperatorList = () => {
  //#region Action Button Permission Check
  const { userPermission } = useSelector(({ auth }) => auth);
  //#endregion

  const components = [
    {
      index: 0,
      heading: 'Active',
      component: (
        <React.Fragment>
          <ActiveOperator />
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
          <ArchiveOperator />

          <Spinner />
        </React.Fragment>
      ),

      hasPermission: userPermission?.includes(OPERATORS.ARCHIVE)
    }
  ];
  return (
    <PageContainer heading="Oprators">
      <CustomTab components={components.filter(item => item.hasPermission)} />
    </PageContainer>
  );
};

export default OperatorList;
