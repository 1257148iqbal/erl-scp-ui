/**
 * Title: Log sheet create by Manager form
 * Description:
 * Author: Nasir Ahmed
 * Date: 16-August-2022
 * Modified: 02-June-2022
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
import Axios from 'axios';
import clsx from 'clsx';
import {
  CancelButton,
  CustomAutoComplete,
  CustomDatePicker,
  Form,
  FormWrapper,
  ResetButton,
  SaveButton,
  ScrollToTop,
  Spinner,
  TextInput
} from 'components/CustomControls';
import PageContainer from 'components/PageComponents/layouts/PageContainer';
import { LAB_SHIFT, LOG_SHEET, OPERATION_GROUP, SECTION, TAG, TIME_SLOT } from 'constants/ApiEndPoints/v1';
import { internalServerError } from 'constants/ErrorMessages';
import { useBackDrop } from 'hooks/useBackdrop';
import qs from 'querystring';
import React, { useEffect, useReducer, useRef } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { http } from 'services/httpService';
import { sweetAlerts, toastAlerts } from 'utils/alerts';
import { getSign, scrollToTop } from 'utils/commonHelper';
import { serverDate } from 'utils/dateHelper';
import {
  ADD_REMARK,
  CHANGE_DATE,
  CHANGE_OPERATION_GROUP,
  CHANGE_OPERATION_GROUP_FAIL,
  CHANGE_REMARK,
  CHANGE_SECTION,
  CHANGE_SECTION_FAIL,
  CHANGE_SHIFT,
  CHANGE_SHIFT_FAIL,
  CHANGE_TAG,
  CHANGE_TIME_SLOT,
  CHANGE_TIME_SLOT_FAIL,
  FETCH_OPERATION_GROUP,
  FETCH_SECTIONS,
  FETCH_SHIFT,
  FETCH_TAGS,
  FETCH_TIME_SLOT,
  REMOVE_REMARK,
  RESET
} from '../store/actionTypes';
import { initialState, logSheetSpecificReducer } from '../store/reducer';

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

const LogSheetSpecificForm = props => {
  const [state, dispatch] = useReducer(logSheetSpecificReducer, initialState);
  //#region refs
  const refOperationGroup = useRef();
  const refShiftName = useRef();
  const refSlotName = useRef();
  const refSection = useRef();
  //#endregion

  const classes = useStyles();
  const { setOpenBackdrop, setLoading } = useBackDrop();
  const { operationGroup } = useParams();
  const operationGroupName = operationGroup.split('-')[0];
  const { history } = props;

  // const [remarks, setRemarks] = React.useState([]);

  const {
    authUser: { userName, employeeID, operatorId }
  } = useSelector(({ auth }) => auth);

  //#region States

  //#endregion

  //#region UDF

  const getTagsBySection = sectionId => {
    const queryParam = {
      OperationGroupId: state.operationGroup.value,
      SectionId: sectionId,
      Date: serverDate(state.date),
      FromTime: state.timeSlot.fromTime,
      IsSpacific: true
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
              previousSlotReading: tag.reading ?? '-',
              currentSlotReading: tag.reading ?? ''
            }));
            dispatch({ type: FETCH_TAGS, payload: tags });
          }
        })
        .catch(err => toastAlerts('error', err))
    );
  };

  const getSectionsByOperationGroup = operationGroupId => {
    http
      .get(`${SECTION.get_by_operationGroup}/${operationGroupId}`)
      .then(res => {
        if (res.data.succeeded) {
          const sections = res.data.data.map(item => ({ label: item.sectionName, value: item.id }));
          dispatch({ type: FETCH_SECTIONS, payload: sections });
        }
      })
      .catch(err => {
        toastAlerts('error', err);
      });
  };

  const getTimeSlotsByOperationGroupAndShift = shiftId => {
    const queryParam = {
      OperationGroupId: state.operationGroup.value,
      ShiftId: shiftId
    };
    http
      .get(`${TIME_SLOT.get_by_operation_group_and_shift}?${qs.stringify(queryParam)}`)
      .then(res => {
        if (res.data.succeeded) {
          const timeSlots = res.data.data.map(item => ({
            label: item.slotName,
            value: item.id,
            fromTime: item.fromTime,
            toTime: item.toTime
          }));
          dispatch({ type: FETCH_TIME_SLOT, payload: timeSlots });
        }
      })
      .catch(err => {
        toastAlerts('error', err);
      });
  };

  const checkDuplicateLogSheet = () => {
    if (state.operationGroup && state.shift && state.timeSlot && state.section) {
      const queryParam = {
        OperationGroupId: state.operationGroup.value,
        SectionId: state.section.value,
        ShiftId: state.shift.value,
        TimeSlotId: state.timeSlot.value,
        Date: serverDate(state.date)
      };
      trackPromise(
        http
          .get(`${LOG_SHEET.check_duplicate_log_sheet}?${qs.stringify(queryParam)}`)
          .then(res => {
            if (res.data.succeeded) {
              if (res.data.data > 0) {
                sweetAlerts('error', 'Error', res.data.message);
              } else {
                getTagsBySection(state.section.value);
              }
            } else {
              toastAlerts('error', res.data.message);
            }
          })
          .catch(err => toastAlerts('error', internalServerError))
      );
    } else {
      toastAlerts('warning', 'Please select all fields!!!');
    }
  };

  //#endregion

  //#region hook
  useEffect(() => {
    Axios.all([http.get(OPERATION_GROUP.get_active), http.get(LAB_SHIFT.get_active)]).then(
      Axios.spread((...responses) => {
        const operationGroupReponse = responses[0].data;
        const shiftResponse = responses[1].data;
        if (operationGroupReponse.succeeded && shiftResponse.succeeded) {
          const operationGroups = operationGroupReponse.data.map(item => ({
            label: item.groupName,
            value: item.id,
            alias: item.alias
          }));
          const activeShifts = shiftResponse.data.map(item => ({ label: item.shiftName, value: item.id }));
          dispatch({ type: FETCH_OPERATION_GROUP, payload: operationGroups });
          dispatch({ type: FETCH_SHIFT, payload: activeShifts });
        } else {
          toastAlerts('error', 'Dependency not loaded');
        }
      })
    );
  }, []);

  //#endregion

  //#region Event
  const onAddRemak = () => {
    const _remarks = [...state.remarks].concat(state.remark);
    dispatch({ type: ADD_REMARK, payload: _remarks });
    const ele = document.querySelector('#remark');
    ele.focus();
  };

  const onPressRemark = e => {
    if (e.key === 'Enter') {
      onAddRemak();
    }
  };

  const onOperationGroupChange = (e, newValue) => {
    if (newValue) {
      dispatch({ type: CHANGE_OPERATION_GROUP, payload: newValue });
      getSectionsByOperationGroup(newValue.value);
    } else {
      dispatch({ type: CHANGE_OPERATION_GROUP_FAIL });
    }
  };

  const onShiftChange = (e, newValue) => {
    if (newValue) {
      dispatch({ type: CHANGE_SHIFT, payload: newValue });
      getTimeSlotsByOperationGroupAndShift(newValue.value);
    } else {
      dispatch({ type: CHANGE_SHIFT_FAIL });
    }
  };

  const onSectionChange = (e, newValue) => {
    if (newValue) {
      dispatch({ type: CHANGE_SECTION, payload: newValue });
    } else {
      dispatch({ type: CHANGE_SECTION_FAIL });
    }
  };

  const onTimeSlotChange = (e, newValue) => {
    if (newValue) {
      //setTimeSlot(newValue);
      dispatch({ type: CHANGE_TIME_SLOT, payload: newValue });
    } else {
      dispatch({ type: CHANGE_TIME_SLOT_FAIL });
    }
  };

  const onReadingChange = (e, tagId) => {
    const { name, value } = e.target;
    const oldTags = [...state.tags];

    const updatedTags = oldTags.map(tag => {
      if (tag.tagId === tagId) {
        tag[name] = value;
      }
      return tag;
    });
    dispatch({ type: CHANGE_TAG, payload: updatedTags });
  };

  const onReset = () => {
    const resetedTags = state.tags.map(tag => ({ ...tag, currentSlotReading: '' }));
    dispatch({ type: RESET, payload: resetedTags });
  };

  const onCancel = () => {
    history.goBack();
  };

  const onDateChange = date => {
    dispatch({ type: CHANGE_DATE, payload: date });
  };

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setOpenBackdrop(true);
    const data = {
      date: serverDate(state.date),
      operationGroupId: state.operationGroup ? state.operationGroup.value : '',
      operationGroupName: state.operationGroup ? state.operationGroup.label : '',
      alias: state.operationGroup ? state.operationGroup.alias : '',
      sectionId: state.section ? state.section.value : '',
      sectionName: state.section ? state.section.label : '',
      shiftId: state.shift.value,
      shiftName: state.shift.label,
      timeSlotId: state.timeSlot.value,
      slotName: state.timeSlot.label,
      slotFromTime: state.timeSlot.fromTime,
      slotToTime: state.timeSlot.toTime,
      remark: state.remarks.join('~'),
      operatorId: operatorId,
      empCode: employeeID,
      userName: userName,
      logSheetDetails: state.tags.map(tag => {
        const copiedItem = Object.assign({}, tag);
        copiedItem.reading = tag.currentSlotReading;
        delete copiedItem.previousSlotReading;
        delete copiedItem.currentSlotReading;
        return copiedItem;
      })
    };
    try {
      const res = await http.post(LOG_SHEET.create, data);
      if (res.data.succeeded) {
        onReset();
        scrollToTop();
        toastAlerts('success', res.data.message);
      } else {
        toastAlerts('error', res.data.message);
      }
    } catch (err) {
      setOpenBackdrop(false);
      toastAlerts('error', err);
    } finally {
      setLoading(false);
      setOpenBackdrop(false);
    }
  };
  //#endregion

  return (
    <PageContainer heading={`${operationGroupName} Log sheet (Create Specific)`}>
      <FormWrapper>
        <Form>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12} md={12} lg={12} className={classes.masterInfoBox}>
              <Paper>
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell className={classes.masterInfoBoxTableCell}>Date:</TableCell>
                      <TableCell className={classes.masterInfoBoxTableCell}>
                        <CustomDatePicker label="Select Date" value={state.date} onChange={onDateChange} />
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className={classes.masterInfoBoxTableCell}>Operation Group:</TableCell>
                      <TableCell className={classes.masterInfoBoxTableCell}>
                        <CustomAutoComplete
                          ref={refOperationGroup}
                          name="operationGroupId"
                          data={state.operationGroups}
                          label="Operation Group"
                          value={state.operationGroup}
                          onChange={onOperationGroupChange}
                        />
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className={classes.masterInfoBoxTableCell}>Shift:</TableCell>
                      <TableCell>
                        <CustomAutoComplete
                          ref={refShiftName}
                          name="shiftId"
                          data={state.shifts}
                          label="Shift"
                          value={state.shift}
                          onChange={onShiftChange}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className={classes.masterInfoBoxTableCell}>Slot</TableCell>
                      <TableCell>
                        <CustomAutoComplete
                          ref={refSlotName}
                          name="timeSlotId"
                          data={state.timeSlots}
                          label="Select Slot"
                          value={state.timeSlot}
                          onChange={onTimeSlotChange}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className={classes.masterInfoBoxTableCell}>Section</TableCell>
                      <TableCell>
                        <CustomAutoComplete
                          ref={refSection}
                          name="sectionId"
                          data={state.sections}
                          label="Select Section"
                          value={state.section}
                          onChange={onSectionChange}
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Paper>
            </Grid>

            <Grid item container xs={12} sm={12} md={12} lg={12} justifyContent="flex-end">
              <Button color="primary" variant="contained" onClick={checkDuplicateLogSheet}>
                Check
              </Button>
            </Grid>
            {state.tags.length > 0 && (
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
                        <TableCell style={{ minWidth: 200, backgroundColor: '#333333', color: '#FFFFFF' }} align="left">
                          Last slot
                        </TableCell>
                        <TableCell style={{ minWidth: 200, backgroundColor: '#333333', color: '#FFFFFF' }} align="left">
                          Current slot
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {state.tags.map(tag => (
                        <TableRow key={tag.tagId} className={classes.tableRow}>
                          <TableCell style={{ minWidth: 200 }} align="left">
                            <Typography variant="h4">{tag.tagName}</Typography>
                            <Typography variant="caption">{tag.details}</Typography>
                          </TableCell>
                          <TableCell style={{ minWidth: 200 }} align="left">
                            {tag.factor === 0 ? `${getSign(tag.unitName)}` : `${getSign(tag.unitName)} x ${tag.factor}`}
                          </TableCell>
                          <TableCell style={{ minWidth: 200 }} align="left">
                            {tag.previousSlotReading}
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
            )}
            <Spinner type="Oval" />

            {state.tags.length > 0 && (
              <>
                <Grid item xs={12} style={{ marginTop: 15, display: 'flex', alignItems: 'center' }}>
                  <TextInput
                    className={clsx(classes.txtInput, classes.onPressRemark)}
                    id="remark"
                    label="Remarks"
                    name="remarks"
                    value={state.remark}
                    onChange={e => dispatch({ type: CHANGE_REMARK, payload: e.target.value })}
                    onKeyPress={onPressRemark}
                  />

                  <Button variant="contained" color="primary" className={classes.addRemarkBtn} onClick={onAddRemak}>
                    <Add />
                  </Button>
                </Grid>

                <Grid item xs={12}>
                  <ul className={classes.remarkList}>
                    {state.remarks?.map((rm, rmIdx) => (
                      <li key={rmIdx + 1} className={classes.remarkListItem}>
                        <span style={{ paddingLeft: 5 }}>{rm}</span>
                        <span
                          className={classes.removeIcon}
                          onClick={() => dispatch({ type: REMOVE_REMARK, payload: rmIdx })}>
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
              </>
            )}
          </Grid>
        </Form>
        <ScrollToTop />
      </FormWrapper>
    </PageContainer>
  );
};

export default LogSheetSpecificForm;

/**
 * 2022-02-13 (nasir) : Operation Group end point change
 * 15-Feb-2022 (nasir) : 'reading' field type made string to number
 * 19-Feb-2022 (nasir) : form submit with enter disabled
 * 02-June-2022 (nasir) : Shift to Lab shift in shift ddl
 **/
