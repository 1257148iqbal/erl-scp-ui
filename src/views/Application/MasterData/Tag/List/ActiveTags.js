import { Box, FormControl, Grid, IconButton, MenuItem, Select, Typography } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons';
import { CustomBackDrop, CustomDrawer, CustomPagination, DetailsViewDialog, NewButton } from 'components/CustomControls';
import { TAG } from 'constants/ApiEndPoints/v1';
import { internalServerError } from 'constants/ErrorMessages';
import { TAGS } from 'constants/permissionsType';
import { useBackDrop } from 'hooks/useBackdrop';
import qs from 'querystring';
import React, { useCallback, useEffect, useState } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { useSelector } from 'react-redux';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import TagForm from '../Form/TagForm';
import { useStyles } from '../styles';
import TagContext from '../TagContextProvider/TagContext';
import TagDetails from '../View/TagDetails';
import Tags from './Tags';

const ActiveTags = props => {
  const classes = useStyles();

  //#region Action Button Permission Check
  const { userPermission } = useSelector(({ auth }) => auth);
  const hasEditPermission = userPermission?.includes(TAGS.EDIT);
  const hasDeletePermission = userPermission?.includes(TAGS.DELETE);
  //#endregion

  const { setOpenBackdrop, setLoading } = useBackDrop();

  //#region States
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [state, setState] = useState([]);
  const [dataLength, setDataLength] = useState(0);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [page, setPage] = useState(1);
  const [rowPerPage, setRowPerPage] = useState(10);
  const [confirmDialog, setConfirmDialog] = useState({ title: '', content: '', isOpen: false });

  const [openDetailsView, setOpenDetailsView] = useState(false);
  const [tagKey, setTagKey] = useState(null);
  //#endregion

  //#region UDF's
  const getAllActiveTags = useCallback(() => {
    const queryParam = {
      PageNumber: page,
      PageSize: rowPerPage
    };
    trackPromise(
      http
        .get(`${TAG.get_all_by_section}?${qs.stringify(queryParam)}`)
        .then(res => {
          const tags = res.data.data.map(s => ({
            ...s,
            inSideTags: s.tags.length,
            open: false
          }));
          setState(tags);
          setDataLength(res.data.totalNoOfRow);
        })
        .catch(err => {
          toastAlerts('warning', err);
        })
    );
  }, [page, rowPerPage]);
  //#endregion

  //#region Hooks
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    getAllActiveTags();
  }, [getAllActiveTags]);
  //#endregion

  //#region Events
  const onRowPerPageChange = e => {
    setRowPerPage(e.target.value);
    setPage(1);
  };

  const onPageChange = (event, pageNumber) => {
    setPage(pageNumber);
  };

  const onDrawerOpen = () => {
    setRecordForEdit(null);
    setDrawerOpen(true);
  };

  const onRowToggle = rowId => {
    const upddateTags = state.map(item => {
      if (item.id === rowId) {
        item['open'] = !item.open;
      }
      return item;
    });
    setState(upddateTags);
  };

  const onView = row => {
    setTagKey(row.key);
    setOpenDetailsView(true);
  };

  const onEdit = async key => {
    setOpenBackdrop(true);
    try {
      const res = await http.get(`${TAG.get_single}/${key}`);
      if (res.data.succeeded) {
        const data = res.data.data;
        data.name = res.data.data.tagName;
        setRecordForEdit(data);
        setOpenBackdrop(false);
        setDrawerOpen(true);
      } else {
        toastAlerts('error', res.data.message);
      }
    } catch (error) {
      toastAlerts('warning', error);
    }
  };

  const onDelete = key => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    http
      .delete(`${TAG.delete}/${key}`)
      .then(res => {
        if (res.data.succeeded) {
          toastAlerts('success', res.data.message);
          getAllActiveTags();
        }
      })
      .catch(err => toastAlerts('error', internalServerError));
  };

  const onSubmit = async (e, formValue) => {
    setLoading(true);
    setOpenBackdrop(true);
    const data = {
      ...formValue,
      tagName: formValue.name,
      factor: +formValue.factor,
      sortOrder: +formValue.sortOrder
    };

    try {
      if (data.id > 0) {
        const res = await http.put(`${TAG.update}/${data.key}`, data);
        toastAlerts('success', res.data.message);
      } else {
        const res = await http.post(TAG.create, data);
        toastAlerts('success', res.data.message);
      }
    } catch (err) {
      toastAlerts('warning', err);
    } finally {
      setDrawerOpen(false);
      setLoading(false);
      setOpenBackdrop(false);
      getAllActiveTags();
    }
  };
  //#endregion

  return (
    <Box>
      <Paper>
        <Grid container>
          <Grid className={classes.newBtn} item container justifyContent="flex-start" xs={6} sm={6} md={6} lg={6}>
            <NewButton onClick={onDrawerOpen} appeared />
          </Grid>
        </Grid>

        <TableContainer component={Paper} className={classes.root}>
          <Table stickyHeader className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableCell} />
                <TableCell className={classes.tableCell}>Serial</TableCell>
                <TableCell className={classes.tableCell}>Operation Group</TableCell>
                <TableCell className={classes.tableCell}>Section</TableCell>
                <TableCell className={classes.tableCell} align="center">
                  Total Tags Count
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {state.map(row => (
                <React.Fragment key={row.id}>
                  <TableRow hover selected={row.open} className={classes.tableRow}>
                    <TableCell>
                      <IconButton size="small" onClick={() => onRowToggle(row.id)}>
                        {row.open ? <KeyboardArrowUp style={{ color: '#FFFFFF' }} /> : <KeyboardArrowDown />}
                      </IconButton>
                    </TableCell>
                    <TableCell style={{ minWidth: 100 }}>{row.serialNo}</TableCell>
                    <TableCell style={{ minWidth: 200 }}>{row.operationGroupName}</TableCell>
                    <TableCell style={{ minWidth: 200 }}>{row.sectionName}</TableCell>
                    <TableCell style={{ minWidth: 200 }} align="center">
                      {row.inSideTags}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                      <TagContext.Provider
                        value={{
                          collapsein: row.open,
                          tags: row.tags,
                          hasEditPermission,
                          hasDeletePermission,
                          onView,
                          onEdit,
                          onDelete
                        }}>
                        <Tags />
                      </TagContext.Provider>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Grid container style={{ padding: 10 }}>
          <Grid item container justifyContent="flex-start" xs={12} sm={6} md={6} lg={6}>
            <FormControl>
              <Typography>Row per page : {'\u00A0'}</Typography>
            </FormControl>
            <Select value={rowPerPage} onChange={onRowPerPageChange}>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={30}>30</MenuItem>
            </Select>
          </Grid>
          <Grid item container justifyContent="flex-end" xs={12} sm={6} md={6} lg={6}>
            <CustomPagination count={Math.ceil(dataLength / rowPerPage)} onChange={onPageChange} />
          </Grid>
        </Grid>
      </Paper>
      <CustomDrawer drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} title="Tag">
        <TagForm recordForEdit={recordForEdit} onSubmit={onSubmit} />
      </CustomDrawer>
      <DetailsViewDialog open={openDetailsView} setOpen={setOpenDetailsView} title="Tag Details">
        <TagDetails itemKey={tagKey} />
      </DetailsViewDialog>
      <CustomBackDrop />
    </Box>
  );
};
export default ActiveTags;
