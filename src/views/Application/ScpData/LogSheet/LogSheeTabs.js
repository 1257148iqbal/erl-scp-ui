import { CustomTab, Spinner } from 'components/CustomControls';
import PageContainer from 'components/PageComponents/layouts/PageContainer';
import { LOG_SHEETS } from 'constants/permissionsType';
import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import LogSheetHistory from './List/LogSheetHistory';
import RegularLogSheetList from './List/RegularLogSheetList';

const LogSheeTabs = props => {
  const { operationGroup } = useParams();
  const operationGroupName = operationGroup.split('-')[0];
  //#region Action Button Permission Check
  const { userPermission } = useSelector(({ auth }) => auth);
  //#endregion
  const components = [
    {
      index: 0,
      heading: 'Regular Log Sheet',
      component: (
        <React.Fragment>
          <RegularLogSheetList {...props} />
          <Spinner />
        </React.Fragment>
      ),
      hasPermission: true
    },
    {
      index: 1,
      heading: 'Log Sheet History',
      component: (
        <React.Fragment>
          <LogSheetHistory {...props} />
          <Spinner />
        </React.Fragment>
      ),
      hasPermission: userPermission?.includes(LOG_SHEETS.ARCHIVE)
    }
  ];

  return (
    <PageContainer heading={`Log sheet (${operationGroupName})`}>
      <CustomTab components={components.filter(item => item.hasPermission)} />
    </PageContainer>
  );
};

export default LogSheeTabs;
