import mongoose from "mongoose";

const ConnectDB = async () => {
  await mongoose
    .connect(process.env.DB_URI)
    .then((res) => {
      console.log("DB Connected Successfully");
    })
    .catch((error) => {
      console.error("Fail to Connect on DB");
    });
};

export default ConnectDB;
