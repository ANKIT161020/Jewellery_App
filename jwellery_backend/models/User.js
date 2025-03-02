const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    is_admin: { type: Boolean, default: false }, // ✅ Added Admin Field (Default: False)
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
