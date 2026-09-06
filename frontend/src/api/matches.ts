import api from "./axios";

export async function getMatches() {
  const response = await api.get("/api/matches/");

  return response.data;
}