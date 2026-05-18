import { useState } from "react";

import { useNavigate } from "react-router-dom";

import api from "../services/api";

function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/login", formData);

      const token = response.data.data.token;

      const user = response.data.data.user;

      localStorage.setItem("token", token);

      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "EMPLOYEE") {
        navigate("/employee");
      } else if (user.role === "MANAGER") {
        navigate("/manager");
      } else if (user.role === "ADMIN") {
        navigate("/admin");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-[400px]">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
          Goal Tracking Portal
        </h1>

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block mb-1 font-medium">Email</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 outline-none"
              placeholder="Enter email"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Password</label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 outline-none"
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
