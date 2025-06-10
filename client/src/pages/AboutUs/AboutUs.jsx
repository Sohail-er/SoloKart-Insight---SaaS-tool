import RuturajImage from '../../assets/images/Ruturaj.jpeg'; // Adjust the path if necessary
import ShriniwasImage from '../../assets/images/Shriniwas.jpeg'; // Adjust the path if necessary
import SohailImage from '../../assets/images/sk.jpg'; // Placeholder: Replace with Sohail's image path
import { Container, Row, Col } from 'react-bootstrap';
import './AboutUs.css';

/**
 * AboutUs Component
 * Displays information about the team members.
 */
const AboutUs = () => {
  return (
    <div className='about-us-container'>
      <Container className="about-us-content">
        <h2 className="about-us-title">Meet the Team</h2>

        <Row className="g-4">
          {/* Shriniwas Pawar */}
          <Col md={4}>
            <div className="team-member-card">
              <img
                src={ShriniwasImage}
                alt="Shriniwas Pawar"
                className="member-image"
              />
              <h3 className="member-name">Shriniwas Pawar</h3>
              <p className="member-description">
                Shriniwas is a skilled developer focusing on the application's core
                logic and functionality. His expertise in problem-solving has been
                crucial in building a robust and efficient system.
              </p>
              <a
                href="https://github.com/shriniwas-26"
                target="_blank"
                rel="noopener noreferrer"
                className="github-link"
              >
                GitHub Profile
              </a>
            </div>
          </Col>

          {/* Sohail Khan */}
          <Col md={4}>
            <div className="team-member-card">
              <img
                src={SohailImage}
                alt="Sohail Khan"
                className="member-image"
              />
              <h3 className="member-name">Sohail Khan</h3>
              <p className="member-description">
                Sohail is a valuable team member and developer, contributing unique insights and strong development skills. His problem-solving approach and dedication ensure robust and efficient solutions.
              </p>
              <a
                href="https://github.com/Sohail-er"
                target="_blank"
                rel="noopener noreferrer"
                className="github-link"
              >
                GitHub Profile
              </a>
            </div>
          </Col>

          {/* Ruturaj Aher */}
          <Col md={4}>
            <div className="team-member-card">
              <img
                src={RuturajImage}
                alt="Ruturaj Aher"
                className="member-image"
              />
              <h3 className="member-name">Ruturaj Aher</h3>
              <p className="member-description">
                Ruturaj is a dedicated team member with a strong interest in front-end development. He's contributed significantly to the application's user interface and overall design.
              </p>
              <a
                href="https://github.com/ruturajcdac"
                target="_blank"
                rel="noopener noreferrer"
                className="github-link"
              >
                GitHub Profile
              </a>
            </div>
          </Col>
        </Row>

        {/* Contact Section */}
        <div className="contact-section">
          <h4 className="contact-title">Contact Us</h4>
          <div className="contact-info">
            <a href="tel:+919876543210" className="contact-item">
              <i className="bi bi-telephone-fill contact-icon"></i>
              +91 98765 43210
            </a>
            <a href="mailto:contact@solokart.com" className="contact-item">
              <i className="bi bi-envelope-fill contact-icon"></i>
              contact@solokart.com
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default AboutUs;