import CmtImage from '@coremat/CmtImage';
import { Box } from '@material-ui/core';
import React from 'react';

const FooterLogo = ({ color, ...props }) => {
  const logoUrl = color === 'white' ? '/images/logo-white-symbol.png' : '/images/footer-logo.png';

  return (
    <Box className="pointer" {...props}>
      <a href="/">
        <CmtImage src={logoUrl} alt="" />
      </a>
      {/* <a href="/" target="_blank" rel="noreferrer">
        <CmtImage src={logoUrl} alt="" />
      </a> */}
    </Box>
  );
};

export default FooterLogo;
