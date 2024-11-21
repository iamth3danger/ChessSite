import axios from "axios";
import React, { useState } from "react";

const RegistrationForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/users", {
        username,
        password,
      });
      console.log("Registration successful:", response.data);
      // Handle successful registration, e.g., redirect to login page
    } catch (error) {
      console.error("Registration failed:", error);
      // Handle registration error, e.g., show error message
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <button type="submit">Register</button>
      </div>
    </form>
  );
};
export default RegistrationForm;
