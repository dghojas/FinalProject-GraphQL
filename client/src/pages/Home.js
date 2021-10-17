import React, { useState, useContext, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { auth } from '../firebase';
import { AuthContext } from '../context/authContext';
import { GET_ALL_POST } from '../graphql/queries';
import PostCard from '../components/PostCard';

const Home = (...props) => {
  const [offset, setOffset] = useState(1);
  const [limit] = useState(12);

  const { data, loading } = useQuery(GET_ALL_POST, {
    variables: {
      offset: offset,
      limit: limit
    }
  });

  // access context
  const { state } = useContext(AuthContext);

  let history = useHistory();
  useMemo(() => {
    auth.onAuthStateChanged(async (user) => {
      if (!user) {
        history.push('/login');
      }
    });
  }, [history]);

  const prevPage = () => {
    setOffset(offset - 1);
  }
  const nextPage = () => {
    setOffset(offset + 1);
  }

  if (loading) return <p className="p-5">Loading...</p>;

  const { allTodosPost } = data;

  return (
    <div className="container">
      <div className="row">
        {allTodosPost && allTodosPost.todos.map(post => (
          <div className="col-md-4 pt-5" key={post._id}>
            <PostCard post={post} />
          </div>
        ))}
      </div>

      {allTodosPost && (
        <div className="row">
          <div className="col-12">
            <div className="py-5 d-flex justify-content-between align-items-center">
              <button
                className="btn btn-raised btn-primary"
                disabled={allTodosPost?.totalCount === 1 || offset === 1}
                onClick={prevPage}>
                Prev
              </button>
              Post Total: {allTodosPost && allTodosPost.totalCount}
              <button
                className="btn btn-raised btn-primary"
                disabled={allTodosPost?.todos.length === 0 || offset >= allTodosPost?.todos.length}
                onClick={nextPage}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
