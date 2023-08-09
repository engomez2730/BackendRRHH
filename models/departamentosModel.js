const mongoose = require("mongoose");

const departamentoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "Un Departamento debe tener un nombre"],
      unique: [true, "Un Departamento debe ser unico"],
    },
    encargado: {
      type: String,
      required: [true, "Un Departamento debe tener un encargado"],
    },
    descripcion: {
      type: String,
      required: [true, "Un Departamento debe tener una descripcion"],
    },
    Empleados: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Empleados",
      },
    ],
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

const departamentoModel = new mongoose.model(
  "Departamentos",
  departamentoSchema
);

module.exports = departamentoModel;
