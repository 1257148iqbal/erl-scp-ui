import { Button, Checkbox, FormControlLabel, TextField } from '@material-ui/core';
import { CustomAutoComplete } from 'components/CustomControls';
import React, { useEffect, useRef, useState } from 'react';
import classes from './LabReport.module.css';

const LabReport = () => {
  const unitsArray = [
    { value: 1, label: 'LRV' },
    { value: 2, label: 'Water' }
  ];
  const samplesArray = [
    { id: 1, value: 1, label: 'VB FEED' },
    { id: 2, value: 2, label: 'VB NAPTHA' },
    { id: 3, value: 3, label: 'VB GAS OIL' },
    { id: 4, value: 4, label: 'VB RESIDUE' },
    { id: 5, value: 5, label: 'TOPPING RESIDUE' }
  ];
  const parametersArray = [
    { id: 0, value: 1, label: 'Density at 15', position: 1, checked: false },
    { id: 1, value: 2, label: 'RVP Psi', position: 2, checked: false },
    { id: 2, value: 3, label: 'Colour ASTM', position: 3, checked: false },
    {
      id: 3,
      value: 4,
      label: 'Viscosity',
      position: 4,
      checked: false,
      child: [
        { id: 1, label: '50 D', position: 1 },
        { id: 2, label: '100 D', position: 2 }
      ]
    }
  ];

  const checkMaxlevel = item => {
    const hasChild = item.child;
    return hasChild ? item.child.length : 1;
  };

  const refUnit = useRef();

  const refPre = useRef();

  const [units] = useState(unitsArray);
  const [unit, setUnit] = useState(null);

  const [parameters, setParameters] = useState(parametersArray);
  const [selectedParameters, setSelectedParameters] = useState([]);

  useEffect(() => {
    const updatedParameters = parametersArray.map(p => ({
      ...p,
      checked: false
    }));
    setParameters(updatedParameters);
  }, []);

  const onUnitChange = (e, newValue) => {
    if (newValue) {
      setUnit(newValue);
    } else {
      setUnit(null);
    }
  };

  const onParameterChange = (e, paramId) => {
    const { checked } = e.target;
    const updatedParameter = parameters.map(p => {
      if (p.id === paramId) {
        p['checked'] = checked;
      }
      return p;
    });
    setParameters(updatedParameter);
  };

  const onGenerate = () => {
    setSelectedParameters(parameters.filter(p => p.checked));
  };

  return (
    <React.Fragment>
      <CustomAutoComplete ref={refUnit} name="uniId" data={units} label="Select Unit" value={unit} onChange={onUnitChange} />
      {parameters.map(param => (
        <FormControlLabel
          key={param.id}
          control={
            <Checkbox
              color="primary"
              checked={param.checked}
              onChange={e => onParameterChange(e, param.id)}
              name="paramId"
            />
          }
          label={param.label}
        />
      ))}
      <Button variant="contained" color="primary" onClick={onGenerate}>
        Generate
      </Button>
      <pre ref={refPre}></pre>
      {selectedParameters.length > 0 && (
        <table className={classes.table}>
          <thead>
            {selectedParameters.map(item => {
              let node = null;
              if (item.child) {
                //
                node = (
                  <React.Fragment>
                    <tr></tr>
                    <tr>
                      <td colSpan={checkMaxlevel(item)}>{item.label}</td>
                    </tr>
                  </React.Fragment>
                );
              } else {
                //
                node = (
                  <React.Fragment>
                    <tr>
                      <td rowSpan={checkMaxlevel(item)}>{item.label}</td>
                    </tr>
                    <tr></tr>
                  </React.Fragment>
                );
              }
              return node;
            })}
          </thead>
          <tbody>
            {samplesArray.map((s, index) =>
              index === 0 ? (
                <tr key={s.id}>
                  <td rowSpan={samplesArray.length}>{unit ? unit.label : 'LRV'}</td>
                  <td>{s.label}</td>
                  {selectedParameters.map(sp => (
                    <td key={sp.id}>
                      <TextField variant="outlined" />
                    </td>
                  ))}
                </tr>
              ) : (
                <tr key={s.id}>
                  <td>{s.label}</td>
                  {selectedParameters.map(sp => (
                    <td key={sp.id}>
                      <TextField variant="outlined" />
                    </td>
                  ))}
                </tr>
              )
            )}
          </tbody>
        </table>
      )}
      <table>
        <thead>
          <tr>
            <td rowSpan={2}>Name</td>
            <td rowSpan={2}>Mail</td>
            <td colSpan={2}>Address</td>
          </tr>
          <tr>
            <td>Address 1</td>
            <td>Address 2</td>
          </tr>
        </thead>
      </table>
    </React.Fragment>
  );
};

export default LabReport;
