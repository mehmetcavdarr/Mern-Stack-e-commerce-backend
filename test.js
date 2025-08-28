import mongoose from "mongoose";
const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:29017/mernshop";
console.log("TEST connecting:", uri);
try {
  await mongoose.connect(uri);
  console.log("TEST connected OK");
  await mongoose.disconnect();
  process.exit(0);
} catch (e) {
  console.error("TEST connect error:", e.message);
  process.exit(1);
}