import { data } from '@fake-db/logSheet';
// import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import React from 'react';
import { getSign } from 'utils/commonHelper';

const TestLogSheet = () => {
  const mututateArray = (modifiedArray = []) => {
    const returnedArry = [];
    const uniqeTags = [...new Set(modifiedArray.map(item => item.tagId))];
    const data = uniqeTags.map(tag => {
      const filterdArr = modifiedArray.filter(item => item.tagId === tag);
      return filterdArr;
    });

    for (let i = 0; i < data.length; i++) {
      const item = data[i];

      const obj = {
        tagId: item[0].tagId,
        tagName: item[0].tagName,
        tagDetails: item[0].details,
        unitName: item[0].unitName,
        data: item.map(x => ({
          slotName: x.slotName,
          reading: x.reading
        }))
      };
      returnedArry.push(obj);
    }

    return returnedArry;
  };

  const sections = {
    timeSlotName: ['7-9', '9-11', '11-13', '13-15', '15-17', '17-19', '19-21', '21-23', '23-1', '1-3', '3-5', '5-7'],

    tagDetails: data.map(section => {
      // new Object Creation
      const individualSection = Object.assign({}, section);

      // necessary functionality
      /*
       ** First slot name appended into individual logSheetDetails
       ** Then removed parent section from timeSlots
       */
      const slotWiseReading = section.timeSlots.map(timeslot => {
        const tagDetails = Object.assign({}, timeslot);
        const slotName = timeslot.slotName;
        tagDetails.slotwisetagreading = timeslot.logSheetDetails.map(item => ({ ...item, slotName }));
        delete tagDetails.id;
        delete tagDetails.slotName;
        delete tagDetails.fromTime;
        delete tagDetails.toTime;
        delete tagDetails.logSheetDetails;
        return tagDetails;
      });

      /*
       ** From slot wise data take each item
       ** Then append it to main array (slotWiseReading)
       */
      const flatReading = slotWiseReading.reduce((acc, curr) => {
        curr.slotwisetagreading.map(slotItem => {
          acc.push({ ...slotItem });
          return slotItem;
        });

        return acc;
      }, []);

      // adding property in created object
      individualSection.slotWiseReading = mututateArray(flatReading);
      // Deleted Items
      delete individualSection.timeSlotName;
      delete individualSection.details;
      delete individualSection.timeSlots;

      // return
      return individualSection;
    })
  };

  return (
    <React.Fragment>
      <div>Report Date : 16-Nov-2021</div>
      <hr />
      {sections.tagDetails.map(section => (
        <React.Fragment>
          <div>
            <span>Section Name: </span>
            <span>{section.sectionName}</span>
          </div>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell style={{ backgroundColor: '#ccc', color: '#000' }}>TIME</TableCell>
                  <TableCell style={{ backgroundColor: '#ccc', color: '#000' }}>UNIT</TableCell>
                  {sections.timeSlotName.map(item => (
                    <TableCell key={item} style={{ backgroundColor: '#ccc', color: '#000' }}>
                      {item}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {section.slotWiseReading.map(item => (
                  <TableRow key={item.tagId}>
                    <TableCell>{item.tagName}</TableCell>
                    <TableCell>{getSign(item.unitName)}</TableCell>
                    {item.data.map(r => (
                      <TableCell key={r.slotName}>{r.reading}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </React.Fragment>
      ))}
    </React.Fragment>
  );
};

export default TestLogSheet;
