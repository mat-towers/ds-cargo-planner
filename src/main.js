import "./style.css";
import { cargoTypes, typesDimensions } from "./constants/cargoTypes.js";
import { vehicles } from "./constants/vehicles.js";
import Cargo from "./models/Cargo.js";
import Order from "./models/Order.js";
import Storage from "./models/Storage.js";

const materialKeys = Object.keys(cargoTypes);

document.querySelector("#app").innerHTML = `
  <div class="planner-layout">
    <h1>Cargo Planner</h1>

    <form id="vehicle-form" class="panel compact-form">
      <label for="vehicle-select">Vehicle</label>
      <select id="vehicle-select" name="vehicle-select"></select>
    </form>

    <p id="status-message" class="status-message" aria-live="polite"></p>

    <div class="panel-grid">
      <section class="panel">
        <h2>Add Material Cargo</h2>
        <form id="material-form" class="form-grid">
          <label for="material-type">Material Type</label>
          <select id="material-type" name="material-type" required></select>

          <label for="material-amount">Material Amount</label>
          <input id="material-amount" name="material-amount" type="number" min="1" required />

          <button type="submit">Add Material Cargo</button>
        </form>
      </section>

      <section class="panel">
        <h2>Add Standard Cargo</h2>
        <form id="standard-form" class="form-grid">
          <label for="standard-name">Cargo Name</label>
          <input id="standard-name" name="standard-name" type="text" placeholder="Leave empty for auto-name" />

          <div class="box-grid">
            <div>
              <label for="box-s">S Boxes</label>
              <input id="box-s" name="box-s" type="number" min="0" value="0" />
            </div>
            <div>
              <label for="box-m">M Boxes</label>
              <input id="box-m" name="box-m" type="number" min="0" value="0" />
            </div>
            <div>
              <label for="box-l">L Boxes</label>
              <input id="box-l" name="box-l" type="number" min="0" value="0" />
            </div>
            <div>
              <label for="box-xl">XL Boxes</label>
              <input id="box-xl" name="box-xl" type="number" min="0" value="0" />
            </div>
          </div>

          <button type="submit">Add Standard Cargo</button>
        </form>
      </section>
    </div>

    <section class="panel">
      <div class="panel-header">
        <h2>Current Order</h2>
        <button id="commit-order-button" type="button">Add Current Order To Storage</button>
      </div>
      <p id="order-summary" class="summary"></p>
      <table class="cargo-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Type</th>
            <th>Boxes [S,M,L,XL]</th>
            <th>SCU</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="order-table-body"></tbody>
      </table>
    </section>

    <section class="panel">
      <h2>Storage</h2>
      <p id="storage-summary" class="summary"></p>
      <table class="cargo-table">
        <thead>
          <tr>
            <th>Order</th>
            <th>Cargo Count</th>
            <th>Order SCU</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="storage-table-body"></tbody>
      </table>
    </section>
  </div>
`;

const vehicleSelect = document.querySelector("#vehicle-select");
const materialForm = document.querySelector("#material-form");
const materialTypeSelect = document.querySelector("#material-type");
const materialAmountInput = document.querySelector("#material-amount");
const standardForm = document.querySelector("#standard-form");
const standardNameInput = document.querySelector("#standard-name");
const statusMessage = document.querySelector("#status-message");
const orderTableBody = document.querySelector("#order-table-body");
const storageTableBody = document.querySelector("#storage-table-body");
const orderSummary = document.querySelector("#order-summary");
const storageSummary = document.querySelector("#storage-summary");
const commitOrderButton = document.querySelector("#commit-order-button");

let standardCargoCounter = 1;
let currentVehicleKey;
let storage;
let currentOrder;

function populateVehicleOptions() {
  const entries = Object.entries(vehicles);
  vehicleSelect.innerHTML = entries
    .map(
      ([key, value]) =>
        `<option value="${key}">${value[0]} (${value[1]} SCU)</option>`,
    )
    .join("");
}

function populateMaterialOptions() {
  materialTypeSelect.innerHTML = materialKeys
    .map((key) => `<option value="${key}">${key}</option>`)
    .join("");
}

function createEmptyOrder() {
  return new Order("Current Order", []);
}

function setStatusMessage(text, isError = false) {
  statusMessage.textContent = text;
  statusMessage.classList.toggle("error", isError);
}

function getStandardBoxesFromForm() {
  const s = Number(document.querySelector("#box-s").value);
  const m = Number(document.querySelector("#box-m").value);
  const l = Number(document.querySelector("#box-l").value);
  const xl = Number(document.querySelector("#box-xl").value);

  return [s, m, l, xl, 0, 0, 0].map((value) => {
    if (!Number.isFinite(value) || value < 0) {
      return 0;
    }
    return Math.trunc(value);
  });
}

function boxesPreview(boxes) {
  return `${boxes[0]}, ${boxes[1]}, ${boxes[2]}, ${boxes[3]}`;
}

function materialBoxesPreview(cargo) {
  const boxes = cargo.getBoxes();
  const materialKey = cargo.getCargoContent();
  const materialValues = cargoTypes[materialKey] || [];

  const visibleBoxes = boxes
    .map((count, index) => {
      const dimension = typesDimensions[index];
      const amountPerBox = materialValues[index];
      return { count, dimension, amountPerBox };
    })
    .filter((box) => box.count > 0);

  if (!visibleBoxes.length) {
    return "-";
  }

  return visibleBoxes
    .map((box) => `${box.dimension}: ${box.count}x${box.amountPerBox}`)
    .join(" | ");
}

function boxesDisplayForCargo(cargo) {
  if (cargo.getIsMaterial()) {
    return materialBoxesPreview(cargo);
  }

  return boxesPreview(cargo.getBoxes());
}

function getCargoEntryName(cargo) {
  if (!cargo.getIsMaterial()) {
    return cargo.getCargoContent();
  }

  const amount = cargo.getMaterialAmount();
  return `${cargo.getCargoContent()} (${amount})`;
}

function renderOrderTable() {
  const cargoList = currentOrder.getCargoList();
  if (!cargoList.length) {
    orderTableBody.innerHTML =
      '<tr><td colspan="6">No cargo in current order.</td></tr>';
    return;
  }

  orderTableBody.innerHTML = cargoList
    .map((cargo, index) => {
      const typeLabel = cargo.getIsMaterial() ? "Material" : "Standard";
      return `
        <tr>
          <td>${index + 1}</td>
          <td>${getCargoEntryName(cargo)}</td>
          <td>${typeLabel}</td>
          <td>${boxesDisplayForCargo(cargo)}</td>
          <td>${cargo.getOccupiedSpace()}</td>
          <td><button type="button" class="row-remove-button" data-remove-order-cargo-index="${index}">Remove</button></td>
        </tr>
      `;
    })
    .join("");
}

function renderStorageTable() {
  const orders = storage.getOrders();
  if (!orders.length) {
    storageTableBody.innerHTML =
      '<tr><td colspan="4">No orders committed to storage.</td></tr>';
    return;
  }

  storageTableBody.innerHTML = orders
    .map((order, index) => {
      const cargoItems = order
        .getCargoList()
        .map(
          (cargo) =>
            `<li>${getCargoEntryName(cargo)} | ${cargo.getIsMaterial() ? "Material" : "Standard"} | Boxes: [${boxesDisplayForCargo(cargo)}] | ${cargo.getOccupiedSpace()} SCU</li>`,
        )
        .join("");

      return `
        <tr>
          <td>
            <details>
              <summary>${order.getOrderName()} #${order.getOrderId()}</summary>
              <ul class="order-details-list">${cargoItems}</ul>
            </details>
          </td>
          <td>${order.getCargoList().length}</td>
          <td>${order.getTotalSCU()}</td>
          <td><button type="button" class="row-remove-button" data-remove-storage-order-index="${index}">Remove</button></td>
        </tr>
      `;
    })
    .join("");
}

function renderSummaries() {
  const vehicleName = vehicles[currentVehicleKey][0];
  const vehicleCapacity = storage.getVehicleCapacity();
  const usedStorage = storage.getUsedStorage();
  const availableStorage = storage.getCurrentAvailableStorage();

  orderSummary.textContent = `Current order cargo: ${currentOrder.getCargoList().length} | Current order SCU: ${currentOrder.getTotalSCU()}`;
  storageSummary.textContent = `Vehicle: ${vehicleName} | Capacity: ${vehicleCapacity} SCU | Used: ${usedStorage} SCU | Available: ${availableStorage} SCU | Committed orders: ${storage.getOrders().length}`;
}

function renderAll() {
  renderOrderTable();
  renderStorageTable();
  renderSummaries();
}

function resetForVehicle(vehicleKey) {
  currentVehicleKey = vehicleKey;
  storage = new Storage(vehicles[currentVehicleKey]);
  Order.resetOrderIds();
  currentOrder = createEmptyOrder();
  standardCargoCounter = 1;
  setStatusMessage("Vehicle changed. Storage and order have been reset.");
  renderAll();
}

materialForm.addEventListener("submit", (event) => {
  event.preventDefault();

  try {
    const materialCargo = new Cargo({
      cargoContent: materialTypeSelect.value,
      isMaterial: true,
      amount: Number(materialAmountInput.value),
    });

    currentOrder.addCargo(materialCargo);
    setStatusMessage("Material cargo added to current order.");
    materialAmountInput.value = "";
    materialAmountInput.focus();
    renderAll();
  } catch (error) {
    setStatusMessage(error.message, true);
  }
});

standardForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const boxes = getStandardBoxesFromForm();
  const totalBoxes = boxes.slice(0, 4).reduce((sum, value) => sum + value, 0);
  if (totalBoxes <= 0) {
    setStatusMessage("Add at least one box for standard cargo.", true);
    return;
  }

  const customName = standardNameInput.value.trim();
  const cargoName = customName || `cargo${standardCargoCounter++}`;

  const standardCargo = new Cargo({
    cargoContent: cargoName,
    isMaterial: false,
    boxes,
  });

  currentOrder.addCargo(standardCargo);
  setStatusMessage("Standard cargo added to current order.");
  standardForm.reset();
  document.querySelector("#box-s").value = 0;
  document.querySelector("#box-m").value = 0;
  document.querySelector("#box-l").value = 0;
  document.querySelector("#box-xl").value = 0;
  renderAll();
});

orderTableBody.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const indexValue = target.getAttribute("data-remove-order-cargo-index");
  if (indexValue === null) {
    return;
  }

  const index = Number(indexValue);
  const removed = currentOrder.removeCargoAt(index);
  if (!removed) {
    setStatusMessage("Could not remove order entry.", true);
    return;
  }

  setStatusMessage("Entry removed from current order.");
  renderAll();
});

storageTableBody.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const indexValue = target.getAttribute("data-remove-storage-order-index");
  if (indexValue === null) {
    return;
  }

  const index = Number(indexValue);
  const removed = storage.removeOrderAt(index);
  if (!removed) {
    setStatusMessage("Could not remove storage entry.", true);
    return;
  }

  setStatusMessage("Entry removed from storage.");
  renderAll();
});

commitOrderButton.addEventListener("click", () => {
  if (currentOrder.isEmpty()) {
    setStatusMessage("Current order is empty. Add cargo first.", true);
    return;
  }

  const committed = storage.addOrder(currentOrder);
  if (!committed) {
    setStatusMessage("Not enough storage for this order.", true);
    return;
  }

  setStatusMessage("Order committed to storage.");
  currentOrder = createEmptyOrder();
  renderAll();
});

vehicleSelect.addEventListener("change", () => {
  resetForVehicle(vehicleSelect.value);
});

populateVehicleOptions();
populateMaterialOptions();
resetForVehicle(vehicleSelect.value);
