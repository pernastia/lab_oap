import * as repo from "../repositories/statuses.repository.js";

export function getAllStatuses() {
  return repo.getAll();
}

export function getStatusById(id: number) {
  return repo.getById(id);
}

export function createStatus(data: any) {
  return repo.create(data);
}

export function updateStatus(id: number, data: any) {
  return repo.update(id, data);
}

export function deleteStatus(id: number) {
  return repo.remove(id);
}
