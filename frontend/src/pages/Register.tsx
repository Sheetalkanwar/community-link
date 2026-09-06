import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api/auth";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleRegister(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      await register(name, email, password);

      setMessage("Account created successfully");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error: any) {
      setMessage(
        error.response?.data?.detail ||
        "Registration failed"
      );
    }
  }

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="mb-2 text-3xl font-bold">
        Create your account
      </h1>

      <p className="mb-8 text-gray-500">
        Join your local community on LocalLink.
      </p>

      <form
        onSubmit={handleRegister}
        className="space-y-5"
      >
        <div>
          <label className="mb-2 block text-sm font-medium">
            Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border px-4 py-3 outline-none focus:border-indigo-600"
            placeholder="Your name"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border px-4 py-3 outline-none focus:border-indigo-600"
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full rounded-lg border px-4 py-3 outline-none focus:border-indigo-600"
            placeholder="Create a password"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-medium text-white hover:bg-indigo-700"
        >
          Create Account
        </button>

        {message && (
          <p className="text-center text-sm text-gray-600">
            {message}
          </p>
        )}
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-medium text-indigo-600"
        >
          Login
        </Link>
      </p>
    </div>
  );
}

export default Register;