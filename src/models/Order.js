class Order {
  static nextOrderId = 1;

  constructor(orderName, cargoList) {
    this.orderId = Order.nextOrderId++;
    this.orderName = orderName;
    this.cargoList = cargoList;
    this.totalSCU = 0;
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

    console.log(`Cargo added to order ${this.orderId}. Total SCU: ${this.totalSCU}`); // NOTE: for debugging
  }
  
  getTotalSCU() {
    this.#calculateTotalSCU();
    return this.totalSCU;
  }

  getCargoList() {
    return this.cargoList;
  }
}

export default Order;
