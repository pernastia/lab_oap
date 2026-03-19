const statuses: any[] = [];
let nextId = 1;

export function getAll() {
  return statuses;
}

export function getById(id: number) {
  return statuses.find((s) => s.id === id);
}

export function create(data: any) {
  const status = { id: nextId++, ...data };
  statuses.push(status);
  return status;
}

export function update(id: number, data: any) {
  const index = statuses.findIndex((s) => s.id === id);
  if (index === -1) return null;
  statuses[index] = { id, ...data };
  return statuses[index];
}

export function remove(id: number) {
  const index = statuses.findIndex((s) => s.id === id);
  if (index === -1) return false;
  statuses.splice(index, 1);
  return true;
}
