import { data } from '@fake-db/logsheet';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import React from 'react';

const AdminLogSheetRepot = () => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Tag Number</TableCell>
          <TableCell>Unit</TableCell>
          {data.slotName.map(s => (
            <TableCell key={s}>{s}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {data.logDetails.map(tag => {
          return (
            <TableRow key={tag.tagId}>
              <TableCell>{`${tag.tagName} ${tag.tagDetails}`}</TableCell>
              <TableCell>{tag.unitName}</TableCell>
              {data.slotName.map(sn => (
                <TableCell key={sn}>{tag.data.find(item => item.slotName === sn).reading}</TableCell>
              ))}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default AdminLogSheetRepot;
