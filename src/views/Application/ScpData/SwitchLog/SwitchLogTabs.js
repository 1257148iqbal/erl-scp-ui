import { CustomTab, Spinner } from 'components/CustomControls';
import PageContainer from 'components/PageComponents/layouts/PageContainer';
import { SWITCH_LOGS } from 'constants/permissionsType';
import React from 'react';
import { useSelector } from 'react-redux';
import RegularSwitchLog from './List/RegularSwitchLog';
import SwitchLogHistory from './List/SwitchLogHistory';

const SwitchLogTabs = props => {
  //#region Action Button Permission Check
  const { userPermission } = useSelector(({ auth }) => auth);
  //#endregion
  const components = [
    {
      index: 0,
      heading: 'Regular Switch Log',
      component: (
        <React.Fragment>
          <RegularSwitchLog {...props} />
          <Spinner />
        </React.Fragment>
      ),
      hasPermission: true
    },
    {
      index: 1,
      heading: 'Switch Log History',
      component: (
        <React.Fragment>
          <SwitchLogHistory {...props} />
          <Spinner />
        </React.Fragment>
      ),
      hasPermission: userPermission?.includes(SWITCH_LOGS.ARCHIVE)
    }
  ];

  return (
    <PageContainer heading="Switch Log">
      <CustomTab components={components.filter(item => item.hasPermission)} />
    </PageContainer>
  );
};

export default SwitchLogTabs;
