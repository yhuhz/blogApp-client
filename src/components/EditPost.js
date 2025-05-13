import { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { Notyf } from 'notyf';

export default function EditPost({ post, getPostData }) {
  const notyf = new Notyf();

  const [postId] = useState(post._id);
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);

  const [showEdit, setShowEdit] = useState(false);

  const editOpen = () => {
    setShowEdit(true);
  };

  const editClose = () => {
    setShowEdit(false);
  };

  const editPost = (e, postId) => {
    e.preventDefault();

    fetch(`${process.env.REACT_APP_API_BASE_URL}/posts/updatePost/${postId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        title: title,
        content: content,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          notyf.error('Something went wrong. Please try again');
          getPostData();
          editClose();
        } else {
          notyf.success(data.message);
          getPostData();
          editClose();
        }
      });
  };

  return (
    <>
      <Button
        variant="outline-primary"
        className="w-100"
        onClick={() => editOpen()}
      >
        <i className="bi bi-pencil-square"></i>{' '}
        <span className="post-text"> Edit Post</span>
      </Button>

      <Modal show={showEdit} onHide={editClose}>
        <Modal.Header className="bg-primary" closeButton>
          <Modal.Title className="text-center">Edit Post</Modal.Title>
        </Modal.Header>
        <Form className="bg-secondary" onSubmit={(e) => editPost(e, postId)}>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={editClose}>
              Close
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={title === '' || content === ''}
            >
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
