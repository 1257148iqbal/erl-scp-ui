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
import {
  CancelButton,
  CustomPreloder,
  Form,
  FormWrapper,
  ResetButton,
  SaveButton,
  TextInput
} from 'components/CustomControls';
import { StyledTableHeadCell } from 'components/CustomControls/TableRowHeadCell';
import { DAILY_DATA_SHEET } from 'constants/ApiEndPoints/v1/dailyDataSheet';
import { useBackDrop } from 'hooks/useBackdrop';
import React, { useEffect } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { useHistory, useLocation } from 'react-router';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import { twoDecimal } from 'utils/commonHelper';
import { formattedDate } from 'utils/dateHelper';
import { v4 as uuid } from 'uuid';
import { useStyles } from '../Styles';

const DailyDataSheetEditForm = () => {
  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();
  const { setOpenBackdrop, setLoading } = useBackDrop();

  const [state, setState] = React.useState(null);
  const [isPageLoaded, setIsPageLoaded] = React.useState(false);

  //#region UDF
  const getDailyDataSheets = () => {
    trackPromise(
      http
        .get(`${DAILY_DATA_SHEET.get_single}/${location.state}`)
        .then(res => {
          if (res.data.succeeded) {
            const settings = {
              ...res.data.data,
              dailyDataSheetDetails: res.data.data.dailyDataSheetDetails.map(s => ({
                sectionId: uuid(),
                ...s
              }))
            };
            setState(settings);
            setIsPageLoaded(true);
          } else {
            toastAlerts('error', res.data.message);
          }
        })
        .catch(err => toastAlerts('error', err))
    );
  };
  //#region

  ////#region  Hooks
  useEffect(() => getDailyDataSheets(location.state), []);
  //#endregion

  //#region Pre Loader
  if (!isPageLoaded) {
    return <CustomPreloder />;
  }
  //#region

  //#region Events

  const onChange = (e, sectionId) => {
    const { name, value } = e.target;
    const regx = /^[+-]?\d*(?:[.,]\d*)?$/;
    const oldState = [...state.dailyDataSheetDetails];
    const updatedState = oldState.map((section, index, arr) => {
      if (section.sectionId === sectionId) {
        const validReading = regx.test(value) ? value : section[name];
        section[name] = validReading;

        if (section.refSettingId) {
          // For previous reading
          const psObj = arr.find(item => item.selfSettingId === section.refSettingId);
          const previousReading = psObj['previousReading'];

          // For current reading
          const powerObj = arr.find(item => item.sectionId === sectionId);
          const currentReading = powerObj['currentReading'];
          const currentFactor = powerObj['factor'];

          // set updated psCalculatedValue
          const updatedPsCalculatedValue = (currentReading - previousReading) * currentFactor;
          psObj['psCalculatedValue'] = isNaN(updatedPsCalculatedValue) ? 0 : updatedPsCalculatedValue;
        }
      }
      return section;
    });
    setState({ ...state, dailyDataSheetDetails: updatedState });
  };

  const onReset = () => {};
  const onCancel = () => {
    history.goBack();
  };

  const onSubmit = e => {
    setOpenBackdrop(true);
    setLoading(true);
    e.preventDefault();
    const oldState = [...state.dailyDataSheetDetails];
    const dailyDataSheetDetails = oldState.map(section => {
      const copiedItem = Object.assign({}, section);
      copiedItem.factor = +copiedItem.factor;
      copiedItem.vcf = +copiedItem.vcf;
      copiedItem.currentReading = +copiedItem.currentReading;
      delete copiedItem.sectionId;
      return copiedItem;
    });
    const data = {
      ...state,
      dailyDataSheetDetails
    };

    http
      .put(`${DAILY_DATA_SHEET.update}/${data.key}`, data)
      .then(res => {
        if (res.data.succeeded) {
          toastAlerts('success', res.data.message);
          setOpenBackdrop(false);
          setLoading(false);
          history.goBack();
        } else {
          toastAlerts('error', res.data.message);
          setOpenBackdrop(false);
          setLoading(false);
        }
      })
      .catch(err => {
        toastAlerts('error', err);
        setOpenBackdrop(false);
        setLoading(false);
      });
  };

  //#region

  return (
    <FormWrapper>
      <Form>
        <Grid container spacing={3} style={{ marginBottom: 5 }}>
          <Grid item xs={12} sm={12} md={12} lg={12} className={classes.masterInfoBox}>
            <Paper>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className={classes.masterInfoBoxTableCell}>Date</TableCell>
                    <TableCell>{formattedDate(state.date)} </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={classes.masterInfoBoxTableCell}>Time</TableCell>
                    <TableCell>{state.time} </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={7}>
            <TableContainer component={Paper}>
              <Table stickyHeader className={classes.tableCumulative}>
                <TableHead>
                  <TableRow>
                    <StyledTableHeadCell align="center">ITEM</StyledTableHeadCell>
                    <StyledTableHeadCell align="center">FQ READING</StyledTableHeadCell>
                    <StyledTableHeadCell align="center">FACTOR</StyledTableHeadCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {state.dailyDataSheetDetails
                    .filter(item => item.ddsSection === 'Cumulitive')
                    .map(cumulitive => (
                      <TableRow key={cumulitive.sectionId} className={classes.tableRow}>
                        <TableCell size="small" style={{ minWidth: 100 }}>
                          <Typography variant="h4">{cumulitive.displayName}</Typography>
                          <Typography variant="caption">{cumulitive.tagName}</Typography>
                        </TableCell>
                        {cumulitive.isAutoReading ? (
                          <TableCell align="center" size="small" style={{ minWidth: 20 }}>
                            {cumulitive.currentReading}
                          </TableCell>
                        ) : (
                          <TableCell align="center" size="small" style={{ minWidth: 20 }}>
                            <TextInput
                              name="currentReading"
                              value={cumulitive.currentReading}
                              onChange={e => onChange(e, cumulitive.sectionId)}
                            />
                          </TableCell>
                        )}

                        {cumulitive.isAutoReading ? (
                          <TableCell align="center" size="small" style={{ minWidth: 20 }}>
                            {cumulitive.factor}
                          </TableCell>
                        ) : (
                          <TableCell align="center" size="small" style={{ minWidth: 20 }}>
                            <TextInput
                              name="factor"
                              value={cumulitive.factor}
                              onChange={e => onChange(e, cumulitive.sectionId)}
                            />
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={5}>
            <TableContainer component={Paper}>
              <Table stickyHeader className={classes.tableTui}>
                <TableHead>
                  <TableRow>
                    <StyledTableHeadCell align="center" style={{ minWidth: 130, backgroundColor: '#00897B' }}>
                      TUI ITEM
                    </StyledTableHeadCell>
                    <StyledTableHeadCell align="center" style={{ minWidth: 130, backgroundColor: '#00897B' }}>
                      {'TEMP. \u00b0C'}
                    </StyledTableHeadCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {state.dailyDataSheetDetails
                    .filter(item => item.ddsSection === 'TUI')
                    .map(tui => (
                      <TableRow key={tui.id}>
                        <TableCell align="center">{tui.displayName}</TableCell>
                        <TableCell align="center">{twoDecimal(tui.currentReading)}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>

        <Grid container spacing={3} style={{ marginBottom: 5 }}>
          <Grid item xs={12} sm={12} md={12} lg={6}>
            <TableContainer component={Paper}>
              <Table stickyHeader className={classes.table}>
                <TableHead>
                  <TableRow>
                    <StyledTableHeadCell align="center" style={{ minWidth: 130, backgroundColor: '#045170' }}>
                      FI ITEM
                    </StyledTableHeadCell>
                    <StyledTableHeadCell align="center" style={{ minWidth: 130, backgroundColor: '#045170' }}>
                      VALUE
                    </StyledTableHeadCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {state.dailyDataSheetDetails
                    .filter(item => item.ddsSection === 'FIC')
                    .map(fi => (
                      <TableRow key={fi.id}>
                        <StyledTableHeadCell size="small" style={{ minWidth: 130 }}>
                          <Typography variant="h4">{fi.displayName}</Typography>
                          <Typography variant="caption">{fi.signe}</Typography>
                        </StyledTableHeadCell>
                        <TableCell size="small" align="center">
                          {fi.currentReading}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={6}>
            <TableContainer component={Paper}>
              <Table stickyHeader className={classes.table}>
                <TableHead>
                  <TableRow>
                    <StyledTableHeadCell align="center" style={{ minWidth: 130, backgroundColor: '#045170' }}>
                      FIC ITEM
                    </StyledTableHeadCell>
                    <StyledTableHeadCell align="center" style={{ minWidth: 130, backgroundColor: '#045170' }}>
                      VALUE
                    </StyledTableHeadCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {state.dailyDataSheetDetails
                    .filter(item => item.ddsSection === 'FIC')
                    .map(fic => (
                      <TableRow key={fic.id}>
                        <StyledTableHeadCell size="small" style={{ minWidth: 130 }}>
                          <Typography variant="h4">{fic.displayName}</Typography>
                          <Typography variant="caption">{fic.signe}</Typography>
                        </StyledTableHeadCell>
                        <TableCell size="small" align="center">
                          {fic.currentReading}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>

        <Grid container spacing={3} style={{ marginBottom: 5 }}>
          <Grid item xs={12} sm={12} md={12} lg={6}>
            <TableContainer component={Paper}>
              <Table stickyHeader className={classes.table}>
                <TableHead>
                  <TableRow>
                    <StyledTableHeadCell align="center" style={{ minWidth: 130, backgroundColor: '#045170' }}>
                      AMMONIA ITEM
                    </StyledTableHeadCell>
                    <StyledTableHeadCell align="center" style={{ minWidth: 130, backgroundColor: '#045170' }}>
                      VALUE
                    </StyledTableHeadCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {state.dailyDataSheetDetails
                    .filter(item => item.ddsSection === 'Ammonia')
                    .map(ammonia => (
                      <TableRow key={ammonia.id}>
                        <StyledTableHeadCell size="small" style={{ minWidth: 130, backgroundColor: '#E1F5FE' }}>
                          <Typography variant="h4">{ammonia.displayName}</Typography>
                          <Typography variant="caption">{ammonia.signe}</Typography>
                        </StyledTableHeadCell>
                        {ammonia.isAutoReading ? (
                          <TableCell>{ammonia.currentReading}</TableCell>
                        ) : (
                          <TableCell>
                            <TextInput
                              className={classes.txtInput}
                              name="currentReading"
                              value={ammonia.currentReading}
                              onChange={e => onChange(e, ammonia.ddsSection, ammonia.rowId)}
                            />
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={6}>
            <TableContainer component={Paper}>
              <Table stickyHeader className={classes.table}>
                <TableHead>
                  <TableRow>
                    <StyledTableHeadCell align="center" style={{ minWidth: 130, backgroundColor: '#045170' }}>
                      TRAY
                    </StyledTableHeadCell>
                    <StyledTableHeadCell align="center" style={{ minWidth: 130, backgroundColor: '#045170' }}>
                      TRAY Data
                    </StyledTableHeadCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {state.dailyDataSheetDetails
                    .filter(item => item.ddsSection === 'Tray')
                    .map(tray => (
                      <TableRow key={tray.sectionId}>
                        <StyledTableHeadCell size="small" style={{ minWidth: 130, backgroundColor: '#E1F5FE' }}>
                          <Typography variant="h4">{tray.displayName}</Typography>
                          <Typography variant="caption">{tray.signe}</Typography>
                        </StyledTableHeadCell>
                        {tray.isAutoReading ? (
                          <TableCell size="small">{tray.currentReading}</TableCell>
                        ) : (
                          <TableCell size="small">
                            <TextInput
                              className={classes.txtInput}
                              name="currentReading"
                              value={tray.currentReading}
                              onChange={e => onChange(e, tray.sectionId)}
                            />
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>

        <TableContainer>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Paper>
              <Table stickyHeader className={classes.table}>
                <TableHead>
                  <TableRow>
                    <StyledTableHeadCell size="small" align="center" colSpan="5">
                      PRODUCTION SYNOPSIS
                    </StyledTableHeadCell>
                  </TableRow>
                  <TableRow>
                    <StyledTableHeadCell align="center" style={{ minWidth: 130, backgroundColor: '#42663A' }}>
                      ITEM
                    </StyledTableHeadCell>
                    <StyledTableHeadCell align="center" style={{ minWidth: 130, backgroundColor: '#42663A' }}>
                      VCF
                    </StyledTableHeadCell>
                    <StyledTableHeadCell align="center" style={{ minWidth: 130, backgroundColor: '#42663A' }}>
                      Dencity (Last Shift)
                    </StyledTableHeadCell>
                    <StyledTableHeadCell align="center" style={{ minWidth: 130, backgroundColor: '#42663A' }}>
                      Formula
                    </StyledTableHeadCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {state.dailyDataSheetDetails
                    .filter(item => item.ddsSection === 'ProductionSynopsys')
                    .map(item => {
                      return (
                        <TableRow key={item.id}>
                          <TableCell size="small">{item.displayName}</TableCell>
                          <TableCell size="small" align="center">
                            {item.vcf}
                          </TableCell>
                          <TableCell size="small" align="center">
                            {item.density}
                          </TableCell>
                          <TableCell size="small" align="center">
                            {item.psCalculatedValue.toFixed(4)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </Paper>
          </Grid>
        </TableContainer>

        <Grid item container justifyContent="flex-end">
          <SaveButton onClick={onSubmit} />
          <ResetButton onClick={onReset} />
          <CancelButton onClick={onCancel} />
        </Grid>
      </Form>
    </FormWrapper>
  );
};

export default DailyDataSheetEditForm;
