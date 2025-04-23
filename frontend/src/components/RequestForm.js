import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Card, ListGroup, Alert } from 'react-bootstrap';
import { MdEvent } from 'react-icons/md';
import { FaTrashAlt } from 'react-icons/fa';
// import 'bootstrap/dist/css/bootstrap.min.css';

const RequestForm = () => {
  const [formData, setFormData] = useState({
    eventName: '',
    eventCategory: '',
    description: '',
  });

  const [requestedEvents, setRequestedEvents] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.eventName && formData.eventCategory && formData.description) {
      setRequestedEvents((prevState) => [...prevState, { ...formData, id: Date.now() }]);
      setFormData({
        eventName: '',
        eventCategory: '',
        description: '',
      });
      setErrorMessage('');
    } else {
      setErrorMessage('Please fill in all fields.');
    }
  };

  const handleDelete = (eventId) => {
    setRequestedEvents(requestedEvents.filter(event => event.id !== eventId));
  };

  return (
    <div className="request-form-wrapper"> {/* Scoped Wrapper */}
      <Container className="py-5">
        <Row className="justify-content-center">
          {/* Left Side: Requested Events */}
          <Col md={6}>
            <Card className="shadow-lg p-4" style={{ borderRadius: '15px' }}>
              <Card.Body>
                <h2 className="mb-3 text-center">Your Requested Events</h2>
                {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                <ListGroup className="scrollable-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {requestedEvents.length === 0 ? (
                    <ListGroup.Item>No requested events yet.</ListGroup.Item>
                  ) : (
                    requestedEvents.map((event) => (
                      <ListGroup.Item key={event.id} className="d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{event.eventName}</strong>
                          <br />
                          <em>{event.eventCategory}</em>
                          <p>{event.description}</p>
                        </div>
                        <FaTrashAlt
                          size={20}
                          color='#e63946'
                          className="ms-2"
                          onClick={() => handleDelete(event.id)}
                          title={'Remove from requests'}
                          style={{ cursor: 'pointer' }}
                        />
                      </ListGroup.Item>
                    ))
                  )}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>

          {/* Right Side: Event Request Form */}
          <Col md={6}>
            <Card className="shadow-lg p-4" style={{ borderRadius: '15px' }}>
              <Card.Body>
                <div className="text-center mb-4">
                  <MdEvent size={60} className="text-primary mb-2" />
                  <h2 className="mb-3">Request an Event</h2>
                  <p className="text-muted">
                    Can't find what you're looking for? Submit a request, and we'll do our best to help!
                  </p>
                </div>
                
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formEventName">
                    <Form.Label>Event Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter the name of the event"
                      name="eventName"
                      value={formData.eventName}
                      onChange={handleChange}
                      required
                      style={{ borderRadius: '10px' }}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formEventCategory">
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                      name="eventCategory"
                      value={formData.eventCategory}
                      onChange={handleChange}
                      required
                      style={{ borderRadius: '10px' }}
                    >
                      <option value="">Select Category</option>
                      <option value="workshop">Workshop</option>
                      <option value="seminar">Seminar</option>
                      <option value="conference">Conference</option>
                      <option value="other">Other</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formDescription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      placeholder="Provide more details about the event"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      style={{ borderRadius: '10px' }}
                    />
                  </Form.Group>
                  <div className="d-flex justify-content-center">
                    <Button variant="primary" type="submit" style={{ borderRadius: '10px' }}>
                      Submit Request
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default RequestForm;
