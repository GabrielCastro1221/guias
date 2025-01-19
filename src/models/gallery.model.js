const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    thumbnail: [{ type: String, required: true }],
    description: { type: String, required: true },
    tour: [{ type: Schema.Types.ObjectId, ref: "Tour" }],
    guide: [{ type: Schema.Types.ObjectId, ref: "Guide" }],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("Gallery", schema);
