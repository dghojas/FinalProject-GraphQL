import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useQuery, useMutation } from '@apollo/react-hooks';
import FileUpload from '../../components/FileUpload';
import { POST_CREATE, POST_DELETE } from '../../graphql/mutations';
import { POSTS_BY_USER } from '../../graphql/queries';
import PostCard from '../../components/PostCard';

const initialState = {
  content: '',
  image: {
    url: 'https://via.placeholder.com/200x200.png?text=Post',
    public_id: '123'
  }
};

const Post = () => {
  const [values, setValues] = useState(initialState);
  const [loading, setLoading] = useState(false);

  // query
  const { data: posts } = useQuery(POSTS_BY_USER);

  // destrecture
  const { content } = values;

  // mutation
  const [postCreate] = useMutation(POST_CREATE, {
    // read query from cache / write query to cache
    update: (cache, { data: { postCreate } }) => {
      // read Query from cache
      const { postsByUser } = cache.readQuery({
        query: POSTS_BY_USER,
      });
      // write Query to cache
      cache.writeQuery({
        query: POSTS_BY_USER,
        data: {
          postsByUser: [postCreate, ...postsByUser],
        },
      });
    },
    onError: (err) => console.log(err.graphqlQLError[0].message),
  });

  const [postDelete] = useMutation(POST_DELETE);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    postCreate({ variables: { input: values } });
    setValues(initialState);
    setLoading(false);
    toast.success("Post created");
  };

  const handleDeletePost = (e) => {
    const { id } = e.target.dataset;
    setLoading(true);
    postDelete({
      variables: { input: { _id: id } },
      update: (cache) => {
        const { postsByUser } = cache.readQuery({
          query: POSTS_BY_USER,
        });
        const newTodos = postsByUser.filter(t => (t._id !== id));
        cache.writeQuery({
          query: POSTS_BY_USER,
          data: {
            postsByUser: newTodos,
          }
        });
      }
    });
    setValues(initialState);
    setLoading(false);
    toast.success("Post delete");
  };

  const handleChange = (e) => {
    e.preventDefault();
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const createForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <textarea
          value={content}
          onChange={handleChange}
          name="content"
          rows="5"
          className="md-textarea form-control"
          placeholder="Write something cool"
          maxLength="150"
          disabled={loading}
        ></textarea>
      </div>

      <button className="btn btn-raised btn-primary" type="submit" disabled={loading || !content}>
        Post
      </button>
    </form>
  );

  return (
    <div className="container p-5">
      {loading ? <h4 className="text-danger">Loading ...</h4> : <h4>Create</h4>}
      <FileUpload
        values={values}
        loading={loading}
        setValues={setValues}
        setLoading={setLoading}
        singleUpload={true}
      />
      <div className="row">
        <div className="col">{createForm()}</div>
      </div>
      <div className="row">
        {posts && posts.postsByUser.map((post) => (
          <div className="col-md-6 pt-5" key={post._id} data-id={post._id}>
            <PostCard post={post} handleDeletePost={handleDeletePost} activeControls={true} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Post;
