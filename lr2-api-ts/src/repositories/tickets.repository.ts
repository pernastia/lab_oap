import { all, get, run } from "../db/dbClient.js";
import {
  type CreateTicketRequestDTO,
  type UpdateTicketRequestDTO,
} from "../dtos/tickets.dto.js";

const ALLOWED_SORT_FIELDS = new Set([
  "id",
  "subject",
  "priority",
  "statusId",
  "authorId",
]);
const ALLOWED_ORDERS = new Set(["ASC", "DESC"]);

export async function getAllTickets(query: {
  statusId?: number;
  userId?: number;
  sort?: string;
  order?: string;
}) {
  const params: unknown[] = [];

  let sql = `
    SELECT 
      t.*,
      u.name AS authorName,
      s.name AS statusName
    FROM tickets t
    LEFT JOIN users u ON t.authorId = u.id
    LEFT JOIN statuses s ON t.statusId = s.id
    WHERE 1=1
  `;

  if (query.statusId) {
    sql += ` AND t.statusId = ?`;
    params.push(query.statusId);
  }

  if (query.userId) {
    sql += ` AND t.authorId = ?`;
    params.push(query.userId);
  }

  const sortField = ALLOWED_SORT_FIELDS.has(query.sort ?? "")
    ? query.sort
    : "id";
  const sortOrder = ALLOWED_ORDERS.has((query.order ?? "").toUpperCase())
    ? (query.order as string).toUpperCase()
    : "DESC";

  sql += ` ORDER BY ${sortField} ${sortOrder}`;
  sql += ` LIMIT 10`;

  return await all(sql, params);
}

export async function getTicketById(id: number) {
  const sql = `
    SELECT 
      t.*, 
      s.name AS statusName, 
      u.name AS authorName
    FROM tickets t
    LEFT JOIN statuses s ON t.statusId = s.id
    LEFT JOIN users u ON t.authorId = u.id
    WHERE t.id = ?
  `;

  return await get(sql, [id]);
}

export async function getTicketByIdAndOwner(id: number, ownerUserId: number) {
  const sql = `
    SELECT 
      t.*, 
      s.name AS statusName, 
      u.name AS authorName
    FROM tickets t
    LEFT JOIN statuses s ON t.statusId = s.id
    LEFT JOIN users u ON t.authorId = u.id
    WHERE t.id = ? AND t.authorId = ?
  `;

  return await get(sql, [id, ownerUserId]);
}

export async function createTicket(data: CreateTicketRequestDTO) {
  const result = await run(
    `INSERT INTO tickets(subject, message, priority, authorId, statusId)
     VALUES(?, ?, ?, ?, ?)`,
    [data.subject, data.message, data.priority, data.authorId, data.statusId],
  );

  return await getTicketById(result.lastID);
}

export async function updateTicket(
  id: number,
  data: UpdateTicketRequestDTO,
  ownerUserId?: number,
) {
  if (ownerUserId !== undefined) {
    const result = await run(
      `UPDATE tickets SET subject=?, message=? WHERE id=? AND authorId=?`,
      [data.subject, data.message, id, ownerUserId],
    );
    if (result.changes === 0) return null;
  } else {
    await run(`UPDATE tickets SET subject=?, message=? WHERE id=?`, [
      data.subject,
      data.message,
      id,
    ]);
  }

  return await getTicketById(id);
}

export async function deleteTicket(id: number, ownerUserId?: number) {
  if (ownerUserId !== undefined) {
    const result = await run(`DELETE FROM tickets WHERE id=? AND authorId=?`, [
      id,
      ownerUserId,
    ]);
    return result;
  }
  return await run(`DELETE FROM tickets WHERE id=?`, [id]);
}

export async function getTop3TicketsWithTopUser() {
  const top3Tickets = await all(`
    SELECT t.id AS ticketId, t.subject, COUNT(tm.id) AS messagesCount
    FROM tickets t
    JOIN ticket_messages tm ON tm.ticketId = t.id
    GROUP BY t.id, t.subject
    ORDER BY messagesCount DESC
    LIMIT 3
  `);

  const result = [];

  for (const ticket of top3Tickets as any[]) {
    const topUser = await get(
      `SELECT u.name, COUNT(tm.id) AS userMessagesCount
       FROM ticket_messages tm
       JOIN users u ON u.id = tm.userId
       WHERE tm.ticketId = ?
       GROUP BY tm.userId, u.name
       ORDER BY userMessagesCount DESC
       LIMIT 1`,
      [ticket.ticketId],
    );

    result.push({
      ticketId: ticket.ticketId,
      subject: ticket.subject,
      messagesCount: ticket.messagesCount,
      topUser: topUser ? (topUser as any).name : null,
    });
  }

  return result;
}
