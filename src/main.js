import "./style.css";
import {
  buildCargoTableRows,
  createStorageForVehicle,
  formatMaterialLabel,
  tryAddCargo,
  getVehicleName,
} from "./utils/cargoFormOps.js";

document.querySelector("#app").innerHTML = `
    <div class="planner-layout">
        <h1>Cargo Planner</h1>

        <div class="summary" id="summary"></div>

        <table class="cargo-table" aria-live="polite">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Material</th>
                    <th>Amount</th>
                    <th>Size</th>
                    <th>SCU</th>
                </tr>
            </thead>
            <tbody id="cargo-table-body"></tbody>
        </table>

        <form id="cargo-form" class="rendered-form">
            <div class="formbuilder-select form-group field-material-select">
                <label for="material-select" class="formbuilder-select-label">Material Type<span class="formbuilder-required">*</span></label>
                <select class="form-control" name="material-select" id="material-select" required aria-required="true">
                    <option value="ceramics" selected id="material-select-0">ceramics</option>
                    <option value="chemicals" id="material-select-1">chemicals</option>
                    <option value="metals" id="material-select-2">metals</option>
                    <option value="resins" id="material-select-3">resins</option>
                    <option value="specialAlloys" id="material-select-4">specialAlloys</option>
                </select>
            </div>

            <div class="formbuilder-select form-group field-vehicle-select">
                <label for="vehicle-select" class="formbuilder-select-label">Vehicle<span class="formbuilder-required">*</span></label>
                <select class="form-control" name="vehicle-select" id="vehicle-select" required aria-required="true">
                    <option value="bridgesTruck" selected id="vehicle-select-0">bridgesTruck</option>
                    <option value="muleTruck" id="vehicle-select-1">muleTruck</option>
                    <option value="floatingCarrier" id="vehicle-select-2">floatingCarrier</option>
                    <option value="reverseTrike" id="vehicle-select-3">reverseTrike</option>
                    <option value="reverseTrikeCargo" id="vehicle-select-4">reverseTrikeCargo</option>
                </select>
    </div>

            <div class="formbuilder-number form-group field-material-quantity">
                <label for="material-quantity" class="formbuilder-number-label">Material Quantity<span class="formbuilder-required">*</span></label>
                <input type="number" class="form-control" name="material-quantity" min="0" step="10" id="material-quantity" required aria-required="true">
            </div>

            <button type="submit" class="btn-add">Add</button>
            <p id="form-message" class="form-message" aria-live="polite"></p>
        </form>
    </div>
`;

const form = document.querySelector("#cargo-form");
const vehicleSelect = document.querySelector("#vehicle-select");
const materialSelect = document.querySelector("#material-select");
const quantityInput = document.querySelector("#material-quantity");
const tableBody = document.querySelector("#cargo-table-body");
const summary = document.querySelector("#summary");
const message = document.querySelector("#form-message");

let currentVehicleKey = vehicleSelect.value;
let storage = createStorageForVehicle(currentVehicleKey);

function renderSummary() {
  const vehicleName = getVehicleName(currentVehicleKey);
  summary.textContent = `Vehicle: ${vehicleName} | Available storage: ${storage.getCurrentAvailableStorage()} SCU`;
}

function renderTable() {
  tableBody.innerHTML = buildCargoTableRows(storage.getCargo());
}

function setMessage(text, isError = false) {
  message.textContent = text;
  message.classList.toggle("error", isError);
}

vehicleSelect.addEventListener("change", () => {
  currentVehicleKey = vehicleSelect.value;
  storage = createStorageForVehicle(currentVehicleKey);
  renderSummary();
  renderTable();
  setMessage("Switched vehicle. Cargo list has been reset.");
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const result = tryAddCargo(storage, {
    material: materialSelect.value,
    amount: Number(quantityInput.value),
  });

  if (!result.ok) {
    setMessage(result.message, true);
    return;
  }

  const addedMaterial = formatMaterialLabel(result.cargo.getMaterial());
  setMessage(`Added ${result.cargo.getAmount()} ${addedMaterial}.`);
  renderSummary();
  renderTable();
  quantityInput.value = "";
  quantityInput.focus();
});

renderSummary();
renderTable();
