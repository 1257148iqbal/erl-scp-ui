import { Box, withStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    maxWidth: 752
  },

  title: {
    margin: theme.spacing(8, 0, 4),
    backgroundColor: '#045170',
    color: 'white',
    padding: '5px 5px',
    borderRadius: 10,
    textAlign: 'center',
    minWidth: '150px'
  },
  container: {
    display: 'table',
    width: '100%'
  },
  col: {
    display: 'table-cell',
    backgroundColor: theme.palette.background.default
  },
  primaryText: {
    color: '#818183'
  },
  secondaryText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000'
  },
  buttonPrint: {
    textDecoration: 'none',
    margin: 5,
    height: 42,
    border: 'none',
    backgroundColor: '#FFFFFF',
    color: '#FEA362',
    width: 100,
    [theme.breakpoints.up('xs')]: {
      marginRight: 0
    },
    '&:hover': {
      backgroundColor: '#FEA362',
      color: '#FFFFFF',
      border: 'none'
    }
  }
}));

const StyledListItemText = withStyles(theme => ({
  primary: {
    color: '#818183'
  },
  secondary: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000'
  }
}))(ListItemText);

export default function DailyProductionDetails(props) {
  const { details } = props;
  const classes = useStyles();

  //#region

  return (
    <Box className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={4} className={classes.container}>
          <Box className={classes.col}>
            <Typography variant="h6" className={classes.title}>
              THROUGH PUT
            </Typography>

            <Box>
              <List>
                <ListItem>
                  <StyledListItemText primary="FEED ALC" secondary={details.feed_ALC ? details.feed_ALC : '-'} />
                </ListItem>
                <ListItem>
                  <StyledListItemText primary="FEED Murban" secondary={details.feed_Murban ? details.feed_Murban : '-'} />
                </ListItem>
              </List>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={4} className={classes.container}>
          <Box className={classes.col}>
            <Typography variant="h6" className={classes.title}>
              PRODUCTION
            </Typography>
            <Box>
              <List>
                <ListItem>
                  <StyledListItemText primary="Gas Oil (MT)" secondary={details.gas_Oil ? details.gas_Oil : '-'} />
                </ListItem>
                <ListItem>
                  <StyledListItemText primary="Residue (MT)" secondary={details.residue ? details.residue : '-'} />
                </ListItem>
                <ListItem>
                  <StyledListItemText primary="NAPTHA (MT)" secondary={details.naptha ? details.naptha : '-'} />
                </ListItem>
                <ListItem>
                  <StyledListItemText primary="GAS (N-m3)" secondary={details.gas ? details.gas : '-'} />
                </ListItem>
                <ListItem>
                  <StyledListItemText primary="STEAM (MT)" secondary={details.steam ? details.steam : '-'} />
                </ListItem>
              </List>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={4} className={classes.container}>
          <Box className={classes.col}>
            <Typography variant="h6" className={classes.title}>
              CONSUMPTION
            </Typography>
            <Box>
              <List>
                <ListItem>
                  <StyledListItemText primary="NG (N-m3)" secondary={details.ng ? details.ng : '-'} />
                </ListItem>
                <ListItem>
                  <StyledListItemText primary="POWER (kwh)" secondary={details.power ? details.power : '-'} />
                </ListItem>
                <ListItem>
                  <StyledListItemText primary="NH3 (Kg)" secondary={details.nH3 ? details.nH3 : '-'} />
                </ListItem>
                <ListItem>
                  <StyledListItemText primary="C.I (Ltr)" secondary={details.ci ? details.ci : '-'} />
                </ListItem>
                <ListItem>
                  <StyledListItemText primary="A.O (Ltr)" secondary={details.ao ? details.ao : '-'} />
                </ListItem>
              </List>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
