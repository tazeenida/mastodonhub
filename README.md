# MastodonHub

## Overview

At Purdue University, many clubs and events are available for students to explore. However, new students often struggle to find and engage with these opportunities, facing challenges when navigating the PFW portal. To solve this, our project aims to create a comprehensive app that streamlines club and event information, provides a Purdue events calendar.

## Project Features

- Club and Event Information Searching for clubs and events.
- Events Calendar View upcoming Purdue events.

## Application Structure

- Front-End
     - Built with React.

- Back-End
     - Developed with Django.
- Includes the following endpoints
     - admin/
     - api/mastodonhub/
     - token/ [name='token_obtain_pair']
     - token/refresh/ [name='token_refresh']
     - logout/ [name='logout']
     - signUp/ [name='signUp']
     - profile/ [name='user_profile']

## Technology Stack

- Front-End React
- Back-End Django
- Database SQLite
- Version Control Git

## To start the React frontend and Django backend for your project, follow these steps:

### **Step 1: Start the Django Backend**

1. **Navigate to the backend directory**:

   - Open a new terminal window and navigate to the `backend` folder inside your project directory:
     ```
     cd mastodonhub/backend
     ```

2. **Install backend dependencies**:

   - Run the following command to install the required Python packages listed in `requirements.txt`:
     ```
     pip install -r requirements.txt
     ```

3. **Start the Django development server**:

   - Once the dependencies are installed, run the Django development server:

     ```
     python manage.py runserver
     ```

   - The Django backend will be running at `http://127.0.0.1:8000`.

---

### **Step 2: Start the React Frontend**

1. **Navigate to the frontend directory**:

   - Open a terminal and navigate to the `frontend` folder inside your project directory (e.g., `mastodonhub`):
     ```
     cd mastodonhub/frontend
     ```

2. **Install dependencies**:

   - Run the following command to install the required packages listed in `package.json`:
     ```
     npm install
     ```

3. **Start the React development server**:

   - Once the dependencies are installed, start the React app:

     ```
     npm start
     ```

   - This will run the React development server, and the frontend will be available at `http://localhost:3000`.

---

### **Step 3: Test the Application**

- With both the React frontend (`localhost:3000`) and the Django backend (`localhost:8000`) running, the frontend should be able to make API calls to the backend.

---

### Conclusion

The MastodonHub project is designed to be a one-stop solution for Purdue University students seeking to engage with clubs and events, making it easier to connect, participate, and stay informed.
