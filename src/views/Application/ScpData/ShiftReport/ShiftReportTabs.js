import { CustomTab } from 'components/CustomControls';
import PageContainer from 'components/PageComponents/layouts/PageContainer';
import { SHIFT_REPORTS } from 'constants/permissionsType';
import React from 'react';
import { useSelector } from 'react-redux';
import ArchiveShiftReportList from './List/ArchiveShiftReportList';
import HistoryShiftReportList from './List/HistoryShiftReportList';
import RegularShiftReportList from './List/RegularShiftReportList';

const ShiftReportTabs = props => {
  //#region Action Button Permission Check
  const { userPermission } = useSelector(({ auth }) => auth);
  //#endregion
  const components = [
    {
      index: 0,
      heading: 'Regular',
      component: (
        <React.Fragment>
          <RegularShiftReportList {...props} />
        </React.Fragment>
      ),
      hasPermission: userPermission?.includes(SHIFT_REPORTS.VIEW)
    },
    {
      index: 1,
      heading: 'History',
      component: (
        <React.Fragment>
          <HistoryShiftReportList {...props} />
        </React.Fragment>
      ),
      hasPermission: userPermission?.includes(SHIFT_REPORTS.VIEW)
    },
    {
      index: 2,
      heading: 'Archive',
      component: (
        <React.Fragment>
          <ArchiveShiftReportList {...props} />
        </React.Fragment>
      ),
      hasPermission: userPermission?.includes(SHIFT_REPORTS.VIEW)
    }
  ];

  return (
    <PageContainer heading="Shift Report">
      <CustomTab components={components.filter(item => item.hasPermission)} />
    </PageContainer>
  );
};

export default ShiftReportTabs;
