let notas = [
    {id:1, estudiante:"Ana López", asignatura:"Matemáticas", nota:4.5, fecha:"2026-02-01", obs:"Buen desempeño"},
    {id:2, estudiante:"Carlos Pérez", asignatura:"Programación", nota:3.8, fecha:"2026-02-02", obs:"Puede mejorar"},
    {id:3, estudiante:"Laura Gómez", asignatura:"Contabilidad", nota:4.2, fecha:"2026-02-03", obs:"Buen trabajo"},
    {id:4, estudiante:"Ana López", asignatura:"Programación", nota:4.9, fecha:"2026-02-05", obs:"Excelente"},
    {id:5, estudiante:"Carlos Pérez", asignatura:"Matemáticas", nota:2.9, fecha:"2026-02-06", obs:"Debe reforzar"}
];

let editId = null;

const tbody = document.getElementById("notasBody");
const form = document.getElementById("formNota");
const modal = new bootstrap.Modal(document.getElementById("notaModal"));

const overlay = document.getElementById("loadingOverlay");
const overlayMsg = document.getElementById("loadingMessage");

function mostrarCarga(msg){
    overlayMsg.textContent = msg;
    overlay.style.display = "flex";
}

function ocultarCarga(){
    overlay.style.display = "none";
}

function esperar(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

function generarId(){
    if(notas.length === 0) return 1;
    return Math.max(...notas.map(e => e.id)) + 1;
}

function render(){
    tbody.innerHTML = "";

    notas.forEach(n => {
        tbody.innerHTML += `
        <tr>
            <td>${n.id}</td>
            <td>${n.estudiante}</td>
            <td>${n.asignatura}</td>
            <td>${n.nota}</td>
            <td>${n.fecha}</td>
            <td>${n.obs}</td>
            <td>
                <button class="btn btn-warning btn-sm editar" data-id="${n.id}">Editar</button>
                <button class="btn btn-danger btn-sm eliminar" data-id="${n.id}">Eliminar</button>
            </td>
        </tr>
        `;
    });
}

form.addEventListener("submit", async function(e){
    e.preventDefault();

    const inputs = form.querySelectorAll("input, select");

    const nuevo = {
        estudiante: inputs[0].value,
        asignatura: inputs[1].value,
        nota: parseFloat(inputs[2].value),
        fecha: inputs[3].value,
        obs: inputs[4].value
    };

    if(nuevo.nota < 0 || nuevo.nota > 5){
        alert("La nota debe estar entre 0 y 5");
        return;
    }

    if(!nuevo.fecha){
        alert("La fecha es obligatoria");
        return;
    }

    mostrarCarga("Guardando...");
    await esperar(1000);

    if(editId){
        const index = notas.findIndex(e => e.id == editId);
        notas[index] = {id: editId, ...nuevo};
        editId = null;
    } else {
        nuevo.id = generarId();
        notas.push(nuevo);
    }

    render();
    form.reset();
    modal.hide();
    ocultarCarga();
});

tbody.addEventListener("click", async function(e){
    const btn = e.target.closest("button");
    if(!btn) return;

    const id = btn.dataset.id;

    if(btn.classList.contains("eliminar")){
        mostrarCarga("Eliminando...");
        await esperar(1000);

        notas = notas.filter(e => e.id != id);
        render();
        ocultarCarga();
    }

    if(btn.classList.contains("editar")){
        mostrarCarga("Cargando registro...");
        await esperar(800);

        const n = notas.find(e => e.id == id);
        const inputs = form.querySelectorAll("input, select");

        inputs[0].value = n.estudiante;
        inputs[1].value = n.asignatura;
        inputs[2].value = n.nota;
        inputs[3].value = n.fecha;
        inputs[4].value = n.obs;

        editId = id;
        ocultarCarga();
        modal.show();
    }
});

document.addEventListener("DOMContentLoaded", async () => {
    mostrarCarga("Cargando notas...");
    await esperar(1200);
    render();
    ocultarCarga();
});

