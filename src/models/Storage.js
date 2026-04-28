class Storage {
  constructor(vehicle) {
    this.orders = [];
    this.vehicle = vehicle;
    this.currentAvailableStorage = this.vehicle[1];
  }

  addOrder(order) {
    const orderSize = order.getTotalSCU();
    if (orderSize > this.currentAvailableStorage) {
      return false;
    }

    this.orders.push(order);
    this.currentAvailableStorage -= orderSize;
    return true;
  }

  removeOrderAt(index) {
    if (index < 0 || index >= this.orders.length) {
      return false;
    }

    const [removedOrder] = this.orders.splice(index, 1);
    this.currentAvailableStorage += removedOrder.getTotalSCU();
    return true;
  }

  getOrders() {
    return this.orders;
  }

  getVehicleCapacity() {
    return this.vehicle[1];
  }

  getUsedStorage() {
    return this.getVehicleCapacity() - this.currentAvailableStorage;
  }

  getCurrentAvailableStorage() {
    return this.currentAvailableStorage;
  }
}

export default Storage;
