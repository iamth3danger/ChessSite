import React from "react";

type LoginFormProps = {
  onSubmit: (username: string, password: string) => void;
};

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const username = (event.target as HTMLFormElement).username.value;
    const password = (event.target as HTMLFormElement).password.value;
    onSubmit(username, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username:</label>
        <input type="text" id="username" required />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" required />
      </div>
      <div>
        <button type="submit">Login</button>
      </div>
    </form>
  );
};
export default LoginForm;
