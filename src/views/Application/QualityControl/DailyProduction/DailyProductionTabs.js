import { CustomTab, Spinner } from 'components/CustomControls';
import PageContainer from 'components/PageComponents/layouts/PageContainer';
import { LAB_SHIFTS } from 'constants/permissionsType';
import React from 'react';
import { useSelector } from 'react-redux';
import ActiveDailyProductionList from './List/ActiveDailyProductionList';
import ArchiveDailyProductionList from './List/ArchiveDailyProductionList';

const DailyProductionTabs = () => {
  //#region Action Button Permission Check
  const { userPermission } = useSelector(({ auth }) => auth);
  //#endregion

  const components = [
    {
      index: 0,
      heading: 'Active',
      component: (
        <React.Fragment>
          <ActiveDailyProductionList />
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
          <ArchiveDailyProductionList />
          <Spinner />
        </React.Fragment>
      ),
      hasPermission: userPermission?.includes(LAB_SHIFTS.ARCHIVE)
    }
  ];
  return (
    <PageContainer heading="Daily Production">
      <CustomTab components={components.filter(item => item.hasPermission)} />
    </PageContainer>
  );
};

export default DailyProductionTabs;
