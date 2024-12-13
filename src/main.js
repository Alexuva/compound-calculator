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
      let adjustedInterestRate = (interestRate / 100);
      let periodsPerYear = 1;
    
      if (periodFrequency === 'monthly') {
        adjustedInterestRate = (interestRate / 100) / 12;
        periodsPerYear = 12;
      } else if (periodFrequency === 'weekly') {
        adjustedInterestRate = (interestRate / 100) / 52;
        periodsPerYear = 52;
      }else if(periodFrequency === 'bi-weekly'){
        adjustedInterestRate = (interestRate / 100) / 26;
        periodsPerYear = 26;
      }
    
      let year = 0;
      let totalDeposits = ammount;
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
          deposits: parseFloat(depositsThisYear.toFixed(2)),
          totalDeposits: parseFloat(totalDeposits.toFixed(2)),
          interestEarnedThisYear: parseFloat(interestThisYear.toFixed(2)),
          interest: parseFloat(interestEarned.toFixed(2)),
          balance: parseFloat(ammount.toFixed(2)),
        });
  
      }
  
      const periodsToTime = this.conversionToTimeString(periods, periodsPerYear, periodFrequency);
      
      const totalDepositsFinal = parseFloat(table[table.length - 1].totalDeposits) - initialAmmount;
      const totalInterest = table[table.length - 1].interest;


      return { table, totalPeriods: periods, periodsToTime, totalBalance: 0, totalInterest, totalDeposits: totalDepositsFinal, initialAmmount, totalPeriodicDeposits: totalDepositsFinal};
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
      const finalInterest = interestRate;
  
      if(periodFrequency === 'monthly'){
        periods = periods * 12;
        interestRate = (interestRate / 100) / 12;
      }else if(periodFrequency === 'weekly'){
        periods = periods * 52;
        interestRate = (interestRate / 100) / 52;
      }else if(periodFrequency === 'bi-weekly'){
        periods = periods * 26;
        interestRate = (interestRate / 100) / 26;
      }else{
        interestRate = (interestRate / 100);
      }
  
      for (let period = 1; period <= periods; period++) {
      
        // Si excedemos el total de períodos, limitarlo
        if (period > periods) break;
  
        const actualDeposits = periodicDeposit * ((Math.pow(1 + interestRate, period) - 1) / interestRate) * (1 + interestRate);
        const initial = ammount * Math.pow(1 + interestRate, period);
        const balance = actualDeposits + initial;
  
        const totalDeposits = ammount + periodicDeposit * period;
  
        const totalInterest = balance - totalDeposits;
  
        if(periodFrequency === 'monthly'){
          if(period % 12 === 0){
            table.push({
              year: period / 12,
              deposits: parseFloat((periodicDeposit * 12).toFixed(2)),
              totalDeposits: parseFloat(totalDeposits.toFixed(2)),
              interest: parseFloat(totalInterest.toFixed(2)),
              balance: parseFloat(balance.toFixed(2)),
            });
          }
        }else if(periodFrequency === 'weekly'){
          if(period % 52 === 0){
            table.push({
              year: period / 52,
              deposits: parseFloat((periodicDeposit * 52).toFixed(2)),
              totalDeposits: parseFloat(totalDeposits.toFixed(2)),
              interest: parseFloat(totalInterest.toFixed(2)),
              balance: parseFloat(balance.toFixed(2)),
            });
          }
        }else if(periodFrequency === 'bi-weekly'){
          if(period % 26 === 0){
            table.push({
              year: period / 26,
              deposits: parseFloat((periodicDeposit * 26).toFixed(2)),
              totalDeposits: parseFloat(totalDeposits.toFixed(2)),
              interest: parseFloat(totalInterest.toFixed(2)),
              balance: parseFloat(balance.toFixed(2)),
            });
          }
        }else{
          table.push({
            year: period,
            deposits: parseFloat((periodicDeposit).toFixed(2)),
            totalDeposits: parseFloat(totalDeposits.toFixed(2)),
            interest: parseFloat(totalInterest.toFixed(2)),
            balance: parseFloat(balance.toFixed(2)),
          });
        }
        
        
      }
  
      const totalDeposits = parseFloat((periodicDeposit * ((Math.pow(1 + interestRate, periods) - 1) / interestRate) * (1 + interestRate)).toFixed(2));
      const totalInitial = ammount * Math.pow(1 + interestRate, periods);
      const totalBalance = parseFloat((totalDeposits + totalInitial).toFixed(2));
      const totalInterest =table[table.length - 1].interest;
      const totalPeriodicDeposits = parseFloat((periodicDeposit * periods).toFixed(2));
  
      return { table, totalPeriods: periods, totalBalance, totalInterest, totalDeposits, initialAmmount, totalPeriodicDeposits, finalInterest };
  
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
      const finalInterest = interestRate;
    
      if(periodFrequency === 'monthly'){
        periods = periods * 12;
        interestRate = (interestRate / 100) / 12;
      }else if(periodFrequency === 'weekly'){
        periods = periods * 52;
        interestRate = (interestRate / 100) / 52;
      }else if(periodFrequency === 'bi-weekly'){
        periods = periods * 26;
        interestRate = (interestRate / 100) / 26;
      }else{
        interestRate = (interestRate / 100);
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
  
          if(periodFrequency === 'monthly'){
            if(period % 12 === 0){
              table.push({
                year: period / 12,
                deposits: parseFloat((periodicDeposit * 12).toFixed(2)),
                totalDeposits: parseFloat(totalDeposits.toFixed(2)),
                interest: parseFloat(totalInterest.toFixed(2)),
                balance: parseFloat(balance.toFixed(2)),
              });
            }
          }else if(periodFrequency === 'weekly'){
            if(period % 52 === 0){
              table.push({
                year: period / 52,
                deposits: parseFloat((periodicDeposit * 52).toFixed(2)),
                totalDeposits: parseFloat(totalDeposits.toFixed(2)),
                interest: parseFloat(totalInterest.toFixed(2)),
                balance: parseFloat(balance.toFixed(2)),
              });
            }
          }else if(periodFrequency === 'bi-weekly'){
            if(period % 26 === 0){
              table.push({
                year: period / 26,
                deposits: parseFloat((periodicDeposit * 26).toFixed(2)),
                totalDeposits: parseFloat(totalDeposits.toFixed(2)),
                interest: parseFloat(totalInterest.toFixed(2)),
                balance: parseFloat(balance.toFixed(2)),
              });
            }
          }else{
            table.push({
              year: period,
              deposits: parseFloat((periodicDeposit).toFixed(2)),
              totalDeposits: parseFloat(totalDeposits.toFixed(2)),
              interest: parseFloat(totalInterest.toFixed(2)),
              balance: parseFloat(balance.toFixed(2)),
            });
          }
      }

      const totalPeriodicDeposits = parseFloat((periodicDeposit * periods).toFixed(2));
      const totalBalance = parseFloat((balance).toFixed(2));
  
      return { table, totalPeriods: periods, totalBalance, totalInterest, totalDeposits, initialAmmount, totalPeriodicDeposits, finalInterest };
  
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
      let newInterestRate = (interestRate / 100);
  
      if(periodFrequency === 'monthly'){
        newPeriods = periods * 12;
        newInterestRate = (interestRate / 100) / 12;
      }else if(periodFrequency === 'weekly'){
        newPeriods = periods * 52;
        newInterestRate = (interestRate / 100) / 52;
      }else if(periodFrequency === 'bi-weekly'){
        newPeriods = periods * 26;
        newInterestRate = (interestRate / 100) / 26;
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
      let maxAnualInterest = 100;
  
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
        return  this.compoundAnnuity(initialAmmount, periodicDeposit, finalInterest, periods, periodFrequency)
      }else{
        return this.compoundOrdinary(initialAmmount, periodicDeposit, finalInterest, periods, periodFrequency)
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
  
  
      if (periodFrequency === 'anual') {
  
        periodsToTime = `${years} años`;
  
      } else if (periodFrequency === 'monthly') {
  
        const totalMonths = years * 12 + remainingPeriods; // Convertir todo a meses
        const correctedYears = Math.floor(totalMonths / 12);
        const correctedMonths = totalMonths % 12;
  
        //Si hay meses restantes, se agrega años y meses
        if(correctedMonths > 0){
          periodsToTime = `${correctedYears} ${correctedYears > 1 ? 'años' : 'año'} y ${correctedMonths} ${correctedMonths > 1 ? 'meses' : 'mes'}`;
        }else{
          periodsToTime = `${correctedYears} ${correctedYears > 1 ? 'años' : 'año'}`;
        }
  
      } else if (periodFrequency === 'weekly') {
        
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
  
      } else if (periodFrequency === 'bi-weekly') {

        const totalWeeks = years * 52 + remainingPeriods * 2; // Total semanas considerando 2 semanas por período
        let correctedYears = Math.floor(totalWeeks / 52); // Años completos (52 semanas por año)
        const remainingWeeks = totalWeeks % 52; // Semanas restantes
    
        let correctedMonths = Math.floor(remainingWeeks / 4.33); // Convertir semanas a meses (~4.33 semanas por mes)
        const finalWeeks = Math.round(remainingWeeks % 4.33); // Semanas finales restantes
    
        // Ajustar si los meses exceden 12
        if (correctedMonths >= 12) {
            correctedYears += Math.floor(correctedMonths / 12);
            correctedMonths = correctedMonths % 12;
        }
    
        // Construcción del texto de salida
        if (correctedMonths > 0) {
            if (finalWeeks > 0) {
                periodsToTime = `${correctedYears} ${correctedYears > 1 ? 'años' : 'año'}, ${correctedMonths} ${correctedMonths > 1 ? 'meses' : 'mes'} y ${finalWeeks} ${finalWeeks > 1 ? 'semanas' : 'semana'}`;
            } else {
                periodsToTime = `${correctedYears} ${correctedYears > 1 ? 'años' : 'año'} y ${correctedMonths} ${correctedMonths > 1 ? 'meses' : 'mes'}`;
            }
        } else {
            if (finalWeeks > 0) {
                periodsToTime = `${correctedYears} ${correctedYears > 1 ? 'años' : 'año'} y ${finalWeeks} ${finalWeeks > 1 ? 'semanas' : 'semana'}`;
            } else {
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
const tableBody = document.querySelector('#result-table tbody');

calculatorType.addEventListener('change', (e)=>{
    calculatorForms.forEach(form => form.classList.add('hidden'));
    const selected = e.target.value;
    calculator.querySelector(`#${selected}-Form`).classList.remove('hidden');
    calculator.querySelector(`#${selected}-Form button[type="submit"]`).click();
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
        const calculator = new CompoundCalculator();
        const form = e.target.id;
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        switch(form){
          case 'save-Form':
              if(data.periodicMoment === 'begin'){
                const result = calculator.compoundAnnuity(
                  parseFloat(data.initialBalance.replaceAll(',', '.')), 
                  parseFloat(data.periodicDeposit.replaceAll(',', '.')), 
                  parseFloat(data.interestRate.replaceAll(',','.')), 
                  parseInt(data.periods), 
                  data.periodicType
                );
                createRoundedChart(result);
                createBarChart(result);
                fillTable(result);
                fillResults(form, result, data);
              }else{
                const result = calculator.compoundOrdinary(
                  parseFloat(data.initialBalance.replaceAll(',', '.')), 
                  parseFloat(data.periodicDeposit.replaceAll(',', '.')), 
                  parseFloat(data.interestRate.replaceAll(',','.')), 
                  parseInt(data.periods), 
                  data.periodicType
                );
                createRoundedChart(result);
                createBarChart(result);
                fillTable(result);
                fillResults(form, result, data);
              }
            break;

          case 'time-Form':
            if(data.periodicMoment === 'begin'){
              const result = calculator.timeToGetAmmount(
                parseFloat(data.initialBalance.replaceAll(',', '.')), 
                parseFloat(data.periodicDeposit.replaceAll(',', '.')), 
                parseFloat(data.interestRate.replaceAll(',','.')),
                parseFloat(data.saveGoal.replaceAll(',','.')),
                'annuity',
                data.periodicType
              );
              createRoundedChart(result);
              createBarChart(result);
              fillTable(result);
              fillResults(form, result, data);
            }else{
              const result = calculator.timeToGetAmmount(
                parseFloat(data.initialBalance.replaceAll(',', '.')), 
                parseFloat(data.periodicDeposit.replaceAll(',', '.')), 
                parseFloat(data.interestRate.replaceAll(',','.')),
                parseFloat(data.saveGoal.replaceAll(',','.')),
                'ordinary',
                data.periodicType
              );
              createRoundedChart(result);
              createBarChart(result);
              fillTable(result);
              fillResults(form, result, data);
            }
            break;

          case 'percentage-Form':
            if(data.periodicMoment === 'begin'){
              const result = calculator.interestToGetAmmount(
                parseFloat(data.initialBalance.replaceAll(',', '.')),
                parseFloat(data.periodicDeposit.replaceAll(',', '.')),
                parseFloat(data.saveGoal.replaceAll(',','.')),
                parseInt(data.periods),
                data.periodicType,
                'annuity'
              );
              createRoundedChart(result);
              createBarChart(result);
              fillTable(result);
              fillResults(form, result, data);
            }else{
              const result = calculator.interestToGetAmmount(
                parseFloat(data.initialBalance.replaceAll(',', '.')),
                parseFloat(data.periodicDeposit.replaceAll(',', '.')),
                parseFloat(data.saveGoal.replaceAll(',','.')),
                parseInt(data.periods),
                data.periodicType,
                'ordinary'
              );
              
              createRoundedChart(result);
              createBarChart(result);
              fillTable(result);
              fillResults(form, result, data);
            }
          break;

          case 'periodSave-Form':
            if(data.periodicMoment === 'begin'){
              const result = calculator.depositToGetAmmount(
                parseFloat(data.initialBalance.replaceAll(',', '.')),
                parseFloat(data.saveGoal.replaceAll(',','.')), 
                parseFloat(data.interestRate.replaceAll(',','.')),
                parseInt(data.periods),
                'annuity',
                data.periodicType
              );
              
              createRoundedChart(result);
              createBarChart(result);
              fillTable(result);
              fillResults(form, result, data);
            }else{
              const result = calculator.depositToGetAmmount(
                parseFloat(data.initialBalance.replaceAll(',', '.')),
                parseFloat(data.saveGoal.replaceAll(',','.')), 
                parseFloat(data.interestRate.replaceAll(',','.')),
                parseInt(data.periods),
                'ordinary',
                data.periodicType
              );
              createRoundedChart(result);
              createBarChart(result);
              fillTable(result);
              fillResults(form, result, data);
            }
          break;
        }
    }
}

function createRoundedChart(data){
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
            const formattedValue = params.value.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
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
            { value: data.initialAmmount, name: 'Balance Inicial', itemStyle: { color: '#8b5cf6'}, label:{show: false}, labelLine:{ show: false,  emphasis: { show: false }} },
            { value: data.totalPeriodicDeposits, name: 'Depósitos Periódicos', itemStyle: {color: '#2563eb'}, label:{show: false}, labelLine:{ show: false,  emphasis: { show: false }} },
            { value: data.totalInterest, name: 'Interés Total', itemStyle: {color: '#84cc16'}, label:{show: false}, labelLine:{ show: false,  emphasis: { show: false }} },
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

  resumeChart.setOption(circleChartOptions);
  window.addEventListener('resize', resumeChart.resize);
}

function createBarChart(data){
  
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
    series : (() => {
      const series = [];
      const initialBalance = {
        data: (()=>{ 
          const balanceData = [];
          for(let i = 0; i < data.table.length; i++){ balanceData.push(data.initialAmmount) }
          return balanceData;
        })(),
        type: 'bar',
        stack: 'a',
        name: 'Balance Inicial',
        color: '#8b5cf6',
        barCategoryGap: '10%'
      }
      
      const deposits = {
        data: (()=>{ 
          const depositsData = [];
          let totalDeposit = 0;
          for(let i = 0; i < data.table.length; i++){
            totalDeposit += data.table[i].deposits;
            depositsData.push(totalDeposit);
          }
          return depositsData;
        })(),
        type: 'bar',
        stack: 'a',
        name: 'Depósitos Periódicos',
        color: '#2563eb',
        barCategoryGap: '10%'
      }

      const interest = {
        data: (()=>{ 
          const interestData = [];
          data.table.forEach(element => interestData.push(element.interest))
          return interestData;
        })(),
        type: 'bar',
        stack: 'a',
        name: 'Interés Total',
        color: '#84cc16',
        barCategoryGap: '10%'
      }
      series.push(initialBalance, deposits, interest);
      return series;
    })(),
    xAxis: {
      type: 'category',
      data: (() =>{
        const category = [];
        for( let i = 0; i < data.table.length; i++){
          category.push(`${i + 1}`);
        }
        return category;
      })()
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
    },
    media: [
      {
        query: {
          maxWidth: 500 // Aplicar si el ancho es menor o igual a 500px.
        },
        option: {
          grid: {
            containLabel: false,
            left: 10,
            right: 10,
            top: 10,
            bottom: 40,
          },
          yAxis: {
            axisLabel:{
              show: false
            },
            splitLine: {
              show: false
            }
          }
        }
      },
    ]
  }

  barChart.setOption(barChartOptions);
  window.addEventListener('resize', barChart.resize);

};

function fillTable(data){
  tableBody.innerHTML = '';
  data.table.forEach(element => {
    tableBody.innerHTML += `
      <tr class="bg-white hover:bg-slate-50 border-b">
        <th scope="row" class="px-6 py-4 font-medium whitespace-nowrap">
          ${element.year}
        </th>
        <td class="px-6 py-4">
          ${element.deposits.toLocaleString('de-DE', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' })}
        </td>
        <td class="px-6 py-4">
            ${element.totalDeposits.toLocaleString('de-DE', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' })}
        </td>
        <td class="px-6 py-4">
            ${(Math.abs(element.interest)).toLocaleString('de-DE', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' })}
        </td>
        <td class="px-6 py-4">
            ${element.balance.toLocaleString('de-DE', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' })}
        </td>
      </tr>
    `
  });
}

function fillResults(formType, result, data){
  
  switch (formType) {
    case 'save-Form':

        document.querySelectorAll('[id$="-resultBox"]').forEach(element => element.classList.add('hidden'));
        
        
        if(data.periodicType === 'weekly'){
          document.querySelector(`#${formType}-periodic`).innerText = `${parseFloat(data.periodicDeposit.replaceAll(',', '.')).toLocaleString('de-DE', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' })} semanal`
        }else if(data.periodicType === 'monthly'){
          document.querySelector(`#${formType}-periodic`).innerText = `${parseFloat(data.periodicDeposit.replaceAll(',', '.')).toLocaleString('de-DE', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' })} mensual`
        }else if(data.periodicType === 'bi-weekly'){
          document.querySelector(`#${formType}-periodic`).innerText = `${parseFloat(data.periodicDeposit.replaceAll(',', '.')).toLocaleString('de-DE', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' })} bisemanal`
        }else{
          document.querySelector(`#${formType}-periodic`).innerText = `${parseFloat(data.periodicDeposit.replaceAll(',', '.')).toLocaleString('de-DE', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' })} anual`
        }

        document.querySelector(`#${formType}-result`).innerText = result.totalBalance.toLocaleString('de-DE', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' });
        document.querySelector(`#${formType}-period`).innerText = `${result.table.length} años`;
        document.querySelector(`#${formType}-initialBalance`).innerText = result.initialAmmount.toLocaleString('de-DE', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' });
        document.querySelector(`#${formType}-periodicTotal`).innerText = result.totalPeriodicDeposits.toLocaleString('de-DE', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' });
        document.querySelector(`#${formType}-interestTotal`).innerText = result.totalInterest.toLocaleString('de-DE', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' });

        document.querySelector(`#${formType}-resultBox`).classList.remove('hidden');

      break;

    case 'time-Form':

      document.querySelectorAll('[id$="-resultBox"]').forEach(element => element.classList.add('hidden'));

      if(data.periodicType === 'weekly'){
        document.querySelector(`#${formType}-periodic`).innerText = `${parseFloat(data.periodicDeposit.replaceAll(',', '.')).toLocaleString('de-DE', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' })} semanal`
      }else if(data.periodicType === 'monthly'){
        document.querySelector(`#${formType}-periodic`).innerText = `${parseFloat(data.periodicDeposit.replaceAll(',', '.')).toLocaleString('de-DE', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' })} mensual`
      }else if(data.periodicType === 'bi-weekly'){
        document.querySelector(`#${formType}-periodic`).innerText = `${parseFloat(data.periodicDeposit.replaceAll(',', '.')).toLocaleString('de-DE', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' })} bisemanal`
      }else{
        document.querySelector(`#${formType}-periodic`).innerText = `${parseFloat(data.periodicDeposit.replaceAll(',', '.')).toLocaleString('de-DE', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' })} anual`
      }

      document.querySelector(`#${formType}-result`).innerText = result.periodsToTime;
      document.querySelector(`#${formType}-goal`).innerText = parseFloat(data.saveGoal.replaceAll(',','.')).toLocaleString('de-DE', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' });
      document.querySelector(`#${formType}-initialBalance`).innerText = result.initialAmmount.toLocaleString('de-DE', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' });
      document.querySelector(`#${formType}-periodicTotal`).innerText = result.totalPeriodicDeposits.toLocaleString('de-DE', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' });
      document.querySelector(`#${formType}-interestTotal`).innerText = result.totalInterest.toLocaleString('de-DE', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' });

      document.querySelector(`#${formType}-resultBox`).classList.remove('hidden');

    break;

    case 'periodSave-Form':
      
    document.querySelectorAll('[id$="-resultBox"]').forEach(element => element.classList.add('hidden'));
    
    if(data.periodicType === 'weekly'){
      document.querySelector(`#${formType}-result`).innerHTML = `${(result.table[0].deposits / 52).toLocaleString('de-DE', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' })}<span class="text-base font-semibold"> /semana</span>`
    }else if(data.periodicType === 'monthly'){
      document.querySelector(`#${formType}-result`).innerHTML = `${(result.table[0].deposits / 12).toLocaleString('de-DE', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' })}<span class="text-base font-semibold"> /mes</span>`
    }else if(data.periodicType === 'bi-weekly'){
      document.querySelector(`#${formType}-result`).innerHTML = `${(result.table[0].deposits / 26).toLocaleString('de-DE', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' })}<span class="text-base font-semibold"> /bisemanal</span>`
    }else{
      document.querySelector(`#${formType}-result`).innerHTML = `${(result.table[0].deposits).toLocaleString('de-DE', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' })}<span class="text-base font-semibold"> /año</span>`
    }

    document.querySelector(`#${formType}-goal`).innerText = parseFloat(data.saveGoal.replaceAll(',','.')).toLocaleString('de-DE', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' });
    document.querySelector(`#${formType}-period`).innerText = `${result.table.length} años`;
    document.querySelector(`#${formType}-initialBalance`).innerText = result.initialAmmount.toLocaleString('de-DE', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' });
    document.querySelector(`#${formType}-periodicTotal`).innerText = result.totalPeriodicDeposits.toLocaleString('de-DE', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' });
    document.querySelector(`#${formType}-interestTotal`).innerText = result.totalInterest.toLocaleString('de-DE', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' });

    document.querySelector(`#${formType}-resultBox`).classList.remove('hidden');

    break;

    case 'percentage-Form':
      document.querySelectorAll('[id$="-resultBox"]').forEach(element => element.classList.add('hidden'));

      if(data.periodicType === 'weekly'){
        document.querySelector(`#${formType}-periodic`).innerText = `${parseFloat(data.periodicDeposit.replaceAll(',', '.')).toLocaleString('de-DE', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' })} semanal`
      }else if(data.periodicType === 'monthly'){
        document.querySelector(`#${formType}-periodic`).innerText = `${parseFloat(data.periodicDeposit.replaceAll(',', '.')).toLocaleString('de-DE', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' })} mensual`
      }else if(data.periodicType === 'bi-weekly'){
        document.querySelector(`#${formType}-periodic`).innerText = `${parseFloat(data.periodicDeposit.replaceAll(',', '.')).toLocaleString('de-DE', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' })} bisemanal`
      }else{
        document.querySelector(`#${formType}-periodic`).innerText = `${parseFloat(data.periodicDeposit.replaceAll(',', '.')).toLocaleString('de-DE', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' })} anual`
      }
    
      document.querySelector(`#${formType}-result`).innerText = `${result.finalInterest.toFixed(3)}%`;
      document.querySelector(`#${formType}-goal`).innerText = parseFloat(data.saveGoal.replaceAll(',','.')).toLocaleString('de-DE', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' });
      document.querySelector(`#${formType}-period`).innerText = `${result.table.length} años`;
      document.querySelector(`#${formType}-initialBalance`).innerText = result.initialAmmount.toLocaleString('de-DE', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' });
      document.querySelector(`#${formType}-interestTotal`).innerText = (Math.abs(result.totalInterest)).toLocaleString('de-DE', { maximumFractionDigits: 2, currency: 'EUR', style: 'currency' });

      document.querySelector(`#${formType}-resultBox`).classList.remove('hidden');
    break;
  }

}

document.addEventListener('DOMContentLoaded', ()=>{
  calculatorForms.forEach(form => {
    if(form.id === 'save-Form'){
      form.querySelector('button[type="submit"]').click();
    }
  })
})




