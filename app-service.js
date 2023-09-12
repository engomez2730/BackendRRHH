const Service = require("node-windows").Service;

// Replace this with the actual path to your Node.js server script
const serverScriptPath = "C:\\Users\\CLON\\Desktop\\BackendRRHH\\server.js";

const svc = new Service({
  name: "MyNodeApp",
  description: "My Node.js Server",
  script: serverScriptPath,
});

svc.on("install", () => {
  svc.start();
});

svc.install();
