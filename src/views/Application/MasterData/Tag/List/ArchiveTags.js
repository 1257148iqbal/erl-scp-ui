import { Box, makeStyles, Paper } from '@material-ui/core';
import { ActionButtonGroup, ConfirmDialog, CustomTable, DetailsViewDialog } from 'components/CustomControls';
import { StyledTableCell, StyledTableRow } from 'components/CustomControls/TableRowHeadCell';
import { TAG } from 'constants/ApiEndPoints/v1';
import { internalServerError } from 'constants/ErrorMessages';
import { TAGS } from 'constants/permissionsType';
import qs from 'querystring';
import React, { useEffect } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { useSelector } from 'react-redux';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import TagDetails from '../View/TagDetails';

const useStyles = makeStyles(theme => ({
  toolbar: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(2)
  },
  newBtn: {
    padding: 10,
    paddingTop: 15,
    paddingBottom: 15
  },
  filteredItems: {
    padding: 10,
    backgroundColor: '#ECF0F6',
    borderRadius: 5,
    margin: 10
  },
  actionButton: {
    marginLeft: 5
  },
  filterBoxBackground: {
    backgroundColor: '#FFFFFF'
  }
}));
const ArchiveTagList = () => {
  const classes = useStyles();

  //#region Action Button Permission Check
  const { userPermission } = useSelector(({ auth }) => auth);
  const hasRetrivePermission = userPermission?.includes(TAGS.RETRIEVE);
  //#endregion

  //#region States
  const [state, setState] = React.useState([]);
  const [archiveDataLength, setArchiveDataLength] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [rowPerPage, setRowPerPage] = React.useState(10);
  const [confirmDialog, setConfirmDialog] = React.useState({ title: '', content: '', isOpen: false });
  const [openDetailsView, setOpenDetailsView] = React.useState(false);
  const [tagKey, setTagKey] = React.useState(null);

  //#endregion

  //#region Colums for Table
  const columns = [
    {
      name: 'tagName',
      label: 'Tag Name',
      minWidth: 120
    },
    {
      name: 'sectionName',
      label: 'Section Name',
      minWidth: 250
    },
    {
      name: 'unitName',
      label: 'Unit Name',
      minWidth: 200
    },
    {
      name: 'ipAddress',
      label: 'IP Address',
      minWidth: 150
    },
    {
      name: 'deviceModel',
      label: 'Device Model',
      minWidth: 200
    },
    {
      name: 'brand',
      label: 'Brand',
      minWidth: 200
    }
  ];
  //#endregion

  //#region UDF
  const getAllArchiveTags = () => {
    const queryParam = {
      PageNumber: page,
      PageSize: rowPerPage
    };
    trackPromise(
      http
        .get(`${TAG.get_archive}?${qs.stringify(queryParam)}`)
        .then(res => {
          const tags = res.data.data;
          setState(tags);
          setArchiveDataLength(res.data.totalNoOfRow);
        })
        .catch(err => toastAlerts('warning', err))
    );
  };
  //#endregion

  //#region Hooks
  useEffect(() => getAllArchiveTags(), [rowPerPage, page]);
  //#endregion

  //#region Events

  const onRowPerPageChange = e => {
    setRowPerPage(e.target.value);
    setPage(1);
  };

  const onPageChange = (event, pageNumber) => {
    setPage(pageNumber);
  };

  const onView = row => {
    setTagKey(row.key);
    setOpenDetailsView(true);
  };

  const onRestore = key => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    http
      .put(`${TAG.restore}/${key}`)
      .then(res => {
        if (res.data.succeeded) {
          toastAlerts('success', res.data.message);
        } else {
          toastAlerts('error', res.data.message);
        }
        getAllArchiveTags();
      })
      .catch(err => {
        toastAlerts('error', internalServerError);
      });
  };

  //#endregion

  return (
    <Box>
      <Paper className={classes.root}>
        <CustomTable
          columns={columns}
          rowPerPage={rowPerPage}
          onRowPerPageChange={onRowPerPageChange}
          count={Math.ceil(archiveDataLength / rowPerPage)}
          onPageChange={onPageChange}>
          {state.map(row => (
            <StyledTableRow key={row.id}>
              {columns.map(column => {
                const value = row[column.name];
                return (
                  <StyledTableCell key={column.name} style={{ minWidth: column.minWidth }}>
                    {column.format ? column.format(value) : value}
                  </StyledTableCell>
                );
              })}
              <StyledTableCell align="center">
                <ActionButtonGroup
                  appearedViewButton
                  onView={() => onView(row)}
                  appearedReactiveButton={hasRetrivePermission}
                  onRestore={() => {
                    setConfirmDialog({
                      isOpen: true,
                      title: 'Re-Acitve TAG?',
                      content: 'Are you sure to re-active this tag??',
                      onConfirm: () => onRestore(row.key)
                    });
                  }}
                />
                <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </CustomTable>
      </Paper>
      <DetailsViewDialog open={openDetailsView} setOpen={setOpenDetailsView} title="Tag Details">
        <TagDetails itemKey={tagKey} />
      </DetailsViewDialog>
    </Box>
  );
};

export default ArchiveTagList;
