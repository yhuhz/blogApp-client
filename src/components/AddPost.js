import { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { Notyf } from 'notyf';

export default function AddPost({ getPostData }) {
  const notyf = new Notyf();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const [showAdd, setShowAdd] = useState(false);

  const addOpen = () => {
    setShowAdd(true);
  };

  const addClose = () => {
    setShowAdd(false);
  };

  const addPost = (e) => {
    e.preventDefault();

    fetch(`${process.env.REACT_APP_API_BASE_URL}/posts/addPost/`, {
      method: 'POST',
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
        if (data._id) {
          notyf.success('Post added successfully');
          getPostData();
          addClose();
          setTitle('');
          setContent('');
        } else {
          getPostData();
          notyf.error('Something went wrong. Please try again');
          addClose();
        }
      });
  };

  return (
    <>
      <Button
        className="mt-3 w-100"
        variant="outline-success"
        onClick={addOpen}
      >
        <i className="bi bi-plus-square"></i> Add a Post
      </Button>

      <Modal show={showAdd} onHide={addClose}>
        <Modal.Header className="bg-success text-center" closeButton>
          <Modal.Title>Add Post</Modal.Title>
        </Modal.Header>
        <Form className="bg-secondary" onSubmit={addPost}>
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
            <Button variant="secondary" onClick={addClose}>
              Close
            </Button>
            <Button
              variant="success"
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
