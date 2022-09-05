import { CustomTab, Spinner } from 'components/CustomControls';
import React from 'react';
import ActiveFactors from './ActiveFactors';
import ArchiveFactors from './ArchiveFactors';

const components = [
  {
    index: 0,
    heading: 'Active',
    component: (
      <React.Fragment>
        <ActiveFactors />
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
        <ArchiveFactors />
        <Spinner />
      </React.Fragment>
    ),
    hasPermission: true
  }
];

const FactorList = () => {
  return <CustomTab components={components.filter(item => item.hasPermission)} />;
};

export default FactorList;
