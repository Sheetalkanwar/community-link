import api from "./axios";

export async function register(
  name: string,
  email: string,
  password: string
) {
  const response = await api.post(
    "/api/auth/register",
    {
      name,
      email,
      password,
    }
  );

  return response.data;
}

export async function login(
  email: string,
  password: string
) {
  const response = await api.post(
    "/api/auth/login",
    {
      email,
      password,
    }
  );

  return response.data;
}

export async function getMyProfile() {
  const response = await api.get("/api/auth/me");

  return response.data;
}

export async function updateMyProfile(
  name: string,
  bio: string,
  location: string
) {
  const response = await api.put(
    "/api/auth/me",
    {
      name,
      bio,
      location,
    }
  );

  return response.data;
}