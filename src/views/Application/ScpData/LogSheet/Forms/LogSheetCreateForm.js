/**
 * Title: Log sheet create form
 * Description:
 * Author: Nasir Ahmed
 * Date: 09-August-2022
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
  CustomAutoComplete,
  FormWrapper,
  ResetButton,
  SaveButton,
  ScrollToTop,
  Spinner,
  TextInput
} from 'components/CustomControls';
import PageContainer from 'components/PageComponents/layouts/PageContainer';
import { LOG_SHEET, SECTION, TAG, TIME_SLOT } from 'constants/ApiEndPoints/v1';
import { internalServerError } from 'constants/ErrorMessages';
import { useBackDrop } from 'hooks/useBackdrop';
import qs from 'querystring';
import React, { useEffect, useRef, useState } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { http } from 'services/httpService';
import { sweetAlerts, toastAlerts } from 'utils/alerts';
import { getSign, scrollToTop, stringifyConsole } from 'utils/commonHelper';
import { getFormattedDate, getNewDateBefore, getTime, getTimeFromDate, serverDate, time24 } from 'utils/dateHelper';
import { onTextFieldFocus } from 'utils/keyControl';
import { v4 as uuid } from 'uuid';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: lighten(theme.palette.background.paper, 0.1),
    '& .MuiTableCell-sizeSmall': {
      padding: '0px 24px 0px 16px'
    }
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
    backgroundColor: '#FFFFFF'
  },
  onPressRemark: {
    width: '95%'
  },
  addRemarkBtn: {
    width: '5%',
    marginLeft: 5,
    padding: 'inherit'
  },
  masterInfoBox: {
    padding: 50,
    [theme.breakpoints.down('xs')]: {
      padding: 0
    }
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
    top: '0',
    right: '0',
    color: '#FFF',
    width: '15px',
    height: '15px',
    cursor: 'pointer',
    display: 'flex',
    padding: '10px',
    position: 'absolute',
    alignItems: 'center',
    borderRadius: '30%',
    justifyContent: 'center',
    backgroundColor: 'red'
  }
}));

const LogSheetCreateForm = props => {
  //#region Hooks
  const classes = useStyles();
  const history = useHistory();

  const { operationGroup } = useParams();
  const operationGroupName = operationGroup.split('-')[0];
  const operationGroupId = operationGroup.split('-')[1];
  const alias = operationGroup.split('-')[2];

  const refOperationGroup = useRef();
  const { setOpenBackdrop, setLoading } = useBackDrop();
  const {
    authUser: { userName, employeeID, operatorId }
  } = useSelector(({ auth }) => auth);
  //#endregion

  //#region States
  const [section, setSection] = useState(null);
  const [sections, setSections] = useState([]);
  const [tags, setTags] = useState([]);
  const [remark, setRemark] = useState('');
  const [remarks, setRemarks] = useState([]);
  const [currentTimeSlot, setCurrentTimeSlot] = useState(null);
  const [date, setDate] = useState(new Date('2022-05-16 20:00:00'));
  const [slotHeadings, setSlotHeadings] = useState([]);

  //#endregion

  //#region UDF
  const getCurrentTimeSlot = async (operationGroupId, timeStamp, sectionsCallback) => {
    const queryParam = {
      OperationGroupId: operationGroupId,
      CurrentTime: time24(timeStamp)
    };

    try {
      const res = await http.get(TIME_SLOT.get_currentTimeSlot, { params: queryParam });
      const currentTimeSlot = res.data.data;
      setCurrentTimeSlot(currentTimeSlot);
      sectionsCallback(operationGroupId);
    } catch (err) {
      toastAlerts('error', err);
    }
  };

  const getSectionsByOperationGroup = async operationGroupId => {
    try {
      const res = await http.get(`${SECTION.get_by_operationGroup}/${operationGroupId}`);
      if (res.data.succeeded) {
        const sections = res.data.data.map(item => ({ label: item.sectionName, value: item.id }));
        setSections(sections);
      }
    } catch (err) {
      toastAlerts('error', err);
    }
  };

  const getTagsBySection = sectionId => {
    const queryParam = {
      OperationGroupId: operationGroupId,
      SectionId: sectionId,
      Date: serverDate(date),
      FromTime: currentTimeSlot.fromTime,
      IsSpacific: false
    };
    trackPromise(
      http
        .get(`${TAG.get_with_last_reading}?${qs.stringify(queryParam)}`)
        .then(res => {
          if (res.data.succeeded) {
            const tags = res.data.data.map(tag => ({
              sortOrder: tag.sortOrder,
              tagId: tag.id,
              tagName: tag.tagName,
              details: tag.details,
              unitId: tag.unitId,
              unitName: tag.unitName,
              factor: tag.factor,

              lastSlotHeading: getTime(tag.lastFromTime, 'HH:mm'),
              lastSlotReading: tag.lastReading ?? '-',

              secondLastSlotHeading: getTime(tag.secondLastFromTime, 'HH:mm'),
              secondLastSlotReading: tag.secondLastReading ?? '-',

              thirdLastSlotHeading: getTime(tag.thirdLastFromTime, 'HH:mm'),
              thirdLastSlotReading: tag.thirdLastReading ?? '-',

              currentSlotHeading: getTime(currentTimeSlot.fromTime, 'HH:mm'),
              currentSlotReading: ''
            }));
            const { currentSlotHeading, lastSlotHeading, secondLastSlotHeading, thirdLastSlotHeading } = tags[0];
            setSlotHeadings([thirdLastSlotHeading, secondLastSlotHeading, lastSlotHeading, currentSlotHeading]);
            setTags(tags);
          }
        })
        .catch(err => toastAlerts('error', err))
    );
  };

  const checkDuplicateLogSheet = sectionId => {
    const queryParam = {
      OperationGroupId: operationGroupId,
      SectionId: sectionId,
      ShiftId: currentTimeSlot.shift.id,
      TimeSlotId: currentTimeSlot.id,
      Date: serverDate(date)
    };

    trackPromise(
      http
        .get(LOG_SHEET.check_duplicate_log_sheet, { params: queryParam })
        .then(res => {
          if (res.data.succeeded) {
            if (res.data.data > 0) {
              sweetAlerts('error', 'Error', res.data.message);
            } else {
              getTagsBySection(sectionId);
            }
          } else {
            toastAlerts('error', res.message);
          }
        })
        .catch(err => toastAlerts('error', internalServerError))
    );
  };

  //#endregion

  //#region hook

  useEffect(() => {
    const currentTime = getTimeFromDate(date);

    const fromTime = getTimeFromDate(new Date(`0000-01-01 00:00:01`));
    const toTime = getTimeFromDate(new Date(`0000-01-01 06:59:59`));

    if (currentTime >= fromTime && currentTime <= toTime) {
      const prevDate = getNewDateBefore(date, 1);
      setDate(prevDate);
    }
  }, [date]);

  useEffect(() => {
    getCurrentTimeSlot(operationGroupId, date, getSectionsByOperationGroup);
  }, [date, operationGroupId]);

  //#endregion

  //#region Events
  const onSectionChange = (e, newValue) => {
    if (newValue) {
      setSection(newValue);
      setTags([]);
      checkDuplicateLogSheet(newValue.value);
    } else {
      setSection(null);
    }
  };

  const onReadingChange = (e, tagId) => {
    const { name, value } = e.target;
    const oldTags = [...tags];

    const updatedTags = oldTags.map(tag => {
      if (tag.tagId === tagId) {
        tag[name] = value;
      }
      return tag;
    });
    setTags(updatedTags);
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
    const resetedTags = tags.map(tag => ({ ...tag, currentSlotReading: '' }));
    setTags(resetedTags);
    setRemark('');
  };

  const onCancel = () => {
    history.goBack();
  };

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setOpenBackdrop(true);
    if (currentTimeSlot) {
      const data = {
        date: serverDate(date),
        operationGroupId: operationGroupId,
        operationGroupName: operationGroupName,
        alias: alias,
        sectionId: section ? section.value : '',
        sectionName: section ? section.label : '',
        shiftId: currentTimeSlot.shift.id,
        shiftName: currentTimeSlot.shift.shiftName,
        timeSlotId: currentTimeSlot.id,
        slotName: currentTimeSlot.slotName,
        slotFromTime: currentTimeSlot.fromTime,
        slotToTime: currentTimeSlot.toTime,
        remark: remarks.join('~'),
        operatorId: operatorId,
        empCode: employeeID,
        userName: userName,
        logSheetDetails: tags.map(tag => {
          const copiedItem = Object.assign({}, tag);
          copiedItem.reading = tag.currentSlotReading;
          delete copiedItem.lastSlotReading;
          delete copiedItem.secondLastSlotReading;
          delete copiedItem.thirdLastSlotReading;
          return copiedItem;
        })
      };
      stringifyConsole(data, 'normal');
      //return;

      try {
        const res = await http.post(LOG_SHEET.create, data);
        if (res.data.succeeded) {
          toastAlerts('success', res.data.message);
          onReset();
          scrollToTop();
        } else {
          toastAlerts('error', res.data.message);
        }
      } catch (err) {
        toastAlerts('error', err);
      } finally {
        setLoading(false);
        setOpenBackdrop(false);
      }
    } else {
      toastAlerts('warning', `Didn't load your current slot yet. Please contact with admin`);
    }
  };
  //#endregion

  return (
    <PageContainer heading={`${operationGroupName} Log Sheet (Create)`}>
      <FormWrapper>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={6} lg={6}>
            <Paper style={{ padding: 10 }}>
              <CustomAutoComplete
                ref={refOperationGroup}
                name="departmentId"
                data={sections}
                label="Select Section"
                value={section}
                onChange={onSectionChange}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} className={classes.masterInfoBox}>
            <Paper>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell className={classes.masterInfoBoxTableCell}>Date:</TableCell>
                    <TableCell>{getFormattedDate(date, 'DD-MMM-yyyy')} </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={classes.masterInfoBoxTableCell}>Shift:</TableCell>
                    <TableCell>{currentTimeSlot ? currentTimeSlot.shift.shiftName : 'N/A'} </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={classes.masterInfoBoxTableCell}> Start Time</TableCell>
                    <TableCell>{currentTimeSlot ? currentTimeSlot.fromTime : 'N/A'} </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={classes.masterInfoBoxTableCell}> End Time</TableCell>
                    <TableCell>{currentTimeSlot ? currentTimeSlot.toTime : 'N/A'} </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Paper>
          </Grid>
          {tags.length > 0 && (
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
                      {/* <TableCell style={{ minWidth: 200, backgroundColor: '#333333', color: '#FFFFFF' }} align="left">
                        Current Slot
                      </TableCell> */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tags.map((tag, index) => (
                      <TableRow key={tag.tagId} className={classes.tableRow}>
                        <TableCell style={{ minWidth: 200 }} align="left">
                          <Typography variant="h4">{tag.tagName}</Typography>
                          <Typography variant="caption">{tag.details}</Typography>
                        </TableCell>
                        <TableCell style={{ minWidth: 200 }} align="left">
                          {tag.factor === 0 ? `${getSign(tag.unitName)}` : `${getSign(tag.unitName)} x ${tag.factor}`}
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
                            id={`currentReading${index}`}
                            name="currentSlotReading"
                            value={tag.currentSlotReading}
                            onChange={e => onReadingChange(e, tag.tagId)}
                            onKeyDown={e => onTextFieldFocus(e, 'currentReading', index, tags.length)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          )}
          <Spinner type="Oval" />

          {currentTimeSlot && tags.length > 0 && (
            <>
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
              <pre id="jsondata"></pre>
            </>
          )}
        </Grid>
        <ScrollToTop />
      </FormWrapper>
    </PageContainer>
  );
};

export default LogSheetCreateForm;

/** Change Log
 * 15-Feb-2022 (nasir) : 'reading' field type made string to number
 * 19-Feb-2022 (nasir) : form submit with enter disabled
 * 08-March-2022 (nasir) : remarks portion modify with continuous addition
 **/
