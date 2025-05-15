import { Card, Row, Col } from 'react-bootstrap';
import { Link, Navigate } from 'react-router-dom';
import UserContext from '../UserContext';
import { useContext, useEffect, useState } from 'react';
import EditPost from '../components/EditPost';
import DeletePost from '../components/DeletePost';
import AddPost from '../components/AddPost';

export default function MyPosts() {
  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [postsData, setPostsData] = useState([]);

  function getPostsData() {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/posts/getPosts`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.posts)) {
          setPostsData(
            <Row className="g-4">
              {data.posts
                .filter((post) => post.author === user.id)
                .map((post) => {
                  const formattedDate = new Date(
                    post.dateCreated
                  ).toLocaleDateString('en-US', {
                    month: '2-digit',
                    day: '2-digit',
                    year: '2-digit',
                  });

                  return (
                    <Col md={6} key={post._id}>
                      <Card
                        style={{
                          border: '2px white solid',
                          maxWidth: '100%',
                        }}
                        className="rounded bg-dark p-3 h-100"
                      >
                        <Card.Title>
                          <h2 className="bg-dark text-center px-3">
                            {post.title}
                          </h2>
                        </Card.Title>
                        <Card.Body className="card-body-custom bg-dark">
                          <div>
                            <div className="d-flex flexbox justify-content-between">
                              <p className="fw-light">by {post.authorName}</p>
                              <p>{formattedDate}</p>
                            </div>

                            <p
                              style={{
                                width: '100%',
                                height: '50px',
                                overflow: 'hidden',
                                display: '-webkit-box',
                                WebkitBoxOrient: 'vertical',
                                WebkitLineClamp: 2,
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {post.content}
                            </p>
                          </div>

                          <div className="d-flex flexbox gap-3 justify-content-center mt-3">
                            <Link
                              to={`/comments/${post._id}`}
                              className="btn btn-outline-light w-100"
                            >
                              <i className="bi bi-book-half"></i>
                              <span className="post-text"> View Post</span>
                            </Link>
                            <EditPost post={post} getPostData={getPostsData} />
                            <DeletePost
                              post={post}
                              getPostData={getPostsData}
                            />
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
    if (user?.id !== null) {
      setIsAuthenticated(true);
    }
    getPostsData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Card className="p-4 text-center bg-dark">
          <Card.Body>
            <h1>My Posts</h1>
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
    );
  }

  return isAuthenticated ? (
    <div className="mb-5">
      <div className="d-flex justify-content-center mt-5">
        <Card className="p-4 text-center bg-dark">
          <Card.Body>
            <h1>My Posts</h1>
            <div className="d-flex justify-content-center">
              <h6
                className="text-light fw-light text-center py-3"
                style={{ maxWidth: '400px' }}
              >
                You can view all the posts you have created here. Feel free to
                add new posts, edit existing ones, or delete posts you no longer
                need. This is your personal space to manage your content.
              </h6>
            </div>
            <AddPost getPostData={getPostsData} />
          </Card.Body>
        </Card>
      </div>

      <hr className="my-3" />
      {postsData}
    </div>
  ) : (
    <Navigate to="/" />
  );
}
