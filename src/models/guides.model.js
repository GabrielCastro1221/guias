const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String },
    bio: { type: String },
    about: { type: String },
    photo: { type: String },
    role: { type: String },
    specialization: { type: String },
    education: { type: Array },
    experiences: { type: Array },
    tours: [{ type: Schema.Types.ObjectId, ref: "Tour" }],
    isApproved: {
      type: String,
      enum: ["pendiente", "aprobado", "cancelado"],
      default: "pendiente",
    },
    token_reset: { token: String, expire: Date },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

schema.plugin(mongoosePaginate);
module.exports = model("Guide", schema);
