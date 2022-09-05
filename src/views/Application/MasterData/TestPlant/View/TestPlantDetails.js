import { lighten, makeStyles, Table, TableBody, TableCell, TableContainer, TableRow } from '@material-ui/core';
import { CustomPreloder } from 'components/CustomControls';
import { LAB_UNIT } from 'constants/ApiEndPoints/v1';
import React, { useEffect, useState } from 'react';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: lighten(theme.palette.background.paper, 0.1)
  },
  table: {
    minWidth: 250
  },
  container: {
    padding: 15
  }
}));

const TestPlantDetails = props => {
  const classes = useStyles();

  const { itemKey } = props;
  const [details, setDetails] = useState(null);
  const [isPageLoaded, setIsPageLoaded] = React.useState(false);

  useEffect(() => {
    if (itemKey) {
      http
        .get(`${LAB_UNIT.get_single}/${itemKey}`)
        .then(res => {
          if (res.data.succeeded) {
            setDetails(res.data.data);
            setIsPageLoaded(true);
          }
        })
        .catch(err => toastAlerts('error', err));
    }
  }, [itemKey]);

  //#region Pre Loader
  if (!isPageLoaded) {
    return <CustomPreloder />;
  }
  //#region

  return (
    <TableContainer className={classes.root}>
      <Table className={classes.table} aria-label="custom pagination table">
        <TableBody>
          <TableRow>
            <TableCell component="th" align="left" style={{ maxWidth: 160 }}>
              Plant Name
            </TableCell>
            <TableCell align="left">{`: ${details.unitName}`}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell component="th" align="left" style={{ maxWidth: 160 }}>
              Alias
            </TableCell>
            <TableCell align="left">{`: ${details.alias}`}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell component="th" align="left" style={{ maxWidth: 160 }}>
              Status
            </TableCell>
            <TableCell align="left">{`: ${details.isActive ? 'Active' : 'Inactive'}`}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TestPlantDetails;
