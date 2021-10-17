import React from "react";

const UserPost = ({
  handleSubmit,
  handleChange,
  content,
  loading,
}) => (
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

    <button
      className="btn btn-raised btn-primary"
      type="submit"
      disabled={loading || !content}
    >
      Update
    </button>
  </form>
);

export default UserPost;