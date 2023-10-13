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

let provincias = [
    {
        impuestosProvinciales: 0.02,
        nombreProvinciaEnString: "Buenos Aires"
    },
    {
        impuestosProvinciales: 0.055,
        nombreProvinciaEnString: "Chaco"
    },
    {
        impuestosProvinciales: 0.03,
        nombreProvinciaEnString: "Cordoba"
    },
    {
        impuestosProvinciales: 0.01,
        nombreProvinciaEnString: "La Pampa"
    },
    {
        impuestosProvinciales: 0.03,
        nombreProvinciaEnString: "Neuquen"
    },
    {
        impuestosProvinciales: 0.05,
        nombreProvinciaEnString: "Rio Negro"
    },
    {
        impuestosProvinciales: 0.036,
        nombreProvinciaEnString: "Salta"
    },
    {
        impuestosProvinciales: 0,
        nombreProvinciaEnString: "Tierra del Fuego"
    },
    {
        impuestosProvinciales: 0,
        nombreProvinciaEnString: "Ninguna de las anteriores"
    }
];

let divisas = [
    {
        tipoDivisa: "AR",
        multiplicador: 1
    },
    {
        tipoDivisa: "USD",
        multiplicador: 367
    },
    {
        tipoDivisa: "EUR",
        multiplicador: 349
    }
];

let provinciaSelect = document.getElementById("provinciaSeleccionada");
let inputMonto = document.getElementById("inputMonto");
let divisaSelect = document.getElementById("divisaSeleccionada");
let resetearTodoBoton = document.getElementById("resetearTodo");

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
    montoSinImpuestos = inputMonto.value * divisaObjeto.multiplicador;
    actualizarTablaTotal(montoSinImpuestos, provinciaObjecto);
});

divisaSelect.addEventListener("change", function () {
    divisaSeleccionada = divisaSelect.value;
    divisaObjeto = divisas.find(divisa => divisa.tipoDivisa === divisaSeleccionada);
    montoSinImpuestos = inputMonto.value * divisaObjeto.multiplicador;
    actualizarTablaTotal(montoSinImpuestos, provinciaObjecto);
});

resetearTodoBoton.addEventListener("click", resetearTodo);

function resetearTodo() {
    document.getElementById("inputMonto").value = 0;
    montoSinImpuestos = 0;
    actualizarTablaTotal(montoSinImpuestos, provinciaObjecto);
}

function actualizarTablaTotal(monto, provincia) {
    monto = parseFloat(monto);
    let totalImpuestos = calcularIva(monto, provincia) + calcularPercepcion(monto) + calcularImpuestoPais(monto) + calcularImpuestoProvincial(monto, provincia);
    totalImpuestos = parseFloat(totalImpuestos);

    let totalMasImpuestoHTML = document.getElementById("totalMasImpuestos");
    let montoSinImpuestosHTML = document.getElementById("montoSinImpuestos");
    let montoSoloImpuestosHTML = document.getElementById("montoSoloImpuestos");
    let montoIvaHTML = document.getElementById("montoIVA");
    let montoPercepcionHTML = document.getElementById("montoPercepcion");
    let montoImpuestoPaisHTML = document.getElementById("montoImpuestoPais");
    let montoProvincialesHTML = document.getElementById("montoProvinciales");

    if (divisaSeleccionada === "USD") {
        totalMasImpuestoHTML.innerHTML = `Total + impuestos: USD$${(monto + totalImpuestos).toFixed(2)}`;
    } else if (divisaSeleccionada === "AR") {
        totalMasImpuestoHTML.innerHTML = `Total + impuestos: AR$${(monto + totalImpuestos).toFixed(2)}`;
    } else {
        totalMasImpuestoHTML.innerHTML = `Total + impuestos: EUR$${(monto + totalImpuestos).toFixed(2)}`;
    }

    montoSinImpuestosHTML.innerHTML = `Monto de la compra: AR$${monto.toFixed(2)}`;
    montoSoloImpuestosHTML.innerHTML = `Monto de impuestos: AR$${totalImpuestos.toFixed(2)}`;
    
    if (provincia.nombreProvinciaEnString === "Tierra del Fuego") {
        montoIvaHTML.innerHTML = `IVA Servicios Digitales: AR$${(calcularIva(monto, provincia)).toFixed(2)} (0%)`;
    } else {
        montoIvaHTML.innerHTML = `IVA Servicios Digitales: AR$${(calcularIva(monto, provincia)).toFixed(2)} (21%)`;
    }
    
    montoPercepcionHTML.innerHTML = `Percepción RG AFIP 4815: AR$${(calcularPercepcion(monto)).toFixed(2)} (45%)`;
    montoImpuestoPaisHTML.innerHTML = `Ley impuesto PAIS: AR$${(calcularImpuestoPais(monto)).toFixed(2)} (8%)`;
    montoProvincialesHTML.innerHTML = `Impuestos provinciales para ${provincia.nombreProvinciaEnString}: AR$${(calcularImpuestoProvincial(monto, provincia)).toFixed(2)} (${(provincia.impuestosProvinciales * 100).toFixed(2)}%)`;
}

const calcularIva = function (monto, provincia) {
    if (provincia.nombreProvinciaEnString === "Tierra del Fuego") {
        return 0;
    } else {
        return monto * 0.21;
    }
};

const calcularPercepcion = monto => monto * 0.45;

const calcularImpuestoPais = monto => monto * 0.08;

const calcularImpuestoProvincial = (monto, provincia) => monto * provincia.impuestosProvinciales;

actualizarTablaTotal(montoSinImpuestos, provinciaObjecto);