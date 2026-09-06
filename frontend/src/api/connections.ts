import api from "./axios";

export async function sendConnectionRequest(
  receiverId: number
) {
  const response = await api.post(
    `/api/connections/${receiverId}`
  );

  return response.data;
}

export async function getReceivedRequests() {
  const response = await api.get(
    "/api/connections/received"
  );

  return response.data;
}

export async function acceptConnection(
  connectionId: number
) {
  const response = await api.put(
    `/api/connections/${connectionId}/accept`
  );

  return response.data;
}

export async function rejectConnection(
  connectionId: number
) {
  const response = await api.put(
    `/api/connections/${connectionId}/reject`
  );

  return response.data;
}

export async function getConnections() {
  const response = await api.get(
    "/api/connections/"
  );

  return response.data;
}