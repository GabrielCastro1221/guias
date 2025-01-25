const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    img: { type: String, required: true },
    thumbnail: [{ type: String }],
    place_detail: [{ type: String, required: true }],
    guide: { type: Schema.Types.ObjectId, ref: "Guide" },
    gallery: [{ type: Schema.Types.ObjectId, ref: "Gallery" }],
    location: { type: String, required: true },
    category: { type: String, required: true },
    avaliables_dates: { type: Array },
    isApproved: {
      type: String,
      enum: ["pendiente", "aprobado", "cancelado"],
      default: "pendiente",
    },
    type: {
      type: String,
      enum: ["gratis", "pago"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("Tour", schema);
