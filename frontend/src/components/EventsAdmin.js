import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input } from "reactstrap";
import { useNavigate } from 'react-router-dom';
import '../adminClubsEvents.css'

const backendUrl = 'http://127.0.0.1:8000';

function EventsAdmin() {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [modal, setModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    // Initial state for event form
    const initialEventState = {
        Title: '',
        Description: '',
        Location: '',
        Date: '',
        StartTime: '',
        EndTime: '',
        ImageUrl: '',
        Category: ''
    };

    // Event state for create and edit
    const [currentEvent, setCurrentEvent] = useState(initialEventState);

    // Check admin status and fetch events on component mount
    useEffect(() => {
        const checkAdminStatus = async () => {
            const token = localStorage.getItem('access_token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await axios.get(`${backendUrl}/api/check-admin/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.data && response.data.is_admin) {
                    setIsAdmin(true);
                    fetchEvents();
                } else {
                    // If not admin, redirect to dashboard
                    navigate('/dashboard');
                }
            } catch (error) {
                console.error('Error checking admin status:', error);
                navigate('/dashboard');
            }
        };

        checkAdminStatus();
    }, [navigate]);

    // Fetch events data
    const fetchEvents = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.get(`${backendUrl}/api/mastodonhub/events/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setEvents(response.data);
        } catch (error) {
            setError(error);
            console.error('Error fetching events:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle input changes in form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentEvent(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Toggle create modal
    const toggleCreateModal = () => {
        setModal(prev => !prev);
        if (!modal) {
            // Reset form when opening
            setCurrentEvent(initialEventState);
        }
    };

    // Toggle edit modal
    const toggleEditModal = (event = null) => {
        setEditModal(prev => !prev);
        if (event) {
            // Populate form with selected event data
            setCurrentEvent({ ...event });
        }
    };

    const validateForm = () => {
        const { Title, Description, Location, Date, StartTime, EndTime, ImageUrl, Category } = currentEvent;

        if (!Title || Title.trim() === '') {
            alert('Event Title is required');
            return false;
        }

        if (!Description || Description.trim() === '') {
            alert('Event Description is required');
            return false;
        }

        if (!Location || Location.trim() === '') {
            alert('Event Location is required');
            return false;
        }

        if (!Date || Date.trim() === '') {
            alert('Event Date is required');
            return false;
        }

        if (!StartTime || StartTime.trim() === '') {
            alert('Event Start Time is required');
            return false;
        }

        if (!EndTime || EndTime.trim() === '') {
            alert('Event End Time is required');
            return false;
        }

        if (!Category || Category.trim() === '') {
            alert('Event Category is required');
            return false;
        }

        // Validate ImageUrl if provided
        if (ImageUrl) {
            try {
                // Check URL length
                if (ImageUrl.length > 200) {
                    alert('Image URL must be 200 characters or less');
                    return false;
                }

                // Optional: Additional URL validation
                new URL(ImageUrl);
            } catch (error) {
                alert('Invalid Image URL. Please provide a valid URL or leave blank.');
                return false;
            }
        }

        return true;
    };

    // Create new event
    const handleCreateEvent = async () => {
        // Validate form first
        if (!validateForm()) return;

        try {
            const token = localStorage.getItem('access_token');
            
            // Log the payload for debugging
            console.log('Creating Event Payload:', currentEvent);

            const response = await axios.post(
                `${backendUrl}/api/mastodonhub/events/`, 
                currentEvent, 
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            // Refresh events list and close modal
            fetchEvents();
            toggleCreateModal();
            
            // Show success message
            alert('Event created successfully!');
        } catch (error) {
            // Detailed error logging
            console.error('Full Error Object:', error);
            console.error('Error Response:', error.response);
            
            // Detailed error message extraction
            let errorMessage = 'Failed to create event';
            
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                if (error.response.data) {
                    if (typeof error.response.data === 'object') {
                        // Try to extract specific error details
                        errorMessage = error.response.data.error || 
                                       error.response.data.message || 
                                       error.response.data.detail || 
                                       JSON.stringify(error.response.data);
                    } else {
                        errorMessage = error.response.data;
                    }
                }
                
                console.error('Status Code:', error.response.status);
                console.error('Headers:', error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                errorMessage = 'No response received from server';
                console.error('Request:', error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                errorMessage = error.message;
                console.error('Error Message:', error.message);
            }

            // Show detailed error to user
            alert(errorMessage);
        }
    };

    // Update existing event
    const handleUpdateEvent = async () => {
        // Validate form first
        if (!validateForm()) return;

        try {
            const token = localStorage.getItem('access_token');
            await axios.put(`${backendUrl}/api/mastodonhub/events/${currentEvent.id}/`, currentEvent, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            // Refresh events list and close modal
            fetchEvents();
            toggleEditModal();
            
            // Show success message
            alert('Event updated successfully!');
        } catch (error) {
            console.error('Error updating event:', error.response ? error.response.data : error);
            alert('Failed to update event: ' + 
                (error.response?.data?.detail || 
                 error.response?.data?.non_field_errors?.[0] || 
                 'Unknown error')
            );
        }
    };

    // Delete event
    const handleDeleteEvent = async (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                const token = localStorage.getItem('access_token');
                await axios.delete(`${backendUrl}/api/mastodonhub/events/${id}/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                // Refresh event list
                fetchEvents();
                
                // Show success message
                alert('Event deleted successfully!');
            } catch (error) {
                console.error('Error deleting Event:', error.response ? error.response.data : error);
                alert('Failed to delete Event: ' + 
                    (error.response?.data?.detail || 
                     error.response?.data?.non_field_errors?.[0] || 
                     'Unknown error')
                );
            }
        }
    };

    

    // If not admin, show nothing (will redirect from useEffect)
    if (!isAdmin) {
        return null;
    }

    return (
        <div className="container mt-4">
            <h1>Events Administration</h1>
            
            {/* Add New Event Button */}
            <div className="mb-3">
                <Button color="primary" onClick={toggleCreateModal}>
                    Add New Event
                </Button>
            </div>

            {/* Events Table */}
            {isLoading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error: {error.message}</p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped" style={{color: "black"}}>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Location</th>
                                <th>Date</th>
                                <th>Start Time</th>
                                <th>End Time</th>
                                <th>Category</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((event) => (
                                <tr key={event.id}>
                                    <td>{event.Title}</td>
                                    <td>{event.Description}</td>
                                    <td>{event.Location}</td>
                                    <td>{event.Date}</td>
                                    <td>{event.StartTime}</td>
                                    <td>{event.EndTime}</td>
                                    <td>{event.Category}</td>
                                    <td>
                                        <Button 
                                            color="info" 
                                            size="sm" 
                                            className="mr-2" 
                                            onClick={() => toggleEditModal(event)}
                                        >
                                            Edit
                                        </Button>
                                        {' '}
                                        <Button 
                                            color="danger" 
                                            size="sm" 
                                            onClick={() => handleDeleteEvent(event.id)}
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Create Event Modal */}
            <Modal isOpen={modal} toggle={toggleCreateModal}>
                <ModalHeader toggle={toggleCreateModal}>Add New Event</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label for="Title">Event Title *</Label>
                            <Input
                                type="text"
                                name="Title"
                                id="Title"
                                value={currentEvent.Title}
                                onChange={handleInputChange}
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="Description">Description *</Label>
                            <Input
                                type="text"
                                name="Description"
                                id="Description"
                                value={currentEvent.Description}
                                onChange={handleInputChange}
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="Location">Location *</Label>
                            <Input
                                type="text"
                                name="Location"
                                id="Location"
                                value={currentEvent.Location}
                                onChange={handleInputChange}
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="Date">Date *</Label>
                            <Input
                                type="date"
                                name="Date"
                                id="Date"
                                value={currentEvent.Date}
                                onChange={handleInputChange}
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="StartTime">Start Time *</Label>
                            <Input
                                type="time"
                                name="StartTime"
                                id="StartTime"
                                value={currentEvent.StartTime}
                                onChange={handleInputChange}
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="EndTime">End Time *</Label>
                            <Input
                                type="time"
                                name="EndTime"
                                id="EndTime"
                                value={currentEvent.EndTime}
                                onChange={handleInputChange}
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="Category">Category *</Label>
                            <Input
                                type="text"
                                name="Category"
                                id="Category"
                                value={currentEvent.Category}
                                onChange={handleInputChange}
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="ImageUrl">Image URL</Label>
                            <Input
                                type="text"
                                name="ImageUrl"
                                id="ImageUrl"
                                value={currentEvent.ImageUrl}
                                onChange={handleInputChange}
                            />
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleCreateEvent}>Create</Button>
                    <Button color="secondary" onClick={toggleCreateModal}>Cancel</Button>
                </ModalFooter>
            </Modal>

            {/* Edit Event Modal */}
            <Modal isOpen={editModal} toggle={() => toggleEditModal()}>
                <ModalHeader toggle={() => toggleEditModal()}>Edit Event</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label for="EditTitle">Event Title *</Label>
                            <Input
                                type="text"
                                name="Title"
                                id="EditTitle"
                                value={currentEvent.Title}
                                onChange={handleInputChange}
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="EditDescription">Description *</Label>
                            <Input
                                type="text"
                                name="Description"
                                id="EditDescription"
                                value={currentEvent.Description}
                                onChange={handleInputChange}
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="EditLocation">Location *</Label>
                            <Input
                                type="text"
                                name="Location"
                                id="EditLocation"
                                value={currentEvent.Location}
                                onChange={handleInputChange}
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="EditDate">Date *</Label>
                            <Input
                                type="date"
                                name="Date"
                                id="EditDate"
                                value={currentEvent.Date}
                                onChange={handleInputChange}
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="EditStartTime">Start Time *</Label>
                            <Input
                                type="time"
                                name="StartTime"
                                id="EditStartTime"
                                value={currentEvent.StartTime}
                                onChange={handleInputChange}
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="EditEndTime">End Time *</Label>
                            <Input
                                type="time"
                                name="EndTime"
                                id="EditEndTime"
                                value={currentEvent.EndTime}
                                onChange={handleInputChange}
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="EditCategory">Category *</Label>
                            <Input
                                type="text"
                                name="Category"
                                id="EditCategory"
                                value={currentEvent.Category}
                                onChange={handleInputChange}
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="EditImageUrl">Image URL</Label>
                            <Input
                                type="text"
                                name="ImageUrl"
                                id="EditImageUrl"
                                value={currentEvent.ImageUrl}
                                onChange={handleInputChange}
                            />
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleUpdateEvent}>Update</Button>
                    <Button color="secondary" onClick={() => toggleEditModal()}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

export default EventsAdmin;
