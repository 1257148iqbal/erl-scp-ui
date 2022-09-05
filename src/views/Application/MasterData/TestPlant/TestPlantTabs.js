import { CustomTab, Spinner } from 'components/CustomControls';
import PageContainer from 'components/PageComponents/layouts/PageContainer';
import React from 'react';
import { useSelector } from 'react-redux';
import ActiveLabUnits from './List/ActiveTestPlant';
import ArchiveLabUnits from './List/ArchiveTestPlant';

const TestPlantTabs = props => {
  //#region Action Button Permission Check
  const { userPermission } = useSelector(({ auth }) => auth);
  //#endregion

  const components = [
    {
      index: 0,
      heading: 'Active',
      component: (
        <React.Fragment>
          <ActiveLabUnits />
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
          <ArchiveLabUnits />
          <Spinner />
        </React.Fragment>
      ),
      hasPermission: true
    }
  ];
  return (
    <PageContainer heading="Test Plants">
      <CustomTab components={components.filter(item => item.hasPermission)} />
    </PageContainer>
  );
};

export default TestPlantTabs;
