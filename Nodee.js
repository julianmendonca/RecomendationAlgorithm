module.exports = class Node {
  constructor(val) {
    this.value = val;
    this.edges = [];
  }

  addEdge(n) {
    this.edges.push(n);
    n.edges.push(this);
  }
};
