import { CustomTab, Spinner } from 'components/CustomControls';
import PageContainer from 'components/PageComponents/layouts/PageContainer';
import { TIME_SLOTS } from 'constants/permissionsType';
import React from 'react';
import { useSelector } from 'react-redux';
import ActiveTimeSlots from './List/ActiveTimeSlots';
import ArchiveTimeSlots from './List/ArchiveTimeSlots';

const TimeSlotsList = () => {
  //#region Action Button Permission Check
  const { userPermission } = useSelector(({ auth }) => auth);
  //#endregion

  const components = [
    {
      index: 0,
      heading: 'Active',
      component: (
        <React.Fragment>
          <ActiveTimeSlots />
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
          <ArchiveTimeSlots />
          <Spinner />
        </React.Fragment>
      ),
      hasPermission: userPermission?.includes(TIME_SLOTS.ARCHIVE)
    }
  ];

  return (
    <PageContainer heading="Time Slots">
      <CustomTab components={components.filter(item => item.hasPermission)} />
    </PageContainer>
  );
};

export default TimeSlotsList;
