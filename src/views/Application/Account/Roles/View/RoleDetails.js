import React from 'react';
import '../style/index.css';

const RoleDetails = ({ data }) => {
  return (
    <div>
      <table id="roleDetails">
        <caption className="caption">Role Name: {data.name}</caption>
        <thead>
          <tr style={{ fontSize: 16 }}>
            <th className="roleTd">Permissions</th>
            <th className="roleTd">Details</th>
          </tr>
        </thead>
        <tbody>
          {data.visualize.map((item, index) => (
            <tr key={index + 1}>
              <td className="roleTd">{item.groupName}</td>
              <td className="roleTd">{item.permissions.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoleDetails;
