module.exports = class Graph {
    constructor() {
      this.nodes = [];
      this.graph = {};
    }
    getNode(user) {
      var n = this.graph[user];
      return n;
    }
    addNode(n) {
      this.nodes.push(n);
      var title = n.value;
      this.graph[title] = n;
    }
  };
  