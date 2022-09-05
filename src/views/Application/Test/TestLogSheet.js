import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';
import React from 'react';
import { getSign } from 'utils/commonHelper';
import { data } from '../../../@fake-db/logSheet';

const TestLogSheet = () => {
  const feedData = data.find(item => item.sectionName === 'Feed');

  const feedsection = feedData.timeSlots.map(item => ({
    slotName: item.slotName,
    logSheetDetails: item.logSheetDetails.map(s => {
      const copiedItem = Object.assign({}, s);
      copiedItem.slotName = item.slotName;
      return copiedItem;
    })
  }));

  const feedSectionS7_9 = feedData.timeSlots.find(item => item.slotName === '7-9');

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>TIME</TableCell>
            <TableCell>UNIT</TableCell>
            {feedData.timeSlotName.map(item => (
              <TableCell key={item}>{item}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {feedSectionS7_9.logSheetDetails.map(data => (
            <TableRow key={data.id}>
              <TableCell>
                <Typography>{data.tagName}</Typography>
                <Typography variant="h5">{data.details}</Typography>
              </TableCell>
              <TableCell>{getSign(data.unitName)}</TableCell>
              <TableCell>{data.reading}</TableCell>
            </TableRow>
          ))}

          <TableRow></TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TestLogSheet;
