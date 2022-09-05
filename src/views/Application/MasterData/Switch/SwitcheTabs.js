import { CustomTab, Spinner } from 'components/CustomControls';
import PageContainer from 'components/PageComponents/layouts/PageContainer';
import { SWITCHES } from 'constants/permissionsType';
import React from 'react';
import { useSelector } from 'react-redux';
import ActiveSwitches from './List/ActiveSwitches';
import ArchiveSwitches from './List/ArchiveSwitches';

const SwitcheList = () => {
  //#region Action Button Permission Check
  const { userPermission } = useSelector(({ auth }) => auth);
  //#endregion

  const components = [
    {
      index: 0,
      heading: 'Active',
      component: (
        <React.Fragment>
          <ActiveSwitches />
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
          <ArchiveSwitches />
          <Spinner />
        </React.Fragment>
      ),
      hasPermission: userPermission?.includes(SWITCHES.ARCHIVE)
    }
  ];
  return (
    <PageContainer heading="Switches">
      <CustomTab components={components.filter(item => item.hasPermission)} />
    </PageContainer>
  );
};

export default SwitcheList;
