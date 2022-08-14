const moment = require('moment')
moment.locale('es')


const calculateMonths = (date1,date2) =>{
    return parseInt((date1 - date2) / (1000 * 3600 * 24 * 30));
}

const calculateYears = (date1,date2) =>{
    return parseInt((date1 - date2) / (1000 * 60 * 60 * 24 * 30 * 12))
}



exports.calcularPrestaciones = (tiempoEmpresa,salario) =>{

    const meses = calculateMonths(new Date(),new Date('July 12, 2020 03:24:00'))
    const years = calculateYears(new Date(),new Date('July 12, 2020 03:24:00'))
    let preaviso = null;
    let cesantia = null
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
    return preavisoFinal + cesantiaFinal
    
}


exports.vacaciones = (tiempoEmpresa,salario) =>{
    const meses = calculateMonths(new Date(),new Date('July 12, 2020 03:24:00'))
    const years = calculateYears(new Date(),new Date('July 12, 2020 03:24:00'))

    let diasVaciones = null;

    if(meses < 5){
        return 'No tiene derechos a vacaciones'
    }else if(meses === 5){
        diasVaciones = 6
    }else if(meses === 6){
        diasVaciones = 7
    }else if(meses === 7){
        diasVaciones = 8
    }else if(meses === 8){
        diasVaciones = 9
    }else if(meses === 9){
        diasVaciones = 10
    }else if(meses === 10){
        diasVaciones = 11
    }else if(meses === 11){
        diasVaciones = 12
    }else if(meses >= 12 && years < 5){
        diasVaciones = 14
    }else{
        diasVaciones = 18
    }
    
    return diasVaciones
    
    

}
