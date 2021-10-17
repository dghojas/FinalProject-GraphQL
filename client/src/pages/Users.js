import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { ALL_USERS } from '../graphql/queries';
import UserCard from '../components/UserCard';

const Users = () => {
  const { data, loading } = useQuery(ALL_USERS);

  if (loading) return <p className="p-5">Loading...</p>;

  return (
    <div className="container">
      <div className="row">
        {data.allUsers.map((user) => (
          <div className="col-md-4 mt-4 mt-md-5" key={user._id}>
            <UserCard user={user} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;
