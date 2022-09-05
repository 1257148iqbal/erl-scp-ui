import { CustomTab, Spinner } from 'components/CustomControls';
import PageContainer from 'components/PageComponents/layouts/PageContainer';
import { UNITS } from 'constants/permissionsType';
import React from 'react';
import { useSelector } from 'react-redux';
import ActiveUnit from './List/ActiveLogUnit';
import ArchiveUnit from './List/ArchiveLogUnit';

const UnitList = () => {
  //#region Action Button Permission Check
  const { userPermission } = useSelector(({ auth }) => auth);
  //#endregion

  const components = [
    {
      index: 0,
      heading: 'Active',
      component: (
        <React.Fragment>
          <ActiveUnit />
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
          <ArchiveUnit />
          <Spinner />
        </React.Fragment>
      ),
      hasPermission: userPermission?.includes(UNITS.ARCHIVE)
    }
  ];
  return (
    <PageContainer heading="Units">
      <CustomTab components={components.filter(item => item.hasPermission)} />
    </PageContainer>
  );
};

export default UnitList;
