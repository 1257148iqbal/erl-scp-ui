import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { UNIT } from 'constants/ApiEndPoints/v1';
import React, { useEffect, useState } from 'react';
import { http } from 'services/httpService';

const UnicodeTest = () => {
  const [state, setState] = useState([]);

  useEffect(() => {
    http.get(UNIT.get_active).then(res => {
      const units = res.data.data.map(item => ({
        ...item
      }));
      setState(res.data.data);
    });
    // const units = unitResponse.data(item => ({ ...item, sign2: '' }));
  }, []);

  const getSign = signname => {
    switch (signname) {
      case 'cmph':
        return 'm\u00b3/h';

      default:
        return 'no';
    }
  };

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Unit Name</TableCell>
          <TableCell>Sign</TableCell>
          <TableCell>Test</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {state.map(item => (
          <TableRow key={item.id}>
            <TableCell>{item.unitName}</TableCell>
            <TableCell>{JSON.parse('"' + item.sign + '"')}</TableCell>
            <TableCell>{'m\u00b3/h'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UnicodeTest;
