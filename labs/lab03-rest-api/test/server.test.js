import { describe, expect, test } from "vitest";
import request from "supertest";
import { createApp } from "../src/server.js";

describe("Lab 3 REST API", () => {
  test("GET /health returns status ok", async () => {
    const app = createApp();

    const response = await request(app)
        .get("/health")
        .expect(200);

    expect(response.body).toEqual({ status: "ok" });
  });

  test("GET /items returns initial list", async () => {
    const app = createApp();

    const response = await request(app)
        .get("/items")
        .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(2);
  });

  test("POST /items creates a new item", async () => {
    const app = createApp();

    const createResponse = await request(app)
        .post("/items")
        .send({ name: "monitor", quantity: 4 })
        .expect(201);

    expect(createResponse.body).toEqual({ id: 3, name: "monitor", quantity: 4 });

    const getResponse = await request(app)
        .get("/items/3")
        .expect(200);

    expect(getResponse.body).toEqual({ id: 3, name: "monitor", quantity: 4 });
  });

  test("GET /items/:id returns 404 for missing item", async () => {
    const app = createApp();

    const response = await request(app)
        .get("/items/999")
        .expect(404);

    expect(response.body).toEqual({ error: "Item not found" });
  });

  test("PUT /items/:id updates existing item", async () => {
    const app = createApp();

    const response = await request(app)
        .put("/items/1")
        .send({ name: "mechanical keyboard", quantity: 12 })
        .expect(200);

    expect(response.body).toEqual({ id: 1, name: "mechanical keyboard", quantity: 12 });
  });

  test("DELETE /items/:id removes item", async () => {
    const app = createApp();

    await request(app)
        .delete("/items/2")
        .expect(204);

    await request(app)
        .get("/items/2")
        .expect(404);
  });

  test("POST /items returns 400 for invalid data", async () => {
    const app = createApp();

    const response = await request(app)
        .post("/items")
        .send({ name: 123, quantity: "bad" })
        .expect(400);

    expect(response.body).toEqual({ error: "Invalid item data" });
  });

  test("PUT /items/:id returns 400 for invalid data", async () => {
    const app = createApp();

    const response = await request(app)
        .put("/items/1")
        .send({ name: 123, quantity: "bad" })
        .expect(400);

    expect(response.body).toEqual({ error: "Invalid item data" });
  });
});