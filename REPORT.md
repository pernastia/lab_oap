Сценарій А — SQL Injection
  Де проблема:
src/repositories/tickets.repository.ts — функції getAllTickets, getTicketById, createTicket, updateTicket, deleteTicket, getTop3TicketsWithTopUser.
src/repositories/users.repository.ts — функції getUserById, createUser, updateUser, deleteUser.
  
  Як проявляється (було):
typescript// Уразливий код — конкатенація рядка:
sql += ` AND t.statusId = ${query.statusId}`;  // statusId може бути "1 OR 1=1"
WHERE t.id = ${id}                              // id може бути "1 OR 1=1"
VALUES('${data.subject}', ...)                  // subject може містити SQL
  
  Відтворення:
http GET /api/v1/tickets?sort=id%3B%20DROP%20TABLE%20tickets%3B--
До виправлення: ORDER BY id; DROP TABLE tickets;-- виконується як SQL.
http GET /api/v1/tickets?statusId=1%20OR%201%3D1
До виправлення: повертає всі тікети незалежно від statusId.
  
  Виправлення:
Замінено конкатенацію на параметризовані запити (?).
Для ORDER BY — allowlist допустимих полів, бо параметри не працюють для ідентифікаторів:
  Було (уразливо):
sql += ` AND t.statusId = ${query.statusId}`;
sql += ` ORDER BY ${query.sort} ${query.order}`;

  Стало (безпечно):
sql += ` AND t.statusId = ?`;
params.push(query.statusId);

const ALLOWED_SORT_FIELDS = new Set(["id", "subject", "priority", "statusId"]);
const sortField = ALLOWED_SORT_FIELDS.has(query.sort ?? "") ? query.sort : "id";
sql += ` ORDER BY ${sortField} ${sortOrder}`;
  
  Перевірка:
httpGET /api/v1/tickets?statusId=1%20OR%201%3D1
Після виправлення: statusId передається як значення параметра, не як SQL-код.
Результат: повертає тільки тікети зі statusId = "1 OR 1=1" (жодних), а не всі тікети.
Нормальний запит GET /api/v1/tickets?statusId=1 працює як і раніше.

Сценарій Б — XSS (Stored)
  Де проблема:
frontend/app.js — функція renderTickets використовує row.innerHTML з даними користувача.
Як проявляється (було)
  
  Уразливий код:
row.innerHTML = `
  <td>${ticket.subject}</td>   // subject — дані від користувача
  <td>${ticket.message}</td>   // message — дані від користувача
  <td>${ticket.authorName}</td>
`;
  
  Відтворення:
Створити тікет з subject:
<img src=x onerror="alert('XSS')">
До виправлення: браузер виконає alert('XSS') при відображенні списку.
  
  Виправлення:
Замінено innerHTML з даними користувача на createElement + textContent:
  
  Було (уразливо):
row.innerHTML = `<td>${ticket.subject}</td>`;
  
  Стало (безпечно):
const tdSubject = document.createElement("td");
tdSubject.textContent = ticket.subject; // екранується автоматично
tr.appendChild(tdSubject);
textContent не парсить HTML — рядок <img onerror=...> відображається буквально як текст.
  
  Перевірка:
Після виправлення тікет з subject <img src=x onerror="alert(1)">:

відображається як текст <img src=x onerror="alert(1)">
alert не виконується
DOM не змінюється


Сценарій В — Broken Access Control / IDOR
  Де проблема:
src/repositories/tickets.repository.ts — updateTicket, deleteTicket не перевіряли власника.
src/index.ts — відсутній механізм визначення поточного користувача.
  
  Як проявляється (було):
httpDELETE /api/v1/tickets/3
До виправлення: будь-хто міг видалити будь-який тікет, підставивши чужий id.
  
  Відтворення:
httpPUT /api/v1/tickets/1
Content-Type: application/json

{ "subject": "HACKED", "message": "hacked", "priority": "High", "statusId": 1, "authorId": 2 }
До виправлення: тікет id=1 (власник userId=1) змінено від імені userId=2.
Виправлення

Додано demoAuth middleware — читає X-Demo-UserId з заголовка:

typescriptexport async function demoAuth(req, res, next) {
  const rawId = req.headers["x-demo-userid"];
  if (!rawId) return res.status(401).json({ error: { code: "UNAUTHORIZED", ... }});
  const user = await getUserById(Number(rawId));
  if (!user) return res.status(401).json({ error: { code: "UNAUTHORIZED", ... }});
  (req as any).currentUserId = Number(rawId);
  next();
}

В контролері перевірка власника перед update/delete:

typescriptconst owned = await getTicketByIdAndOwner(id, currentUserId);
if (!owned) return res.status(404).json({ error: "Not found or access denied" });

В репозиторії — запит з перевіркою обох умов:

typescriptWHERE t.id = ? AND t.authorId = ?
Перевірка
httpDELETE /api/v1/tickets/1
X-Demo-UserId: 2

Після виправлення: 404 (тікет id=1 належить userId=1, не userId=2).
httpDELETE /api/v1/tickets/1
X-Demo-UserId: 1

Після виправлення: 204 — власник може видалити свій тікет.
httpDELETE /api/v1/tickets/1
(без заголовка)

Після виправлення: 401 Unauthorized.

Сценарій Г — Security Misconfiguration
  Де проблема:
src/index.ts — Access-Control-Allow-Origin: * (дозволяє всі origins).
src/middleware/error-handler.middleware.ts — stack traces могли потрапити у відповідь.
Відсутні security headers.

  Виправлення:
1. CORS — обмежений конкретними origins:
typescript// Було:
res.setHeader("Access-Control-Allow-Origin", "*");

  Стало:
const allowedOrigins = ["http://localhost:5500", "http://127.0.0.1:5501", ...];
const origin = req.headers.origin;
if (origin && allowedOrigins.includes(origin)) {
  res.setHeader("Access-Control-Allow-Origin", origin);
}
2. Security headers:
typescriptres.setHeader("X-Content-Type-Options", "nosniff");  // захист від MIME sniffing
res.setHeader("X-Frame-Options", "DENY");             // захист від clickjacking
res.setHeader("Referrer-Policy", "no-referrer");      // контроль Referer
3. Помилки без dev-деталей у production:
typescriptconst isDev = process.env.NODE_ENV !== "production";
// details повертаються тільки в dev
  
  Перевірка:
bashcurl -I http://localhost:3000/health
Відповідь містить:
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: no-referrer
Запит з чужого origin не отримує Access-Control-Allow-Origin.