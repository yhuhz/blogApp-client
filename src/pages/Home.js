import { Card, Row, Col } from 'react-bootstrap';
import { Link, Navigate } from 'react-router-dom';
import UserContext from '../UserContext';
import { useContext, useEffect, useState } from 'react';
import EditPost from '../components/EditPost';
import DeletePost from '../components/DeletePost';
import AddPost from '../components/AddPost';

export default function Home() {
  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);

  const [postsData, setPostsData] = useState([]);

  function getPostsData() {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/posts/getPosts`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.posts)) {
          setPostsData(
            <Row className="g-4">
              {data.posts.map((post) => {
                const formattedDate = new Date(
                  post.dateCreated
                ).toLocaleDateString('en-US', {
                  month: '2-digit',
                  day: '2-digit',
                  year: '2-digit',
                });

                return (
                  <Col xl={6} key={post._id}>
                    <Card
                      style={{ border: '2px white solid', maxWidth: '100%' }}
                      className="rounded bg-dark p-3 d-flex flex-column h-100"
                    >
                      <Card.Title
                        className="text-center bg-dark px-3"
                        style={{ height: '80px', overflow: 'auto' }}
                      >
                        <h2>{post.title}</h2>
                      </Card.Title>

                      <div className="flex-grow-1"></div>

                      <Card.Body className="card-body-custom bg-dark">
                        <div>
                          <div className="d-flex justify-content-between">
                            <p className="fw-light">by {post.authorName}</p>
                            <p>{formattedDate}</p>
                          </div>

                          <p
                            style={{
                              width: '100%',
                              overflow: 'hidden',
                              whiteSpace: 'nowrap',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {post.content}
                          </p>
                        </div>

                        <div className="d-flex gap-3 justify-content-center mt-3">
                          <Link
                            to={`/comments/${post._id}`}
                            className="btn btn-outline-light w-100"
                          >
                            <i className="bi bi-book-half"></i>
                            <span className="post-text"> View Post</span>
                          </Link>
                          {user.id !== null &&
                            (user.id === post.author || user.isAdmin) && (
                              <>
                                <EditPost
                                  post={post}
                                  getPostData={getPostsData}
                                />
                                <DeletePost
                                  post={post}
                                  getPostData={getPostsData}
                                />
                              </>
                            )}
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          );
        } else {
          setPostsData([]);
        }
      })
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    getPostsData();
  }, [user]);

  return isLoading ? (
    <div className="d-flex justify-content-center mt-5">
      <Card className="p-4 text-center bg-dark">
        <Card.Body>
          <h1>
            Welcome to{' '}
            <span className="cursive-text fw-bold">TroubleBubble!</span>
          </h1>
          <div className="d-flex justify-content-center">
            <h6
              className="text-light text-center py-3"
              style={{ maxWidth: '400px' }}
            >
              Loading Posts
            </h6>
          </div>
        </Card.Body>
      </Card>
    </div>
  ) : (
    <div className="mb-5">
      <div className="d-flex justify-content-center mt-5">
        <Card className="p-4 text-center bg-dark">
          <Card.Body>
            <h1>
              Welcome to{' '}
              <span className="cursive-text fw-bold">TroubleBubble!</span>
            </h1>
            <div className="d-flex justify-content-center">
              <h6
                className="text-light text-center py-3"
                style={{ maxWidth: '400px' }}
              >
                Connecting Voices Across the Globe—Your Blog, Your World.
              </h6>
            </div>
            {user.id !== null ? <AddPost getPostData={getPostsData} /> : ''}
          </Card.Body>
        </Card>
      </div>

      <hr className="my-3" />
      {postsData}
    </div>
  );
}
