import React, { useEffect, useReducer } from 'react';

const initialState = {
  users: [],
  loading: true,
  error: ''
};

const reducer = (state, action) => {
  const { type } = action;
  switch (type) {
    case 'SUCCESS':
      const updatedUser = action.payload;
      const updatedState = { ...state, loading: false, users: updatedUser };
      return updatedState;
    case 'FAIL':
      return { ...state, error: 'There was an error' };
    default:
      return state;
  }
};

const Reducer = () => {
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(res => res.json())
      .then(data => {
        dispatch({ type: 'SUCCESS', payload: data });
      })
      .catch(err => {
        dispatch({ type: 'FAIL' });
      });
  }, []);

  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      {state.loading ? (
        <p>Loading....</p>
      ) : (
        <table>
          <thead>
            <tr>
              <td>Name</td>
              <td>User Name</td>
              <td>Email</td>
            </tr>
          </thead>
          <tbody>
            {state.users.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {state.error ? state.error : ''}
    </div>
  );
};

export default Reducer;
