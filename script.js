
const numerador1 = document.getElementById("numerador1");
const denominador1 = document.getElementById("denominador1");

const numerador2 = document.getElementById("numerador2");
const denominador2 = document.getElementById("denominador2");

const operacion = document.getElementById("operacion");

const botonCalcular =
    document.getElementById("calcularFraccion");

const botonLimpiar =
    document.getElementById("limpiarFraccion");

const resultado =
    document.getElementById("resultadoFraccion");

const explicacion =
    document.getElementById("explicacionFraccion");

const procedimiento =
    document.getElementById("pasosOperacion");


/* =====================================================
   EVENTOS
===================================================== */

botonCalcular.addEventListener(
    "click",
    calcularFraccion
);

botonLimpiar.addEventListener(
    "click",
    limpiarCalculadora
);


/*
   También permite calcular presionando ENTER
*/

document.querySelectorAll(
    "#fracciones input"
).forEach(input => {

    input.addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Enter") {
                calcularFraccion();
            }

        }
    );

});


/* =====================================================
   FUNCIÓN PRINCIPAL
===================================================== */

function calcularFraccion() {

    const n1 = Number(numerador1.value);
    const d1 = Number(denominador1.value);

    const n2 = Number(numerador2.value);
    const d2 = Number(denominador2.value);

    const op = operacion.value;


    /* ================================================
       VALIDAR CAMPOS VACÍOS
    ================================================ */

    if (
        numerador1.value === "" ||
        denominador1.value === "" ||
        numerador2.value === "" ||
        denominador2.value === ""
    ) {

        mostrarError(
            "Completa todos los campos antes de calcular."
        );

        return;
    }


    /* ================================================
       VALIDAR DENOMINADORES
    ================================================ */

    if (d1 === 0 || d2 === 0) {

        mostrarError(
            "El denominador de una fracción no puede ser 0."
        );

        return;
    }


    /* ================================================
       VARIABLES DEL RESULTADO
    ================================================ */

    let numeradorResultado;
    let denominadorResultado;

    let pasos = "";


    /* ================================================
       SUMA
       a/b + c/d
       = (a × d + c × b) / (b × d)
    ================================================ */

    if (op === "+") {

        numeradorResultado =
            n1 * d2 + n2 * d1;

        denominadorResultado =
            d1 * d2;


        pasos = `

            <div class="procedure-step">

                <strong>
                    Paso 1 — Multiplicar en cruz
                </strong>

                <p>
                    ${n1} × ${d2}
                    +
                    ${n2} × ${d1}
                </p>

            </div>


            <div class="procedure-step">

                <strong>
                    Paso 2 — Resolver el numerador
                </strong>

                <p>
                    ${n1 * d2}
                    +
                    ${n2 * d1}
                    =
                    ${numeradorResultado}
                </p>

            </div>


            <div class="procedure-step">

                <strong>
                    Paso 3 — Multiplicar denominadores
                </strong>

                <p>
                    ${d1} × ${d2}
                    =
                    ${denominadorResultado}
                </p>

            </div>

        `;
    }


    /* ================================================
       RESTA
       a/b - c/d
       = (a × d - c × b) / (b × d)
    ================================================ */

    else if (op === "-") {

        numeradorResultado =
            n1 * d2 - n2 * d1;

        denominadorResultado =
            d1 * d2;


        pasos = `

            <div class="procedure-step">

                <strong>
                    Paso 1 — Multiplicar en cruz
                </strong>

                <p>
                    ${n1} × ${d2}
                    −
                    ${n2} × ${d1}
                </p>

            </div>


            <div class="procedure-step">

                <strong>
                    Paso 2 — Resolver el numerador
                </strong>

                <p>
                    ${n1 * d2}
                    −
                    ${n2 * d1}
                    =
                    ${numeradorResultado}
                </p>

            </div>


            <div class="procedure-step">

                <strong>
                    Paso 3 — Multiplicar denominadores
                </strong>

                <p>
                    ${d1} × ${d2}
                    =
                    ${denominadorResultado}
                </p>

            </div>

        `;
    }


    /* ================================================
       MULTIPLICACIÓN
       a/b × c/d
       = (a × c) / (b × d)
    ================================================ */

    else if (op === "*") {

        numeradorResultado =
            n1 * n2;

        denominadorResultado =
            d1 * d2;


        pasos = `

            <div class="procedure-step">

                <strong>
                    Paso 1 — Multiplicar numeradores
                </strong>

                <p>
                    ${n1} × ${n2}
                    =
                    ${numeradorResultado}
                </p>

            </div>


            <div class="procedure-step">

                <strong>
                    Paso 2 — Multiplicar denominadores
                </strong>

                <p>
                    ${d1} × ${d2}
                    =
                    ${denominadorResultado}
                </p>

            </div>

        `;
    }


    /* ================================================
       DIVISIÓN
       a/b ÷ c/d
       = a/b × d/c
       = (a × d) / (b × c)
    ================================================ */

    else if (op === "/") {


        /* ============================================
           NO SE PUEDE DIVIDIR ENTRE UNA FRACCIÓN
           CUYO NUMERADOR SEA 0
        ============================================ */

        if (n2 === 0) {

            mostrarError(
                "No se puede dividir entre una fracción cuyo numerador es 0."
            );

            return;
        }


        numeradorResultado =
            n1 * d2;

        denominadorResultado =
            d1 * n2;


        pasos = `

            <div class="procedure-step">

                <strong>
                    Paso 1 — Invertir la segunda fracción
                </strong>

                <p>
                    ${n2}/${d2}
                    →
                    ${d2}/${n2}
                </p>

            </div>


            <div class="procedure-step">

                <strong>
                    Paso 2 — Multiplicar numeradores
                </strong>

                <p>
                    ${n1} × ${d2}
                    =
                    ${numeradorResultado}
                </p>

            </div>


            <div class="procedure-step">

                <strong>
                    Paso 3 — Multiplicar denominadores
                </strong>

                <p>
                    ${d1} × ${n2}
                    =
                    ${denominadorResultado}
                </p>

            </div>

        `;
    }


    /* ================================================
       GUARDAR RESULTADO ORIGINAL
    ================================================ */

    const numeradorOriginal =
        numeradorResultado;

    const denominadorOriginal =
        denominadorResultado;


    /* ================================================
       SIMPLIFICAR FRACCIÓN
    ================================================ */

    const divisor =
        maximoComunDivisor(
            Math.abs(numeradorResultado),
            Math.abs(denominadorResultado)
        );


    numeradorResultado =
        numeradorResultado / divisor;

    denominadorResultado =
        denominadorResultado / divisor;


    /* ================================================
       CORREGIR SIGNO
    ================================================ */

    if (denominadorResultado < 0) {

        numeradorResultado *= -1;

        denominadorResultado *= -1;

    }


    /* ================================================
       MOSTRAR RESULTADO
    ================================================ */

    if (denominadorResultado === 1) {

        resultado.innerHTML = `

            <span class="integer-result">
                ${numeradorResultado}
            </span>

        `;

    }

    else {

        resultado.innerHTML = `

            <div class="final-fraction">

                <span>
                    ${numeradorResultado}
                </span>

                <div></div>

                <span>
                    ${denominadorResultado}
                </span>

            </div>

        `;
    }


    /* ================================================
       OBTENER SÍMBOLO
    ================================================ */

    let simbolo;

    if (op === "+") {
        simbolo = "+";
    }

    else if (op === "-") {
        simbolo = "−";
    }

    else if (op === "*") {
        simbolo = "×";
    }

    else if (op === "/") {
        simbolo = "÷";
    }


    /* ================================================
       MOSTRAR EXPLICACIÓN
    ================================================ */

    explicacion.textContent =
        `${n1}/${d1} ${simbolo} ${n2}/${d2} = ${formatearFraccion(
            numeradorResultado,
            denominadorResultado
        )}`;


    /* ================================================
       AGREGAR SIMPLIFICACIÓN
    ================================================ */

    let simplificacion = "";


    if (
        numeradorOriginal !== numeradorResultado ||
        denominadorOriginal !== denominadorResultado
    ) {

        simplificacion = `

            <div class="procedure-step">

                <strong>
                    Paso 4 — Simplificar
                </strong>

                <p>
                    ${numeradorOriginal}/${denominadorOriginal}
                    →
                    ${numeradorResultado}/${denominadorResultado}
                </p>

            </div>

        `;

    }


    /* ================================================
       RESULTADO FINAL DEL PROCEDIMIENTO
    ================================================ */

    procedimiento.innerHTML =

        pasos +

        simplificacion +

        `

        <div class="procedure-step final-step">

            <strong>
                Resultado final
            </strong>

            <p>
                ${formatearFraccion(
                    numeradorResultado,
                    denominadorResultado
                )}
            </p>

        </div>

        `;


    /* ================================================
       ANIMACIÓN
    ================================================ */

    resultado.style.transform =
        "scale(1.08)";

    setTimeout(() => {

        resultado.style.transform =
            "scale(1)";

    }, 250);

}


/* =====================================================
   MÁXIMO COMÚN DIVISOR
===================================================== */

function maximoComunDivisor(a, b) {

    while (b !== 0) {

        const temporal = b;

        b = a % b;

        a = temporal;

    }

    return a;
}


/* =====================================================
   FORMATEAR FRACCIÓN
===================================================== */

function formatearFraccion(
    numerador,
    denominador
) {

    if (denominador === 1) {

        return `${numerador}`;

    }

    return `${numerador}/${denominador}`;
}


/* =====================================================
   MOSTRAR ERROR
===================================================== */

function mostrarError(mensaje) {

    resultado.innerHTML = `

        <span
            style="
                color:#ff5c70;
                font-size:25px;
                font-weight:bold;
            "
        >
            Error
        </span>

    `;


    explicacion.textContent =
        mensaje;


    procedimiento.innerHTML = `

        <div class="procedure-error">

            ${mensaje}

        </div>

    `;

}


/* =====================================================
   LIMPIAR CALCULADORA
===================================================== */

function limpiarCalculadora() {

    numerador1.value = "";

    denominador1.value = "";

    numerador2.value = "";

    denominador2.value = "";

    operacion.value = "+";


    resultado.innerHTML = "—";


    explicacion.textContent =
        "Introduce las fracciones para comenzar.";


    procedimiento.innerHTML =
        "Aquí aparecerá el procedimiento de la operación.";

}


