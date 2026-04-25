import Cargo from "../models/Cargo.js";
import Storage from "../models/Storage.js";
import { vehicles } from "../models/Vehicle.js";
import { cargoTypes, typesDimensions } from "../constants/cargoTypes.js";

export function createStorageForVehicle(vehicleKey) {
  const vehicle = vehicles[vehicleKey];
  if (!vehicle) {
    throw new Error("Invalid vehicle type");
  }

  return new Storage(vehicle);
}

export function getVehicleName(vehicleKey) {
  const vehicle = vehicles[vehicleKey];
  return vehicle ? vehicle.getName() : vehicleKey;
}

export function tryAddCargo(storage, input) {
  const amount = Number(input.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    return { ok: false, message: "Material quantity must be greater than 0." };
  }

  const materialKey = input.material;
  const cargoList = [0, 0, 0, 0, 0, 0, 0]; // S, M, L, XL, XL1, XL2, XL3
  let remainingAmount = amount;
  let pkgs;

  for (
    let i = cargoTypes[materialKey].length - 1, j = cargoList.length - 1;
    i >= 0;
    i--, j--
  ) {
    pkgs = Math.trunc(remainingAmount / cargoTypes[materialKey][i]);
    cargoList[j] = pkgs;
    remainingAmount -= pkgs * cargoTypes[materialKey][i];
  }

  try {
    for (let i = 0; i < cargoList.length; i++) {
      if (cargoList[i] > 0) {
        for (let j = 0; j < cargoList[i]; j++) {
          const pkgAmount = cargoTypes[materialKey][i];
          const cargo = new Cargo(input.material, pkgAmount);
          storage.addCargo(cargo);
        }
      }
    }
  } catch (error) {
    return { ok: false, message: error.message };
  }

  const previousCargoCount = storage.getCargo().length;
  const availableBeforeAdd = storage.getCurrentAvailableStorage();
  storage.addCargo(cargo);

  if (storage.getCargo().length === previousCargoCount) {
    return {
      ok: false,
      message: `Not enough storage. Available: ${availableBeforeAdd} SCU.`,
    };
  }

  return { ok: true, cargo };
}

export function formatMaterialLabel(material) {
  return material
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase());
}

export function buildCargoTableRows(cargoList) {
  if (!cargoList.length) {
    return '<tr><td colspan="5">No cargo added yet.</td></tr>';
  }

  return cargoList
    .map((cargo, index) => {
      const material = formatMaterialLabel(cargo.getMaterial());
      const amount = cargo.getAmount();
      const dimension = cargo.displayedDimension || "-";
      const scu = cargo.getSize();

      return `
        <tr>
          <td>${index + 1}</td>
          <td>${material}</td>
          <td>${amount}</td>
          <td>${dimension}</td>
          <td>${scu}</td>
        </tr>
      `;
    })
    .join("");
}
