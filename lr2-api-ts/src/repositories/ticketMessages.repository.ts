const messages: any[] = [];
let nextId = 1;

export const getAll = () => messages;

export const getById = (id: number) => messages.find((m) => m.id === id);

export const create = (data: any) => {
  const msg = { id: nextId++, ...data };
  messages.push(msg);
  return msg;
};

export const remove = (id: number) => {
  const index = messages.findIndex((m) => m.id === id);
  if (index === -1) return false;
  messages.splice(index, 1);
  return true;
};
