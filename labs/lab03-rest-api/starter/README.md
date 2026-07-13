# Lab 3 REST API

## How to Run

```bash
npm install
npm run server
```

The server runs on:

```text
http://localhost:3000
```

## How to Test

```bash
npm test
```

## API Routes

| Method | Route | Description |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/items` | Return all items |
| GET | `/items/:id` | Return one item |
| POST | `/items` | Create one item |
| PUT | `/items/:id` | Update one item |
| DELETE | `/items/:id` | Delete one item |

## Reflection Answers

### 1. What makes this API more REST-like than the previous HTTP/JSON lab?

In lab 2 we used the http module and handled requests manually. This lab uses Express with routes like GET /items and PUT /items/:id and we use different methods for create, read, update, and delete on the same resource. We also return status codes like 201, 204, 400, and 404.

### 2. What is the purpose of a route parameter such as `/items/:id`?

The :id part lets us work with one item instead of the whole list. In the code we read it from req.params.id and use it in the GET, PUT, and DELETE routes.

### 3. Why should `POST`, `PUT`, and `DELETE` use different HTTP methods?

Each method tells the server what action to do. POST creates an item, PUT updates one, and DELETE removes one.

### 4. What is the difference between a `400` error and a `404` error?

A 400 means the request is bad like when name or quantity is the wrong type. A 404 means the item was not found. In my server I return "Invalid item data" for 400 and "Item not found" for 404.

### 5. How does the OpenAPI file relate to your Express server code?

The openapi.yaml file describes the routes and responses. The server.js file is the code that handles the requests. They should match what the API actually does.

## Graduate Extension

TODO: Graduate students should describe their extension here.
