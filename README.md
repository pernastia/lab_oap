# Lab

## Run backend

npm run dev

Backend URL:
http://localhost:3000

## Run frontend

npx http-server -p 5500

Frontend URL:
http://localhost:5500

## API

GET /api/v1/tickets
GET /api/v1/tickets/1
POST /api/v1/tickets
DELETE /api/v1/tickets/1

## Validation example

POST /api/v1/tickets

Wrong body:
{
  "subject": "a"
}

Response:
{
  "code": "VALIDATION_ERROR",
  "message": "Subject must contain at least 3 characters"
}

## CORS

Frontend origin:
http://localhost:5500

Backend origin:
http://localhost:3000

## Endpoints

### Users

GET all:
curl http://localhost:3000/api/users

GET by id:
curl http://localhost:3000/api/users/1

POST:
curl -X POST http://localhost:3000/api/users \
-H "Content-Type: application/json" \
-d '{"name":"Ivan"}'

PUT:
curl -X PUT http://localhost:3000/api/users/1 \
-H "Content-Type: application/json" \
-d '{"name":"Oleg"}'

DELETE:
curl -X DELETE http://localhost:3000/api/users/1

### Tickets

GET all:
curl http://localhost:3000/api/tickets

GET by id:
curl http://localhost:3000/api/tickets/1

POST:
curl -X POST http://localhost:3000/api/tickets \
-H "Content-Type: application/json" \
-d '{"subject":"Test","author":"Ivan","priority":"High"}'

PUT:
curl -X PUT http://localhost:3000/api/tickets/1 \
-H "Content-Type: application/json" \
-d '{"subject":"Updated","author":"Oleg","priority":"Low"}'

DELETE:
curl -X DELETE http://localhost:3000/api/tickets/1

## Filtering / Pagination / Sorting

Filter:
curl "http://localhost:3000/api/tickets?author=ivan"

Pagination:
curl "http://localhost:3000/api/tickets?page=1&pageSize=2"

Sorting:
curl "http://localhost:3000/api/tickets?sortDir=desc"

Combined:
curl "http://localhost:3000/api/tickets?author=ivan&page=1&pageSize=2&sortDir=desc"

## SQL Injection demo
./data/app.db

POST http://localhost:3000/api/users
{ "name": "Artem" }

GET http://localhost:3000/api/users/1

PUT http://localhost:3000/api/users/1
{ "name": "Ivan " }

DELETE http://localhost:3000/api/users/1

WHERE+ORDER+LIMIT: GET http://localhost:3000/api/tickets?userId=1&limit=5

Users (1) → Tickets (N)
Tickets (1) → Messages (N)

Endpoint:
GET /tickets
POST /tickets
GET /tickets/full
GET /tickets/count

Example bad input:
?q=' OR 1=1 --