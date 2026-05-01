class Order {
  static nextOrderId = 1;

  static resetOrderIds() {
    Order.nextOrderId = 1;
  }

  constructor(orderName, cargoList) {
    this.orderId = Order.nextOrderId++;
    this.orderName = orderName || `Order ${this.orderId}`;
    this.cargoList = Array.isArray(cargoList) ? cargoList : [];
    this.totalSCU = 0;
    this.#calculateTotalSCU();
  }

  #calculateTotalSCU() {
    let total = 0;
    for (const cargo of this.cargoList) {
      total += cargo.getOccupiedSpace();
    }
    this.totalSCU = total;
  }

  addCargo(cargo) {
    this.cargoList.push(cargo);
    this.#calculateTotalSCU();
  }

  removeCargoAt(index) {
    if (index < 0 || index >= this.cargoList.length) {
      return false;
    }

    this.cargoList.splice(index, 1);
    this.#calculateTotalSCU();
    return true;
  }

  isEmpty() {
    return this.cargoList.length === 0;
  }

  getOrderId() {
    return this.orderId;
  }

  getOrderName() {
    return this.orderName;
  }

  setOrderName(orderName) {
    this.orderName = orderName || "Current Order";
  }

  getTotalSCU() {
    return this.totalSCU;
  }

  getCargoList() {
    return this.cargoList;
  }
}

export default Order;
