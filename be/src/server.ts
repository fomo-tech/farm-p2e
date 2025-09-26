import app from "./app";
import { port } from "./config";
// import { registerMessageHandler } from "./helpers/telegramBot";

app
  .listen(port, () => {
    console.log(`Server running on port: ${port}`);
    // registerMessageHandler();
  })
  .on("error", (e) => console.log(e));
