import React, { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import { useQuery, useMutation } from '@apollo/react-hooks';

// pending imports
import omitDeep from 'omit-deep';
import { PROFILE } from '../../graphql/queries';
import { USER_UPDATE } from '../../graphql/mutations';
import FileUpload from '../../components/FileUpload';
import UserProfile from '../../components/forms/UserProfile';

const Profile = () => {
  const [values, setValues] = useState({
    username: "",
    name: "",
    email: "",
    about: "",
    images: [],
  });
  const [loading, setLoading] = useState(false);

  const { data } = useQuery(PROFILE);

  useMemo(() => {
    if (data) {
      setValues({
        ...values,
        username: data.profile.username,
        name: data.profile.name,
        email: data.profile.email,
        about: data.profile.about,
        images: omitDeep(data.profile.images, ["__typename"]),
      });
    }
  }, [data]);

  // mutation
  const [userUpdate] = useMutation(USER_UPDATE, {
    update: ({ data }) => {
      console.log("USER UPDATE MUTATION IN PROFILE", data);
      toast.success("Profile updated");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    userUpdate({ variables: { input: values } });
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
            <h4>Profile</h4>
          )}
        </div>
      </div>
      <FileUpload
        setValues={setValues}
        setLoading={setLoading}
        values={values}
        loading={loading}
      />
      <UserProfile
        {...values}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
};

export default Profile;
