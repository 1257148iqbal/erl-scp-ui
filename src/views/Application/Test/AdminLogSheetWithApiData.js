import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import * as React from 'react';
import { onTextFieldFocus } from 'utils/keyControl';

const array = [
  { id: 1, name: 'Small' },
  { id: 2, name: 'Small' },
  { id: 3, name: 'Small' },
  { id: 4, name: 'Small' },
  { id: 5, name: 'Small' }
];

const AdminLogSheetWithApiData = () => {
  // const onKeyDown = (e, index) => {
  //   if (e.keyCode === 40) {
  //     if (index < array.length - 1) {
  //       const currentElement = document.querySelector(`#outlined-size-small${index + 1}`);
  //       currentElement.focus();
  //     }
  //   }
  //   if (e.keyCode === 38) {
  //     if (index > 0) {
  //       const currentElement = document.querySelector(`#outlined-size-small${index - 1}`);
  //       currentElement.focus();
  //       currentElement.select();
  //     }
  //   }
  // };

  return (
    <Box>
      {array.map((item, index) => (
        <div key={item.id} style={{ padding: '10px 20px' }}>
          <TextField
            label="Size"
            id={`outlined-size-small${index}`}
            defaultValue={item.name}
            onKeyDown={e => onTextFieldFocus(e, 'outlined-size-small', index, array.length)}
            onSelect={e => e.target.select()}
            fullWidth
          />
        </div>
      ))}
      {/* <div style={{ padding: '10px 20px' }}>
        <TextField label="Size" id="outlined-size-small1" defaultValue="Small" fullWidth />
      </div>
      <div style={{ padding: '10px 20px' }}>
        <TextField label="Size" id="outlined-size-small2" defaultValue="Small" fullWidth />
      </div>
      <div style={{ padding: '10px 20px' }}>
        <TextField label="Size" id="outlined-size-small3" defaultValue="Small" fullWidth />
      </div>
      <div style={{ padding: '10px 20px' }}>
        <TextField label="Size" id="outlined-size-small4" defaultValue="Small" fullWidth />
      </div>
      <div style={{ padding: '10px 20px' }}>
        <TextField label="Size" id="outlined-size-small5" defaultValue="Small" fullWidth />
      </div> */}
    </Box>
  );
};

export default AdminLogSheetWithApiData;
