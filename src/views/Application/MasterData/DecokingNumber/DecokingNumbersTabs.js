import { CustomTab, Spinner } from 'components/CustomControls';
import PageContainer from 'components/PageComponents/layouts/PageContainer';
import { PARAMETER } from 'constants/permissionsType';
import React from 'react';
import { useSelector } from 'react-redux';
import ActiveDecokingNumbers from './List/ActiveDecokingNumbers';
import ArchiveDecokingNumbers from './List/ArchiveDecokingNumbers';

const DecokingLogSheetList = () => {
  //#region Action Button Permission Check
  const { userPermission } = useSelector(({ auth }) => auth);
  //#endregion
  const components = [
    {
      index: 0,
      heading: 'Active',

      component: (
        <React.Fragment>
          <ActiveDecokingNumbers />
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
          <ArchiveDecokingNumbers />
          <Spinner />
        </React.Fragment>
      ),
      hasPermission: userPermission?.includes(PARAMETER.ARCHIVE)
    }
  ];
  return (
    <PageContainer heading="Decoking Numbers">
      <CustomTab components={components.filter(item => item.hasPermission)} />
    </PageContainer>
  );
};

export default DecokingLogSheetList;
