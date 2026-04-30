import * as repo from "../repositories/users.repository.js";

export function getAllUsers() {
  return repo.getAllUsers();
}

export function getUserById(id: number) {
  return repo.getUserById(id);
}

export function createUser(dto: { name: string }) {
  return repo.createUser(dto);
}

export function updateUser(id: number, dto: { name: string }) {
  return repo.updateUser(id, dto);
}

export function deleteUser(id: number) {
  return repo.deleteUser(id);
}
