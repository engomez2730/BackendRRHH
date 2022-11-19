const moment = require('moment')
moment.locale('es')


const calculateMonths = (date1,date2) =>{
    return (date1 - date2) / (1000 * 3600 * 24 * 30);
}

const calculateYears = (date1,date2) =>{
    return parseInt((date1 - date2) / (1000 * 60 * 60 * 24 * 30 * 12))
}

exports.calcularPrestaciones = (createdAt,salario,tomoVacaciones,salarioVacaciones,regalia) =>{
 
    const meses = calculateMonths(new Date(),new Date(createdAt))
    const years = calculateYears(new Date(),new Date(createdAt))
    let preaviso = null;
    let cesantia = null;

   if(meses < 3){
        return'No tiene derechos a prestaciones laborables aun'
   }else if (meses >= 3 && meses <6){
        preaviso = 7
   }else if (meses >=6 && meses <12){
        preaviso = 14
   }else{
        preaviso = 28
   }
    if(meses < 3){
     return 'No le toca regalia'
    }else if (meses >= 3 && meses <6){
        cesantia = 6
    }else if (meses >=6 && meses <12){
        cesantia = 13
    }else if(meses > 12 && years <= 5){
        cesantia = years * 21
    }else if(meses > 12 && years >= 5){
        cesantia = years * 23
    }
    const preavisoFinal = salario/ 23.83 * preaviso
    const cesantiaFinal = salario/ 23.83 * cesantia
    if(!tomoVacaciones){
        return preavisoFinal + cesantiaFinal + salarioVacaciones + regalia
    }else{
        return preavisoFinal + cesantiaFinal + regalia
    }
}

exports.vacacionesDisponibles = (createdAt) =>{
   if(calculateMonths(new Date(),createdAt) >= 3){
        return true
    }else{
        return false
   }
}

exports.vacaciones = (createdAt) =>{
    const meses = calculateMonths(new Date(),new Date(createdAt))
    const years = calculateYears(new Date(),new Date(createdAt))
    let diasVaciones = null;
    if(meses < 5){
        return 'No tiene derechos a vacaciones'
    }else if(meses >= 5 && meses < 6){
        diasVaciones = 6
    }else if(meses >= 6 && meses < 7){
        diasVaciones = 7
    }else if(meses >= 7 && meses <8){
        diasVaciones = 8
    }else if(meses >= 8 && meses <9){
        diasVaciones = 9
    }else if(meses >= 9 && meses <10){
        diasVaciones = 10
    }else if(meses >= 10 && meses <11){
        diasVaciones = 11
    }else if(meses >= 11 && meses <12){
        diasVaciones = 12
    }else if(meses >= 13 && meses <14){
        diasVaciones = 14
    }else{
        diasVaciones = 18
    }
    return diasVaciones
}


exports.regalia = (createdAt,salario) =>{
    let regalia;
    if(createdAt.getFullYear() === new Date().getFullYear()){
        const months = calculateMonths(new Date(),createdAt)
        regalia = (salario / 12) * months
   
    }else if(createdAt.getFullYear() !== new Date().getFullYear()){
        const months = calculateMonths(new Date(),new Date(`January 1, ${new Date().getFullYear()} 03:24:00`))
        regalia = (salario / 12) * months
    }
    return regalia
}

const ISR = (sueldo) => {
    const sueldoAnual = sueldo * 12
    return sueldoAnual < 416220.0
      ? 0
      : sueldoAnual > 416220.01 && sueldoAnual < 624329.0
      ? (sueldoAnual - 416220.01) * 0.15
      : sueldoAnual > 624329.01 && sueldoAnual < 867123.0
      ? (sueldoAnual - 624329.01) * 0.2 + 31216.0
      : sueldoAnual > 867123.0 && (sueldoAnual - 867123.01) * 0.25 + 79776.0
}
  
exports.nomina = (sueldo, ahorro = 0) => {
    const afp = sueldo * 0.0287
    const sfs = sueldo * 0.0304
    const isr = ISR(sueldo - sfs - afp)
    const totalDescuento = afp + sfs + isr / 12
    const sueldoNeto = sueldo - afp - sfs - isr / 12
    const totalSinAhorro = sueldo - afp - sfs - isr / 12 - ahorro
    const sueldoAnual = sueldo * 12
    const sueldoBruto = sueldo

  
    return {
      afp,
      sfs,
      isr,
      totalDescuento,
      sueldoNeto,
      totalSinAhorro,
      sueldoAnual,
      sueldoBruto,
    }
  }
  