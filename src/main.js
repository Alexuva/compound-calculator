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

calculatorForms.forEach(form => form.addEventListener('change', handleInput));

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
            e.target.parentElement.parentElement.querySelector(".error").innerText = "Campo requerido";
            e.target.setAttribute('valid', 'false');
        } else {
            if (floatRegex.test(e.target.value)) {
                e.target.parentElement.parentElement.querySelector(".error").innerText = "";
                e.target.classList.remove('error-input');
                e.target.setAttribute('valid', 'true');
            } else {
                e.target.parentElement.parentElement.querySelector(".error").innerText = "La cantidad introducida no es válida";
                e.target.classList.add('error-input');
                e.target.setAttribute('valid', 'false');
            }
        }

    }else if(percentage.includes(inputName)){
        
        const min = parseFloat(e.target.min.replaceAll(',','.'));
        const max = parseFloat(e.target.max.replaceAll(',','.'));

        if (e.target.value.length <= 0) {
            e.target.classList.add('error-input');
            e.target.parentElement.parentElement.querySelector(".error").innerText = "Campo requerido";
            e.target.setAttribute('valid', 'false');
        }else{
            if (floatRegex.test(e.target.value)){
                e.target.parentElement.parentElement.querySelector(".error").innerText = "";
                e.target.classList.remove('error-input');
                e.target.setAttribute('valid', 'true');
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
                }
            }else{
                e.target.parentElement.parentElement.querySelector(".error").innerText = "La cantidad introducida no es válida";
                e.target.classList.add('error-input');
                e.target.setAttribute('valid', 'false');
            }
        }

    }else if(number.includes(inputName)){

        const min = parseInt(e.target.min);
        const max = parseInt(e.target.max);

        if(e.target.value.length <= 0){
            e.target.classList.add('error-input');
            e.target.parentElement.parentElement.querySelector(".error").innerText = "Campo requerido";
            e.target.setAttribute('valid', 'false');
        }else{

            if (intRegex.test(e.target.value)){
                e.target.parentElement.parentElement.querySelector(".error").innerText = "";
                e.target.classList.remove('error-input');
                e.target.setAttribute('valid', 'true');
                const value = parseInt(e.target.value.replaceAll(',','.'));
                if(value <= min){
                    e.target.value = min
                    if(value < min){
                        e.target.parentElement.parentElement.querySelector(".error").innerText = `El mínimo es ${min} año(s)`;
                    }
                }else if(value >= max){
                    e.target.value = max
                    if(value > max){
                        e.target.parentElement.parentElement.querySelector(".error").innerText = `El máximo es ${max} año(s)`;
                    }
                }
            }else{
                e.target.parentElement.parentElement.querySelector(".error").innerText = "La cantidad introducida no es válida";
                e.target.classList.add('error-input');
                e.target.setAttribute('valid', 'false');
            }

        }

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
        data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13','14', '15', '16', '17']
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


