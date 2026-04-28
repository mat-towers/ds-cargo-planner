import { cargoTypes, scu_conversion } from "../constants/cargoTypes.js";

class Cargo {
  constructor({ cargoContent, isMaterial, boxes, amount }) {
    this.cargoContent = cargoContent;
    this.isMaterial = Boolean(isMaterial);
    this.materialAmount = null;

    if (this.isMaterial) {
      const parsedAmount = Number(amount);
      this.materialAmount = parsedAmount;
      this.boxes = this.materialDistribution(parsedAmount);
    } else {
      this.boxes = this.#normalizeBoxes(boxes);
    }

    this.occupiedSpace = this.#occupiedSpace(this.boxes);
  }

  #occupiedSpace(boxes) {
    let total = 0;
    for (let i = 0; i < boxes.length; i++) {
      total += boxes[i] * scu_conversion[i];
    }
    return total;
  }

  #normalizeBoxes(boxes) {
    const normalized = [0, 0, 0, 0, 0, 0, 0];
    if (!Array.isArray(boxes)) {
      return normalized;
    }

    for (let i = 0; i < 4; i++) {
      const value = Number(boxes[i]);
      normalized[i] =
        Number.isFinite(value) && value > 0 ? Math.trunc(value) : 0;
    }

    return normalized;
  }

  materialDistribution(amount) {
    const values = cargoTypes[this.cargoContent];
    if (!values) {
      throw new Error("Invalid material type selected.");
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error("Material amount must be greater than 0.");
    }

    let distribution = [0, 0, 0, 0, 0, 0, 0];
    let remainingAmount = amount;

    for (let i = distribution.length - 1; i >= 0; i--) {
      let calc = Math.trunc(remainingAmount / values[i]);
      if (calc > 0) {
        distribution[i] = calc;
        remainingAmount -= calc * values[i];
      }
    }

    if (remainingAmount > 0) {
      distribution[0] += 1;
    }

    return distribution;
  }

  getCargoContent() {
    return this.cargoContent;
  }

  getBoxes() {
    return [...this.boxes];
  }

  getIsMaterial() {
    return this.isMaterial;
  }

  getMaterialAmount() {
    return this.materialAmount;
  }

  getOccupiedSpace() {
    return this.occupiedSpace;
  }
}

export default Cargo;
