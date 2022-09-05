/**
 * Title: Assing operator to duty tabs
 * Description:
 * Author: Nasir Ahmed
 * Date: 04-June-2022
 * Modified: 04-June-2022
 **/

import { CustomTab, Spinner } from 'components/CustomControls';
import PageContainer from 'components/PageComponents/layouts/PageContainer';
import { OPERATOR_DUTY_LOG } from 'constants/permissionsType';
import React from 'react';
import { useSelector } from 'react-redux';
import ArchiveOperatorDutyLog from './List/ArchiveOperatorDutyLog';
import HistoryOperatorDutyLog from './List/HistoryOperatorDutyLog';
import RegularOperatorDutyLog from './List/RegularOperatorDutyLog';

const AssingOperatorToDutyTabs = () => {
  //#region Action Button Permission Check
  const { userPermission } = useSelector(({ auth }) => auth);
  //#endregion

  const components = [
    {
      index: 0,
      heading: 'History',
      component: (
        <React.Fragment>
          <HistoryOperatorDutyLog />
          <Spinner />
        </React.Fragment>
      ),
      hasPermission: true
    },
    {
      index: 1,
      heading: 'Regular',
      component: (
        <React.Fragment>
          <RegularOperatorDutyLog />
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
          <ArchiveOperatorDutyLog />
          <Spinner />
        </React.Fragment>
      ),
      hasPermission: userPermission?.includes(OPERATOR_DUTY_LOG.ARCHIVE)
    }
  ];
  return (
    <PageContainer heading="Operator Duty Log">
      <CustomTab components={components.filter(item => item.hasPermission)} />
    </PageContainer>
  );
};

export default AssingOperatorToDutyTabs;

/** Change Log
 * 26-Feb-2022 (nasir) : Tabs modify with regular,history and archive
 **/
