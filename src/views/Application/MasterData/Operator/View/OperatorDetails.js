import { lighten, makeStyles, Table, TableBody, TableCell, TableContainer, TableRow } from '@material-ui/core';
import { CustomPreloder } from 'components/CustomControls';
import { OPERATOR } from 'constants/ApiEndPoints/v1';
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

const OperatorDetails = props => {
  const classes = useStyles();

  const { itemKey } = props;
  const [details, setDetails] = useState(null);
  const [isPageLoaded, setIsPageLoaded] = React.useState(false);

  useEffect(() => {
    if (itemKey) {
      http
        .get(`${OPERATOR.get_single}/${itemKey}`)
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
              Employee Name
            </TableCell>
            <TableCell align="left">{`: ${details.operatorName}`}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" align="left" style={{ maxWidth: 160 }}>
              Current Group
            </TableCell>
            <TableCell align="left">{`: ${details.operatorGroupName}`}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell component="th" align="left" style={{ maxWidth: 160 }}>
              Department
            </TableCell>
            <TableCell align="left">{`: ${details.departmentName}`}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell component="th" align="left" style={{ maxWidth: 160 }}>
              Designation
            </TableCell>
            <TableCell align="left">{`: ${details.designationName}`}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell component="th" align="left" style={{ maxWidth: 160 }}>
              Employee Code
            </TableCell>
            <TableCell align="left">{`: ${details.operatorCode}`}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell component="th" align="left" style={{ maxWidth: 160 }}>
              Phone
            </TableCell>
            <TableCell align="left">{`: ${details.phoneNumber}`}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell component="th" align="left" style={{ maxWidth: 160 }}>
              Email
            </TableCell>
            <TableCell align="left">{`: ${details.email}`}</TableCell>
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

export default OperatorDetails;
