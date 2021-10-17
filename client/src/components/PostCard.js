import React from 'react';
import { Link } from 'react-router-dom';
import Image from './Image';

const PostCard = ({
  post,
  handleDeletePost = (f) => f,
  activeControls = false
}) => {
  const { _id, image, content, postedBy } = post;

  return (
    <div className="postCard text-center">
      <div className="post-image">
        <Image
          image={image}
        />
      </div>
      <div className="post-body">
        <h4 className="text-primary">@{postedBy.username}</h4>
        <p>{content}</p>
        {activeControls && (
          <ul className="list-inline d-flex align-items-center justify-content-around my-4">
            <li className="list-inline-item">
              <Link
                className="btn btn-raised btn-primary ripple-surface"
                to={`/post/update/${_id}`}
              >
                Update
              </Link>
            </li>
            <li className="list-inline-item">
              <button
                type="button"
                className="btn btn-raised btn-danger ripple-surface"
                data-id={_id}
                onClick={handleDeletePost}
              >Delete</button>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default PostCard;