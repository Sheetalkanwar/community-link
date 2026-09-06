import api from "./axios";


// =========================================================
// Posts
// =========================================================

export async function getPosts() {
  const response = await api.get("/api/posts/");
  return response.data;
}


export async function createPost(
  type: string,
  title: string,
  description: string
) {
  const response = await api.post("/api/posts/", {
    type,
    title,
    description,
  });

  return response.data;
}


export async function deletePost(postId: number) {
  const response = await api.delete(
    `/api/posts/${postId}`
  );

  return response.data;
}


// =========================================================
// Likes
// =========================================================

export async function likePost(postId: number) {
  const response = await api.post(
    `/api/posts/${postId}/like`
  );

  return response.data;
}


export async function unlikePost(postId: number) {
  const response = await api.delete(
    `/api/posts/${postId}/like`
  );

  return response.data;
}


// =========================================================
// Comments
// =========================================================

export async function getComments(postId: number) {
  const response = await api.get(
    `/api/posts/${postId}/comments`
  );

  return response.data;
}


export async function createComment(
  postId: number,
  content: string
) {
  const response = await api.post(
    `/api/posts/${postId}/comments`,
    {
      content,
    }
  );

  return response.data;
}