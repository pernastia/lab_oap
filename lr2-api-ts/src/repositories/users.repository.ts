import { all, get, run } from "../db/dbClient.js";

export async function getAllUsers() {
  return all("SELECT * FROM Users ORDER BY id DESC");
}

export async function getUserById(id: number) {
  return get(`SELECT * FROM Users WHERE id = ${id}`);
}

export async function createUser(dto: { name: string }) {
  const result = await run(`INSERT INTO Users(name) VALUES('${dto.name}')`);
  return getUserById(result.lastID);
}

export async function updateUser(id: number, dto: { name: string }) {
  await run(`UPDATE Users SET name = '${dto.name}' WHERE id = ${id}`);
  return getUserById(id);
}

export async function deleteUser(id: number) {
  const result = await run(`DELETE FROM Users WHERE id = ${id}`);
  return result.changes > 0;
}
