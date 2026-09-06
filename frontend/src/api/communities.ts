import api from "./axios";


// =========================
// Types
// =========================

export interface Community {
  id: number;
  name: string;
  description: string;
  category: string;
  members: number;
  joined: boolean;
  created_by: number;
}


// =========================
// Get communities
// =========================

export async function getCommunities(): Promise<Community[]> {
  const response = await api.get(
    "/api/communities/"
  );

  return response.data;
}


// =========================
// Create community
// =========================

export async function createCommunity(
  name: string,
  description: string,
  category: string
) {
  const response = await api.post(
    "/api/communities/",
    {
      name,
      description,
      category,
    }
  );

  return response.data;
}


// =========================
// Join community
// =========================

export async function joinCommunity(
  communityId: number
) {
  const response = await api.post(
    `/api/communities/${communityId}/join`
  );

  return response.data;
}


// =========================
// Leave community
// =========================

export async function leaveCommunity(
  communityId: number
) {
  const response = await api.delete(
    `/api/communities/${communityId}/leave`
  );

  return response.data;
}

export async function getCommunity(communityId: number) {
  const response = await api.get(
    `/api/communities/${communityId}`
  );

  return response.data;
}

export async function getCommunityPosts(communityId: number) {
  const response = await api.get(
    `/api/communities/${communityId}/posts`
  );

  return response.data;
}


export async function createCommunityPost(
  communityId: number,
  content: string
) {
  const response = await api.post(
    `/api/communities/${communityId}/posts`,
    {
      content,
    }
  );

  return response.data;
}

export async function likeCommunityPost(
  communityId: number,
  postId: number
) {
  const response = await api.post(
    `/api/communities/${communityId}/posts/${postId}/like`
  );

  return response.data;
}


export async function unlikeCommunityPost(
  communityId: number,
  postId: number
) {
  const response = await api.delete(
    `/api/communities/${communityId}/posts/${postId}/like`
  );

  return response.data;
}


export async function getCommunityPostComments(
  communityId: number,
  postId: number
) {
  const response = await api.get(
    `/api/communities/${communityId}/posts/${postId}/comments`
  );

  return response.data;
}


export async function createCommunityPostComment(
  communityId: number,
  postId: number,
  content: string
) {
  const response = await api.post(
    `/api/communities/${communityId}/posts/${postId}/comments`,
    {
      content,
    }
  );

  return response.data;
}