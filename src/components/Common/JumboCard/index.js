import CmtCard from '@coremat/CmtCard';
import CmtCardContent from '@coremat/CmtCard/CmtCardContent';
import CmtCardFooter from '@coremat/CmtCard/CmtCardFooter';
import CmtCardHeader from '@coremat/CmtCard/CmtCardHeader';
import React from 'react';

const JumboCard = ({
  title,
  subTitle,
  avatar,
  icon,
  actionHandleIcon,
  actionHandler,
  actionsPos,
  actionsShowOnHover,
  footer,
  children,
  ...restProps
}) => {
  return (
    <CmtCard {...restProps}>
      {(icon || avatar || title || subTitle) && (
        <CmtCardHeader
          {...{
            title,
            subTitle,
            avatar,
            icon,
            actionHandleIcon,
            actionHandler,
            actionsPos,
            actionsShowOnHover
          }}
          titleProps={{
            variant: 'h4',
            component: 'div'
          }}
        />
      )}
      <CmtCardContent>{children}</CmtCardContent>
      {footer && <CmtCardFooter>{footer}</CmtCardFooter>}
    </CmtCard>
  );
};

export default JumboCard;
