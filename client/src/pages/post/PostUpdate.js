import React, { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import omitDeep from 'omit-deep';

import { GET_POST_ID } from '../../graphql/queries';
import { POST_UPDATE } from '../../graphql/mutations';
import FileUpload from '../../components/FileUpload';
import UserPost from '../../components/forms/UserPost';

const PostUpdate = () => {
  const params = useParams();
  const { id } = params;

  const { data } = useQuery(GET_POST_ID, {
    variables: {
      _id: id
    }
  });

  const [values, setValues] = useState({
    _id: '',
    content: '',
    image: {
      url: 'https://via.placeholder.com/200x200.png?text=Post',
      public_id: '123'
    }
  });
  const [loading, setLoading] = useState(false);

  useMemo(() => {
    if (data) {
      setValues({
        ...values,
        _id: data.postGetId[0]._id,
        content: data.postGetId[0].content,
        image: omitDeep(data.postGetId[0].image, ["__typename"]),
      });
    }
  }, [data]);

  // mutation
  const [postUpdate] = useMutation(POST_UPDATE, {
    update: ({ data }) => {
      console.log("USER UPDATE MUTATION IN POST", data);
      toast.success("Post updated");
    },
  });


  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    postUpdate({ variables: { input: values } });
    setLoading(false);
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mt-5 mt-md-0">
      <div className="row">
        <div className="col-md-12">
          {loading ? (
            <h4 className="text-danger">Loading...</h4>
          ) : (
            <h4>Post Update</h4>
          )}
        </div>
      </div>
      <FileUpload
        setValues={setValues}
        setLoading={setLoading}
        values={values}
        loading={loading}
        singleUpload={true}
      />
      <UserPost
        {...values}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
};

export default PostUpdate;
