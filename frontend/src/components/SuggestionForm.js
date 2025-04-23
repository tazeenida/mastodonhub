import React, { useState } from 'react';
import { Form, Button, Card, Container, Row, Col, Alert } from 'react-bootstrap';
import { Edit3 } from 'lucide-react'; // Import the desired icon from lucide-react

const EVENT_OPTIONS = [
  { value: 'event1', label: 'Event 1' },
  { value: 'event2', label: 'Event 2' },
  { value: 'event3', label: 'Event 3' },
  // Add more events as needed
];

const SuggestionForm = () => {
  const [formData, setFormData] = useState({
    event: '',
    suggestion: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.event && formData.suggestion) {
      // Simulate form submission success
      setSubmitted(true);
      setErrorMessage('');
    } else {
      setErrorMessage('Please fill out all fields.');
    }
  };

  const handleReset = () => {
    setFormData({
      event: '',
      suggestion: '',
    });
    setSubmitted(false);
  };

  return (
    <Container fluid className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', backgroundColor: '#000000', paddingTop: '200px', paddingRight: '200px', paddingLeft: '450px' }}>
      <Row className="justify-content-center w-100">
        <Col md={6} lg={4} className="d-flex justify-content-center">
          <Card style={{ padding: '70px', borderRadius: '10px', width: '100%', maxWidth: '500px', backgroundColor: '#ffffff', textAlign: 'center' }}>
            <Card.Body>
              <div className="text-center mb-4">
                <Edit3 size={60} className="mb-2" style={{ color: '#000000' }} /> {/* Icon in black */}
              </div>
              <h2 className="mb-3 text-center" style={{ color: '#000000' }}>Help us improve our events!</h2> {/* Text in black */}
              {errorMessage && <Alert variant="danger" className="text-center">{errorMessage}</Alert>}
              {!submitted ? (
                <Form onSubmit={handleSubmit} className="text-center">
                <Form.Group className="mb-4 text-start"> {/* Increased margin-bottom to mb-4 */}
                  <Form.Label style={{ color: '#000000' }}>Select an Event:</Form.Label> {/* Text in black */}
                  <Form.Select
                    name="event"
                    value={formData.event}
                    onChange={handleChange}
                    required
                    style={{ borderRadius: '5px', color: '#000000', width: '100%', marginTop: '8px' }}
                  >
                    <option value="">Choose an event</option>
                    {EVENT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-4 text-start"> {/* Increased margin-bottom to mb-4 */}
                  <Form.Label style={{ color: '#000000' }}>Suggestion / Review:</Form.Label> {/* Text in black */}
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Provide your suggestion or review"
                    name="suggestion"
                    value={formData.suggestion}
                    onChange={handleChange}
                    required
                    style={{ borderRadius: '6px', color: '#000000', width: '100%', marginTop: '8px' }}
                  />
                </Form.Group>
                <div className="d-flex justify-content-center mt-5"> {/* Increased margin-top to mt-5 */}
                  <Button variant="primary" type="submit" style={{ backgroundColor: '#000000', borderColor: '#000000', padding: '10px', marginTop: '10px'}}> {/* Button in black */}
                    Submit Suggestion
                  </Button>
                </div>
              </Form>
              ) : (
                <div className="text-center">
                  <h4 style={{ color: '#000000' }}>Thank you for your suggestion!</h4> {/* Text in black */}
                  <Button variant="outline-primary" onClick={handleReset} style={{ color: '#ffffff', borderColor: '#000000' }}> {/* Button in black */}
                    Submit Another Suggestion
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SuggestionForm;