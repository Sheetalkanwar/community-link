import { FormEvent, useState } from "react";
import { login } from "../api/auth";
import { Link, useNavigate } from "react-router-dom";
function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleLogin(
  event: FormEvent<HTMLFormElement>
) {
  event.preventDefault();

  try {
    const data = await login(email, password);

    localStorage.setItem(
      "access_token",
      data.access_token
    );

    setMessage("Login successful");

    setTimeout(() => {
      navigate("/");
    }, 500);
  } catch (error: any) {
    setMessage(
      error.response?.data?.detail ||
      "Invalid email or password"
    );
  }
}

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="mb-2 text-3xl font-bold">
        Welcome back
      </h1>

      <p className="mb-8 text-gray-500">
        Sign in to your LocalLink account.
      </p>

      <form
        onSubmit={handleLogin}
        className="space-y-5"
      >
        <div>
          <label className="mb-2 block text-sm font-medium">
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full rounded-lg border px-4 py-3 outline-none focus:border-indigo-600"
            placeholder="you@example.com"
            required
          />

          <p className="mt-6 text-center text-sm text-gray-500">
  Don't have an account?{" "}
  <Link
    to="/register"
    className="font-medium text-indigo-600"
  >
    Create account
  </Link>
</p>
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
            placeholder="Enter your password"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-medium text-white hover:bg-indigo-700"
        >
          Login
        </button>

        {message && (
          <p className="text-center text-sm text-gray-600">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

export default Login;