import { API_BASE_URL } from "../config.js";
import { Status } from "../types/status.js";

export async function getStatuses(): Promise<Status[]> {

  const response = await fetch(
    `${API_BASE_URL}/statuses`
  );

  const result = await response.json();

  return result.data;
}

export async function createStatus(
  data: Omit<Status, "id">
): Promise<Status> {

  const response = await fetch(
    `${API_BASE_URL}/statuses`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }
  );

  const result = await response.json();

  return result.data;
}

export async function updateStatus(
  id: number,
  data: Omit<Status, "id">
): Promise<Status> {

  const response = await fetch(
    `${API_BASE_URL}/statuses/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }
  );

  const result = await response.json();

  return result.data;
}

export async function deleteStatus(
  id: number
): Promise<void> {

  await fetch(
    `${API_BASE_URL}/statuses/${id}`,
    {
      method: "DELETE"
    }
  );
}
