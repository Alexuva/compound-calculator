type CompoundTable = {
  year: number;
  deposits: string;
  totalDeposits: string;
  interest: string;
  totalInterest: string;
  balance: string;
}[];


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
    initialAmmount: number, 
    periodicDeposit: number, 
    interestRate: number, 
    futureAmmount: number, 
    periodType: 'annuity' | 'ordinary', 
    periodFrequency: 'year' | 'month' | 'week'
  ):{table: CompoundTable, totalPeriods: number, periodsToTime: string} {
    
    let periods:number = 0;
    let ammount:number = initialAmmount;
  
    // Ajustar tasa de interés y períodos por año según la frecuencia
    let adjustedInterestRate:number = interestRate;
    let periodsPerYear:number = 1;
  
    if (periodFrequency === 'month') {
      adjustedInterestRate = interestRate / 12;
      periodsPerYear = 12;
    } else if (periodFrequency === 'week') {
      adjustedInterestRate = interestRate / 52;
      periodsPerYear = 52;
    }
  
    let year:number = 0;
    let totalDeposits:number = 0;
    let interestEarned:number = 0;
  
    const table: CompoundTable = [];
  
    while (ammount < futureAmmount) {

      let depositsThisYear:number = 0;
      let interestThisYear:number = 0;
  
      for (let period:number = 0; period < periodsPerYear; period++) {

        if (ammount >= futureAmmount) break;
  
        // Depósito al inicio del período
        if (periodType === 'annuity') {        
          ammount += periodicDeposit;
          depositsThisYear += periodicDeposit;
          totalDeposits += periodicDeposit;
        }
  
        const interestThisPeriod:number = ammount * adjustedInterestRate;
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
    initialAmmount:number, 
    periodicDeposit:number, 
    interestRate:number, 
    periods:number, 
    periodFrequency:'year' | 'month' | 'week'
  ):{table: CompoundTable, totalPeriods: number, totalBalance: number} {

    const table:CompoundTable = []; // Para almacenar los datos por año
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
    initialAmmount:number, 
    periodicDeposit:number, 
    interestRate:number, 
    periods:number, 
    periodFrequency:'year'|'month'|'week'
  ){

    const table: CompoundTable = [];
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
    initialAmmount:number, 
    goalAmmount:number, 
    interestRate:number, 
    periods:number, 
    periodType:'annuity'|'ordinary', 
    periodFrequency:'year'|'month'|'week'
  ):{table: CompoundTable, totalPeriods: number, totalBalance: number} {

    let newPeriods:number = periods;
    let newInterestRate:number = interestRate;

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
    initialAmmount:number, 
    periodicDeposit:number, 
    goalAmmount:number, 
    periods:number, 
    periodFrequency:'year'|'month'|'week', 
    periodType:'annuity'|'ordinary',
    precision:number = 1e-6
  ){
    
    let minAnualInterest:number = 0;
    let maxAnualInterest:number = 10;

    while((maxAnualInterest - minAnualInterest) > precision){
      const midAnualInterest:number = (minAnualInterest + maxAnualInterest) / 2;

      if(periodType === 'annuity'){
        const futureAmmount:number = this.compoundAnnuity(initialAmmount, periodicDeposit, midAnualInterest, periods, periodFrequency).totalBalance;
        if(futureAmmount < goalAmmount){
          minAnualInterest = midAnualInterest;
        }else{
          maxAnualInterest = midAnualInterest;
        }
      }else{
        const futureAmmount:number = this.compoundOrdinary(initialAmmount, periodicDeposit, midAnualInterest, periods, periodFrequency).totalBalance;
        if(futureAmmount < goalAmmount){
          minAnualInterest = midAnualInterest;
        }else{
          maxAnualInterest = midAnualInterest;
        }
      }
    }

    const finalInterest:number = ((minAnualInterest + maxAnualInterest) / 2);

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
  conversionToTimeString(periods:number, periodsPerYear:number, periodFrequency:'year' | 'month' | 'week'): string {

    const years: number = Math.floor(periods / periodsPerYear); // Años completos
    const remainingPeriods: number = periods % periodsPerYear; // Períodos restantes
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