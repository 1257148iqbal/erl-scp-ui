import { CustomTab, Spinner } from 'components/CustomControls';
import React from 'react';
import DailyDataSheetActiveSettings from './list/ActiveDailyDataSheetSetting';
import DailyDataSheetArchiveSettings from './list/ArchiveDailyDataSheetSetting';

const DailyDataSheetSettingList = props => {
  const components = [
    {
      index: 0,
      heading: 'Active',
      component: (
        <React.Fragment>
          <DailyDataSheetActiveSettings {...props} />
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
          <DailyDataSheetArchiveSettings {...props} />
          <Spinner />
        </React.Fragment>
      ),
      hasPermission: true
    }
  ];
  return <CustomTab components={components.filter(item => item.hasPermission)} />;
};

export default DailyDataSheetSettingList;
