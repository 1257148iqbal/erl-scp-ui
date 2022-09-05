/**
 * Title: Regular lab test tabs
 * Description:
 * Author: N/A
 * Date: N/A
 * Modified: 27-February-2022
 **/

import { CustomTab, Spinner } from 'components/CustomControls';
import PageContainer from 'components/PageComponents/layouts/PageContainer';
import { LAB_SHIFTS } from 'constants/permissionsType';
import React from 'react';
import { useSelector } from 'react-redux';
import ArchiveLabTestList from './List/ArchiveLabTestList';
import HistoryLabTestList from './List/HistoryLabTestList';
import RegularLabTestList from './List/RegularLabTestList';

const LabTestTabs = () => {
  //#region Action Button Permission Check
  const { userPermission } = useSelector(({ auth }) => auth);
  //#endregion

  const components = [
    {
      index: 0,
      heading: 'Regular',
      component: (
        <React.Fragment>
          <RegularLabTestList />
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
          <HistoryLabTestList />
          <Spinner />
        </React.Fragment>
      ),
      hasPermission: userPermission?.includes(LAB_SHIFTS.ARCHIVE)
    },
    {
      index: 2,
      heading: 'Archive',
      component: (
        <React.Fragment>
          <ArchiveLabTestList />
          <Spinner />
        </React.Fragment>
      ),
      hasPermission: userPermission?.includes(LAB_SHIFTS.ARCHIVE)
    }
  ];
  return (
    <PageContainer heading="Lab Test">
      <CustomTab components={components.filter(item => item.hasPermission)} />
    </PageContainer>
  );
};

export default LabTestTabs;

/** Change Log
 * 27-Feb-2022 (nasir) : History tab add
 **/
