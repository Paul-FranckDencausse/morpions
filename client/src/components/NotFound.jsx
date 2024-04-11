import React from 'react'
import { Link } from 'react-router-dom'
import Container from './common/Container';
import Footer from './common/Footer';
import './NotFound.scss'

const NotFound = () => (
  <div className='notFound'>
    <Container>
      <div className='contents'>
        <h2>Page Not Found</h2>
        <p>Sorry, the page you are looking for does not exists.</p>
        <Link to={`/`}>
          <button className="uk-button uk-button-secondary uk-text-capitalize homeButton">Go Home</button>
        </Link>
      </div>
    </Container>
    <Footer />
  </div>
)

export default NotFound