class Storage {
  constructor(Vehicle) {
    this.cargo = [];
    this.vehicle = Vehicle;
    this.currentAvailableStorage = this.vehicle.getCapacity();
  }

  addCargo(cargo) {
    if (cargo.getSize() <= this.currentAvailableStorage) {
      this.cargo.push(cargo);
      this.currentAvailableStorage -= cargo.getSize();
    } else {
      console.log("Not enough storage available for this cargo.");
    }
  }

  getCargo() {
    return this.cargo;
  }

  getCurrentAvailableStorage() {
    return this.currentAvailableStorage;
  }
}

export default Storage;