import { Avatar, lighten, makeStyles, Table, TableBody, TableCell, TableContainer, TableRow } from '@material-ui/core';
import React from 'react';

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

const UserDetails = props => {
  const classes = useStyles();
  const { REACT_APP_BASE_URL } = process.env;

  const { details } = props;

  //#region

  return (
    <TableContainer className={classes.root}>
      <Table className={classes.table} aria-label="custom pagination table">
        <TableBody>
          <TableRow>
            <TableCell component="th" align="left" style={{ maxWidth: 160 }}>
              <strong>Employee Code</strong>
            </TableCell>
            <TableCell align="left">{`: ${details.employeeID}`}</TableCell>

            <TableCell component="th" align="left" style={{ maxWidth: 160 }}>
              <strong>Full Name</strong>
            </TableCell>
            <TableCell align="left">{`: ${details.fullName}`}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell component="th" align="left" style={{ maxWidth: 160 }}>
              <strong>Department</strong>
            </TableCell>
            <TableCell align="left">{`: ${details.departmentName}`}</TableCell>

            <TableCell component="th" align="left" style={{ maxWidth: 160 }}>
              <strong>Designation</strong>
            </TableCell>
            <TableCell align="left">{`: ${details.jobTitle}`}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell component="th" align="left" style={{ maxWidth: 160 }}>
              <strong>Phone</strong>
            </TableCell>
            <TableCell align="left">{`: ${details.phoneNumber}`}</TableCell>

            <TableCell component="th" align="left" style={{ maxWidth: 160 }}>
              <strong>Email</strong>
            </TableCell>
            <TableCell align="left">{`: ${details.email}`}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell component="th" align="left" style={{ maxWidth: 160 }}>
              <strong>Status</strong>
            </TableCell>
            <TableCell align="left">{`: ${details.isEnabled ? 'Active' : 'Inactive'}`}</TableCell>

            <TableCell component="th" align="left" style={{ maxWidth: 160 }}>
              <strong>Roles</strong>
            </TableCell>
            <TableCell align="left">{`: ${details.roles.join(', ')}`}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell component="th" align="left" style={{ maxWidth: 160 }}>
              <strong>Photo</strong>
            </TableCell>
            <TableCell align="left">
              <Avatar
                variant={'circular'}
                src={`${REACT_APP_BASE_URL}/${details.media?.fileUrl}`}
                style={{
                  width: 150,
                  height: 150
                }}
              />
            </TableCell>
            <TableCell component="th" align="left" style={{ maxWidth: 160 }}></TableCell>
            <TableCell align="left"></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserDetails;
