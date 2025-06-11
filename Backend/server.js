const http = require("http");
const { app } = require("./index");
const { initializeSocket } = require("./socket");

const server = http.createServer(app);
initializeSocket(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () =>
  console.log(`Server is running on PORT NO : ${PORT}`)
);
