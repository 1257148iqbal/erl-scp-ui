import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import { CancelButton, CustomPreloder, FormWrapper, ResetButton, SaveButton, TextInput } from 'components/CustomControls';
import PageContainer from 'components/PageComponents/layouts/PageContainer';
import { DECOKING_LOG } from 'constants/ApiEndPoints/v1/decokingLog';
import { useBackDrop } from 'hooks/useBackdrop';
import React, { useEffect, useState } from 'react';
import { FormattedDate } from 'react-intl';
import { trackPromise } from 'react-promise-tracker';
import { useHistory, useLocation } from 'react-router-dom';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import { getSign } from 'utils/commonHelper';
import { serverDate } from 'utils/dateHelper';
import { onTextFieldFocus } from 'utils/keyControl';
import { useStyles } from '../style';

const DecokingLogSheetEditForm = () => {
  const classes = useStyles();

  const { setOpenBackdrop, setLoading } = useBackDrop();

  const [state, setState] = useState(null);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const history = useHistory();

  const {
    state: { key }
  } = useLocation();

  //#region Effect
  useEffect(() => {
    const fetchDependencies = async () => {
      try {
        const res = await http.get(`${DECOKING_LOG.get_single}/${key}`);

        if (res.data.succeeded) {
          const decokingLogSheet = {
            ...res.data.data,
            decokingLogDetails: res.data.data.decokingLogDetails.map(item => ({
              id: item.id,
              decokingLogMasterId: item.decokingLogMasterId,
              operationGroupId: item.operationGroupId,
              operationGroupName: item.operationGroupName,
              parameterId: item.parameterId,
              parameterName: item.parameterName,
              sortOrder: item.sortOrder,
              details: item.details,
              unitId: item.unitId,
              unitName: item.unitName,
              reading: item.reading ? item.reading : ''
            }))
          };
          const uniqueGroupName = [...new Set(decokingLogSheet.decokingLogDetails.map(item => item.operationGroupName))];
          const groupNameArray = uniqueGroupName.reduce((accumulator, current) => {
            const filteredArray = decokingLogSheet.decokingLogDetails.filter(item => item.operationGroupName === current);
            const assignArray = { operationGroupName: current, parameters: filteredArray };
            accumulator.push(assignArray);
            return accumulator;
          }, []);
          decokingLogSheet.decokingLogDetails = groupNameArray;

          setState(decokingLogSheet);
          setIsPageLoaded(true);
        }
      } catch (err) {}
    };

    trackPromise(fetchDependencies());
  }, [key]);
  //#endregion

  //#region States

  //#region Pre Loader
  if (!isPageLoaded) {
    return <CustomPreloder />;
  }
  //#region

  //#region Events

  const onReset = () => {
    const ressetData = state.decokingLogDetails.map(item => ({ ...item, reading: '' }));
    setState({ ...state, decokingLogDetails: ressetData });
  };

  const onChange = (e, operationGroupName, id) => {
    const { name, value } = e.target;
    const oldState = [...state.decokingLogDetails];
    const updatedStates = oldState.map(item => {
      if (item.operationGroupName === operationGroupName) {
        item.parameters.map(parameter => {
          if (parameter.id === id) {
            const regx = /^[+-]?\d*(?:[.,]\d*)?$/;
            const validReading = regx.test(value) ? value : parameter[name];
            parameter[name] = validReading;
          }
          return parameter;
        });
      }
      return item;
    });
    setState({ ...state, decokingLogDetails: updatedStates });
  };

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setOpenBackdrop(true);

    try {
      const oldParameter = [...state.decokingLogDetails];
      const newParameters = oldParameter.reduce((acc, curr) => {
        curr.parameters.map(param => {
          const copiedParam = Object.assign({}, param);
          copiedParam.reading = param.reading ? +param.reading : 0;
          acc.push(copiedParam);
          return copiedParam;
        });
        return acc;
      }, []);

      const data = {
        ...state,
        date: serverDate(state.date),
        decokingLogDetails: newParameters
      };

      const res = await http.put(`${DECOKING_LOG.update}/${data.key}`, data);
      if (res.data.succeeded) {
        toastAlerts('success', res.data.message);
        history.goBack();
      } else {
        setLoading(false);
        setOpenBackdrop(false);
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
    <PageContainer heading="Decoking Log Sheet (Update)">
      <FormWrapper>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={12} lg={12} className={classes.masterInfoBox}>
            <Paper>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className={classes.masterInfoBoxTableCell}>Date: </TableCell>
                    <TableCell>{FormattedDate(state.date)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={classes.masterInfoBoxTableCell}>Time: </TableCell>
                    <TableCell>{state.time}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={classes.masterInfoBoxTableCell}>Decoking No: </TableCell>
                    <TableCell>{state.number}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Paper>
          </Grid>

          {state.decokingLogDetails.map((item, opGrIdx) => (
            <Grid item xs={12} key={item.operationGroupName}>
              <Typography variant="h1" className={classes.operationGroup}>
                {item.operationGroupName}
              </Typography>
              <TableContainer component={Paper} className={classes.root}>
                <Table stickyHeader aria-label="caption table">
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ minWidth: 200, backgroundColor: '#333333', color: '#FFFFFF' }} align="left">
                        Parameters
                      </TableCell>
                      <TableCell style={{ minWidth: 200, backgroundColor: '#333333', color: '#FFFFFF' }} align="left">
                        Unit
                      </TableCell>
                      <TableCell style={{ minWidth: 200, backgroundColor: '#333333', color: '#FFFFFF' }} align="left">
                        Reading
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {item.parameters.map((para, paraIdx) => (
                      <TableRow key={para.id} className={classes.tableRow}>
                        <TableCell size="small">{para.parameterName}</TableCell>
                        <TableCell size="small">{getSign(para.unitName)}</TableCell>
                        <TableCell size="small">
                          <TextInput
                            id={`reading${opGrIdx}${paraIdx}`}
                            name="reading"
                            value={para.reading}
                            className={classes.txtInput}
                            onChange={e => {
                              onChange(e, item.operationGroupName, para.id);
                            }}
                            onKeyDown={e => onTextFieldFocus(e, `reading${opGrIdx}`, paraIdx, item.parameters.length)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          ))}
        </Grid>

        <Grid item xs={12} style={{ marginTop: 15 }}>
          <TextInput
            multiline
            className={classes.txtInput}
            label="Remark"
            name="remark"
            value={state.remark}
            onChange={e => setState({ ...state, remark: e.target.value })}
          />
        </Grid>
        <Grid item container justifyContent="flex-end">
          <SaveButton onClick={onSubmit} />
          <ResetButton onClick={onReset} />
          <CancelButton onClick={() => history.goBack()} />
        </Grid>
      </FormWrapper>
    </PageContainer>
  );
};

export default DecokingLogSheetEditForm;
