import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import PropTypes from 'prop-types';
import React from 'react';

const CheckboxesGroup = props => {
  const { groupName, items, onChange } = props;

  return (
    <FormControl component="fieldset" margin="dense">
      <FormLabel component="legend">{groupName}</FormLabel>
      <FormGroup>
        {items.map(item => (
          <FormControlLabel
            disabled={item.disabled}
            key={item.name}
            control={<Checkbox color="primary" checked={item.checked} onChange={e => onChange(e, item.name)} />}
            label={item.label}
          />
        ))}
      </FormGroup>
    </FormControl>
  );
};

CheckboxesGroup.propTypes = {
  groupName: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string
};

CheckboxesGroup.defaultProps = {
  className: 'CheckBox'
};

export default CheckboxesGroup;
