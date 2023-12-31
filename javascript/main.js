/* 
ingresar un monto en $ar y calcular a valor tarjeta de pago al exterior
a tener en cuenta:
* imprimir valor normal
* imprimir valor de impuestos total
* imprimir total (impuestos+valor normal)
* imprimir una lista con los distintos impuestos
    + IVA Servicios Digitales(21%)
    + Percepción RG AFIP 4815(45%)
    + Ley impuesto PAIS(8%)
    + Impuestos provinciales (varían según la provincia)
*/

class Divisa {
    constructor(tipoDivisa, valor) {
        this.tipoDivisa = tipoDivisa;
        this.valor = valor;
    }

    actualizarValor(valor) {
        this.valor = valor;
    }
}

const divisas = [
    new Divisa("AR", 1),
    new Divisa("USD", 1),
    new Divisa("EUR", 1),
    new Divisa("BRL", 1)
];

let dolarHoy;
let euroHoy;
let realBrasilenoHoy;

const urlDolar = "https://dolarapi.com/v1/dolares/oficial"
const urlEuro = "https://dolarapi.com/v1/cotizaciones/eur"
const urlRealBrasileno = "https://dolarapi.com/v1/cotizaciones/brl"

async function obtenerDatos() {
    try {
        const responseDolar = await fetch(urlDolar);
        if (!responseDolar.ok) {
            throw new Error('Error en la solicitud del Dólar');
        }
        const dataDolar = await responseDolar.json();
        dolarHoy = dataDolar.venta;
        divisas[1].actualizarValor(dolarHoy);

        const responseEuro = await fetch(urlEuro);
        if (!responseEuro.ok) {
            throw Error('Error en la solicitud de Euro');
        }
        const dataEuro = await responseEuro.json();
        euroHoy = dataEuro.venta;
        divisas[2].actualizarValor(euroHoy);

        const responseReal = await fetch(urlRealBrasileno);
        if (!responseReal.ok) {
            throw new Error('Error en la solicitud de Real Brasileño');
        }
        const dataReal = await responseReal.json();
        realBrasilenoHoy = dataReal.venta;
        divisas[3].actualizarValor(realBrasilenoHoy);
    } catch (error) {
        if (error.message === 'Error en la solicitud de Dólar') {
            Swal.fire({
                title: '¡Error en la solicitud del Dólar!',
                text: 'La API de Dólar se encuentra fuera de servicio o ha ocurrido un error en la solicitud. Los datos del Dólar pueden no ser certeros.',
                icon: 'error',
                iconColor: '#00FFFF',
                confirmButtonText: 'OK',
            });
        } else if (error.message === 'Error en la solicitud de Euro') {
            Swal.fire({
                title: '¡Error en la solicitud de Euro!',
                text: 'La API de Euro se encuentra fuera de servicio o ha ocurrido un error en la solicitud. Los datos del Euro pueden no ser certeros.',
                icon: 'error',
                iconColor: '#00FFFF',
                confirmButtonText: 'OK',
            });
        } else if (error.message === 'Error en la solicitud de Real Brasileño') {
            Swal.fire({
                title: '¡Error en la solicitud de Real Brasileño!',
                text: 'La API de Real Brasileño se encuentra fuera de servicio o ha ocurrido un error en la solicitud. Los datos del Real Brasileño pueden no ser certeros.',
                icon: 'error',
                iconColor: '#00FFFF',
                confirmButtonText: 'OK',
            });
        }
    }
}

obtenerDatos();

class Provincia {
    constructor(nombreProvinciaEnString, impuestosProvinciales) {
        this.nombreProvinciaEnString = nombreProvinciaEnString;
        this.impuestosProvinciales = impuestosProvinciales;
    }
}

const provincias = [
    new Provincia("Buenos Aires", 0.02),
    new Provincia("Chaco", 0.055),
    new Provincia("Cordoba", 0.03),
    new Provincia("La Pampa", 0.01),
    new Provincia("Neuquen", 0.03),
    new Provincia("Rio Negro", 0.05),
    new Provincia("Salta", 0.036),
    new Provincia("Tierra del Fuego", 0),
    new Provincia("Ninguna de las anteriores", 0)
];

let configuracionUsuario = {
    provincia: '',
    divisa: ''
};

let provinciaSelect = document.getElementById("provinciaSeleccionada");
let inputMonto = document.getElementById("inputMonto");
let divisaSelect = document.getElementById("divisaSeleccionada");
let resetearTodoBoton = document.getElementById("botonResetearTodo");
let guardarConfiguracionBoton = document.getElementById("botonGuardarConfiguracion");

let provinciaSeleccionada = provinciaSelect.value;
let montoSinImpuestos = inputMonto.value;
let divisaSeleccionada = divisaSelect.value;

let provinciaObjecto = provincias.find(provincia => provincia.nombreProvinciaEnString === provinciaSeleccionada);
let divisaObjeto = divisas.find(divisa => divisa.tipoDivisa === divisaSeleccionada);

provinciaSelect.addEventListener("change", function () {
    provinciaSeleccionada = provinciaSelect.value;
    provinciaObjecto = provincias.find(provincia => provincia.nombreProvinciaEnString === provinciaSeleccionada);
    actualizarTablaTotal(montoSinImpuestos, provinciaObjecto);
});

inputMonto.addEventListener("input", function () {
    montoSinImpuestos = inputMonto.value * divisaObjeto.valor;
    actualizarTablaTotal(montoSinImpuestos, provinciaObjecto); // Mover esta línea aquí
});

divisaSelect.addEventListener("change", function () {
    divisaSeleccionada = divisaSelect.value;
    divisaObjeto = divisas.find(divisa => divisa.tipoDivisa === divisaSeleccionada);
    montoSinImpuestos = inputMonto.value * divisaObjeto.valor;
    actualizarTablaTotal(montoSinImpuestos, provinciaObjecto);
});

guardarConfiguracionBoton.addEventListener("click", function () {
    configuracionUsuario.provincia = provinciaSeleccionada;
    configuracionUsuario.divisa = divisaSeleccionada;
    const configuracionJSON = JSON.stringify(configuracionUsuario);
    localStorage.setItem('configuracionUsuario', configuracionJSON);

    Swal.fire({
        title: 'Genial!',
        text: 'Se guardo correctamente la configuracion.',
        icon: 'success',
        iconColor: '#00FFFF',
        confirmButtonText: 'BIEN',
    })
});

window.addEventListener('load', function () {
    const configuracionGuardada = localStorage.getItem('configuracionUsuario');
    if (configuracionGuardada) {
        configuracionUsuario = JSON.parse(configuracionGuardada);
        provinciaSeleccionada = configuracionUsuario.provincia;
        divisaSeleccionada = configuracionUsuario.divisa;
        provinciaSelect.value = provinciaSeleccionada;
        divisaSelect.value = divisaSeleccionada;

        provinciaObjecto = provincias.find(provincia => provincia.nombreProvinciaEnString === provinciaSeleccionada);
        divisaObjeto = divisas.find(divisa => divisa.tipoDivisa === divisaSeleccionada);

        montoSinImpuestos = inputMonto.value * divisaObjeto.valor;
        actualizarTablaTotal(montoSinImpuestos, provinciaObjecto);
    }
});

resetearTodoBoton.addEventListener("click", resetearTodo);

function resetearTodo() {
    document.getElementById("inputMonto").value = 0;
    montoSinImpuestos = 0;
    actualizarTablaTotal(montoSinImpuestos, provinciaObjecto);
}

function actualizarTablaTotal(monto, provincia) {
    monto = parseFloat(monto);
    let totalImpuestos = /* calcularIva(monto, provincia) +*/ calcularPercepcion4815(monto) + calcularImpuestoPais(monto) + calcularImpuestoProvincial(monto, provincia) /* + calcularPercepcion5272(monto) */;
    totalImpuestos = parseFloat(totalImpuestos);

    let totalMasImpuestoHTML = document.getElementById("totalMasImpuestos");
    let montoSinImpuestosHTML = document.getElementById("montoSinImpuestos");
    let montoSoloImpuestosHTML = document.getElementById("montoSoloImpuestos");
    /* let montoIvaHTML = document.getElementById("montoIVA"); */
    let montoPercepcion4815HTML = document.getElementById("montoPercepcion4815");
    /* let montoPercepcion5272HTML = document.getElementById("montoPercepcion5272"); */
    let montoImpuestoPaisHTML = document.getElementById("montoImpuestoPais");
    let montoProvincialesHTML = document.getElementById("montoProvinciales");

    totalMasImpuestoHTML.innerHTML = `Total + impuestos: AR$${(monto + totalImpuestos).toFixed(2)}`;

    montoSinImpuestosHTML.innerHTML = `Monto de la compra: AR$${monto.toFixed(2)}`;
    montoSoloImpuestosHTML.innerHTML = `Monto de impuestos: AR$${totalImpuestos.toFixed(2)}`;

    /* if (provincia.nombreProvinciaEnString === "Tierra del Fuego") {
        montoIvaHTML.innerHTML = `IVA Servicios Digitales: AR$${(calcularIva(monto, provincia)).toFixed(2)} (0%)`;
    } else {
        montoIvaHTML.innerHTML = `IVA Servicios Digitales: AR$${(calcularIva(monto, provincia)).toFixed(2)} (21%)`;
    } */

    montoPercepcion4815HTML.innerHTML = `Percepción RG AFIP 4815: AR$${(calcularPercepcion4815(monto)).toFixed(2)} (30%)`;
    /* montoPercepcion5272HTML.innerHTML = `Percepcion RG AFIP 5272: AR$${(calcularPercepcion5272(monto).toFixed(2))} (25%)`; */
    montoImpuestoPaisHTML.innerHTML = `Ley impuesto PAIS: AR$${(calcularImpuestoPais(monto)).toFixed(2)} (30%)`;
    montoProvincialesHTML.innerHTML = `Impuestos provinciales para ${provincia.nombreProvinciaEnString}: AR$${(calcularImpuestoProvincial(monto, provincia)).toFixed(2)} (${(provincia.impuestosProvinciales * 100).toFixed(2)}%)`;
}

/* const calcularIva = function (monto, provincia) {
    if (provincia.nombreProvinciaEnString === "Tierra del Fuego") {
        return 0;
    } else {
        return monto * 0.21;
    }
};
*/
const calcularPercepcion4815 = monto => monto * 0.30;

/* const calcularPercepcion5272 = monto => monto * 0.25; */

const calcularImpuestoPais = monto => monto * 0.30;

const calcularImpuestoProvincial = (monto, provincia) => monto * provincia.impuestosProvinciales;



actualizarTablaTotal(montoSinImpuestos, provinciaObjecto);