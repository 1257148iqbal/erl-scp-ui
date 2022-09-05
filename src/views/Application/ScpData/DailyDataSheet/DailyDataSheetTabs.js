/**
 * Title: Daily data sheet tabs
 * Description:
 * Author: N/A
 * Date: N/A
 * Modified: 26-February-2022
 **/

import { CustomTab, Spinner } from 'components/CustomControls';
import PageContainer from 'components/PageComponents/layouts/PageContainer';
import { LAB_SHIFTS } from 'constants/permissionsType';
import React from 'react';
import { useSelector } from 'react-redux';
import ArchiveDailyDataSheetList from './List/ArchiveDailyDataSheetList';
import HistoryDailyDataSheetList from './List/HistoryDailyDataSheetList';
import RegularDailyDataSheetList from './List/RegularDailyDataSheetList';

const DailyDataSheetTabs = () => {
  //#region Action Button Permission Check
  const { userPermission } = useSelector(({ auth }) => auth);
  //#endregion

  const components = [
    {
      index: 0,
      heading: 'Regular',
      component: (
        <React.Fragment>
          <RegularDailyDataSheetList />
          <Spinner />
        </React.Fragment>
      ),
      hasPermission: true
    },
    {
      index: 1,
      heading: 'History',
      component: (
        <React.Fragment>
          <HistoryDailyDataSheetList />
          <Spinner />
        </React.Fragment>
      ),
      hasPermission: true
    },
    {
      index: 2,
      heading: 'Archive',
      component: (
        <React.Fragment>
          <ArchiveDailyDataSheetList />
          <Spinner />
        </React.Fragment>
      ),
      hasPermission: userPermission?.includes(LAB_SHIFTS.ARCHIVE)
    }
  ];
  return (
    <PageContainer heading="Daily Data Sheet">
      <CustomTab components={components.filter(item => item.hasPermission)} />
    </PageContainer>
  );
};

export default DailyDataSheetTabs;

/** Change Log
 * 26-Feb-2022 (nasir) : Tabs modify with regular,history and archive
 **/
