import { all, get, run } from "../db/dbClient.js";

export async function getAll() {
  return await all(`SELECT * FROM statuses ORDER BY id DESC`);
}

export async function getById(id: number) {
  return await get(`SELECT * FROM statuses WHERE id=${id}`);
}

export async function create(data: any) {
  console.log("---> ЩО ПРИЙШЛО В РЕПОЗИТОРІЙ:", data);
  const result = await run(`
    INSERT INTO statuses(name)
    VALUES('${data.name}')
  `);

  return await get(`SELECT * FROM statuses WHERE id=${result.lastID}`);
}

export async function update(id: number, data: any) {
  await run(`
    UPDATE statuses
    SET name='${data.name}'
    WHERE id=${id}
  `);

  return await get(`SELECT * FROM statuses WHERE id=${id}`);
}

export async function remove(id: number) {
  await run(`DELETE FROM statuses WHERE id=${id}`);
  return true;
}
