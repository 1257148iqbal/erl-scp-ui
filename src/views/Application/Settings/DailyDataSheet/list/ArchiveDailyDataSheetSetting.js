import {
  Box,
  Collapse,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@material-ui/core';
import { KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons';
import { ActionButtonGroup, ConfirmDialog } from 'components/CustomControls';
import { DAILY_DATA_SHEET_SETTINGS } from 'constants/ApiEndPoints/v1';
import { internalServerError } from 'constants/ErrorMessages';
import _, { uniqueId } from 'lodash';
import React, { useEffect } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import { useStyles } from '../style';
const DailyDataSheetArchiveSettings = () => {
  const classes = useStyles();
  //#region States
  const [state, setState] = React.useState([]);

  const [confirmDialog, setConfirmDialog] = React.useState({ title: '', content: '', isOpen: false });

  //#endregion

  //#region UDF

  const getArchiveDailyDataSheetSettings = () => {
    trackPromise(
      http
        .get(DAILY_DATA_SHEET_SETTINGS.get_archive)
        .then(res => {
          if (res.data.succeeded) {
            const settings = res.data.data.map(setting => ({
              ...setting,
              id: uniqueId(),
              open: false,
              inSideSettings: setting.dataSheetSetting.length
            }));
            setState(settings);
          } else {
            toastAlerts('error', res.data.message);
          }
        })
        .catch(err => toastAlerts('error', err))
    );
  };

  //#endregion

  ////#region  Hooks
  useEffect(() => getArchiveDailyDataSheetSettings(), []);

  //#region Events

  const onRestore = key => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });

    http
      .put(`${DAILY_DATA_SHEET_SETTINGS.restore}/${key}`)
      .then(res => {
        if (res.data.succeeded) {
          toastAlerts('success', res.data.message);
        } else {
          toastAlerts('error', res.data.message);
        }
        getArchiveDailyDataSheetSettings();
      })
      .catch(err => {
        toastAlerts('error', internalServerError);
      });
  };

  const onRowToggle = rowId => {
    const updatedSlots = state.map(item => {
      if (item.id === rowId) {
        item['open'] = !item.open;
      }
      return item;
    });
    setState(updatedSlots);
  };

  const onView = id => {};

  //#endregion

  return (
    <Box>
      <Paper className={classes.root}>
        <TableContainer component={Paper} className={classes.root}>
          <Table stickyHeader className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableCell} />
                <TableCell className={classes.tableCell}>Section</TableCell>
                <TableCell className={classes.tableCell} align="center">
                  Settings Count
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {state.map(row => (
                <React.Fragment key={row.id}>
                  <TableRow hover selected={row.open} className={classes.tableRow}>
                    <TableCell>
                      <IconButton size="small" onClick={() => onRowToggle(row.id)}>
                        {row.open ? <KeyboardArrowUp style={{ color: '#FFFFFF' }} /> : <KeyboardArrowDown />}
                      </IconButton>
                    </TableCell>
                    <TableCell style={{ minWidth: 200 }}>{_.startCase(row.ddsSection)}</TableCell>
                    <TableCell style={{ minWidth: 200 }} align="center">
                      {row.inSideSettings}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                      <Collapse in={row.open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell style={{ backgroundColor: '#78909C', color: '#FFFFFF', minWidth: 170 }}>
                                  Section Name
                                </TableCell>
                                <TableCell style={{ backgroundColor: '#78909C', color: '#FFFFFF', minWidth: 170 }}>
                                  Tag Name
                                </TableCell>
                                <TableCell style={{ backgroundColor: '#78909C', color: '#FFFFFF', minWidth: 170 }}>
                                  Display Name
                                </TableCell>
                                <TableCell style={{ backgroundColor: '#78909C', color: '#FFFFFF', minWidth: 170 }}>
                                  Action
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {row.dataSheetSetting.map(setting => (
                                <TableRow key={setting.id} hover>
                                  <TableCell style={{ minWidth: 170 }}>{setting.ddsSection}</TableCell>
                                  <TableCell style={{ minWidth: 170 }}>{setting.tagName}</TableCell>
                                  <TableCell style={{ minWidth: 170 }}>{setting.displayName}</TableCell>
                                  <TableCell style={{ minWidth: 170 }}>
                                    <ActionButtonGroup
                                      appearedViewButton
                                      appearedReactiveButton
                                      onView={() => onView(setting.id)}
                                      onRestore={() => {
                                        setConfirmDialog({
                                          isOpen: true,
                                          title: 'Delete Daily Data Sheet?',
                                          content: 'Are you sure to delete this daily data sheet??',
                                          onConfirm: () => onRestore(setting.key)
                                        });
                                      }}
                                    />
                                    <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default DailyDataSheetArchiveSettings;
