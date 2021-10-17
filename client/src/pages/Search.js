import React, { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { GET_SEARCH_POST } from '../graphql/queries';
import PostCard from '../components/PostCard';

const Search = () => {
  const [searchFilter, setSearchFilter] = useState('');

  const [executeSearch, { data, loading }] = useLazyQuery(
    GET_SEARCH_POST
  );

  if (loading) return <p className="p-5">Loading...</p>;

  return (
    <div className="container py-5">
      <div className="row mb-5">
        <div className="col-12 col-md-12">
          <div>
            <input
              className="form-control mr-sm-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
              onChange={(e) => setSearchFilter(e.target.value)}
            />
            <button
              className="btn btn-raised btn-primary mt-3 float-right"
              onClick={() =>
                executeSearch({
                  variables: { filter: searchFilter }
                })
              }
            >SEARCH</button>
          </div>
        </div>
      </div>

      <div className="row">
        {data && data.postSearch.map(post => (
          <div className="col-md-4 pt-5" key={post._id}>
            <PostCard post={post} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;
