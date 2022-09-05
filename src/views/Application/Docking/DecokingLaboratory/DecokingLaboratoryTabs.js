import { CustomTab, Spinner } from 'components/CustomControls';
import PageContainer from 'components/PageComponents/layouts/PageContainer';
import { DECOKING_LABRATORY } from 'constants/permissionsType';
import React from 'react';
import { useSelector } from 'react-redux';
import ArchiveDecokingLaboratoryList from './List/ArchiveDecokingLaboratoryList';
import HistoryDecokingLaboratoryList from './List/HistoryDecokingLaboratoryList';
import RegularDecokingLaboratoryList from './List/RegularDecokingLaboratoryList';

const DecokingLaboratoryTabs = () => {
  //#region Action Button Permission Check
  const { userPermission } = useSelector(({ auth }) => auth);
  const hasViewPermission = userPermission?.includes(DECOKING_LABRATORY.VIEW);
  const hasArchivePermission = userPermission?.includes(DECOKING_LABRATORY.ARCHIVE);
  //#endregion

  const components = [
    {
      index: 0,
      heading: 'History ',
      component: (
        <React.Fragment>
          <HistoryDecokingLaboratoryList />
          <Spinner />
        </React.Fragment>
      ),
      hasPermission: hasViewPermission
    },
    {
      index: 1,
      heading: 'Regular',
      component: (
        <React.Fragment>
          <RegularDecokingLaboratoryList />
          <Spinner />
        </React.Fragment>
      ),
      hasPermission: hasViewPermission
    },

    {
      index: 2,
      heading: 'Archive',
      component: (
        <React.Fragment>
          <ArchiveDecokingLaboratoryList />
          <Spinner />
        </React.Fragment>
      ),
      hasPermission: hasArchivePermission
    }
  ];
  return (
    <PageContainer heading="Decoking Laboratory">
      <CustomTab components={components.filter(item => item.hasPermission)} />
    </PageContainer>
  );
};

export default DecokingLaboratoryTabs;
