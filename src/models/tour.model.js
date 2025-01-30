const { Schema, model } = require("mongoose");

const schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  img: { type: String, required: true },
  photo: [{ type: String }],
  guide: { type: Schema.Types.ObjectId, ref: "Guide", required: true },
  gallery: [{ type: String }],
  location: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  isApproved: {
    type: String,
    enum: ["pendiente", "aprobado", "cancelado"],
    default: "pendiente",
  },
  status: {
    type: String,
    enum: ["educativo", "aporte"],
    default: "disponible",
  },
});

module.exports = model("Tour", schema);
