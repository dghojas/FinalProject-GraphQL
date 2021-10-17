import React from 'react';
import Image from './Image';
import { Link } from 'react-router-dom';

const UserCard = ({ user }) => {
  const { username, images, about } = user;
  return (
    <div className="userCard text-center">
      <div className="user-image">
        <Image
          image={images[0]}
        />
      </div>
      <div className="user-body">
        <Link to={`/user/${username}`}>
          <h4 className="text-primary">@{username}</h4>
        </Link>
        <hr />
        <small>{about}</small>
      </div>
    </div>
  );
};

export default UserCard;
