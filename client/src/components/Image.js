import React from 'react';

const Image = ({
  image,
  width,
  height,
  handleImageRemove = (f) => f
}) => (
  <img
    src={image.url}
    key={image.public_id}
    alt={image.public_id}
    onClick={() => handleImageRemove(image.public_id)}
  />
);

export default Image;
