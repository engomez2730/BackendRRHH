const mongoose = require("mongoose");

const EquipoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "Un Puestos debe tener un nombre"],
      unique: [true, "Ya exite un puesto con ese nombre"],
    },
    ficha: {
      type: String,
    },
    descripcion: {
      type: String,
      required: [true, "Un Puestos debe tener una descripcion"],
    },
    createdAt: {
      type: Date,
      default: new Date(),
    },
    estado: {
      type: Boolean,
      default: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const equipoModel = new mongoose.model("Equipos", EquipoSchema);

module.exports = equipoModel;
