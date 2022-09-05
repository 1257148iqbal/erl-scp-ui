import { CustomTab, Spinner } from 'components/CustomControls';
import PageContainer from 'components/PageComponents/layouts/PageContainer';
import { DECOKING_LABRATORY } from 'constants/permissionsType';
import React from 'react';
import { useSelector } from 'react-redux';
import ArchiveSiteReportList from './List/ArchiveSiteReportList';
import HistorySiteReportList from './List/HistorySiteReportList';
import ActiveSiteReportList from './List/RegularSiteReportList';

const SiteReportTabs = () => {
  //#region Action Button Permission Check
  const { userPermission } = useSelector(({ auth }) => auth);
  //#endregion

  const components = [
    {
      index: 0,
      heading: 'Regular',
      component: (
        <React.Fragment>
          <ActiveSiteReportList />
          <Spinner />
        </React.Fragment>
      ),
      hasPermission: true
    },
    {
      index: 1,
      heading: 'Hisory',
      component: (
        <React.Fragment>
          <HistorySiteReportList />
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
          <ArchiveSiteReportList />
          <Spinner />
        </React.Fragment>
      ),
      hasPermission: userPermission?.includes(DECOKING_LABRATORY.ARCHIVE)
    }
  ];
  return (
    <PageContainer heading="Site Report">
      <CustomTab components={components.filter(item => item.hasPermission)} />
    </PageContainer>
  );
};

export default SiteReportTabs;
