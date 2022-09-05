import { CustomTab, Spinner } from 'components/CustomControls';
import PageContainer from 'components/PageComponents/layouts/PageContainer';
import { DECOKING_LOG } from 'constants/permissionsType';
import React from 'react';
import { useSelector } from 'react-redux';
import ArchiveDecokingLogSheetList from './List/ArchiveDecokingLogSheetList';
import HistoryDecokingLogSheetList from './List/HistoryDecokingLogSheetList';
import RegularDecokingLogSheetList from './List/RegularDecokingLogSheetList';

const DecokingLogSheetTabs = () => {
  //#region Action Button Permission Check
  const { userPermission } = useSelector(({ auth }) => auth);
  const hasViewPermission = userPermission?.includes(DECOKING_LOG.VIEW);
  const hasArchivePermission = userPermission?.includes(DECOKING_LOG.ARCHIVE);
  //#endregion

  const components = [
    {
      index: 0,
      heading: 'History',
      component: (
        <React.Fragment>
          <HistoryDecokingLogSheetList />
          <Spinner />
        </React.Fragment>
      ),
      hasPermission: hasViewPermission
    },

    {
      index: 1,
      heading: 'Regular ',
      component: (
        <React.Fragment>
          <RegularDecokingLogSheetList />
          <Spinner />
        </React.Fragment>
      ),
      hasPermission: hasViewPermission
    },

    {
      index: 2,
      heading: 'Archive',
      component: (
        <React.Fragment>
          <ArchiveDecokingLogSheetList />
          <Spinner />
        </React.Fragment>
      ),
      hasPermission: hasArchivePermission
    }
  ];
  return (
    <PageContainer heading="Decoking Logsheet">
      <CustomTab components={components.filter(item => item.hasPermission)} />
    </PageContainer>
  );
};

export default DecokingLogSheetTabs;
