// Referencias de la interfaz HTML
const inputCloud = document.getElementById('costoCloud');
const inputEspera = document.getElementById('costoEspera');
const lblC1 = document.getElementById('lblC1');
const lblC2 = document.getElementById('lblC2');
const optimoXHTML = document.getElementById('optimoX');
const costoMinimoHTML = document.getElementById('costoMinimo');

let costChart = null; // Variable para almacenar la instancia del gráfico

// Función principal que calcula la optimización mediante derivadas
function calcularOptimizacion() {
    // 1. Obtener los valores de los inputs
    const c1 = parseFloat(inputCloud.value) || 1;
    const c2 = parseFloat(inputEspera.value) || 1;

    // Actualizar etiquetas visuales de la fórmula matemática
    lblC1.textContent = c1;
    lblC2.textContent = c2;

    /* Explicación Matemática:
       C(x) = c1 * x + c2 / x
       C'(x) = c1 - c2 / x^2 = 0 
       c1 = c2 / x^2  =>  x^2 = c2 / c1
       x = sqrt(c2 / c1)  [Tomamos solo el valor positivo]
    */
    const xOptimo = Math.sqrt(c2 / c1);
    // Redondeamos para visualización práctica de pruebas reales (entero más cercano)
    const xOptimoRedondeado = Math.round(xOptimo); 
    
    // Calcular el costo mínimo real con la variable óptima analítica
    const costoMinimo = (c1 * xOptimo) + (c2 / xOptimo);

    // 2. Imprimir resultados numéricos en el HTML
    optimoXHTML.textContent = xOptimoRedondeado;
    costoMinimoHTML.textContent = costoMinimo.toFixed(2);

    // 3. Generar los datos para graficar la curva C(x)
    const labels = [];
    const dataCostos = [];
    
    // Graficamos un rango de x desde 1 hasta el doble del óptimo (mínimo hasta 10) para ver la curva clara
    const maxGrafica = Math.max(xOptimoRedondeado * 2, 12);

    for (let x = 1; x <= maxGrafica; x++) {
        labels.push(`x=${x}`);
        let costoTotal = (c1 * x) + (c2 / x);
        dataCostos.push(costoTotal.toFixed(2));
    }

    // 4. Renderizar o actualizar la gráfica con Chart.js
    actualizarGrafica(labels, dataCostos, xOptimoRedondeado, c1, c2);
}

function actualizarGrafica(labels, data, xOptimo, c1, c2) {
    const ctx = document.getElementById('costChart').getContext('2d');

    // Si ya existe un gráfico previo, lo destruimos para que no se superponga
    if (costChart) {
        costChart.destroy();
    }

    // Crear configuración del nuevo gráfico
    costChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Costo Operativo Total C(x)',
                data: data,
                borderColor: '#2980b9',
                backgroundColor: 'rgba(41, 128, 185, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.3, // Curvatura suave de la línea
                pointBackgroundColor: data.map((val, idx) => (idx + 1) === xOptimo ? '#27ae60' : '#2980b9'),
                pointRadius: data.map((val, idx) => (idx + 1) === xOptimo ? 8 : 4),
                pointHoverRadius: data.map((val, idx) => (idx + 1) === xOptimo ? 10 : 6),
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: true, position: 'top' },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return ` Costo Total: S/. ${context.parsed.y}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    title: { display: true, text: 'Costo en Soles (S/.)' }
                },
                x: {
                    title: { display: true, text: 'Pruebas Simultáneas (Paralelismo)' }
                }
            }
        }
    });
}

// Escuchar eventos para recalcular inmediatamente si el usuario cambia datos
inputCloud.addEventListener('input', calcularOptimizacion);
inputEspera.addEventListener('input', calcularOptimizacion);

// Ejecución inicial al cargar la página por primera vez
window.addEventListener('DOMContentLoaded', calcularOptimizacion);