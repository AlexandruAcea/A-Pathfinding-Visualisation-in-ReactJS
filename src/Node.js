export default class Node {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.g = 0;
    this.h = 0;
    this.f = 0;
    let locationParent;
  }

  // Getter
  get area() {
    return this.calcArea();
  }
  //   // Method
  //   calcArea() {
  //     return this.height * this.width;
  //   }
}
