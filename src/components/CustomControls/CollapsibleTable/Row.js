import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { withStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import React from 'react';

const styles = theme => ({
  tableRow: {
    '&.Mui-selected, &.Mui-selected:hover': {
      backgroundColor: '#546E7A',
      '& > .MuiTableCell-root': {
        color: '#FFFFFF'
      }
    }
  }
});

const Row = props => {
  const { row, classes } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow hover key={row.id} selected={open} className={classes.tableRow}>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(prev => !prev)}>
            {open ? <KeyboardArrowUpIcon style={{ color: '#FFFFFF' }} /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{row.operationGroupName}</TableCell>
        <TableCell>{row.sectionName}</TableCell>
        <TableCell>{row.serialNo}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ backgroundColor: '#78909C', color: '#FFFFFF' }}>Tag Name</TableCell>
                    <TableCell style={{ backgroundColor: '#78909C', color: '#FFFFFF' }}>Unit Name</TableCell>
                    <TableCell style={{ backgroundColor: '#78909C', color: '#FFFFFF' }}>IP Address</TableCell>
                    <TableCell style={{ backgroundColor: '#78909C', color: '#FFFFFF' }}>Device</TableCell>
                    <TableCell style={{ backgroundColor: '#78909C', color: '#FFFFFF' }}>Brand</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.tags.map(tag => (
                    <TableRow key={tag.id} hover>
                      <TableCell>{tag.tagName}</TableCell>
                      <TableCell>{tag.unitName}</TableCell>
                      <TableCell>{tag.ipAddress}</TableCell>
                      <TableCell>{tag.deviceModel}</TableCell>
                      <TableCell>{tag.brand}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

Row.propTypes = {
  row: PropTypes.shape({
    operationGroupName: PropTypes.string.isRequired,
    sectionName: PropTypes.string.isRequired,
    serialNo: PropTypes.number.isRequired,
    tags: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        tagName: PropTypes.string.isRequired,
        unitName: PropTypes.string.isRequired,
        ipAddress: PropTypes.string.isRequired,
        deviceModel: PropTypes.string.isRequired,
        brand: PropTypes.string.isRequired
      })
    ).isRequired
  }).isRequired
};

export default withStyles(styles)(Row);
