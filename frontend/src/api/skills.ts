import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

function getAuthHeaders() {
  const token = localStorage.getItem("access_token");

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function getMySkills() {
  const response = await axios.get(
    `${API_URL}/api/skills/`,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
}

export async function addSkill(
  skill_name: string,
  skill_type: string,
  level: string
) {
  const response = await axios.post(
    `${API_URL}/api/skills/`,
    {
      skill_name,
      skill_type,
      level,
    },
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
}

export async function deleteSkill(
  userSkillId: number
) {
  const response = await axios.delete(
    `${API_URL}/api/skills/${userSkillId}`,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
}