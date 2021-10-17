import React from 'react';
import { useQuery } from '@apollo/client';
import { useParams, useHistory } from 'react-router-dom';
import UserCard from '../components/UserCard';
import { PUBLIC_PROFILE } from '../graphql/queries';

const SingleUser = () => {
  let params = useParams();
  let history = useHistory();

  const { data, loading } = useQuery(PUBLIC_PROFILE, {
    variables: { username: params.username }
  });

  if (loading) return <p className="p-5">Loading...</p>;

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12 mb-4">
          <button
            className="btn btn-raised btn-primary"
            onClick={history.goBack}
          >
            BACK
          </button>
        </div>
        <div className="col-12">
          <UserCard user={data.publicProfile} />
        </div>
      </div>
    </div>
  );
};

export default SingleUser;
