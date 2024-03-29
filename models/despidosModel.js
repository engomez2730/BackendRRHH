const mongoose = require("mongoose");

const despidosSchema = new mongoose.Schema(
  {
    razon: {
      type: String,
      enum: [
        "Mala Conducta",
        "Rotacion Laboral",
        "Reducción de Personal",
        "Otro",
        "Mejor Oportunidad",
        "Mal ambiente laboral",
        "Mejor Oportunidad",
      ],
    },
    descripcion: {
      type: String,
      required: [true, "Un Despido debe tener un descripcion"],
    },
    fechaDespido: {
      type: Date,
      default: Date.now(),
    },
    prestacionesLaborables: {
      type: Number,
      default: 0,
    },
    tipoDeDespido: {
      type: String,
      required: [true, "Debe Tener una tipo de Despido"],
    },
    asistenciaEconomica: {
      type: Number,
    },
    Usuario: {
      type: mongoose.Schema.ObjectId,
      ref: "Empleados",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

despidosSchema.pre("save", async function (next) {
  next();
});

const despidosModel = new mongoose.model("Despidos", despidosSchema);

module.exports = despidosModel;
