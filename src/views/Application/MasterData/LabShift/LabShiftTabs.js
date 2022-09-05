import { CustomTab, Spinner } from 'components/CustomControls';
import PageContainer from 'components/PageComponents/layouts/PageContainer';
import { LAB_SHIFTS } from 'constants/permissionsType';
import React from 'react';
import { useSelector } from 'react-redux';
import ActiveShifts from './List/ActiveLabShifts';
import ArchiveShifts from './List/ArchiveLabShifts';

const LabShifts = () => {
  //#region Action Button Permission Check
  const { userPermission } = useSelector(({ auth }) => auth);
  //#endregion

  const components = [
    {
      index: 0,
      heading: 'Active',
      component: (
        <React.Fragment>
          <ActiveShifts />
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
          <ArchiveShifts />
          <Spinner />
        </React.Fragment>
      ),
      hasPermission: userPermission?.includes(LAB_SHIFTS.ARCHIVE)
    }
  ];
  return (
    <PageContainer heading="Shift">
      <CustomTab components={components.filter(item => item.hasPermission)} />
    </PageContainer>
  );
};

export default LabShifts;
