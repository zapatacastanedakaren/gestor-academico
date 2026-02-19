let asignaturas = [
    {id:1, codigo:"MAT101", nombre:"Matemáticas", creditos:3, docente:"Carlos Ruiz", estado:"Activa"},
    {id:2, codigo:"PRO201", nombre:"Programación", creditos:4, docente:"Ana Torres", estado:"Activa"},
    {id:3, codigo:"CON102", nombre:"Contabilidad", creditos:2, docente:"Luis Pérez", estado:"Activa"},
    {id:4, codigo:"DIS301", nombre:"Diseño Gráfico", creditos:3, docente:"María López", estado:"Inactiva"},
    {id:5, codigo:"ADM110", nombre:"Administración", creditos:2, docente:"Jorge Díaz", estado:"Activa"}
];

let editId = null;

const tbody = document.getElementById("asignaturasBody");
const form = document.getElementById("formAsignatura");
const modal = new bootstrap.Modal(document.getElementById("asignaturaModal"));

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
    if(asignaturas.length === 0) return 1;
    return Math.max(...asignaturas.map(e => e.id)) + 1;
}

function render(){
    tbody.innerHTML = "";

    asignaturas.forEach(asi => {
        tbody.innerHTML += `
        <tr>
            <td>${asi.id}</td>
            <td>${asi.codigo}</td>
            <td>${asi.nombre}</td>
            <td>${asi.creditos}</td>
            <td>${asi.docente}</td>
            <td>${asi.estado}</td>
            <td>
                <button class="btn btn-warning btn-sm editar" data-id="${asi.id}">Editar</button>
                <button class="btn btn-danger btn-sm eliminar" data-id="${asi.id}">Eliminar</button>
            </td>
        </tr>
        `;
    });
}

form.addEventListener("submit", async function(e){
    e.preventDefault();

    const inputs = form.querySelectorAll("input, select");

    const nuevo = {
        codigo: inputs[0].value,
        nombre: inputs[1].value,
        creditos: parseInt(inputs[2].value),
        docente: inputs[3].value,
        estado: inputs[4].value
    };

    if(nuevo.creditos < 1){
        alert("Los créditos deben ser mínimo 1");
        return;
    }

    mostrarCarga("Guardando...");
    await esperar(1000);

    if(editId){
        const index = asignaturas.findIndex(e => e.id == editId);
        asignaturas[index] = {id: editId, ...nuevo};
        editId = null;
    } else {
        nuevo.id = generarId();
        asignaturas.push(nuevo);
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

        asignaturas = asignaturas.filter(e => e.id != id);
        render();
        ocultarCarga();
    }

    if(btn.classList.contains("editar")){
        mostrarCarga("Cargando registro...");
        await esperar(800);

        const asi = asignaturas.find(e => e.id == id);
        const inputs = form.querySelectorAll("input, select");

        inputs[0].value = asi.codigo;
        inputs[1].value = asi.nombre;
        inputs[2].value = asi.creditos;
        inputs[3].value = asi.docente;
        inputs[4].value = asi.estado;

        editId = id;
        ocultarCarga();
        modal.show();
    }
});

document.addEventListener("DOMContentLoaded", async () => {
    mostrarCarga("Cargando asignaturas...");
    await esperar(1200);
    render();
    ocultarCarga();
});

