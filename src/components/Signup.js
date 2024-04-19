import React, { useState } from 'react';

const SignUp = () => {
    const [successPopupVisible, setSuccessPopupVisible] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Simulate successful response
        setSuccessPopupVisible(true);
        setTimeout(() => {
            setSuccessPopupVisible(false);
        }, 3000);
    };

    return (
        <main id="styles_main">
            <h1 id="signup_id">Create an Account</h1>
            <form id="signup-form" onSubmit={handleSubmit}>
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" required />

                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" required />

                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" required />

                <label htmlFor="confirm-password">Confirm Password</label>
                <input type="password" id="confirm-password" name="confirmPassword" required />

                <label htmlFor="student-id">Student ID</label>
                <input type="text" id="student-id" name="studentId" required />

                <label htmlFor="major">Major</label>
                <input type="text" id="major" name="major" required />

                <button type="submit">Sign Up</button>

                {successPopupVisible && (
                    <div className="popup popup-top" id="success-popup">
                        Account created successfully!
                    </div>
                )}
            </form>

            <p className="login-link">Already have an account? <a href="./Login">Log in</a></p>
        </main>
    );
};

export default SignUp;
