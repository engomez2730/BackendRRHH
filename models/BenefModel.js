const mongoose = require("mongoose");

const BeneficiosSchema = new mongoose.Schema(
  {
    nombreBeneficio: {
      type: String,
    },
    cantidadBeneficio: {
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



const BeneficiosModel = new mongoose.model("Beneficios", BeneficiosSchema);

module.exports = BeneficiosModel;
