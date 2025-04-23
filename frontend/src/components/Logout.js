import { useEffect } from "react";
import axios from "axios";

const backendUrl = 'http://127.0.0.1:8000';

const Logout = () => {
    useEffect(() => {
        const logout = async () => {
            try {
                await axios.post(
                    `${backendUrl}/logout/`,
                    {},
                    { headers: { "Content-Type": "application/json" } }
                );
                    localStorage.clear();
                    window.location.href = "/login";
            } catch (error) {
                console.error("Logout failed:", error);
                alert("Logout failed. Please try again.");
            }
        };

        logout();
    }, []);

    return <div>Logging out...</div>;
};

export default Logout;
