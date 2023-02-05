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
        return 0
   }else if (meses >= 3 && meses <6){
        preaviso = 7
   }else if (meses >=6 && meses <12){
        preaviso = 14
   }else{
        preaviso = 28
   }
    if(meses < 3){
     return 0
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

exports.sueldoVacaciones = (sueldo,dias) =>{
    return (sueldo / 23.83) * dias 
}


exports.vacaciones = (createdAt) =>{

    const meses = calculateMonths(new Date(),new Date(createdAt))
    const years = calculateYears(new Date(),new Date(createdAt))
    if(meses < 5){
        return 0
    }else if(meses >= 5 && meses < 6){
        return  6
    }else if(meses >= 6 && meses < 7){
        return  7
    }else if(meses >= 7 && meses <8){
        return  8
    }else if(meses >= 8 && meses <9){
        return 9
    }else if(meses >= 9 && meses <10){
        return 10
    }else if(meses >= 10 && meses <11){
        return 11
    }else if(meses >= 11 && meses <=12){
        return  12
    }else if(meses >= 12 && meses <13){
        return 14
    }else{
        return  14
    }
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
      ? ((sueldoAnual - 416220.01) * 0.15 )/ 12
      : sueldoAnual > 624329.01 && sueldoAnual < 867123.0
      ? ((sueldoAnual - 416220.01) * 0.20 )/ 12
      : sueldoAnual > 867123.0 && ((sueldoAnual - 416220.01) * 0.25 )/ 12
}
  
exports.nomina = (sueldo,sueldoPorHora,tipoNomina,vacaciones = 0,regalia = 0,ahorro = 0) => {

    if(tipoNomina === 'Por Hora'){
        const afp = sueldo * 0.0287
        const sfs = sueldo * 0.0304
        const isr = ISR(sueldo - sfs - afp)
        const totalDescuento = afp + sfs + isr 
        const sueldoNeto = sueldoPorHora + vacaciones + regalia - afp - sfs - isr 
        const totalSinAhorro = sueldo - afp - sfs - isr / 12 - ahorro
        const sueldoAnual = sueldo * 12
        const sueldoBruto = sueldoPorHora + vacaciones + regalia
        const sueldoFijo = sueldo
        return {
          afp,
          sfs,
          isr,
          totalDescuento,
          sueldoNeto,
          totalSinAhorro,
          sueldoAnual,
          sueldoBruto,
          sueldoFijo,
        }

    }

    const afp = sueldo * 0.0287
    const sfs = sueldo * 0.0304
    const isr = ISR(sueldo - sfs - afp)
    const totalDescuento = afp + sfs + isr 
    const sueldoNeto = sueldo + vacaciones + regalia - afp - sfs - isr 
    const totalSinAhorro = sueldo - afp - sfs - isr / 12 - ahorro
    const sueldoAnual = sueldo * 12
    const sueldoBruto = sueldo + vacaciones + regalia
    const sueldoFijo = sueldo
    return {
      afp,
      sfs,
      isr,
      totalDescuento,
      sueldoNeto,
      totalSinAhorro,
      sueldoAnual,
      sueldoBruto,
      sueldoFijo,

    }
}