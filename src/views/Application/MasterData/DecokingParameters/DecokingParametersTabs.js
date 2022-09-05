import { CustomTab, Spinner } from 'components/CustomControls';
import PageContainer from 'components/PageComponents/layouts/PageContainer';
import { PARAMETER } from 'constants/permissionsType';
import React from 'react';
import { useSelector } from 'react-redux';
import ActiveDockingLogSheet from './List/ActiveDecokingParameters';
import ArchiveDockingLogSheet from './List/ArchiveDecokingParameterst';

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
          <ActiveDockingLogSheet />
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
          <ArchiveDockingLogSheet />
          <Spinner />
        </React.Fragment>
      ),
      hasPermission: userPermission?.includes(PARAMETER.ARCHIVE)
    }
  ];
  return (
    <PageContainer heading="Decoking Parameters">
      <CustomTab components={components.filter(item => item.hasPermission)} />
    </PageContainer>
  );
};

export default DecokingLogSheetList;
