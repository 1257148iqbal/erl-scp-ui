import { CustomTab, Spinner } from 'components/CustomControls';
import PageContainer from 'components/PageComponents/layouts/PageContainer';
import { TEST_SAMPLES } from 'constants/permissionsType';
import React from 'react';
import { useSelector } from 'react-redux';
import ActiveLabSamples from './List/ActiveTestSamples';
import ArchiveLabSamples from './List/ArchiveTestSamples';

const TestSampleList = () => {
  //#region Action Button Permission Check
  const { userPermission } = useSelector(({ auth }) => auth);
  //#endregion

  const components = [
    {
      index: 0,
      heading: 'Active',

      component: (
        <React.Fragment>
          <ActiveLabSamples />
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
          <ArchiveLabSamples />
          <Spinner />
        </React.Fragment>
      ),
      hasPermission: userPermission?.includes(TEST_SAMPLES.ARCHIVE)
    }
  ];
  return (
    <PageContainer heading="Test Sample">
      <CustomTab components={components.filter(item => item.hasPermission)} />
    </PageContainer>
  );
};

export default TestSampleList;
