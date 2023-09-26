const mongoose = require("mongoose");

const EquipoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "Un Proyecto debe tener un nombre"],
      unique: [true, "Ya exite un puesto con ese nombre"],
    },
    descripcion: {
      type: String,
      required: [true, "Un Proyecto debe tener una descripcion"],
    },
    encargado: {
      type: String,
      required: [true, "Un Proyecto debe tener una encargdo"],
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

const equipoModel = new mongoose.model("Proyectos", EquipoSchema);

module.exports = equipoModel;
