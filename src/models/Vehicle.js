class Vehicle {
  constructor(name, capacity) {
    this.name = name;
    this.capacity = capacity;
  }

  getCapacity() {
    return this.capacity;
  }
  getName() {
    return this.name;
  }
}

const bridgesTruck = new Vehicle("Bridges Truck", 168); // All versions. Add front seat bonus 1XL.
const muleTruck = new Vehicle("MULE Truck", 42); // Stolen
const floatingCarrier = new Vehicle("Floating Carrier", 32); // Lv. 1 & 2
const reverseTrike = new Vehicle("Reverse Trike", 12); // Standard
const reverseTrikeCargo = new Vehicle("Reverse Trike", 24); // Cargo

export const vehicles = {
  "bridgesTruck": bridgesTruck,
  "muleTruck": muleTruck,
  "floatingCarrier": floatingCarrier,
  "reverseTrike": reverseTrike,
  "reverseTrikeCargo": reverseTrikeCargo,
};

export default Vehicle;