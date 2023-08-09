const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const calcular = require("../utils/calcularVacaciones");
const moment = require("moment");
moment.locale("es");

const employeesSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      unique: false,
      required: [true, "Un empleado debe tener un nombre"],
    },
    apellido: {
      type: String,
      required: [true, "Un empleado debe tener un apellido"],
    },
    cedula: {
      type: Number,
      required: [true, "Un empleado debe tener una cedula"],
      unique: [true, "La cedula del empleado existe en la base de datos"],
    },
    direccion: {
      type: String,
      required: [true, "Un empleado debe tener una cedula"],
    },
    celular: {
      type: Number,
      required: [true, "Un empleado debe tener este campo"],
      unique: [
        true,
        "El numero de telefono del empleado existe en la base de datos",
      ],
    },
    correo: {
      type: String,
      unique: [true, "Este correo ya existe"],
    },
    provincia: {
      type: String,
      enum: [
        "Azua",
        "Barahuco",
        "Barahona",
        "Dajabon",
        "Distrito Nacional",
        "Duarte",
        "Elias Piña",
        "El Seibo",
        "Espaillat",
        "Hato Mayor",
        "Hermanas Mirabal",
        "Independencia",
        "La Altagracias",
        "La Romana",
        "La Vega",
        "Maria Trinidad Sanchez",
        "Monseñor Nouel",
        "Monte Cristi",
        "Monte Plata",
        "Pedernales",
        "Peravia",
        "Puerto Plata",
        "Samana",
        "Sanchez Ramirez",
        "San Cristobal",
        "San Jose de Ocoa",
        "San Juan",
        "San Pedro de Macoris",
        "Santiago",
        "Santiago Rodriguez",
        "Santo Domingo",
        "Valverde",
        "No Establecida",
      ],
      default: "No Establecida",
    },
    pais: {
      type: String,
      required: [true, "Un empleado debe tener este campo"],
    },
    createdAt: {
      type: Date,
      default: moment().format(),
    },
    password: {
      type: String,
    },
    confirmPassword: {
      type: String,
    },
    tipoDeNomina: {
      type: String,
      required: [true, "Un empleado debe tener este campo"],
      enum: ["Nomina Fija", "Por Hora"],
    },
    estado: {
      type: Boolean,
      default: true,
    },
    contrato: {
      type: String,
      default: "indefinido",
      enum: ["definido", "indefinido", "temporal"],
    },
    puesto: {
      type: String,
    },
    prestacionesLaborables: {
      type: Number,
    },
    rol: {
      type: String,
      default: "encargado",
      enum: ["encargado", "admin"],
    },
    salarioBruto: {
      type: Number,
    },
    genero: {
      type: String,
      required: [true, "Un empleado debe tener este campo"],
      enum: ["Hombre", "Mujer", "Otro"],
    },
    fechaDeNacimiento: {
      type: Date,
      require: [true, "Debes poner tu edad"],
    },
    vencimientoDelContrato: {
      type: Date,
      required: false,
    },
    photo: {
      type: String,
    },
    departamento: {
      type: String,
      enum: [
        "Administracion",
        "Taller",
        "Barrick",
        "Falcondo",
        "Planta de Agregados",
        "Inmobiliaria",
        "Rio",
        "Topografia",
        "Campamento",
      ],
    },
    licenciasDeConducir: {
      type: Boolean,
      default: false,
    },
    tipoLicencia: {
      type: String,
    },
    licenciaDeConducirFechaExp: {
      type: Date,
      default: null,
    },
    contactoDeEmergencia: {
      type: Number,
      required: [true, "Debes introducir un contacto de emergencia"],
    },
    costoPorHora: {
      type: Number,
      default: null,
    },
    Nominas: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Nomina",
      },
    ],
    Licencias: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Licencias",
      },
    ],
    Vacaciones: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Vacaciones",
      },
    ],
    Epps: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Epp",
      },
    ],
    Despidos: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Despidos",
      },
    ],
    Beneficios: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Beneficios",
      },
    ],
    Amonestaciones: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Amonestaciones",
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//Virtuals

employeesSchema.virtual("tiempoEnLaEmpresa").get(function () {
  return (this.tiempoEnLaEmpresa = moment(this.createdAt).fromNow());
});

employeesSchema.virtual("regalia").get(function () {
  return (this.regalia = calcular.regalia(this.createdAt, this.salarioBruto));
});

//Methods

const ordenarMeses = (mes, año) => {
  if (mes === 12) {
    mes = 1;
  } else if (mes === 13) {
    mes = 2;
  } else if (mes === 14) {
    mes = 3;
  }

  return mes;
};

const ordenaraños = (mes, año) => {
  if (mes === 12) {
    mes = 1;
    año = año + 1;
  } else if (mes === 13) {
    mes = 2;
    año = año + 1;
  } else if (mes === 14) {
    mes = 3;
    año = año + 1;
  }

  return año;
};

employeesSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  /*     if (!this.isModified('password')) return next();
   */
  // Hash the password with cost of 12
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 12);
  }

  // Delete passwordConfirm field
  this.confirmPassword = undefined;
  // Converting Born day to Moment
  this.fechaDeNacimiento = moment(this.fechaDeNacimiento).fromNow();
  next();
});

employeesSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const userModel = new mongoose.model("Empleados", employeesSchema);

module.exports = userModel;
