import api from "./axios";

export async function sendMessage(
  receiverId: number,
  content: string
) {
  const response = await api.post(
    "/api/messages/",
    {
      receiver_id: receiverId,
      content,
    }
  );

  return response.data;
}

export async function getMessages(
  userId: number
) {
  const response = await api.get(
    `/api/messages/${userId}`
  );

  return response.data;
}