import React, { useContext } from 'react';
import Resizer from 'react-image-file-resizer';
import Axios from 'axios';
import { AuthContext } from '../context/authContext';
import Image from './Image';

const FileUpload = ({
  setValues,
  setLoading,
  values,
  singleUpload = false
}) => {
  const { state } = useContext(AuthContext);

  const fileResizeAndUpload = (e) => {
    setLoading(true);
    let fileInput = false;
    if (e.target.files[0]) {
      fileInput = true;
    }
    if (fileInput) {
      Resizer.imageFileResizer(
        e.target.files[0],
        300,
        300,
        'JPEG',
        100,
        0,
        (uri) => {
          Axios.post(
            `${process.env.REACT_APP_REST_ENDPOINT}/upload-images`,
            { image: uri },
            {
              headers: {
                authtoken: state.user.token
              }
            }
          )
            .then((response) => {
              setLoading(false);
              console.log('CLOUDINARY UPLOAD', response);
              if (singleUpload) {
                // single upload
                // const { image } = values;
                setValues({ ...values, image: response.data });
              } else {
                const { images } = values;
                setValues({ ...values, images: [...images, response.data] });
              }
            })
            .catch((error) => {
              setLoading(false);
              console.log('CLOUDINARY UPLOAD FAILED', error);
            });
        },
        "base64"
      );
    }
  };

  const handleImageRemove = (id) => {
    setLoading(true);
    Axios.post(
      `${process.env.REACT_APP_REST_ENDPOINT}/remove-images`,
      {
        public_id: id
      },
      {
        headers: {
          authtoken: state.user.token
        }
      }
    )
      .then((response) => {
        setLoading(false);
        if (singleUpload) {
          // const { image } = values;
          setValues({
            ...values,
            image: {
              url: "",
              public_id: ""
            }
          });
        } else {
          const { images } = values;
          let filteredImages = images.filter((item) => {
            return item.public_id !== id;
          });
          setValues({ ...values, images: filteredImages });
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  return (
    <div className="row mb-4">
      <div className="col-md-12">
        <div className="form-group">
          <label className="btn btn-raised btn-primary">
            Upload Image
            <input
              hidden
              type="file"
              accept="image/*"
              onChange={fileResizeAndUpload}
              className="form-control"
              placeholder="Image"
            />
          </label>
        </div>
      </div>
      <div className="col-md-12">
        {/* for single image */}
        {values.image && (
          <Image
            image={values.image}
            key={values.image.public_id}
            width="100px"
            height="100px"
            handleImageRemove={handleImageRemove}
          />
        )}
        {/* for multiple images */}
        {values.images &&
          values.images.map((image) => (
            <Image
              image={image}
              key={image.public_id}
              width="100px"
              height="100px"
              handleImageRemove={handleImageRemove}
            />
          ))}
      </div>
    </div>
  );
};

export default FileUpload;
