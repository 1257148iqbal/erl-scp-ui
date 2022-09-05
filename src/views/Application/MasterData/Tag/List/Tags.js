import { Box, Collapse, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { ActionButtonGroup, ConfirmDialog } from 'components/CustomControls';
import React from 'react';
import { getSign } from 'utils/commonHelper';
import TagContext from '../TagContextProvider/TagContext';

const Tags = props => {
  const context = React.useContext(TagContext);
  const { collapsein, tags, onView, onEdit, onDelete, hasDeletePermission, hasEditPermission } = context;

  const [confirmDialog, setConfirmDialog] = React.useState({ title: '', content: '', isOpen: false });
  return (
    <Collapse in={collapsein} timeout="auto" unmountOnExit>
      <Box margin={1}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ backgroundColor: '#78909C', color: '#FFFFFF', minWidth: 100 }}>#SL</TableCell>
              <TableCell style={{ backgroundColor: '#78909C', color: '#FFFFFF', minWidth: 170 }}>Tag Name</TableCell>
              <TableCell style={{ backgroundColor: '#78909C', color: '#FFFFFF', minWidth: 170 }}>Unit Name</TableCell>
              <TableCell style={{ backgroundColor: '#78909C', color: '#FFFFFF', minWidth: 170 }}>Details</TableCell>
              <TableCell style={{ backgroundColor: '#78909C', color: '#FFFFFF', minWidth: 170 }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tags.map(tag => (
              <TableRow key={tag.id} hover>
                <TableCell style={{ minWidth: 100 }}>{tag.sortOrder}</TableCell>
                <TableCell style={{ minWidth: 170 }}>{tag.tagName}</TableCell>
                <TableCell style={{ minWidth: 170 }}>
                  {tag.factor === 0 ? getSign(tag.unitName) : `${getSign(tag.unitName)} x ${tag.factor}`}
                </TableCell>
                <TableCell style={{ minWidth: 200 }}>{tag.details}</TableCell>
                <TableCell style={{ minWidth: 170 }}>
                  <ActionButtonGroup
                    appearedViewButton
                    appearedDeleteButton={hasDeletePermission}
                    appearedEditButton={hasEditPermission}
                    onView={() => onView(tag)}
                    onEdit={() => onEdit(tag.key)}
                    onDelete={() => {
                      setConfirmDialog({
                        isOpen: true,
                        title: 'Delete Tag?',
                        content: 'Are you sure to delete this tag??',
                        onConfirm: () => onDelete(tag.key)
                      });
                    }}
                  />
                  <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Collapse>
  );
};

export default Tags;
