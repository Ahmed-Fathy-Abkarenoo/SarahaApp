import path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: path.resolve("./src/config/.env.prod") });

import express from "express";
import bootStrap from "./src/app.controller.js";

const app = express();
const port = process.env.PORT || 5000;

bootStrap(app, express);
app.listen(port, () => console.log(`Saraha app listening on port ${port}!`));
