import { CustomTab, Spinner } from 'components/CustomControls';
import React from 'react';
import ActiveShiftReportSettingList from './list/ActiveShiftReportSettingList';
import ArchiveShiftReportSettingList from './list/ArchiveShiftReportSettingList';

const ShiftReportSettingTabs = props => {
  const components = [
    {
      index: 0,
      heading: 'Active',
      component: (
        <React.Fragment>
          <ActiveShiftReportSettingList {...props} />
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
          <ArchiveShiftReportSettingList {...props} />
          <Spinner />
        </React.Fragment>
      ),
      hasPermission: true
    }
  ];
  return <CustomTab components={components.filter(item => item.hasPermission)} />;
};

export default ShiftReportSettingTabs;
