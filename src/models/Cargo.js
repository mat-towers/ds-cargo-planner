import { cargoTypes, typesDimensions } from "../constants/cargoTypes.js";

class Cargo {
  constructor(material, amount) {
    this.material = material;
    this.amount = amount;
    this.displayedDimension = this.#calculateDimension();
    this.convertedDimension = this.#convertDimension();
  }

  #calculateDimension() {
    const type = cargoTypes[this.material];
    if (!type) {
      throw new Error("Invalid material type");
    }
    for (let i = 0; i < 7; i++) {
      if (this.amount === type[i]) {
        return typesDimensions[i];
        break;
      }
    }
  }

  #convertDimension() {
    // -- Scu conversion --
    //    Small (S), 1 S
    //    Medium (M), 2 S
    //    Large (L), 4 S
    //    Extra Large (XL to XL3), 6 S

    switch (this.displayedDimension) {
      case "S":
        return 1;
      case "M":
        return 2;
      case "L":
        return 4;
      case "XL":
        return 6;
      case "XL1":
        return 6;
      case "XL2":
        return 6;
      case "XL3":
        return 6;
      default:
        throw new Error("Invalid displayed dimension");
    }
  }

  getSize() {
    return this.convertedDimension;
  }

  getMaterial() {
    return this.material;
  }

  getAmount() {
    return this.amount;
  }
}

export default Cargo;