import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Notyf } from 'notyf';

export default function DeletePost({ post, getPostData }) {
  const notyf = new Notyf();

  const [postId] = useState(post._id);

  const [showDelete, setShowDelete] = useState(false);

  const deleteOpen = () => {
    setShowDelete(true);
  };

  const deleteClose = () => {
    setShowDelete(false);
  };

  const deletePost = (e, postId) => {
    e.preventDefault();

    fetch(`${process.env.REACT_APP_API_BASE_URL}/posts/deletePost/${postId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          notyf.error('Something went wrong. Please try again');
          getPostData();
          deleteClose();
        } else {
          notyf.success(data.message);
          getPostData();
          deleteClose();
        }
      });
  };

  return (
    <>
      <Button variant="outline-danger" className="w-100" onClick={deleteOpen}>
        <i className="bi bi-trash"></i>{' '}
        <span className="post-text"> Delete Post</span>
      </Button>

      <Modal show={showDelete} onHide={deleteClose}>
        <Modal.Header className="bg-danger" closeButton>
          <Modal.Title className="text-center">Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-secondary">
          <p>
            Are you sure you want to delete this post? This action cannot be
            undone.
          </p>
        </Modal.Body>
        <Modal.Footer className="bg-secondary">
          <Button variant="secondary" onClick={deleteClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={(e) => deletePost(e, postId)}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
