import ConnectDB from "./DB/connection.js";
import userController from "./modules/user/user.controller.js";
import authController from "./modules/auth/auth.controller.js";
import msgController from "./modules/message/message.controller.js";
import { globalErrorHandling } from "./utils/error/error.handling.js";
import cors from "cors";

const bootStrap = (app, express) => {
  app.use(cors());
  app.use(express.json());
  app.get("/", (req, res) => res.send("Hello World!"));

  //app routing
  app.use("/auth", authController);
  app.use("/user", userController);
  app.use("/message", msgController);

  app.use(globalErrorHandling);
  app.all("*", (req, res) =>
    res.status(404).json({ message: "Page Not Found" })
  );

  //DB
  ConnectDB();
};

export default bootStrap;
