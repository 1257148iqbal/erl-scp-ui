import MomentUtils from '@date-io/moment';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createTheme, jssPreset, StylesProvider } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import AppLocale from 'i18n';
import { create } from 'jss';
import rtl from 'jss-rtl';
import React, { useContext, useEffect } from 'react';
import { IntlProvider } from 'react-intl';
import AppLayout from '../AppLayout';
import AppContext from '../contextProvider/AppContextProvider/AppContext';

// Configure JSS
const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

const AppWrapper = ({ match, location, children }) => {
  const { theme, locale, direction } = useContext(AppContext);
  const currentAppLocale = AppLocale[locale.locale];
  useEffect(() => {
    if (direction === 'rtl') {
      document.body.setAttribute('dir', 'rtl');
    } else {
      document.body.setAttribute('dir', 'ltr');
    }
  }, [direction]);

  return (
    <IntlProvider locale={currentAppLocale.locale} messages={currentAppLocale.messages}>
      <ThemeProvider theme={createTheme(theme)}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <StylesProvider jss={jss}>
            <CssBaseline />
            <AppLayout>{children}</AppLayout>
          </StylesProvider>
        </MuiPickersUtilsProvider>
      </ThemeProvider>
    </IntlProvider>
  );
};

export default AppWrapper;
