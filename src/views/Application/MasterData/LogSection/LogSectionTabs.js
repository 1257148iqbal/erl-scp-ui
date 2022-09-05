import { CustomTab, Spinner } from 'components/CustomControls';
import PageContainer from 'components/PageComponents/layouts/PageContainer';
import { SECTIONS } from 'constants/permissionsType';
import React from 'react';
import { useSelector } from 'react-redux';
import ActiveLogSections from './List/ActiveLogSections';
import ArchivelogSections from './List/ArchivelogSections';

const SectionList = () => {
  //#region Action Button Permission Check
  const { userPermission } = useSelector(({ auth }) => auth);
  //#endregion

  const components = [
    {
      index: 0,
      heading: 'Active',
      component: (
        <React.Fragment>
          <ActiveLogSections />
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
          <ArchivelogSections />
          <Spinner />
        </React.Fragment>
      ),
      hasPermission: userPermission?.includes(SECTIONS.ARCHIVE)
    }
  ];
  return (
    <PageContainer heading="Log Section">
      <CustomTab components={components.filter(item => item.hasPermission)} />
    </PageContainer>
  );
};

export default SectionList;
