class Storage {
  constructor(vehicle) {
    this.orders = [];
    this.vehicle = vehicle; // [name, capacity]
    this.currentAvailableStorage = this.vehicle[1];
  }

  addOrder(order) {
    const orderSize = order.getSize();
    this.orders.push(order);
    this.currentAvailableStorage -= orderSize;

    if (this.currentAvailableStorage < 0) {
      return true; // Storage is full
    }
  }

  getOrders() {
    return this.orders;
  }

  getCurrentAvailableStorage() {
    return this.currentAvailableStorage;
  }
}

export default Storage;