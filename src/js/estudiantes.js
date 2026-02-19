let estudiantes = [
    {id:1, nombre:"Ana López", documento:"1001", correo:"ana@mail.com", programa:"Ingeniería", estado:"Activo"},
    {id:2, nombre:"Carlos Pérez", documento:"1002", correo:"carlos@mail.com", programa:"ADSO", estado:"Activo"},
    {id:3, nombre:"Laura Gómez", documento:"1003", correo:"laura@mail.com", programa:"Contabilidad", estado:"Inactivo"},
    {id:4, nombre:"Juan Torres", documento:"1004", correo:"juan@mail.com", programa:"Diseño", estado:"Activo"},
    {id:5, nombre:"Sofía Rojas", documento:"1005", correo:"sofia@mail.com", programa:"Enfermería", estado:"Activo"}
];

let editId = null;

const tbody = document.getElementById("estudiantesBody");
const form = document.getElementById("formEstudiante");
const modal = new bootstrap.Modal(document.getElementById("estudianteModal"));

const overlay = document.getElementById("loadingOverlay");
const overlayMsg = document.getElementById("loadingMessage");

// ================= OVERLAY =================
function mostrarCarga(mensaje){
    overlayMsg.textContent = mensaje;
    overlay.style.display = "flex";
}

function ocultarCarga(){
    overlay.style.display = "none";
}

function esperar(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ================= ID INCREMENTAL =================
function generarId(){
    if(estudiantes.length === 0) return 1;
    return Math.max(...estudiantes.map(e => e.id)) + 1;
}

// ================= RENDER =================
function render(){
    tbody.innerHTML = "";

    estudiantes.forEach(est => {
        tbody.innerHTML += `
        <tr>
            <td>${est.id}</td>
            <td>${est.nombre}</td>
            <td>${est.documento}</td>
            <td>${est.correo}</td>
            <td>${est.programa}</td>
            <td>${est.estado}</td>
            <td>
                <button class="btn btn-warning btn-sm editar" data-id="${est.id}">Editar</button>
                <button class="btn btn-danger btn-sm eliminar" data-id="${est.id}">Eliminar</button>
            </td>
        </tr>
        `;
    });
}

// ================= SUBMIT =================
form.addEventListener("submit", async function(e){
    e.preventDefault();

    mostrarCarga("Guardando...");
    await esperar(1000);

    const inputs = form.querySelectorAll("input, select");

    const nuevo = {
        nombre: inputs[0].value,
        documento: inputs[1].value,
        correo: inputs[2].value,
        programa: inputs[3].value,
        estado: inputs[4].value
    };

    if(editId){
        const index = estudiantes.findIndex(e => e.id == editId);
        estudiantes[index] = {id: editId, ...nuevo};
        editId = null;
    } else {
        nuevo.id = generarId();
        estudiantes.push(nuevo);
    }

    render();
    form.reset();
    modal.hide();
    ocultarCarga();
});

// ================= DELEGACIÓN =================
tbody.addEventListener("click", async function(e){
    const btn = e.target.closest("button");
    if(!btn) return;

    const id = btn.dataset.id;

    if(btn.classList.contains("eliminar")){
        mostrarCarga("Eliminando...");
        await esperar(1000);

        estudiantes = estudiantes.filter(e => e.id != id);
        render();
        ocultarCarga();
    }

    if(btn.classList.contains("editar")){
        mostrarCarga("Cargando registro...");
        await esperar(800);

        const est = estudiantes.find(e => e.id == id);
        const inputs = form.querySelectorAll("input, select");

        inputs[0].value = est.nombre;
        inputs[1].value = est.documento;
        inputs[2].value = est.correo;
        inputs[3].value = est.programa;
        inputs[4].value = est.estado;

        editId = id;
        ocultarCarga();
        modal.show();
    }
});

// ================= CARGA INICIAL =================
document.addEventListener("DOMContentLoaded", async () => {
    mostrarCarga("Cargando estudiantes...");
    await esperar(1200);
    render();
    ocultarCarga();
});



