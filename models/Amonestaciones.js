const mongoose = require("mongoose");

const AmonestacionesSchema = new mongoose.Schema(
  {
    nombreAmonestacion: {
      type: String,
    },
    cantidadAmonestacion: {
      type: Number,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const AmonestacionesModel = new mongoose.model(
  "Amonestaciones",
  AmonestacionesSchema
);

module.exports = AmonestacionesModel;
