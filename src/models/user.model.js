const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: Number },
    photo: { type: String },
    role: {
      type: String,
      enum: ["usuario", "admin"],
      default: "usuario",
    },
    gender: {
      type: String,
      enum: ["masculino", "femenino", "otro"],
    },
    token_reset: { token: String, expire: Date },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("User", schema);
