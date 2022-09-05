import { CustomTab, Spinner } from 'components/CustomControls';
import PageContainer from 'components/PageComponents/layouts/PageContainer';
import { TAGS } from 'constants/permissionsType';
import React from 'react';
import { useSelector } from 'react-redux';
import ActiveTags from './List/ActiveTags';
import ArchiveTags from './List/ArchiveTags';

const TagList = () => {
  //#region Action Button Permission Check
  const { userPermission } = useSelector(({ auth }) => auth);
  //#endregion

  const components = [
    {
      index: 0,
      heading: 'Active',
      component: (
        <React.Fragment>
          <ActiveTags />
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
          <ArchiveTags />
          <Spinner />
        </React.Fragment>
      ),
      hasPermission: userPermission?.includes(TAGS.ARCHIVE)
    }
  ];
  return (
    <PageContainer heading="Tags">
      <CustomTab components={components.filter(item => item.hasPermission)} />
    </PageContainer>
  );
};

export default TagList;
