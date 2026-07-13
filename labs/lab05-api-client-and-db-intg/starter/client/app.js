const API_BASE_URL = "http://localhost:3000";

const loadButton = document.querySelector("#load-items");
const itemList = document.querySelector("#items");
const form = document.querySelector("#add-item-form");
const itemNameInput = document.querySelector("#item-name");
const itemQuantityInput = document.querySelector("#item-quantity");
const editForm = document.querySelector("#edit-item-form");
const editItemStatus = document.querySelector("#edit-item-status");
const editItemNameInput = document.querySelector("#edit-item-name");
const editItemQuantityInput = document.querySelector("#edit-item-quantity");
const editItemClearButton = document.querySelector("#edit-item-clear");
const statusBox = document.querySelector("#status");

let editingItemId = null;

function setStatus(message) {
  statusBox.textContent = message;
}

function setEditState(message) {
  editItemStatus.textContent = message;
}

function clearEditForm() {
  editingItemId = null;
  editForm.reset();
  setEditState("Select an item to edit.");
}

function beginEdit(item) {
  editingItemId = item.id;
  editItemNameInput.value = item.name;
  editItemQuantityInput.value = String(item.quantity);
  setEditState(`Editing item ${item.id}. Change name and/or quantity, then submit.`);
}

function renderItems(items) {
  itemList.replaceChildren();

  for (const item of items) {
    const li = document.createElement("li");

    const label = document.createElement("span");
    label.textContent = `${item.id}: ${item.name} (${item.quantity})`;

    const actions = document.createElement("span");
    actions.className = "item-actions";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => {
      beginEdit(item);
    });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", async () => {
      await deleteItem(item.id);
    });

    actions.append(editButton, deleteButton);
    li.append(label, actions);
    itemList.appendChild(li);
  }
}

async function loadItems() {
  setStatus("Loading items...");

  try {
    const response = await fetch(`${API_BASE_URL}/api/items`);

    if (!response.ok) {
      throw new Error(`GET /api/items failed with status ${response.status}`);
    }

    const data = await response.json();
    renderItems(data.items);
    setStatus("Items loaded.");
  } catch (error) {
    setStatus(error.message);
  }
}

async function addItem(name, quantity) {
  setStatus("Adding item...");

  try {
    const response = await fetch(`${API_BASE_URL}/api/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, quantity })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message ?? `POST /api/items failed with status ${response.status}`);
    }

    setStatus(`Added item: ${data.item.name}`);
    await loadItems();
  } catch (error) {
    setStatus(error.message);
  }
}

async function replaceItem(id, name, quantity) {
  setStatus(`Updating item ${id}...`);

  try { 
    const response = await fetch(`${API_BASE_URL}/api/items/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, quantity })
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message ?? `PATCH /api/items/${id} failed with status ${response.status}`);
    }
    setStatus(`Updated item ${id}: ${data.item.name}`);
    await loadItems();
  } catch (error) {
    setStatus(error.message);
  }
}

async function deleteItem(id) {
  setStatus(`Deleting item ${id}...`);
  try {
    const response = await fetch(`${API_BASE_URL}/api/items/${id}`, {
      method: "DELETE"
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message ?? `DELETE /api/items/${id} failed with status ${response.status}`);
    }
    setStatus(`Deleted item ${id}: ${data.item.name}`);
    await loadItems();
  } catch (error) {
    setStatus(error.message);
  }
}

loadButton.addEventListener("click", loadItems);

editItemClearButton.addEventListener("click", clearEditForm);

editForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (editingItemId === null) {
    setStatus("Select an item to edit first.");
    return;
  }

  const name = editItemNameInput.value.trim();
  const quantity = Number(editItemQuantityInput.value);

  if (!name || !Number.isInteger(quantity) || quantity < 0) {
    setStatus("Enter a name and a non-negative integer quantity.");
    return;
  }

  await replaceItem(editingItemId, name, quantity);
  clearEditForm();
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = itemNameInput.value.trim();
  const quantity = Number(itemQuantityInput.value);

  if (!name || !Number.isInteger(quantity) || quantity < 0) {
    setStatus("Enter a name and a non-negative integer quantity.");
    return;
  }

  itemNameInput.value = "";
  itemQuantityInput.value = "0";
  await addItem(name, quantity);
});
