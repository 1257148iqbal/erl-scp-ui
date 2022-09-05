import { CustomTab, Spinner } from 'components/CustomControls';
import PageContainer from 'components/PageComponents/layouts/PageContainer';
import { DESIGNATIONS } from 'constants/permissionsType';
import React from 'react';
import { useSelector } from 'react-redux';
import ActiveDesignations from './List/ActiveDesignations';
import ArchiveDesignations from './List/ArchiveDesignations';

const DesignationList = () => {
  //#region Action Button Permission Check
  const { userPermission } = useSelector(({ auth }) => auth);
  //#endregion

  const components = [
    {
      index: 0,
      heading: 'Active',

      component: (
        <React.Fragment>
          <ActiveDesignations />
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
          <ArchiveDesignations />
          <Spinner />
        </React.Fragment>
      ),
      hasPermission: userPermission?.includes(DESIGNATIONS.ARCHIVE)
    }
  ];
  return (
    <PageContainer heading="Designations">
      <CustomTab components={components.filter(item => item.hasPermission)} />
    </PageContainer>
  );
};

export default DesignationList;
