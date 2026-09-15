/* =====================================================
   CALCULADORA DE FRACCIONES
===================================================== */

const numerador1 = document.getElementById("numerador1");
const denominador1 = document.getElementById("denominador1");
const numerador2 = document.getElementById("numerador2");
const denominador2 = document.getElementById("denominador2");
const operacionSelect = document.getElementById("operacion");
const botonCalcular = document.getElementById("calcularFraccion");
const botonLimpiar = document.getElementById("limpiarFraccion");
const resultadoFraccion = document.getElementById("resultadoFraccion");
const explicacionFraccion = document.getElementById("explicacionFraccion");
const pasosOperacion = document.getElementById("pasosOperacion");

function mcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
        [a, b] = [b, a % b];
    }
    return a || 1;
}

function simplificar(num, den) {
    if (den === 0) return null;
    const divisor = mcd(num, den);
    return { num: num / divisor, den: den / divisor };
}

function mostrarFraccion(num, den) {
    if (den === 1) {
        return `<div class="integer-result">${num}</div>`;
    }
    return `
        <div class="final-fraction">
            <span>${num}</span>
            <div></div>
            <span>${den}</span>
        </div>
    `;
}

botonCalcular.addEventListener("click", calcularFraccion);

function calcularFraccion() {

    const n1 = Number(numerador1.value);
    const d1 = Number(denominador1.value);
    const n2 = Number(numerador2.value);
    const d2 = Number(denominador2.value);

    if (numerador1.value === "" || denominador1.value === "" ||
        numerador2.value === "" || denominador2.value === "") {
        mostrarError("Por favor, completa todos los campos.");
        return;
    }

    if (d1 === 0 || d2 === 0) {
        mostrarError("Los denominadores no pueden ser 0.");
        return;
    }

    const op = operacionSelect.value;
    let numResultado, denResultado;

    switch (op) {
        case "+":
            numResultado = n1 * d2 + n2 * d1;
            denResultado = d1 * d2;
            break;
        case "-":
            numResultado = n1 * d2 - n2 * d1;
            denResultado = d1 * d2;
            break;
        case "*":
            numResultado = n1 * n2;
            denResultado = d1 * d2;
            break;
        case "/":
            if (n2 === 0) {
                mostrarError("No se puede dividir entre 0.");
                return;
            }
            numResultado = n1 * d2;
            denResultado = d1 * n2;
            break;
    }

    const simplificado = simplificar(numResultado, denResultado);

    if (!simplificado) {
        mostrarError("Resultado no válido.");
        return;
    }

    resultadoFraccion.innerHTML = mostrarFraccion(simplificado.num, simplificado.den);
    explicacionFraccion.textContent = `El resultado simplificado es: ${simplificado.num} / ${simplificado.den}`;

    mostrarProcedimiento(n1, d1, n2, d2, op, numResultado, denResultado, simplificado);

    resultadoFraccion.style.transform = "scale(1.08)";
    setTimeout(() => resultadoFraccion.style.transform = "scale(1)", 250);

}

function mostrarError(mensaje) {
    resultadoFraccion.innerHTML = `<div class="integer-result" style="color:#ff5c70;">!</div>`;
    explicacionFraccion.textContent = mensaje;
    pasosOperacion.innerHTML = `<div class="procedure-error">${mensaje}</div>`;
}

function mostrarProcedimiento(n1, d1, n2, d2, op, numResultado, denResultado, simplificado) {

    const simbolo = {
        "+": "+",
        "-": "−",
        "*": "×",
        "/": "÷"
    }[op];

    const pasos = [];

    pasos.push(`
        <div class="procedure-step">
            <strong>Paso 1 — Identificar los términos</strong>
            <p>${n1}/${d1} ${simbolo} ${n2}/${d2}</p>
        </div>
    `);

    if (op === "+" || op === "-") {

        pasos.push(`
            <div class="procedure-step">
                <strong>Paso 2 — Buscar común denominador</strong>
                <p>Común denominador: ${d1} × ${d2} = ${d1 * d2}</p>
            </div>
        `);

        const n1Ajustado = n1 * d2;
        const n2Ajustado = n2 * d1;

        pasos.push(`
            <div class="procedure-step">
                <strong>Paso 3 — Ajustar numeradores</strong>
                <p>${n1} × ${d2} = ${n1Ajustado} | ${n2} × ${d1} = ${n2Ajustado}</p>
            </div>
        `);

        pasos.push(`
            <div class="procedure-step">
                <strong>Paso 4 — Operar numeradores</strong>
                <p>${n1Ajustado} ${simbolo} ${n2Ajustado} = ${numResultado}</p>
            </div>
        `);

    } else if (op === "*") {

        pasos.push(`
            <div class="procedure-step">
                <strong>Paso 2 — Multiplicar numeradores</strong>
                <p>${n1} × ${n2} = ${numResultado}</p>
            </div>
        `);

        pasos.push(`
            <div class="procedure-step">
                <strong>Paso 3 — Multiplicar denominadores</strong>
                <p>${d1} × ${d2} = ${denResultado}</p>
            </div>
        `);

    } else if (op === "/") {

        pasos.push(`
            <div class="procedure-step">
                <strong>Paso 2 — Invertir la segunda fracción</strong>
                <p>${n2}/${d2} → ${d2}/${n2}</p>
            </div>
        `);

        pasos.push(`
            <div class="procedure-step">
                <strong>Paso 3 — Multiplicar en cruz</strong>
                <p>${n1} × ${d2} = ${numResultado} | ${d1} × ${n2} = ${denResultado}</p>
            </div>
        `);

    }

    if (simplificado.num !== numResultado || simplificado.den !== denResultado) {
        pasos.push(`
            <div class="procedure-step">
                <strong>Paso 5 — Simplificar</strong>
                <p>${numResultado}/${denResultado} → ${simplificado.num}/${simplificado.den}</p>
            </div>
        `);
    }

    pasos.push(`
        <div class="procedure-step final-step">
            <strong>Resultado final</strong>
            <p>${simplificado.num} / ${simplificado.den}</p>
        </div>
    `);

    pasosOperacion.innerHTML = pasos.join("");

}

botonLimpiar.addEventListener("click", limpiarFraccion);

function limpiarFraccion() {
    numerador1.value = "";
    denominador1.value = "";
    numerador2.value = "";
    denominador2.value = "";
    resultadoFraccion.innerHTML = "—";
    explicacionFraccion.textContent = "Introduce las fracciones para comenzar.";
    pasosOperacion.innerHTML = "Aquí aparecerá el procedimiento de la operación.";
}


/* =====================================================
   RETO MATEMÁTICO
===================================================== */

const challengeEquation = document.getElementById("challengeEquation");
const challengeOptions = document.getElementById("challengeOptions");
const challengeNext = document.getElementById("challengeNext");

let challengeIndex = 0;
let challengeAnswered = false;

const retos = [
    { ecuacion: "2x + 6 = 16", opciones: ["4", "5", "6"], respuesta: "5" },
    { ecuacion: "3x − 7 = 20", opciones: ["7", "8", "9"], respuesta: "9" },
    { ecuacion: "x/4 + 3 = 10", opciones: ["24", "28", "32"], respuesta: "28" },
    { ecuacion: "5x + 2 = 47", opciones: ["7", "8", "9"], respuesta: "9" },
    { ecuacion: "2(x + 3) = 18", opciones: ["5", "6", "7"], respuesta: "6" }
];

function cargarReto() {

    const reto = retos[challengeIndex];

    challengeEquation.textContent = reto.ecuacion;
    challengeOptions.innerHTML = "";
    challengeAnswered = false;
    challengeNext.style.display = "none";

    const barajadas = [...reto.opciones].sort(() => Math.random() - 0.5);

    barajadas.forEach(opcion => {

        const boton = document.createElement("button");
        boton.className = "challenge-option";
        boton.textContent = opcion;

        boton.addEventListener("click", () => comprobarReto(opcion, boton));

        challengeOptions.appendChild(boton);

    });

}

function comprobarReto(opcionElegida, boton) {

    if (challengeAnswered) return;

    challengeAnswered = true;

    const reto = retos[challengeIndex];

    if (opcionElegida === reto.respuesta) {

        boton.classList.add("correct");
        alert("✅ ¡Correcto! Muy bien.");

    } else {

        boton.classList.add("wrong");
        alert(`❌ Incorrecto. La respuesta era ${reto.respuesta}.`);

    }

    challengeNext.style.display = "inline-block";

}

challengeNext.addEventListener("click", () => {

    challengeIndex++;

    if (challengeIndex >= retos.length) {

        alert("🏁 ¡Completaste todos los retos!");
        challengeIndex = 0;

    }

    cargarReto();

});

cargarReto();


/* =====================================================
   ÁREA Y PERÍMETRO
===================================================== */

const figureButtons = document.querySelectorAll(".figure-btn");
const geoInputs = document.getElementById("geoInputs");
const geoTitle = document.getElementById("geoTitle");
const geoIcon = document.querySelector(".geo-calculator .calculator-icon");

const botonCalcularGeo = document.getElementById("calcularGeo");
const botonLimpiarGeo = document.getElementById("limpiarGeo");
const resultadoGeo = document.getElementById("resultadoGeo");
const explicacionGeo = document.getElementById("explicacionGeo");

const iconosFiguras = {
    cuadrado: "▢",
    rectangulo: "▭",
    triangulo: "△",
    circulo: "◯"
};

const titulosFiguras = {
    cuadrado: "Área y perímetro del cuadrado",
    rectangulo: "Área y perímetro del rectángulo",
    triangulo: "Área y perímetro del triángulo",
    circulo: "Área y perímetro del círculo"
};

let figuraActual = "cuadrado";

figureButtons.forEach(boton => {

    boton.addEventListener("click", () => {

        figureButtons.forEach(b => b.classList.remove("active"));
        boton.classList.add("active");

        figuraActual = boton.dataset.figure;

        geoInputs.querySelectorAll(".geo-field").forEach(campo => {
            campo.style.display =
                (campo.dataset.field === figuraActual) ? "block" : "none";
        });

        geoTitle.textContent = titulosFiguras[figuraActual];
        geoIcon.textContent = iconosFiguras[figuraActual];

        limpiarGeo();

    });

});

botonCalcularGeo.addEventListener("click", calcularGeo);

geoInputs.querySelectorAll("input").forEach(input => {
    input.addEventListener("keydown", event => {
        if (event.key === "Enter") calcularGeo();
    });
});

function calcularGeo() {

    let area = null;
    let perimetro = null;

    if (figuraActual === "cuadrado") {

        const a = Number(document.getElementById("ladoCuadrado").value);

        if (document.getElementById("ladoCuadrado").value === "" || a <= 0) {
            return mostrarErrorGeo("Ingresa un lado válido mayor que 0.");
        }

        area = a * a;
        perimetro = 4 * a;

        mostrarResultadoGeo(area, perimetro);

    }

    else if (figuraActual === "rectangulo") {

        const b = Number(document.getElementById("baseRectangulo").value);
        const h = Number(document.getElementById("alturaRectangulo").value);

        if (document.getElementById("baseRectangulo").value === "" ||
            document.getElementById("alturaRectangulo").value === "" ||
            b <= 0 || h <= 0) {
            return mostrarErrorGeo("Ingresa base y altura mayores que 0.");
        }

        area = b * h;
        perimetro = 2 * (b + h);

        mostrarResultadoGeo(area, perimetro);

    }

    else if (figuraActual === "triangulo") {

        const b = Number(document.getElementById("baseTriangulo").value);
        const h = Number(document.getElementById("alturaTriangulo").value);
        const l1 = Number(document.getElementById("lado1Triangulo").value);
        const l2 = Number(document.getElementById("lado2Triangulo").value);
        const l3 = Number(document.getElementById("lado3Triangulo").value);

        if (document.getElementById("baseTriangulo").value === "" ||
            document.getElementById("alturaTriangulo").value === "" ||
            document.getElementById("lado1Triangulo").value === "" ||
            document.getElementById("lado2Triangulo").value === "" ||
            document.getElementById("lado3Triangulo").value === "" ||
            b <= 0 || h <= 0 || l1 <= 0 || l2 <= 0 || l3 <= 0) {
            return mostrarErrorGeo("Ingresa todos los valores, todos mayores que 0.");
        }

        area = (b * h) / 2;
        perimetro = l1 + l2 + l3;

        mostrarResultadoGeo(area, perimetro);

    }

    else if (figuraActual === "circulo") {

        const r = Number(document.getElementById("radioCirculo").value);

        if (document.getElementById("radioCirculo").value === "" || r <= 0) {
            return mostrarErrorGeo("Ingresa un radio válido mayor que 0.");
        }

        area = Math.PI * r * r;
        perimetro = 2 * Math.PI * r;

        mostrarResultadoGeo(area, perimetro);

    }

}

function mostrarResultadoGeo(area, perimetro) {

    const redondear = valor => Math.round(valor * 100) / 100;

    resultadoGeo.innerHTML = `
        <span>Área</span>
        ${redondear(area)}
        <span>Perímetro</span>
        ${redondear(perimetro)}
    `;

    explicacionGeo.textContent =
        `Área: ${redondear(area)} | Perímetro: ${redondear(perimetro)}`;

    resultadoGeo.style.transform = "scale(1.08)";
    setTimeout(() => resultadoGeo.style.transform = "scale(1)", 250);

}

function mostrarErrorGeo(mensaje) {

    resultadoGeo.innerHTML = `
        <span style="color:#ff5c70; font-size:25px; font-weight:bold;">
            Error
        </span>
    `;

    explicacionGeo.textContent = mensaje;

}

function limpiarGeo() {

    geoInputs.querySelectorAll("input").forEach(input => input.value = "");
    resultadoGeo.innerHTML = "—";
    explicacionGeo.textContent = "Elige una figura e ingresa sus medidas.";

}

botonLimpiarGeo.addEventListener("click", limpiarGeo);
