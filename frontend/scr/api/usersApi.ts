import { API_BASE_URL } from "../config.js";
import { User } from "../types/user.js";

export async function getUsers(): Promise<User[]> {
  const response = await fetch(`${API_BASE_URL}/users`);
  const result = await response.json();
  return result.data ?? result;
}

export async function createUser(data: Omit<User, "id">): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  const result = await response.json();
  return result.data ?? result;
}

export async function updateUser(id: number, data: Omit<User, "id">): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  const result = await response.json();
  return result.data ?? result;
}

export async function deleteUser(id: number): Promise<void> {
  await fetch(`${API_BASE_URL}/users/${id}`, {
    method: "DELETE"
  });
}