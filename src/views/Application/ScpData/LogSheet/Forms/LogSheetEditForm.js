/**
 * Title: Log sheet Edit form
 * Description:
 * Author: Nasir Ahmed
 * Date: 05-August-2022
 * Modified: 08-March-2022
 **/

import {
  Button,
  Grid,
  lighten,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import { Add } from '@material-ui/icons';
import clsx from 'clsx';
import {
  CancelButton,
  CustomPreloder,
  Form,
  FormWrapper,
  ResetButton,
  SaveButton,
  TextInput
} from 'components/CustomControls';
import PageContainer from 'components/PageComponents/layouts/PageContainer';
import { LOG_SHEET } from 'constants/ApiEndPoints/v1';
import { useBackDrop } from 'hooks/useBackdrop';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import { getSign, stringifyConsole } from 'utils/commonHelper';
import { formattedDate, getTime } from 'utils/dateHelper';
import { v4 as uuid } from 'uuid';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: lighten(theme.palette.background.paper, 0.1)
  },
  table: {
    minWidth: 800
  },
  tableRow: {
    '&:nth-of-type(odd)': {
      backgroundColor: '#EAF8E6'
    },
    '&:hover': {
      backgroundColor: '#ACE095',
      cursor: 'pointer'
    }
  },
  txtInput: {
    backgroundColor: '#FFFFFF',
    '& .MuiInputBase-input': {
      textAlign: 'center'
    }
  },
  masterInfoBox: {
    padding: 50,
    [theme.breakpoints.down('xs')]: {
      padding: 0
    }
  },
  onPressRemark: {
    width: '95%'
  },
  addRemarkBtn: {
    width: '5%',
    marginLeft: 5,
    padding: 'inherit'
  },
  masterInfoBoxTableCell: {
    maxWidth: 30,
    [theme.breakpoints.down('xs')]: {
      maxWidth: 85
    }
  },
  remarkList: {
    listStyle: 'none'
  },
  remarkListItem: {
    position: 'relative',
    width: '100%',
    padding: '10px 0',
    backgroundColor: 'rgba(0,0,255,.07)',
    borderRadius: '5px',
    marginBottom: 5
  },
  removeIcon: {
    width: '15px',
    height: '15px',
    display: 'flex',
    padding: '10px',
    position: 'absolute',
    alignItems: 'center',
    borderRadius: '30%',
    justifyContent: 'center',
    backgroundColor: 'red',
    cursor: 'pointer',
    right: '0',
    top: '0',
    color: '#FFF'
  }
}));

const LogSheetEditForm = props => {
  const classes = useStyles();
  const { setOpenBackdrop, setLoading } = useBackDrop();
  const { operationGroup } = useParams();
  const operationGroupName = operationGroup.split('-')[0];
  const { history, location } = props;

  //#region States
  const [state, setState] = React.useState(null);
  const [isPageLoaded, setIsPageLoaded] = React.useState(false);
  const [remark, setRemark] = React.useState('');
  const [remarks, setRemarks] = useState([]);
  const [slotHeadings, setSlotHeadings] = useState([]);

  //#endregion

  //#region UDF
  const getLogSheet = () => {
    http.get(`${LOG_SHEET.get_single}/${location.state}`).then(res => {
      if (res.data.succeeded) {
        const logSheet = {
          ...res.data.data,
          logSheetDetails: res.data.data.logSheetDetails.map(tag => ({
            id: tag.id,
            logSheetMasterId: tag.logSheetMasterId,
            sortOrder: tag.sortOrder,
            tagId: tag.tagId,
            tagName: tag.tagName,
            details: tag.details,
            unitId: tag.unitId,
            unitName: tag.unitName,
            previousSlotReading: tag.lastReading ?? '-',

            currentSlotHeading: getTime(res.data.data.slotFromTime, 'HH:mm'),
            currentSlotReading: tag.reading,

            lastSlotHeading: getTime(tag.lastFromTime, 'HH:mm'),
            lastSlotReading: tag.lastReading ?? '-',

            secondLastSlotHeading: getTime(tag.secondLastFromTime, 'HH:mm'),
            secondLastSlotReading: tag.secondLastReading ?? '-',

            thirdLastSlotHeading: getTime(tag.thirdLastFromTime, 'HH:mm'),
            thirdLastSlotReading: tag.thirdLastReading ?? '-'
          }))
        };
        const {
          currentSlotHeading,
          lastSlotHeading,
          secondLastSlotHeading,
          thirdLastSlotHeading
        } = logSheet.logSheetDetails[0];
        setSlotHeadings([thirdLastSlotHeading, secondLastSlotHeading, lastSlotHeading, currentSlotHeading]);

        stringifyConsole(logSheet, 'normal');

        setState(logSheet);
        setRemarks(logSheet.remark.split('~'));
        setIsPageLoaded(true);
      } else {
        toastAlerts('error', 'Error with loading switches!!!');
      }
    });
  };

  //#endregion

  //#region hook
  useEffect(() => {
    getLogSheet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //#endregion

  //#region Pre Loader
  if (!isPageLoaded) {
    return <CustomPreloder />;
  }
  //#region

  //#region Events

  const onReadingChange = (e, tagId) => {
    const { name, value } = e.target;
    const oldTags = { ...state };

    const updatedTags = oldTags.logSheetDetails.map(tag => {
      if (tag.tagId === tagId) {
        tag[name] = value;
      }
      return tag;
    });

    setState({ ...state, logSheetDetails: updatedTags });
  };

  const onAddRemak = () => {
    if (remark) {
      const _remarks = [...remarks].concat(remark);
      setRemarks(_remarks);
      // document.querySelector('#jsondata').innerHTML = JSON.stringify(_remarks, null, 2);
      setRemark('');
      const ele = document.querySelector('#remark');
      ele.focus();
    }
  };

  const onRemoveRemark = indx => {
    const _remarks = [...remarks];
    _remarks.splice(indx, 1);
    setRemarks(_remarks);
  };

  const onPressRemark = e => {
    if (e.key === 'Enter') {
      onAddRemak();
    }
  };

  const onReset = () => {
    const resetedTags = state.logSheetDetails.map(tag => ({ ...tag, currentSlotReading: '' }));
    setState({ ...state, logSheetDetails: resetedTags });
  };
  const onCancel = () => {
    history.goBack();
  };

  const onSubmit = async e => {
    e.preventDefault();
    setOpenBackdrop(true);
    setLoading(true);

    const data = {
      ...state,
      remark: remarks.join('~'),
      logSheetDetails: state.logSheetDetails.map(item => {
        const copiedItem = Object.assign({}, item);
        copiedItem.id = item.id;
        copiedItem.logSheetMasterId = item.logSheetMasterId;
        copiedItem.tagId = item.tagId;
        copiedItem.tagName = item.tagName;
        copiedItem.details = item.details;
        copiedItem.reading = item.currentSlotReading;
        delete copiedItem.previousSlotReading;
        delete copiedItem.currentSlotReading;
        return copiedItem;
      })
    };

    try {
      const res = await http.put(`${LOG_SHEET.update}/${data.key}`, data);
      if (res.data.succeeded) {
        toastAlerts('success', res.data.message);
        history.goBack();
      } else {
        toastAlerts('error', res.data.message);
      }
    } catch (err) {
      toastAlerts('error', err);
    } finally {
      setLoading(false);
      setOpenBackdrop(false);
    }
  };
  //#endregion

  return (
    <PageContainer heading={`${operationGroupName} Log Sheet (Update)`}>
      <FormWrapper>
        <Form>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12} md={12} lg={12} className={classes.masterInfoBox}>
              <Paper>
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell className={classes.masterInfoBoxTableCell}>Date</TableCell>
                      <TableCell>{formattedDate(state.date)} </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className={classes.masterInfoBoxTableCell}>Shift</TableCell>
                      <TableCell>{state.shiftName}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className={classes.masterInfoBoxTableCell}>Operation Group</TableCell>
                      <TableCell>{state.operationGroupName}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className={classes.masterInfoBoxTableCell}>Section</TableCell>
                      <TableCell>{state.sectionName}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className={classes.masterInfoBoxTableCell}> Start Time</TableCell>
                      <TableCell>{state.slotFromTime}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className={classes.masterInfoBoxTableCell}> End Time</TableCell>
                      <TableCell>{state.slotToTime}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <TableContainer component={Paper} className={classes.root}>
                <Table className={classes.table} stickyHeader aria-label="caption table" size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ minWidth: 200, backgroundColor: '#333333', color: '#FFFFFF' }} align="left">
                        Tag Info
                      </TableCell>
                      <TableCell style={{ minWidth: 200, backgroundColor: '#333333', color: '#FFFFFF' }} align="left">
                        Unit
                      </TableCell>
                      {slotHeadings.map(sh => (
                        <TableCell
                          key={uuid()}
                          style={{ minWidth: 200, backgroundColor: '#333333', color: '#FFFFFF' }}
                          align="center">
                          {sh}
                        </TableCell>
                      ))}
                      {/* <TableCell style={{ minWidth: 200, backgroundColor: '#333333', color: '#FFFFFF' }} align="center">
                        Last slot
                      </TableCell>
                      <TableCell style={{ minWidth: 200, backgroundColor: '#333333', color: '#FFFFFF' }} align="left">
                        Current slot
                      </TableCell> */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {state.logSheetDetails.map(tag => (
                      <TableRow key={tag.id} className={classes.tableRow}>
                        <TableCell style={{ minWidth: 200 }} align="left">
                          <Typography variant="h4">{tag.tagName}</Typography>
                          <Typography variant="caption">{tag.details}</Typography>
                        </TableCell>
                        <TableCell style={{ minWidth: 200 }} align="left">
                          {getSign(tag.unitName)}
                        </TableCell>
                        <TableCell style={{ minWidth: 200 }} align="center">
                          {tag.thirdLastSlotReading}
                        </TableCell>
                        <TableCell style={{ minWidth: 200 }} align="center">
                          {tag.secondLastSlotReading}
                        </TableCell>
                        <TableCell style={{ minWidth: 200 }} align="center">
                          {tag.lastSlotReading}
                        </TableCell>
                        <TableCell style={{ minWidth: 200 }} align="left">
                          <TextInput
                            className={classes.txtInput}
                            name="currentSlotReading"
                            value={tag.currentSlotReading}
                            onChange={e => onReadingChange(e, tag.tagId)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <Grid item xs={12} style={{ marginTop: 15, display: 'flex', alignItems: 'center' }}>
              <TextInput
                id="remark"
                className={clsx(classes.txtInput, classes.onPressRemark)}
                label="Remarks"
                name="remarks"
                value={remark}
                onChange={e => setRemark(e.target.value)}
                onKeyPress={onPressRemark}
              />
              <Button variant="contained" color="primary" className={classes.addRemarkBtn} onClick={onAddRemak}>
                <Add />
              </Button>
            </Grid>
            <Grid item xs={12}>
              <ul className={classes.remarkList}>
                {remarks.map((rm, rmIdx) => (
                  <li key={rmIdx + 1} className={classes.remarkListItem}>
                    <span style={{ paddingLeft: 5 }}>{rm}</span>
                    <span className={classes.removeIcon} onClick={() => onRemoveRemark(rmIdx)}>
                      X
                    </span>
                  </li>
                ))}
              </ul>
            </Grid>
            <Grid item container justifyContent="flex-end">
              <SaveButton onClick={onSubmit} />
              <ResetButton onClick={onReset} />
              <CancelButton onClick={onCancel} />
            </Grid>
            <pre id="jsonData"></pre>
          </Grid>
        </Form>
      </FormWrapper>
    </PageContainer>
  );
};

export default LogSheetEditForm;

/** Change Log
 * 15-Feb-2022 (nasir) : 'reading' field type made string to number
 * 19-Feb-2022 (nasir) : form submit with enter disabled
 * 08-March-2022 (nasir) : remarks portion modify with continuous addition
 **/
