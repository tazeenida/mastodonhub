import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input } from "reactstrap";
import { useNavigate } from 'react-router-dom';
import '../adminClubsEvents.css'

const backendUrl = process.env.REACT_APP_BACKEND_URL;

function ClubsAdmin() {
    const [clubs, setClubs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [modal, setModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    // Initial state for club form
    const initialClubState = {
        Title: '',
        Category: '',
        PresidentName: '',
        TreasurerName: '',
        AdvisorName: '',
        Email: '',
        ImageUrl: ''
    };

    // Club state for create and edit
    const [currentClub, setCurrentClub] = useState(initialClubState);

    // Check admin status and fetch clubs on component mount
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
                    fetchClubs();
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

    // Fetch clubs data
    const fetchClubs = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.get(`${backendUrl}/api/mastodonhub/clubs/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setClubs(response.data);
        } catch (error) {
            setError(error);
            console.error('Error fetching clubs:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle input changes in form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentClub(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Toggle create modal
    const toggleCreateModal = () => {
        setModal(prev => !prev);
        if (!modal) {
            // Reset form when opening
            setCurrentClub(initialClubState);
        }
    };

    // Toggle edit modal
    const toggleEditModal = (club = null) => {
        setEditModal(prev => !prev);
        if (club) {
            // Populate form with selected club data
            setCurrentClub({ ...club });
        }
    };

    const validateForm = () => {
    const { Title, PresidentName, Email, ImageUrl } = currentClub;
    
    if (!Title || Title.trim() === '') {
        alert('Club Name is required');
        return false;
    }

    if (!PresidentName || PresidentName.trim() === '') {
        alert('President Name is required');
        return false;
    }

    if (!Email || !Email.includes('@')) {
        alert('Valid Email is required');
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


    // Create new club
const handleCreateClub = async () => {
    // Validate form first
    if (!validateForm()) return;

    try {
        const token = localStorage.getItem('access_token');
        
        // Log the payload for debugging
        console.log('Creating Club Payload:', currentClub);

        const response = await axios.post(
            `${backendUrl}/api/mastodonhub/clubs/`, 
            currentClub, 
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        // Refresh clubs list and close modal
        fetchClubs();
        toggleCreateModal();
        
        // Show success message
        alert('Club created successfully!');
    } catch (error) {
        // Detailed error logging
        console.error('Full Error Object:', error);
        console.error('Error Response:', error.response);
        
        // Detailed error message extraction
        let errorMessage = 'Failed to create club';
        
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

    // Update existing club
    const handleUpdateClub = async () => {
        // Validate form first
        if (!validateForm()) return;

        try {
            const token = localStorage.getItem('access_token');
            await axios.put(`${backendUrl}/api/mastodonhub/clubs/${currentClub.id}/`, currentClub, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            // Refresh clubs list and close modal
            fetchClubs();
            toggleEditModal();
            
            // Show success message
            alert('Club updated successfully!');
        } catch (error) {
            console.error('Error updating club:', error.response ? error.response.data : error);
            alert('Failed to update club: ' + 
                (error.response?.data?.detail || 
                 error.response?.data?.non_field_errors?.[0] || 
                 'Unknown error')
            );
        }
    };

    // Delete club
    const handleDeleteClub = async (id) => {
        if (window.confirm('Are you sure you want to delete this club?')) {
            try {
                const token = localStorage.getItem('access_token');
                await axios.delete(`${backendUrl}/api/mastodonhub/clubs/${id}/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                // Refresh clubs list
                fetchClubs();
                
                // Show success message
                alert('Club deleted successfully!');
            } catch (error) {
                console.error('Error deleting club:', error.response ? error.response.data : error);
                alert('Failed to delete club: ' + 
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
            <h1>Clubs Administration</h1>
            
            {/* Add New Club Button */}
            <div className="mb-3">
                <Button color="primary" onClick={toggleCreateModal}>
                    Add New Club
                </Button>
            </div>

            {/* Clubs Table */}
            {isLoading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error: {error.message}</p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped" style={{color:"black"}}>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Category</th>
                                <th>President</th>
                                <th>Advisor</th>
                                <th>Email</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clubs.map((club) => (
                                <tr key={club.id}>
                                    <td>{club.Title}</td>
                                    <td>{club.Category}</td>
                                    <td>{club.PresidentName}</td>
                                    <td>{club.AdvisorName}</td>
                                    <td>{club.Email}</td>
                                    <td>
                                        <Button 
                                            color="info" 
                                            size="sm" 
                                            className="mr-2" 
                                            onClick={() => toggleEditModal(club)}
                                        >
                                            Edit
                                        </Button>
                                        {' '}
                                        <Button 
                                            color="danger" 
                                            size="sm" 
                                            onClick={() => handleDeleteClub(club.id)}
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

            {/* Create Club Modal */}
            <Modal isOpen={modal} toggle={toggleCreateModal}>
                <ModalHeader toggle={toggleCreateModal}>Add New Club</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label for="Title">Club Name *</Label>
                            <Input
                                type="text"
                                name="Title"
                                id="Title"
                                value={currentClub.Title}
                                onChange={handleInputChange}
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="Category">Category</Label>
                            <Input
                                type="text"
                                name="Category"
                                id="Category"
                                value={currentClub.Category}
                                onChange={handleInputChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="PresidentName">President Name *</Label>
                            <Input
                                type="text"
                                name="PresidentName"
                                id="PresidentName"
                                value={currentClub.PresidentName}
                                onChange={handleInputChange}
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="TreasurerName">Treasurer Name</Label>
                            <Input
                                type="text"
                                name="TreasurerName"
                                id="TreasurerName"
                                value={currentClub.TreasurerName}
                                onChange={handleInputChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="AdvisorName">Advisor Name</Label>
                            <Input
                                type="text"
                                name="AdvisorName"
                                id="AdvisorName"
                                value={currentClub.AdvisorName}
                                onChange={handleInputChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="Email">Email *</Label>
                            <Input
                                type="email"
                                name="Email"
                                id="Email"
                                value={currentClub.Email}
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
                                value={currentClub.ImageUrl}
                                onChange={handleInputChange}
                            />
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleCreateClub}>Create</Button>
                    <Button color="secondary" onClick={toggleCreateModal}>Cancel</Button>
                </ModalFooter>
            </Modal>

            {/* Edit Club Modal */}
            <Modal isOpen={editModal} toggle={() => toggleEditModal()}>
                <ModalHeader toggle={() => toggleEditModal()}>Edit Club</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label for="EditTitle">Club Name *</Label>
                            <Input
                                type="text"
                                name="Title"
                                id="EditTitle"
                                value={currentClub.Title}
                                onChange={handleInputChange}
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="EditCategory">Category</Label>
                            <Input
                                type="text"
                                name="Category"
                                id="EditCategory"
                                value={currentClub.Category}
                                onChange={handleInputChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="EditPresidentName">President Name *</Label>
                            <Input
                                type="text"
                                name="PresidentName"
                                id="EditPresidentName"
                                value={currentClub.PresidentName}
                                onChange={handleInputChange}
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="EditTreasurerName">Treasurer Name</Label>
                            <Input
                                type="text"
                                name="TreasurerName"
                                id="EditTreasurerName"
                                value={currentClub.TreasurerName}
                                onChange={handleInputChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="EditAdvisorName">Advisor Name</Label>
                            <Input
                                type="text"
                                name="AdvisorName"
                                id="EditAdvisorName"
                                value={currentClub.AdvisorName}
                                onChange={handleInputChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="EditEmail">Email *</Label>
                            <Input
                                type="email"
                                name="Email"
                                id="EditEmail"
                                value={currentClub.Email}
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
                                value={currentClub.ImageUrl}
                                onChange={handleInputChange}
                            />
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleUpdateClub}>Update</Button>
                    <Button color="secondary" onClick={() => toggleEditModal()}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

export default ClubsAdmin;