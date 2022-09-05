import { CustomTab, Spinner } from 'components/CustomControls';
import React from 'react';
import ActiveSiteReportSetting from './list/ActiveSiteReportSetting';
import ArchiveSiteReportSetting from './list/ArchiveSiteReportSetting';

const SiteReportSettingTabs = props => {
  const components = [
    {
      index: 0,
      heading: 'Active',
      component: (
        <React.Fragment>
          <ActiveSiteReportSetting {...props} />
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
          <ArchiveSiteReportSetting {...props} />
          <Spinner />
        </React.Fragment>
      ),
      hasPermission: true
    }
  ];
  return <CustomTab components={components.filter(item => item.hasPermission)} />;
};

export default SiteReportSettingTabs;
