import { Grid, makeStyles } from '@material-ui/core';
import { Checkbox, Form, FormWrapper, SaveButton, TextInput } from 'components/CustomControls';
import { PERMISSIONS } from 'constants/ApiEndPoints/v1/Accounts/permissions';
import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import {
  MdAddBox,
  MdCheckBox,
  MdCheckBoxOutlineBlank,
  MdChevronRight,
  MdFolder,
  MdFolderOpen,
  MdIndeterminateCheckBox,
  MdKeyboardArrowDown,
  MdList
} from 'react-icons/md';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 330
  }
}));

const initialFieldValues = {
  id: '',
  name: '',
  description: '',
  isActive: true
};

const icons = {
  check: <MdCheckBox className="rct-icon rct-icon-check" />,
  uncheck: <MdCheckBoxOutlineBlank className="rct-icon rct-icon-uncheck" />,
  halfCheck: <MdIndeterminateCheckBox className="rct-icon rct-icon-half-check" />,
  expandClose: <MdChevronRight className="rct-icon rct-icon-expand-close" />,
  expandOpen: <MdKeyboardArrowDown className="rct-icon rct-icon-expand-open" />,
  expandAll: <MdAddBox className="rct-icon rct-icon-expand-all" />,
  collapseAll: <MdIndeterminateCheckBox className="rct-icon rct-icon-collapse-all" />,
  parentClose: <MdFolder className="rct-icon rct-icon-parent-close" />,
  parentOpen: <MdFolderOpen className="rct-icon rct-icon-parent-open" />,
  leaf: <MdList className="rct-icon rct-icon-leaf-close" />
};

const RoleCreateForm = props => {
  const { recordForEdit, onSubmit } = props;
  const saveButtonRef = useRef();

  //#region states
  const [state, setState] = useState(initialFieldValues);
  const [permissions, setPermissions] = useState([]);
  const [checked, setChecked] = useState([]);
  const [expanded, setExpanded] = useState([]);
  //#endregion

  //#region UDF
  const getAllPermissions = async () => {
    try {
      await http.get(PERMISSIONS.get_all).then(res => {
        const permissions = [
          {
            value: 'permissions',
            label: 'All Permissions',
            children: res.data.map(grp => ({
              value: grp.groupName,
              label: _.startCase(grp.groupName),
              children: grp.permissions.map(per => ({
                value: per,
                label: _.startCase(per.split('.')[2])
              }))
            }))
          }
        ];
        setPermissions(permissions);
      });
    } catch (error) {
      toastAlerts('error', error);
    }
  };
  //#endregion

  //#region Effects
  useEffect(() => {
    getAllPermissions();
  }, []);

  useEffect(() => {
    if (recordForEdit) {
      setState(recordForEdit);
      setChecked(recordForEdit.permissions);
    }
  }, [recordForEdit]);

  useEffect(() => {
    saveButtonRef.current.focus();
  }, []);

  //#endregion

  //#region Events
  const onChange = e => {
    const { type, name, value, checked } = e.target;
    setState({
      ...state,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    const data = {
      ...state,
      permissions: checked
    };
    onSubmit(data);
  };
  //#endregion
  const classes = useStyles();
  return (
    <FormWrapper>
      <Form className={classes.root}>
        <Grid container>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TextInput name="name" label="Role Name" value={state.name} onChange={onChange} />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TextInput name="description" label="Description" value={state.description} onChange={onChange} />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <CheckboxTree
              nodes={permissions}
              checked={checked}
              onCheck={checked => setChecked(checked)}
              expanded={expanded}
              onExpand={expanded => setExpanded(expanded)}
              icons={icons}
            />
          </Grid>
          {state.id && (
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Checkbox name="isActive" label="Is Active" checked={state.isActive} onChange={onChange} />
            </Grid>
          )}
        </Grid>
        <SaveButton ref={saveButtonRef} onClick={handleSubmit} />
      </Form>
    </FormWrapper>
  );
};

export default RoleCreateForm;
