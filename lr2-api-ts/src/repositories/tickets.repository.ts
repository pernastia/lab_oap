import { all, get, run } from "../db/dbClient.js";

export async function getAllTickets(query: any) {
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
    sql += ` AND t.statusId = ${query.statusId}`;
  }

  if (query.userId) {
    sql += ` AND t.authorId = ${query.userId}`;
  }

  if (query.sort) {
    sql += ` ORDER BY ${query.sort} ${query.order === "desc" ? "DESC" : "ASC"}`;
  }

  sql += ` LIMIT 10`;

  return await all(sql);
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
    WHERE t.id = ${id}
  `;

  return await get(sql);
}

export async function createTicket(data: any) {
  const result = await run(`
    INSERT INTO tickets(subject, message, priority, authorId, statusId)
    VALUES('${data.subject}','${data.message}','${data.priority}',${data.authorId},${data.statusId})
  `);

  return await getTicketById(result.lastID);
}

export async function updateTicket(id: number, data: any) {
  await run(`
    UPDATE tickets
    SET subject='${data.subject}', message='${data.message}'
    WHERE id=${id}
  `);

  return await getTicketById(id);
}

export async function deleteTicket(id: number) {
  const result = await run(`DELETE FROM tickets WHERE id=${id}`);
  return result;
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

  for (const ticket of top3Tickets) {
    const topUser = await get(`
      SELECT u.name, COUNT(tm.id) AS userMessagesCount
      FROM ticket_messages tm
      JOIN users u ON u.id = tm.userId
      WHERE tm.ticketId = ${ticket.ticketId}
      GROUP BY tm.userId, u.name
      ORDER BY userMessagesCount DESC
      LIMIT 1
    `);

    result.push({
      ticketId: ticket.ticketId,
      subject: ticket.subject,
      messagesCount: ticket.messagesCount,
      topUser: topUser ? topUser.name : null,
    });
  }

  return result;
}
