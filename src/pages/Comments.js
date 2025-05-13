import { useState, useEffect, useContext } from 'react';
import { Button, Container, Card, Row, Col, Form } from 'react-bootstrap';
import { Notyf } from 'notyf';
import { useParams } from 'react-router-dom';
import UserContext from '../UserContext';

export default function Comments() {
  const notyf = new Notyf();

  const { user } = useContext(UserContext);

  const { postId } = useParams();
  const [comment, setComment] = useState('');
  const [postData, setPostData] = useState([]);

  const getPostData = () => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/posts/getPost/${postId}`)
      .then((res) => res.json())
      .then((data) => {
        setPostData(data.post);
      });
  };

  useEffect(() => {
    getPostData();
  }, [user]);

  const addComment = (e, postId) => {
    e.preventDefault();

    fetch(`${process.env.REACT_APP_API_BASE_URL}/posts/addComment/${postId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        comment: comment,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          notyf.error('Something went wrong. Please try again');
          getPostData();
        } else {
          notyf.success('Comment added successfully');
          setComment('');
          getPostData();
        }
      });
  };

  const formattedDate = new Date(postData.dateCreated).toLocaleDateString(
    'en-US',
    {
      month: '2-digit',
      day: '2-digit',
      year: '2-digit',
    }
  );

  return (
    <>
      <Container className="mt-3 d-flex justify-content-center">
        <Card className="bg-dark" style={{ maxWidth: '500px' }}>
          <Card.Body className="text-center card-body-custom">
            <Card.Title>
              <h1>{postData.title}</h1>
            </Card.Title>
            <div>
              <div className="d-flex flexbox justify-content-between fw-light">
                <p>by {postData.authorName}</p>
                <p>{formattedDate}</p>
              </div>

              <div style={{ maxHeight: '250px', overflow: 'auto' }}>
                <p>{postData.content}</p>
              </div>
            </div>

            <hr className="my-2" />
            <h4>Comments</h4>
            <div
              className="text-center"
              style={{ overflow: 'auto', maxHeight: '150px' }}
            >
              {postData.comments && postData.comments.length > 0 ? (
                postData.comments.map((comment, index) => (
                  <div key={index} className="mb-3 text-start px-3 px-md-5">
                    <strong>{comment.username}</strong>
                    <p>{comment.comment}</p> <hr />
                  </div>
                ))
              ) : (
                <p>No comments yet.</p>
              )}
            </div>

            {user.id !== null && (
              <Form
                className="bg-dark mt-2"
                onSubmit={(e) => addComment(e, postId)}
              >
                <Form.Group className="d-flex">
                  <Form.Control
                    type="text"
                    required
                    value={comment}
                    placeholder="Say something about this post"
                    onChange={(e) => setComment(e.target.value)}
                    style={{
                      borderTopRightRadius: '0',
                      borderBottomRightRadius: '0',
                    }}
                  />
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={comment === ''}
                    className="pb-0 pt-1"
                    style={{
                      borderTopLeftRadius: '0',
                      borderBottomLeftRadius: '0',
                    }}
                  >
                    <i class="bi bi-send-fill"></i>
                  </Button>
                </Form.Group>
              </Form>
            )}
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}
