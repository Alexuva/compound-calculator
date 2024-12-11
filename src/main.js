class CompoundCalculator {
  
    /**
     * Cálculo del tiempo estimado en obtener un monto específico de dinero
     * @param initialAmmount Inversión inicial
     * @param periodicDeposit Depósito periódico
     * @param interestRate Interés anual
     * @param futureAmmount Monto futuro
     * @param periodType Depósitos de inyectan al inicio o al final de cada período
     * @param periodFrequency Frecuencia de los depósitos periódicos
     */
    timeToGetAmmount(
      initialAmmount, 
      periodicDeposit, 
      interestRate, 
      futureAmmount, 
      periodType, 
      periodFrequency
    ){
      
      let periods = 0;
      let ammount = initialAmmount;
    
      // Ajustar tasa de interés y períodos por año según la frecuencia
      let adjustedInterestRate = interestRate;
      let periodsPerYear = 1;
    
      if (periodFrequency === 'month') {
        adjustedInterestRate = interestRate / 12;
        periodsPerYear = 12;
      } else if (periodFrequency === 'week') {
        adjustedInterestRate = interestRate / 52;
        periodsPerYear = 52;
      }
    
      let year = 0;
      let totalDeposits = 0;
      let interestEarned = 0;
    
      const table = [];
    
      while (ammount < futureAmmount) {
  
        let depositsThisYear = 0;
        let interestThisYear = 0;
    
        for (let period = 0; period < periodsPerYear; period++) {
  
          if (ammount >= futureAmmount) break;
    
          // Depósito al inicio del período
          if (periodType === 'annuity') {        
            ammount += periodicDeposit;
            depositsThisYear += periodicDeposit;
            totalDeposits += periodicDeposit;
          }
    
          const interestThisPeriod = ammount * adjustedInterestRate;
          ammount += interestThisPeriod;
          interestThisYear += interestThisPeriod;
          interestEarned += interestThisPeriod;
    
          // Depósito al final del período
          if (periodType === 'ordinary') {
            ammount += periodicDeposit;
            depositsThisYear += periodicDeposit;
            totalDeposits += periodicDeposit;
          }
    
          periods++;
  
        }
    
        year++;
  
        table.push({
          year: year,
          deposits: depositsThisYear.toLocaleString('es-ES', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' }),
          totalDeposits: totalDeposits.toLocaleString('es-ES', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' }),
          interest: interestThisYear.toLocaleString('es-ES', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' }),
          totalInterest: interestEarned.toLocaleString('es-ES', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' }),
          balance: ammount.toLocaleString('es-ES', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' }),
        });
  
      }
  
      const periodsToTime = this.conversionToTimeString(periods, periodsPerYear, periodFrequency);
  
      return { table, totalPeriods: periods, periodsToTime };
    };
  
    /**
     * Cálculo de cuánto dinero almacenaré hasta la fecha indicada con depósitos periódicos al inicio de cada período
     * @param initialAmmount Inversión inicial
     * @param periodicDeposit Depósito periódico
     * @param interestRate Interés anual
     * @param periods Número total de períodos
     * @param periodFrequency Frecuencia de los depósitos periódicos
     * @returns 
     */
    compoundAnnuity(
      initialAmmount, 
      periodicDeposit, 
      interestRate, 
      periods, 
      periodFrequency
    ){
  
      const table = []; // Para almacenar los datos por año
      const ammount = initialAmmount;
  
      if(periodFrequency === 'month'){
        periods = periods * 12;
        interestRate = interestRate / 12;
      }else if(periodFrequency === 'week'){
        periods = periods * 52;
        interestRate = interestRate / 52;
      }
  
      for (let period = 1; period <= periods; period++) {
      
        // Si excedemos el total de períodos, limitarlo
        if (period > periods) break;
  
        const actualDeposits = periodicDeposit * ((Math.pow(1 + interestRate, period) - 1) / interestRate) * (1 + interestRate);
        const initial = ammount * Math.pow(1 + interestRate, period);
        const balance = actualDeposits + initial;
  
        const totalDeposits = ammount + periodicDeposit * period;
  
        const totalInterest = balance - totalDeposits;
  
        if(periodFrequency === 'month'){
          if(period % 12 === 0){
            table.push({
              year: period / 12,
              deposits: (periodicDeposit * 12).toLocaleString('es-ES', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' }),
              totalDeposits: totalDeposits.toLocaleString('es-ES', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' }),
              interest: totalInterest.toLocaleString('es-ES', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' }),
              totalInterest: totalInterest.toLocaleString('es-ES', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' }),
              balance: balance.toLocaleString('es-ES', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' }),
            });
          }
        }else if(periodFrequency === 'week'){
          if(period % 52 === 0){
            table.push({
              year: period / 52,
              deposits: (periodicDeposit * 52).toLocaleString('es-ES', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' }),
              totalDeposits: totalDeposits.toLocaleString('es-ES', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' }),
              interest: totalInterest.toLocaleString('es-ES', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' }),
              totalInterest: totalInterest.toLocaleString('es-ES', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' }),
              balance: balance.toLocaleString('es-ES', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' }),
            });
          }
        }else{
          table.push({
            year: period,
            deposits: periodicDeposit.toLocaleString('es-ES', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' }),
            totalDeposits: totalDeposits.toLocaleString('es-ES', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' }),
            interest: totalInterest.toLocaleString('es-ES', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' }),
            totalInterest: totalInterest.toLocaleString('es-ES', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' }),
            balance: balance.toLocaleString('es-ES', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' }),
          });
        }
        
        
      }
  
      const totalDeposits = periodicDeposit * ((Math.pow(1 + interestRate, periods) - 1) / interestRate) * (1 + interestRate);
      const totalInitial = ammount * Math.pow(1 + interestRate, periods);
      const totalBalance = totalDeposits + totalInitial;
  
      return { table, totalPeriods: periods, totalBalance };
  
    }
  
     /**
     * Cálculo de cuánto dinero almacenaré hasta la fecha indicada con depósitos periódicos al final de cada período
     * @param initialAmmount Inversión inicial
     * @param periodicDeposit Depósito periódico
     * @param interestRate Interés anual
     * @param periods Número total de períodos
     * @param periodFrequency Frecuencia de los depósitos periódicos
     * @returns 
     */
     compoundOrdinary(
      initialAmmount, 
      periodicDeposit, 
      interestRate, 
      periods, 
      periodFrequency
    ){
  
      const table = [];
      const ammount = initialAmmount;
    
      // Ajustar frecuencia y tasa de interés
      if (periodFrequency === 'month') {
        periods = periods * 12; // Convertir años a meses
        interestRate = interestRate / 12; // Tasa mensual
      } else if (periodFrequency === 'week') {
        periods = periods * 52; // Convertir años a semanas
        interestRate = interestRate / 52; // Tasa semanal
      }
    
      let balance = ammount; // Saldo inicial
      let totalDeposits = ammount; // Depósitos acumulados
      let totalInterest = 0; // Intereses acumulados
    
      for (let period = 1; period <= periods; period++) {
  
        // Calcular el interés ganado sobre el saldo actual
        const interestEarned = balance * interestRate;
    
        // Actualizar el saldo con los intereses ganados
        balance += interestEarned;
    
        // Después de acumular intereses, agregar el depósito del período
        totalDeposits += periodicDeposit;
        balance += periodicDeposit;
    
        // Intereses acumulados hasta ahora
        totalInterest = balance - totalDeposits;
  
          if(periodFrequency === 'month'){
            if(period % 12 === 0){
              // Agregar datos a la tabla
              table.push({
                  year: period / 12,
                  deposits: (periodicDeposit * 12).toLocaleString('es-ES', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' }),
                  totalDeposits: totalDeposits.toLocaleString('es-ES', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' }),
                  interest: totalInterest.toLocaleString('es-ES', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' }),
                  totalInterest: totalInterest.toLocaleString('es-ES', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' }),
                  balance: balance.toLocaleString('es-ES', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' }),
              });
            }
          }else if(periodFrequency === 'week'){
            if(period % 52 === 0){
              // Agregar datos a la tabla
              table.push({
                year: period / 52,
                deposits: (periodicDeposit * 52).toLocaleString('es-ES', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' }),
                totalDeposits: totalDeposits.toLocaleString('es-ES', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' }),
                interest: totalInterest.toLocaleString('es-ES', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' }),
                totalInterest: totalInterest.toLocaleString('es-ES', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' }),
                balance: balance.toLocaleString('es-ES', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' }),
              });
            }
          }else{
            // Agregar datos a la tabla
            table.push({
              year: period,
              deposits: periodicDeposit.toLocaleString('es-ES', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' }),
              totalDeposits: totalDeposits.toLocaleString('es-ES', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' }),
              interest: totalInterest.toLocaleString('es-ES', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' }),
              totalInterest: totalInterest.toLocaleString('es-ES', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' }),
              balance: balance.toLocaleString('es-ES', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' }),
            });
          }
        }
  
        return { table, totalPeriods: periods, totalBalance: balance };
  
    }
  
    /**
     * Calcular cuánto necesito depositar periódicamente para alcanzar un monto objetivo
     * @param initialAmmount Inversión inicial
     * @param goalAmmount Monto objetivo
     * @param interestRate Interés anual
     * @param periods Períodos
     * @param periodType Tipo de períodos
     * @param periodFrequency Frecuencia de los depósitos periódicos
     * @returns 
     */
    depositToGetAmmount(
      initialAmmount, 
      goalAmmount, 
      interestRate, 
      periods, 
      periodType, 
      periodFrequency
    ){
  
      let newPeriods = periods;
      let newInterestRate = interestRate;
  
      if(periodFrequency === 'month'){
        newPeriods = periods * 12;
        newInterestRate = interestRate / 12;
      }else if(periodFrequency === 'week'){
        newPeriods = periods * 52;
        newInterestRate = interestRate / 52;
      }
  
      // Calcular el denominador base
      const baseDenominator = (Math.pow(1 + newInterestRate, newPeriods) - 1) / newInterestRate;
      const denominator = periodType === 'annuity' ? baseDenominator * (1 + newInterestRate) : baseDenominator;
  
      // Calcular el depósito mensual necesario
      const numerator = goalAmmount - initialAmmount * Math.pow(1 + newInterestRate, newPeriods);
      const depositGoal = numerator / denominator;
  
      if(periodType === 'annuity'){
        return this.compoundAnnuity(initialAmmount, depositGoal, interestRate, periods, periodFrequency);
      }else{
        return this.compoundOrdinary(initialAmmount, depositGoal, interestRate, periods, periodFrequency);
      }
      
    }
  
    /**
     * Calcular el interés necesario para alcanzar un monto objetivo con depósitos periódicos
     * @param initialAmmount Inversión inicial	
     * @param periodicDeposit Deposito periódicos
     * @param goalAmmount Monto objetivo
     * @param periods Períodos
     * @param periodFrequency Frecuencia de los depósitos periódicos
     * @param periodType Tipo de períodos
     * @param precision Precisión deseada para la tasa
     * @returns 
     */
    interestToGetAmmount(
      initialAmmount, 
      periodicDeposit, 
      goalAmmount, 
      periods, 
      periodFrequency, 
      periodType,
      precision = 1e-6
    ){
      
      let minAnualInterest = 0;
      let maxAnualInterest = 10;
  
      while((maxAnualInterest - minAnualInterest) > precision){
        const midAnualInterest = (minAnualInterest + maxAnualInterest) / 2;
  
        if(periodType === 'annuity'){
          const futureAmmount = this.compoundAnnuity(initialAmmount, periodicDeposit, midAnualInterest, periods, periodFrequency).totalBalance;
          if(futureAmmount < goalAmmount){
            minAnualInterest = midAnualInterest;
          }else{
            maxAnualInterest = midAnualInterest;
          }
        }else{
          const futureAmmount = this.compoundOrdinary(initialAmmount, periodicDeposit, midAnualInterest, periods, periodFrequency).totalBalance;
          if(futureAmmount < goalAmmount){
            minAnualInterest = midAnualInterest;
          }else{
            maxAnualInterest = midAnualInterest;
          }
        }
      }
  
      const finalInterest = ((minAnualInterest + maxAnualInterest) / 2);
  
      if(periodType === 'annuity'){
        return this.compoundAnnuity(initialAmmount, periodicDeposit, finalInterest, periods, periodFrequency);
      }else{
        return this.compoundOrdinary(initialAmmount, periodicDeposit, finalInterest, periods, periodFrequency);
      }
  
    }
  
    /**
     * Convierte los periodos a una cadena de texto con el tiempo estimado
     * @param periods Número de periodos
     * @param periodsPerYear Número de periodos por año, depende de si los ingresos son mensuales, semanales o anuales
     * @param periodFrequency Frecuencia de los depósitos periódicos
     * @returns string con el tiempo estimado
     */
    conversionToTimeString(periods, periodsPerYear, periodFrequency) {
  
      const years = Math.floor(periods / periodsPerYear); // Años completos
      const remainingPeriods = periods % periodsPerYear; // Períodos restantes
      let periodsToTime = '';
  
  
      if (periodFrequency === 'year') {
  
        periodsToTime = `${years} años`;
  
      } else if (periodFrequency === 'month') {
  
        const totalMonths = years * 12 + remainingPeriods; // Convertir todo a meses
        const correctedYears = Math.floor(totalMonths / 12);
        const correctedMonths = totalMonths % 12;
  
        //Si hay meses restantes, se agrega años y meses
        if(correctedMonths > 0){
          periodsToTime = `${correctedYears} ${correctedYears > 1 ? 'años' : 'año'} y ${correctedMonths} ${correctedMonths > 1 ? 'meses' : 'mes'}`;
        }else{
          periodsToTime = `${correctedYears} ${correctedYears > 1 ? 'años' : 'año'}`;
        }
  
      } else if (periodFrequency === 'week') {
        
        const totalWeeks = years * 52 + remainingPeriods; // Convertir todo a semanas
        let correctedYears = Math.floor(totalWeeks / 52);
        const remainingWeeks = totalWeeks % 52;
        let correctedMonths = Math.floor(remainingWeeks / 4); // Convertir semanas restantes a meses
        const finalWeeks = remainingWeeks % 4;
  
        if(correctedMonths >= 12){
          correctedYears += Math.floor(correctedMonths / 12);
          correctedMonths = Math.floor(correctedMonths % 12);
        }
  
        if(correctedMonths > 0){
          
          if(finalWeeks > 0){
            periodsToTime = `${correctedYears} ${correctedYears > 1 ? 'años' : 'año'}, ${correctedMonths} ${correctedMonths > 1 ? 'meses' : 'mes'} y ${finalWeeks} ${finalWeeks > 1 ? 'semanas' : 'semana'}`;
          }else{
            periodsToTime = `${correctedYears} ${correctedYears > 1 ? 'años' : 'año'} y ${correctedMonths} ${correctedMonths > 1 ? 'meses' : 'mes'}`;
          }
  
        }else{
  
          if(finalWeeks > 0){
            periodsToTime = `${correctedYears} ${correctedYears > 1 ? 'años' : 'año'} y ${finalWeeks} ${finalWeeks > 1 ? 'semanas' : 'semana'}`;
          }else{
            periodsToTime = `${correctedYears} ${correctedYears > 1 ? 'años' : 'año'}`;
          }
  
        }
  
      }
  
      return periodsToTime;
  
    };
    
}

function handleInput(e){
    const currency = ['initialBalance', 'periodicDeposit', 'saveGoal'];
    //const selectors = ['periodicDeposit', 'periodicType'];
    const percentage = ['interestRate'];
    const number = ['periods'];
    const floatRegex = new RegExp(/^\d+(.\d{1,2})?$/);
    const intRegex = new RegExp(/^[0-9]+$/);
    const inputName = e.target.name;

    if(currency.includes(inputName)){

        if (e.target.value.length <= 0) {
            e.target.classList.add('error-input');
            e.target.setCustomValidity("Campo requerido");
        } else {
            if (floatRegex.test(e.target.value)) {
                e.target.setCustomValidity("");
                e.target.classList.remove('error-input');
            } else {
                e.target.classList.add('error-input');
                e.target.setCustomValidity("La cantidad introducida no es válida");
            }
        }

    }else if(percentage.includes(inputName)){
        const min = parseFloat(e.target.min.replaceAll(',','.'));
        const max = parseFloat(e.target.max.replaceAll(',','.'));

        if (e.target.value.length <= 0) {
            e.target.classList.add('error-input');
            e.target.setCustomValidity("Campo requerido");
        }else{
            if (floatRegex.test(e.target.value)){
                e.target.setCustomValidity("");
                e.target.classList.remove('error-input');
                
                const value = parseFloat(e.target.value.replaceAll(',','.'));
                if(value <= min){
                    e.target.value = min
                    if(value < min){
                        e.target.parentElement.parentElement.querySelector(".error").innerText = `El mínimo es ${min}%`;
                    }
                }else if(value >= max){
                    e.target.value = max
                    if(value > max){
                        e.target.parentElement.parentElement.querySelector(".error").innerText = `El máximo es ${max}%`;
                    }
                }else{
                    e.target.parentElement.parentElement.querySelector(".error").innerText = ``;
                }
            }else{
                e.target.setCustomValidity("La cantidad introducida no es válida");
                e.target.classList.add('error-input');
            }
        }

    }else if(number.includes(inputName)){

        const min = parseInt(e.target.min);
        const max = parseInt(e.target.max);

        if(e.target.value.length <= 0){
            e.target.classList.add('error-input');
            e.target.setCustomValidity("Campo requerido");  
        }else{

            if (intRegex.test(e.target.value)){
                e.target.setCustomValidity("");
                e.target.classList.remove('error-input');
                
                const value = parseInt(e.target.value.replaceAll(',','.'));
                if(value <= min){
                    e.target.value = min
                    if(value < min){
                        e.target.parentElement.parentElement.querySelector(".error").innerText = `El mínimo es ${min} año(s)`;
                    }
                }else if(value > max){
                    e.target.value = max
                    if(value > max){
                        e.target.parentElement.parentElement.querySelector(".error").innerText = `El máximo es ${max} año(s)`;
                    }
                }else{
                    e.target.parentElement.parentElement.querySelector(".error").innerText = ``;
                }
            }else{
                e.target.setCustomValidity("La cantidad introducida no es válida");
                e.target.classList.add('error-input');
            }

        }

    }

    e.target.reportValidity();
}

const calculator = document.querySelector('#compound-calculator');
const calculatorType = calculator.querySelector('#calculatorType');
const calculatorForms = calculator.querySelectorAll('[id$="-Form"]');
const circleCanvas = document.querySelector('#round-chart-container');
const resumeChart = echarts.init(circleCanvas, null, {useDirtyRect: false});
const barCanvas = document.querySelector('#bar-chart-container');
const barChart = echarts.init(barCanvas, null, {useDirtyRect: false});

calculatorType.addEventListener('change', (e)=>{
    calculatorForms.forEach(form => form.classList.add('hidden'));
    const selected = e.target.value;
    calculator.querySelector(`#${selected}-Form`).classList.remove('hidden');
});

calculatorForms.forEach(form =>{ 
    form.addEventListener('input', handleInput)
    form.addEventListener('blur', handleInput)
    form.addEventListener('submit', calculate)
});


function calculate(e){
    e.preventDefault();
    const valid = e.target.checkValidity();
    if(valid){
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        console.log(data);
    }
}



const circleChartOptions = {
    title : {
        show: false
    },
    legend: {
        show: false
    },
    grid: {
        top: 0,    
        bottom: 0, 
        left: 0,   
        right: 0,   
    },
    tooltip: {
        trigger: 'item',
        formatter: function (params) {
            // Convertimos el valor numérico a string formateado
            const formattedValue = params.value.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
            return `
                <span style="display:inline-block;width:10px;height:10px;background:${params.color};border-radius:50%;margin-right:5px;"></span>
                <em>${params.name}</em><br>
                <strong>${formattedValue}</strong>
            `;
        }
    },
    series: [
        {
            type: 'pie',
            radius: '90%',
            data: [
              { value: 1000, name: 'Balance Inicial', itemStyle: { color: '#8b5cf6'}, label:{show: false}, labelLine:{ show: false,  emphasis: { show: false }} },
              { value: 12000, name: 'Depósitos Periódicos', itemStyle: {color: '#2563eb'}, label:{show: false}, labelLine:{ show: false,  emphasis: { show: false }} },
              { value: 730.62, name: 'Interés Total', itemStyle: {color: '#84cc16'}, label:{show: false}, labelLine:{ show: false,  emphasis: { show: false }} },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
    ]
};

const barChartOptions = {
    title : {
        show: false
    },
    legend: {
        show: false
    },
    grid:{
        containLabel: true,
        left: 10,
        right: 10,
        top: 40,
        bottom: 40,
    },
    tooltip: {
        trigger: 'item',
        formatter: function (params) {
            // Convertimos el valor numérico a string formateado
            const formattedValue = params.value.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
            return `
                <span style="display:inline-block;width:10px;height:10px;background:${params.color};border-radius:50%;margin-right:5px;"></span>
                <em>${params.seriesName}</em><br>
                <strong>${formattedValue}</strong>
            `;
        }
    },
    series : [
        {
            data: [100, 8, 1],
            type: 'bar',
            stack: 'a',
            name: 'Balance Inicial',
            color: '#8b5cf6'
        },
        {
            data: [8, 2, 1],
            type: 'bar',
            stack: 'a',
            name: 'Depósitos Periódicos',
            color: '#2563eb'
        },
        {
            data: [10, 8, 1],
            type: 'bar',
            stack: 'a',
            name: 'Interés Total',
            color: '#84cc16'
        }
    ],
    xAxis: {
        type: 'category',
        data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
    },
    yAxis: {
        type: 'value',
        axisLabel: {
            formatter: function (value) {
                return value.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
            }
        },
        splitLine: {
            show: true
        }
    }
};

resumeChart.setOption(circleChartOptions);
barChart.setOption(barChartOptions);
window.addEventListener('resize', resumeChart.resize);
window.addEventListener('resize', barChart.resize);


