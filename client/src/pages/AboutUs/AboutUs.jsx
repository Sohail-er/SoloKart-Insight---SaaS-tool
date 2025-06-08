
import RuturajImage from '../../assets/images/Ruturaj.jpeg'; // Adjust the path if necessary
import ShriniwasImage from '../../assets/images/Shriniwas.jpeg'; // Adjust the path if necessary
import SohailImage from '../../assets/images/Sohail.png'; // Placeholder: Replace with Sohail's image path
import { Container, Row, Col } from 'react-bootstrap';

/**
 * AboutUs Component
 * Displays information about the team members.
 */
const AboutUs = () => {
  return (
    <div className='py-5' style={{ background: '#1a1d20', width: '100%' }}>
    <Container className="p-5 bg-dark rounded shadow-lg" style={{ maxWidth: '960px' }}>
      <h2 className="display-4 font-weight-bold text-white mb-5 text-center">Meet the Team</h2>

      <Row className="g-4">
        {/* Shriniwas Pawar */}
        <Col md={4} className="d-flex flex-column align-items-center text-center">
          <img
            src={ShriniwasImage}
            alt="Shriniwas Pawar"
            className="w-100 mb-4 shadow"
            style={{ width: '160px', height: '300px', objectFit: 'cover' }}
          />
          <h3 className="h2 font-weight-bold text-white mb-2">Shriniwas Pawar</h3>
          <p className="text-white mb-4" style={{ lineHeight: '1.75' }}>
            Shriniwas is a skilled developer focusing on the application's core
            logic and functionality. His expertise in problem-solving has been
            crucial in building a robust and efficient system.
          </p>
          <a
            href="https://github.com/shriniwas-26"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary text-decoration-none"
          >
            GitHub Profile
          </a>
        </Col>

        {/* Sohail Khan (Placeholder) */}
        <Col md={4} className="d-flex flex-column align-items-center text-center">
          <img
            src={SohailImage}
            alt="Sohail Khan"
            className="w-100 mb-4 shadow"
            style={{ width: '160px', height: '300px', objectFit: 'cover' }}
          />
          <h3 className="h2 font-weight-bold text-white mb-2">Sohail Khan</h3>
          <p className="text-white mb-4" style={{ lineHeight: '1.75' }}>
            Sohail is a valuable team member, contributing unique insights and strong development skills. His problem-solving approach and dedication ensure robust and efficient solutions.
          </p>
          <a
            href="https://github.com/Sohail-er"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary text-decoration-none"
          >
            GitHub Profile
          </a>
        </Col>

        {/* Ruturaj Aher */}
        <Col md={4} className="d-flex flex-column align-items-center text-center">
          <img
            src={RuturajImage}
            alt="Ruturaj Aher"
            className="w-100 mb-4 shadow"
            style={{ width: '160px', height: '300px', objectFit: 'cover', objectPosition: 'top' }}
          />
          <h3 className="h2 font-weight-bold text-white mb-2">Ruturaj Aher</h3>
          <p className="text-white mb-4" style={{ lineHeight: '1.75' }}>
            Ruturaj is a dedicated team member with a strong interest in front-end development. He's contributed significantly to the application's user interface and overall design.
          </p>
          <a
            href="https://github.com/ruturajcdac"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary text-decoration-none"
          >
            GitHub Profile
          </a>
        </Col>
      </Row>
    </Container>
    </div>
  );
};

export default AboutUs;