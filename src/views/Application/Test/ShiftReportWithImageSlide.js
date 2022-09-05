import CmtImage from '@coremat/CmtImage';
import { Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@mui/icons-material';
import { ReactComponent as IconUpDown } from 'assets/svg/arrow-down-up.svg';
import { ReactComponent as IconDown } from 'assets/svg/arrow-down.svg';
import { ReactComponent as IconUp } from 'assets/svg/arrow-up.svg';
import Axios from 'axios';
import { CustomAutoComplete, CustomPreloder, Form, FormWrapper } from 'components/CustomControls';
import { StyledTableHeadCell } from 'components/CustomControls/TableRowHeadCell';
import { LAB_SHIFT, SHIFT_REPORT_SETTINGS, TANK } from 'constants/ApiEndPoints/v1';
import {
  Box_1,
  Box_2,
  Box_3,
  Box_4,
  Box_5,
  Box_6,
  Box_7,
  Box_8,
  Box_9,
  FEED,
  GAS_OIL,
  NAPHTHA,
  RESIDUE
} from 'constants/ShiftReportSectionName';
import _ from 'lodash';
import qs from 'querystring';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import 'react-image-lightbox/style.css';
import { trackPromise } from 'react-promise-tracker';
import Select from 'react-select';
import { http } from 'services/httpService';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import { getSign, serverDate, time24 } from 'utils/commonHelper';
import { useStyles } from 'views/Application/QualityControl/ShiftReport/Styles';
import { Arrow, Container, Image, ImageContainer1, ImageContainer2, Pass1, Pass2, Slide, Wrapper } from './Slyder.styled';

const arrOfImages = [
  '/images/ShiftReport.jpg',
  '/images/Capture.PNG',
  '/images/ShiftReport.jpg',
  '/images/Capture.PNG',
  '/images/ShiftReport.jpg',
  '/images/Capture.PNG',
  '/images/ShiftReport.jpg'
];

const data = [
  {
    value: 'Up',
    label: 'Up',
    icon: <IconUp />,
    color: 'green'
  },
  {
    value: 'Down',
    label: 'Down',
    icon: <IconDown />,
    color: 'red'
  },
  {
    value: 'Running',
    label: 'Running',
    icon: <IconUpDown />,
    color: 'blue'
  }
];

const ShiftReportCreateForm = () => {
  //#region collapseAll

  const classes = useStyles();
  const refFeedType = useRef();
  const refTank = useRef();
  const refStability = useRef();
  const [shift, setShift] = React.useState(null);

  const [isPageLoaded, setIsPageLoaded] = React.useState(false);

  const [feedTypes, setFeedTypes] = useState([]);
  const [feedType, setFeedType] = useState(null);

  const [tanks, setTanks] = useState([]);
  const [tank, setTank] = useState(null);

  const [stabilities, setStabilities] = useState([]);
  const [stability, setStability] = useState(null);

  const [tankSymbol, setTankSymbol] = useState(null);

  const [indexOfImages, setIndexOfImages] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const [slideIndex, setSlideIndex] = useState(0);
  const openModalAndSetIndex = index => {
    setIndexOfImages(index);
    setShowModal(true);
    return;
  };

  const getCurrentLabShift = () => {
    const queryParam = {
      CurrentTime: time24(new Date())
    };
    trackPromise(
      http.get(`${LAB_SHIFT.get_current_shift}?${qs.stringify(queryParam)}`).then(res => {
        if (res.data.succeeded) {
          const { id } = res.data.data;
          getShiftWithReading(id);
        }
      })
    );
  };
  const getShiftWithReading = shiftId => {
    const queryParam = {
      date: serverDate(new Date()),
      shiftId: shiftId
    };
    http.get(`${SHIFT_REPORT_SETTINGS.get_shift_report_with_reading}?${qs.stringify(queryParam)}`).then(res => {
      setShift(res.data.data);
      setIsPageLoaded(true);
    });
  };

  const getAllDependencies = () => {
    Axios.all([
      http.get(SHIFT_REPORT_SETTINGS.get_all_feed_type),
      http.get(TANK.get_active),
      http.get(SHIFT_REPORT_SETTINGS.get_all_stability)
    ]).then(
      Axios.spread((...responses) => {
        const feedTypeResponses = responses[0];
        const tankResponses = responses[1];
        const stabilityResponses = responses[2];
        if (feedTypeResponses.data.succeeded && tankResponses.data.succeeded && stabilityResponses.data.succeeded) {
          const feedTypeSection = feedTypeResponses.data.data.map(item => ({
            label: _.startCase(item),
            value: item
          }));

          const tankSection = tankResponses.data.data.map(item => ({
            label: item.tankName,
            value: item.id
          }));

          const stabilitySection = stabilityResponses.data.data.map(item => ({
            label: _.startCase(item),
            value: item
          }));
          setTanks(tankSection);
          setFeedTypes(feedTypeSection);
          setStabilities(stabilitySection);
        }
      })
    );
  };

  useEffect(() => {
    getAllDependencies();
    getCurrentLabShift();
  }, []);

  if (!isPageLoaded) {
    return <CustomPreloder />;
  }

  const onFeedTypeChange = (e, newValue) => {
    const updatedShift = [...shift];
    const feedObj = updatedShift.find(feed => feed.shiftSection === FEED);
    const typeObj = feedObj.shiftReportSettings.find(item => item.name === 'TYPE');
    const feedObjIndex = updatedShift.findIndex(item => item.shiftSection === FEED);
    if (newValue) {
      setFeedType(newValue);
      typeObj.reading = newValue.value;
      updatedShift[feedObjIndex] = feedObj;
      setShift(updatedShift);
    } else {
      setFeedType(null);
      typeObj.reading = '';
      updatedShift[feedObjIndex] = feedObj;
      setShift(updatedShift);
    }
  };

  const onTankNameChange = (e, newValue) => {
    const updatedShift = [...shift];
    const feedObj = updatedShift.find(feed => feed.shiftSection === FEED);
    const typeObj = feedObj.shiftReportSettings.find(item => item.name === 'TANK');
    const feedObjIndex = updatedShift.findIndex(item => item.shiftSection === FEED);
    if (newValue) {
      setTank(newValue);
      typeObj.reading = newValue.label;
      updatedShift[feedObjIndex] = feedObj;
      setShift(updatedShift);
    } else {
      setTank(null);
      typeObj.reading = '';
      updatedShift[feedObjIndex] = feedObj;
      setShift(updatedShift);
    }
  };

  const onStabilityChange = (e, newValue) => {
    const updatedShift = [...shift];
    const feedObj = updatedShift.find(feed => feed.shiftSection === RESIDUE);
    const typeObj = feedObj.shiftReportSettings.find(item => item.name === 'STABILITY');
    const feedObjIndex = updatedShift.findIndex(item => item.shiftSection === RESIDUE);
    if (newValue) {
      setStability(newValue);
      typeObj.reading = newValue.value;
      updatedShift[feedObjIndex] = feedObj;
      setShift(updatedShift);
    } else {
      setStability(null);
      typeObj.reading = '';
      updatedShift[feedObjIndex] = feedObj;
      setShift(updatedShift);
    }
  };

  const onSubmit = e => {
    e.preventDefault();
  };

  const onTankSymbolChange = e => {
    setTankSymbol(e);
  };

  const imgSlides = () =>
    arrOfImages.map((images, index) => (
      <CmtImage
        key={index + 1}
        className={classes.imgdetails}
        src={images}
        width="100%"
        onClick={() => openModalAndSetIndex(index)}
      />
    ));

  //#endregion

  const onSlideChange = direction => {
    if (direction === 'right') {
      setSlideIndex(prevIndex => (prevIndex === 1 ? 0 : prevIndex + 1));
    } else {
      setSlideIndex(prevIndex => (prevIndex === 0 ? 1 : prevIndex - 1));
    }
  };
  return (
    <FormWrapper>
      <Form onSubmit={onSubmit}>
        <Button variant="contained" color="primary" type="submit">
          Submit
        </Button>

        <Grid container spacing={5} style={{ boxSizing: 'border-box' }}>
          <Grid item xs={6} sm={6} md={3} lg={3} style={{ display: 'table', width: '100%' }}>
            <TableContainer component={Paper} style={{ display: 'table-cell' }}>
              <h3 align="center">FEED</h3>
              <Table stickyHeader className={classes.tableCumulative} size="small">
                <TableBody>
                  {shift
                    .find(item => item.shiftSection === FEED)
                    .shiftReportSettings.map(item => {
                      const _item = item;
                      let tablecell;

                      if (_item.getAutoReading) {
                        tablecell = (
                          <TableCell>{` :  ${item.reading ?? 0} ${item.unitName ? getSign(item.unitName) : ''}`}</TableCell>
                        );
                      } else if (item.name === 'TYPE') {
                        tablecell = (
                          <TableCell>
                            <CustomAutoComplete
                              ref={refFeedType}
                              data={feedTypes}
                              label="Type"
                              value={feedType}
                              onChange={onFeedTypeChange}
                            />
                          </TableCell>
                        );
                      } else {
                        tablecell = (
                          <TableCell style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
                            <CustomAutoComplete
                              ref={refTank}
                              data={tanks}
                              label="Tank"
                              value={tank}
                              onChange={onTankNameChange}
                            />
                            <Select
                              className={classes.symbol}
                              placeholder="Symbol"
                              value={tankSymbol}
                              options={data}
                              onChange={onTankSymbolChange}
                              getOptionLabel={e => (
                                <div style={{ display: 'flex', alignItems: 'center', color: e.color }}>{e.icon}</div>
                              )}
                            />
                          </TableCell>
                        );
                      }

                      return (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          {tablecell}
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={6} sm={6} md={2} lg={2} style={{ display: 'table', width: '100%' }}>
            <TableContainer component={Paper} style={{ display: 'table-cell' }}>
              <h3 style={{ textAlign: 'center' }}>HAPH</h3>
              <Table stickyHeader className={classes.tableCumulative} size="small">
                <TableBody>
                  {shift
                    .find(item => item.shiftSection === NAPHTHA)
                    .shiftReportSettings.map(item => (
                      <TableRow key={item.id}>
                        <TableCell>{`${item.name}`}</TableCell>
                        <TableCell>{` :  ${item.reading ?? 0} ${getSign(item.unitName)}`}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={6} sm={6} md={2} lg={2} style={{ display: 'table', width: '100%' }}>
            <TableContainer component={Paper} style={{ display: 'table-cell' }}>
              <h3 style={{ textAlign: 'center' }}>G.O.</h3>
              <Table stickyHeader className={classes.tableCumulative} size="small">
                <TableBody>
                  {shift
                    .find(item => item.shiftSection === GAS_OIL)
                    .shiftReportSettings.map(item => (
                      <TableRow key={item.id}>
                        <TableCell>{`${item.name}`}</TableCell>
                        <TableCell>{` :  ${item.reading ?? 0} ${getSign(item.unitName)}`}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={6} sm={6} md={3} lg={3} style={{ display: 'table', width: '100%' }}>
            <TableContainer component={Paper} style={{ display: 'table-cell' }}>
              <h3 style={{ textAlign: 'center' }}>RESID</h3>
              <Table stickyHeader className={classes.tableCumulative} size="small">
                <TableBody>
                  {shift
                    .find(item => item.shiftSection === RESIDUE)
                    .shiftReportSettings.map(item => {
                      const _item = item;
                      let tablecell;

                      if (_item.getAutoReading) {
                        tablecell = (
                          <TableCell>{` :  ${item.reading ?? 0} ${item.unitName ? getSign(item.unitName) : ''}`}</TableCell>
                        );
                      } else {
                        tablecell = (
                          <TableCell>
                            <CustomAutoComplete
                              ref={refStability}
                              data={stabilities}
                              label="Stability"
                              value={stability}
                              onChange={onStabilityChange}
                            />
                          </TableCell>
                        );
                      }

                      return (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          {tablecell}
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={6} sm={6} md={2} lg={2} style={{ display: 'table', width: '100%' }}>
            <TableContainer component={Paper} style={{ display: 'table-cell' }}>
              <h3 style={{ textAlign: 'center' }}>SPECIAL TESTS</h3>
              <Table stickyHeader className={classes.tableCumulative} size="small">
                <TableBody>
                  <TableRow>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
        {/* slider */}
        <Grid>
          <Container>
            <Arrow direction="left" onClick={() => onSlideChange('left')}>
              <ArrowLeftOutlined />
            </Arrow>

            <Wrapper slideIndex={slideIndex}>
              <Slide>
                <ImageContainer1>
                  <Pass1>0.25</Pass1>
                  <Image src="/images/ShiftReport.jpg" />
                </ImageContainer1>
              </Slide>

              <Slide>
                <ImageContainer2>
                  <Pass2>Fuel</Pass2>
                  <Image src="/images/Capture.PNG" />
                </ImageContainer2>
              </Slide>
            </Wrapper>

            <Arrow direction="right" onClick={() => onSlideChange('right')}>
              <ArrowRightOutlined />
            </Arrow>
          </Container>
        </Grid>
        {/* slider */}

        <Grid container spacing={5}>
          <Grid item xs={12}>
            <h2>COLUMN DA-3001/DA-3002/DA-3004</h2>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={3}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    {shift
                      .find(item => item.shiftSection === Box_1)
                      .shiftReportSettings.map(item => (
                        <StyledTableHeadCell key={item.id} align="center" style={{ minWidth: 90 }}>
                          {item.name}
                        </StyledTableHeadCell>
                      ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  <TableRow>
                    {shift
                      .find(item => item.shiftSection === Box_1)
                      .shiftReportSettings.map(item => {
                        return (
                          <TableCell key={item.id} align="center" style={{ minWidth: 90 }}>
                            {`${item.reading ?? 0} ${getSign(item.unitName)}`}
                          </TableCell>
                        );
                      })}
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={6}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    {shift
                      .find(item => item.shiftSection === Box_2)
                      .shiftReportSettings.map(item => (
                        <StyledTableHeadCell key={item.id} align="center" style={{ minWidth: 95 }}>
                          {item.name}
                        </StyledTableHeadCell>
                      ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  <TableRow>
                    {shift
                      .find(item => item.shiftSection === Box_2)
                      .shiftReportSettings.map(item => {
                        return (
                          <TableCell key={item.id} align="center" style={{ minWidth: 95 }}>
                            {`${item.reading ?? 0} ${getSign(item.unitName)}`}
                          </TableCell>
                        );
                      })}
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={3}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    {shift
                      .find(item => item.shiftSection === Box_3)
                      .shiftReportSettings.map(item => (
                        <StyledTableHeadCell key={item.id} align="center" style={{ minWidth: 120 }}>
                          {item.name}
                        </StyledTableHeadCell>
                      ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  <TableRow>
                    {shift
                      .find(item => item.shiftSection === Box_3)
                      .shiftReportSettings.map(item => {
                        return (
                          <TableCell key={item.id} align="center" style={{ minWidth: 120 }}>
                            {`${item.reading ?? 0} ${getSign(item.unitName)}`}
                          </TableCell>
                        );
                      })}
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={3}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    {shift
                      .find(item => item.shiftSection === Box_4)
                      .shiftReportSettings.map(item => (
                        <StyledTableHeadCell key={item.id} align="center" style={{ minWidth: 120 }}>
                          {item.name}
                        </StyledTableHeadCell>
                      ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  <TableRow>
                    {shift
                      .find(item => item.shiftSection === Box_4)
                      .shiftReportSettings.map(item => {
                        return (
                          <TableCell key={item.id} align="center" style={{ minWidth: 120 }}>
                            {`${item.reading ?? 0} ${getSign(item.unitName)}`}
                          </TableCell>
                        );
                      })}
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={6}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    {shift
                      .find(item => item.shiftSection === Box_5)
                      .shiftReportSettings.map(item => (
                        <StyledTableHeadCell key={item.id} align="center" style={{ minWidth: 120 }}>
                          {item.name}
                        </StyledTableHeadCell>
                      ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  <TableRow>
                    {shift
                      .find(item => item.shiftSection === Box_5)
                      .shiftReportSettings.map(item => {
                        return (
                          <TableCell key={item.id} align="center" style={{ minWidth: 120 }}>
                            {`${item.reading ?? 0} ${getSign(item.unitName)}`}
                          </TableCell>
                        );
                      })}
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={3}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    {shift
                      .find(item => item.shiftSection === Box_6)
                      .shiftReportSettings.map(item => (
                        <StyledTableHeadCell key={item.id} align="center" style={{ minWidth: 120 }}>
                          {item.name}
                        </StyledTableHeadCell>
                      ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  <TableRow>
                    {shift
                      .find(item => item.shiftSection === Box_6)
                      .shiftReportSettings.map(item => {
                        return (
                          <TableCell key={item.id} align="center" style={{ minWidth: 120 }}>
                            {`${item.reading ?? 0} ${getSign(item.unitName)}`}
                          </TableCell>
                        );
                      })}
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={12}>
            <h2>COLUMN DA-3003</h2>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={3}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    {shift
                      .find(item => item.shiftSection === Box_7)
                      .shiftReportSettings.map(item => (
                        <StyledTableHeadCell key={item.id} align="center" style={{ minWidth: 120 }}>
                          {item.name}
                        </StyledTableHeadCell>
                      ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  <TableRow>
                    {shift
                      .find(item => item.shiftSection === Box_7)
                      .shiftReportSettings.map(item => {
                        return (
                          <TableCell key={item.id} align="center" style={{ minWidth: 120 }}>
                            {`${item.reading ?? 0} ${getSign(item.unitName)}`}
                          </TableCell>
                        );
                      })}
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={6}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    {shift
                      .find(item => item.shiftSection === Box_8)
                      .shiftReportSettings.map(item => (
                        <StyledTableHeadCell key={item.id} align="center" style={{ minWidth: 120 }}>
                          {item.name}
                        </StyledTableHeadCell>
                      ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  <TableRow>
                    {shift
                      .find(item => item.shiftSection === Box_8)
                      .shiftReportSettings.map(item => {
                        return (
                          <TableCell key={item.id} align="center" style={{ minWidth: 120 }}>
                            {`${item.reading ?? 0} ${getSign(item.unitName)}`}
                          </TableCell>
                        );
                      })}
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={3}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    {shift
                      .find(item => item.shiftSection === Box_9)
                      .shiftReportSettings.map(item => (
                        <StyledTableHeadCell key={item.id} align="center" style={{ minWidth: 120 }}>
                          {item.name}
                        </StyledTableHeadCell>
                      ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {shift
                    .find(item => item.shiftSection === Box_9)
                    .shiftReportSettings.map(item => {
                      let tableCell;
                      if (item.getAutoReading) {
                        tableCell = (
                          <Fragment>
                            <TableCell key={item.id} align="center" style={{ minWidth: 120 }}>
                              {`${item.reading ?? 0} ${getSign(item.unitName)}`}
                            </TableCell>
                          </Fragment>
                        );
                      } else {
                        tableCell = (
                          <Fragment>
                            <TableCell key={item.id} align="center" style={{ minWidth: 120 }}>
                              DATA
                            </TableCell>
                          </Fragment>
                        );
                      }
                      return <TableRow key={item.id}>{tableCell}</TableRow>;
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12}>
            <h2>MATERIAL BALANCE (ONE HR. BASIS):</h2>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={6}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableHeadCell align="center" style={{ minWidth: 110 }}></StyledTableHeadCell>
                    <StyledTableHeadCell align="center">{'M\u00b3'}</StyledTableHeadCell>
                    <StyledTableHeadCell align="center">MT</StyledTableHeadCell>
                    <StyledTableHeadCell align="center">%</StyledTableHeadCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>FEED</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>FLUS. OIL</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={6}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableHeadCell align="center" style={{ minWidth: 110 }}>
                      PRODUCTION
                    </StyledTableHeadCell>
                    <StyledTableHeadCell align="center">{'M\u00b3'}</StyledTableHeadCell>
                    <StyledTableHeadCell align="center">MT</StyledTableHeadCell>
                    <StyledTableHeadCell align="center">% YIELD</StyledTableHeadCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>GAS</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>NAPHTHA</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>G.O.</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>RESID</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Form>
    </FormWrapper>
  );
};

export default ShiftReportCreateForm;
