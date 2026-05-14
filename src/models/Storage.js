class Storage {
  constructor(vehicle) {
    this.orders = [];
    this.vehicle = vehicle;
    this.orderStates = new Map(); // Map of order index to { enabled: boolean }
  }

  addOrder(order) {
    this.orders.push(order);
    this.orderStates.set(this.orders.length - 1, { enabled: true });
    return true;
  }

  removeOrderAt(index) {
    if (index < 0 || index >= this.orders.length) {
      return false;
    }

    this.orders.splice(index, 1);
    this.orderStates.delete(index);
    // Rebuild order state map indices
    const newOrderStates = new Map();
    this.orders.forEach((order, i) => {
      newOrderStates.set(i, this.orderStates.get(i) || { enabled: true });
    });
    this.orderStates = newOrderStates;
    return true;
  }

  toggleOrderAt(index) {
    if (index < 0 || index >= this.orders.length) {
      return false;
    }

    const state = this.orderStates.get(index);
    if (state) {
      state.enabled = !state.enabled;
    }
    return true;
  }

  isOrderEnabled(index) {
    const state = this.orderStates.get(index);
    return state ? state.enabled : true;
  }

  removeCargoFromOrderAt(orderIndex, cargoIndex) {
    if (orderIndex < 0 || orderIndex >= this.orders.length) {
      return false;
    }

    const order = this.orders[orderIndex];
    return order.removeCargoAt(cargoIndex);
  }

  getOrders() {
    return this.orders;
  }

  getVehicleCapacity() {
    return this.vehicle[1];
  }

  getUsedStorage() {
    let used = 0;
    this.orders.forEach((order, index) => {
      if (this.isOrderEnabled(index)) {
        used += order.getTotalSCU();
      }
    });
    return used;
  }

  getCurrentAvailableStorage() {
    const used = this.getUsedStorage();
    return this.getVehicleCapacity() - used;
  }

  getOverweight() {
    const available = this.getCurrentAvailableStorage();
    return available < 0 ? Math.abs(available) : 0;
  }

  isOverweight() {
    return this.getOverweight() > 0;
  }
}

export default Storage;
