import { Box, Paper } from '@material-ui/core';
import { ActionButtonGroup, CustomTable } from 'components/CustomControls';
import { StyledTableCell, StyledTableRow } from 'components/CustomControls/TableRowHeadCell';
import { MONTHLY_PRODUCTION_SETTING } from 'constants/ApiEndPoints/v1/monthlyProductionSetting';
import qs from 'querystring';
import React, { useCallback, useEffect } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { useHistory, useLocation } from 'react-router';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';

const ActiveMonthlyProductionSetting = () => {
  const history = useHistory();
  const location = useLocation();
  //#region States
  const [state, setState] = React.useState([]);
  const [dataLength, setDataLength] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [rowPerPage, setRowPerPage] = React.useState(10);

  //#endregion

  //#region Colums for Table
  const columns = [
    {
      name: 'testSampleName',
      label: 'Test Sample Name',
      isDisableSorting: true
    },
    {
      name: 'shiftName',
      label: 'Shift Name',
      isDisableSorting: true
    },
    {
      name: 'usePreviousDate',
      label: 'Use Previous Date',
      format: value => (value ? 'Active' : 'Inactive'),
      isDisableSorting: true
    }
  ];
  //#endregion

  //#region UDF

  const getAllMonthlyProductions = useCallback(() => {
    const queryParam = {
      PageNumber: page,
      PageSize: rowPerPage
    };

    trackPromise(
      http
        .get(`${MONTHLY_PRODUCTION_SETTING.get_all}?${qs.stringify(queryParam)}`)
        .then(res => {
          if (res.data.succeeded) {
            const monthlyProduction = res.data.data;
            setState(monthlyProduction);
            setDataLength(res.data.totalNoOfRow);
          }
        })
        .catch(err => toastAlerts('warning', err))
    );
  }, [page, rowPerPage]);

  //#endregion

  //#region Hooks
  useEffect(() => getAllMonthlyProductions(), [getAllMonthlyProductions]);
  //#endregion

  //#region Events

  const onRowPerPageChange = e => {
    setRowPerPage(e.target.value);
    setPage(1);
  };

  const onPageChange = (event, pageNumber) => {
    setPage(pageNumber);
  };

  const onEdit = row => {
    history.push({
      pathname: `${location.pathname}/edit`,
      state: row
    });
  };

  //#endregion

  return (
    <Box>
      <Paper>
        <CustomTable
          columns={columns}
          rowPerPage={rowPerPage}
          onRowPerPageChange={onRowPerPageChange}
          count={Math.ceil(dataLength / rowPerPage)}
          onPageChange={onPageChange}>
          {state.map(row => {
            return (
              <StyledTableRow key={row.id}>
                {columns.map(col => {
                  const value = row[col.name];
                  return (
                    <StyledTableCell key={col.name}>
                      {col.format && typeof value === 'boolean' ? col.format(value) : value}
                    </StyledTableCell>
                  );
                })}
                <StyledTableCell align="center">
                  <ActionButtonGroup
                    appearedEditButton
                    onEdit={() => {
                      onEdit(row);
                    }}
                  />
                </StyledTableCell>
              </StyledTableRow>
            );
          })}
        </CustomTable>
      </Paper>
    </Box>
  );
};

export default ActiveMonthlyProductionSetting;
