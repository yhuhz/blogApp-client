import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Error() {
  return (
    <Container className="text-center my-5">
      <img
        src="https://static-00.iconduck.com/assets.00/404-page-not-found-illustration-2048x998-yjzeuy4v.png"
        alt="404"
        className="img-fluid"
      />
      <h1>Page not found</h1>
      <Link to="/" className="btn btn-primary mt-3">
        Return to homepage
      </Link>
    </Container>
  );
}
