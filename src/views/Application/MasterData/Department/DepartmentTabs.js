import { CustomTab, Spinner } from 'components/CustomControls';
import PageContainer from 'components/PageComponents/layouts/PageContainer';
import { DEPARTMENTS } from 'constants/permissionsType';
import React from 'react';
import { useSelector } from 'react-redux';
import ActiveDepartments from './List/ActiveDepartments';
import ArchiveDepartments from './List/ArchiveDepartments';

const DepartmentList = () => {
  //#region Action Button Permission Check
  const { userPermission } = useSelector(({ auth }) => auth);
  //#endregion

  const components = [
    {
      index: 0,
      heading: 'Active',
      component: (
        <React.Fragment>
          <ActiveDepartments />
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
          <ArchiveDepartments />
          <Spinner />
        </React.Fragment>
      ),
      hasPermission: userPermission?.includes(DEPARTMENTS.ARCHIVE)
    }
  ];

  return (
    <PageContainer heading="Departments">
      <CustomTab components={components.filter(item => item.hasPermission)} />
    </PageContainer>
  );
};

export default DepartmentList;
