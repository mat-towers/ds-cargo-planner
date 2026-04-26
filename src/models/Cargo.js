import {
  cargoTypes,
  typesDimensions,
  scu_conversion,
} from "../constants/cargoTypes.js";

class Cargo {
  constructor(cargoContent, isMaterial, boxes) {
    this.cargoContent = cargoContent; // TODO: handle not given name
    this.isMaterial = isMaterial; // True || False
    this.boxes = boxes || [0, 0, 0, 0, 0, 0, 0]; // [0, 0, 0, 0, 0, 0, 0]
    this.occupiedSpace = this.#occupiedSpace(boxes);
  }

  #occupiedSpace(boxes) {
    let total = 0;
    for (let i = 0; i < boxes.length; i++) {
      total += boxes[i] * scu_conversion[i];
    }
    return total;
  }

  materialDistribution(amount) {
    let distribution = [0, 0, 0, 0, 0, 0, 0];

    for (let i = distribution.length - 1; i >= 0; i--) {
      let calc = Math.trunc(amount / cargoTypes[this.cargoContent][i]);
      if (calc > 0) {
        distribution[i] = calc;
        amount -= calc * cargoTypes[this.cargoContent][i];
      }
    }
    if (amount > 0) {
      distribution[0] += 1; // TODO: Ensure this works. If there is remaining amount, add one of the smallest boxes
    }
    return distribution;
  }

  getOccupiedSpace() {
    return this.occupiedSpace;
  }
}

export default Cargo;
