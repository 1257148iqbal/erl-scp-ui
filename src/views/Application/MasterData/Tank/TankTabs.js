import { CustomTab, Spinner } from 'components/CustomControls';
import PageContainer from 'components/PageComponents/layouts/PageContainer';
import { TANKS } from 'constants/permissionsType';
import React from 'react';
import { useSelector } from 'react-redux';
import ActiveTankList from './List/ActiveTankList';
import ArchiveTankList from './List/ArchiveTankList';

const DesignationList = () => {
  //#region Action Button Permission Check
  const { userPermission } = useSelector(({ auth }) => auth);
  //#endregion

  const components = [
    {
      index: 0,
      heading: 'Active',

      component: (
        <React.Fragment>
          <ActiveTankList />
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
          <ArchiveTankList />
          <Spinner />
        </React.Fragment>
      ),
      hasPermission: userPermission?.includes(TANKS.ARCHIVE)
    }
  ];
  return (
    <PageContainer heading="Tank">
      <CustomTab components={components.filter(item => item.hasPermission)} />
    </PageContainer>
  );
};

export default DesignationList;
