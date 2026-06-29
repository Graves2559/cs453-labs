import express from "express";

export function createApp() {
  const app = express();

  app.use(express.json());

  // Starter data. This data is stored in memory and will reset when the
  // server restarts.
  let nextId = 3;
  const items = [
    { id: 1, name: "keyboard", quantity: 10 },
    { id: 2, name: "mouse", quantity: 5 }
  ];

  app.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // TODO: Return all items.
  app.get("/items", (req, res) => {
    res.json(items);
  });

  // TODO: Return one item by ID.
  app.get("/items/:id", (req, res) => {
    const item = items.find(i => i.id === parseInt(req.params.id));
    if (!item) {
      res.status(404).json({ error: "Item not found" });
      return;
    }
    res.json(item);
  });

  // TODO: Create a new item.
  app.post("/items", (req, res) => {
    const { name, quantity } = req.body;
    if (typeof name !== "string" || typeof quantity !== "number") {
      res.status(400).json({ error: "Invalid item data" });
      return;
    }

    const item = { id: nextId++, name, quantity };
    items.push(item);
    res.status(201).json(item);
  });

  // TODO: Update an existing item.
  app.put("/items/:id", (req, res) => {
    //verify the item exists
    const item = items.find(i => i.id === parseInt(req.params.id));
    if (!item) {
      res.status(404).json({ error: "Item not found" });
      return;
    }

    const { name, quantity } = req.body;
    if (typeof name !== "string" || typeof quantity !== "number") {
      res.status(400).json({ error: "Invalid item data" });
      return;
    }

    item.name = name;
    item.quantity = quantity;
    res.json(item);
  });

  // TODO: Delete an existing item.
  app.delete("/items/:id", (req, res) => {
    const itemIndex = items.findIndex(i => i.id === parseInt(req.params.id));
    if (itemIndex === -1) {
      res.status(404).json({ error: "Item not found" });
      return;
    }
    items.splice(itemIndex, 1);
    res.status(204).send();
  });

  app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  return app;
}

const isMainModule = process.argv[1] === new URL(import.meta.url).pathname;

if (isMainModule) {
  const PORT = process.env.PORT || 3000;
  const app = createApp();

  app.listen(PORT, () => {
    console.log(`Lab 3 REST API listening on port ${PORT}`);
  });
}
