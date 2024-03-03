class TaskManager extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="css/style.css">
        <div class="contenedor-padre">
             <h1 class="titulo">tareas</h1>
            <div class="contenedor-nombre">
                <h2 class="titulo">Ingrese nombre</h2>
                <input id="taskName" type="text" placeholder="Nombre de la tarea">
            </div>
            <div class="fechas">
                <div class="contenedor-fechaInicio">
                    <h2 class="titulo">Fecha Inicio</h2>
                    <input id="startDate" type="date" placeholder="Fecha de inicio">
                </div>
                <div class="contenedor-fechaFin">
                    <h2 class="titulo">Fecha Final</h2>
                    <input id="endDate" type="date" placeholder="Fecha de fin">
                </div>
            </div>
            <div class="contenedor-dificultad">
                <h2 class="titulo">Ingrese la Dificultad</h2>
                <input id="difficulty" type="text" placeholder="Dificultad">
            </div>
            <div class="contenedor-descripcion">
                <h1 class="titulo">Ingrese descripción</h1>
                <input id="taskDescription" type="text" placeholder="Descripción de la tarea">
            </div>
            <div class="contenedor-guardarTarea"><button id="addTask">Agregar tarea</button></div>
            <div class="contenedor-pendientes">
            <h2 class="titulo">tareas pendientes</h2>
            <ul id="tasks"></ul></div>
            <div class="tareas-contenedor">
                <div  class="contenedor-completadas">
                    <h2 class="titulo">Tareas completadas</h2>
                    <ul id="completedTasks"></ul>
                </div>
                <div class="contenedor-fallidas">
                    <h2 class="titulo">tareas fallidas</h2>
                    <ul id="failedTasks"></ul>
                </div>
            </div>
            <button id="deleteTasks">Borrar todas las tareas</button>
        </div>
        `;

        let taskData = JSON.parse(localStorage.getItem('taskData')) || { tasks: [] };

        taskData.tasks.forEach(task => {
            const li = document.createElement('li');
            li.textContent = `Descripción: ${task.description}, Fecha de inicio: ${task.startDate}, Fecha de fin: ${task.endDate}, Dificultad: ${task.difficulty}, Estado: ${task.status}`;

            if (task.status === 'Pendiente') {
                const completeButton = document.createElement('button');
                completeButton.textContent = 'Completada';
                completeButton.addEventListener('click', () => {
                    task.status = 'Completado';
                    localStorage.setItem('taskData', JSON.stringify(taskData));
                    li.textContent = `Descripción: ${task.description}, Fecha de inicio: ${task.startDate}, Fecha de fin: ${task.endDate}, Dificultad: ${task.difficulty}, Estado: ${task.status}`;
                    this.shadowRoot.querySelector('#completedTasks').appendChild(li);
                });
                const incompleteButton = document.createElement('button');
                incompleteButton.textContent = 'Incompleta';
                incompleteButton.addEventListener('click', () => {
                    task.status = 'Fallida';
                    localStorage.setItem('taskData', JSON.stringify(taskData));
                    li.textContent = `Descripción: ${task.description}, Fecha de inicio: ${task.startDate}, Fecha de fin: ${task.endDate}, Dificultad: ${task.difficulty}, Estado: ${task.status}`;
                    this.shadowRoot.querySelector('#failedTasks').appendChild(li);
                });
                li.appendChild(completeButton);
                li.appendChild(incompleteButton);
            }

        const currentDate = new Date();
        const endDate = new Date(task.endDate);
        if (endDate < currentDate) {
            task.status = 'Fallida';
            localStorage.setItem('taskData', JSON.stringify(taskData));
            li.textContent = `Descripción: ${task.description}, Fecha de inicio: ${task.startDate}, Fecha de fin: ${task.endDate}, Dificultad: ${task.difficulty}, Estado: ${task.status}`;
        }

        // Añade la tarea a la lista correspondiente según su estado
        if (task.status === 'Completado') {
            this.shadowRoot.querySelector('#completedTasks').appendChild(li);
        } else if (task.status === 'Fallida') {
            this.shadowRoot.querySelector('#failedTasks').appendChild(li);
        } else {
            this.shadowRoot.querySelector('#tasks').appendChild(li);
        }
    });
        this.shadowRoot.querySelector('#deleteTasks').addEventListener('click', () => {
            localStorage.removeItem('taskData');
            location.reload();
        });

        this.shadowRoot.querySelector('#addTask').addEventListener('click', () => {
            const taskName = this.shadowRoot.querySelector('#taskName').value;
            const taskDescription = this.shadowRoot.querySelector('#taskDescription').value;
            const startDate = this.shadowRoot.querySelector('#startDate').value;
            const endDate = this.shadowRoot.querySelector('#endDate').value;
            const difficulty = this.shadowRoot.querySelector('#difficulty').value;

            if (taskName && taskDescription && startDate && endDate && difficulty) {
                const newTask = {
                    name: taskName,
                    description: taskDescription,
                    startDate: startDate,
                    endDate: endDate,
                    difficulty: difficulty,
                    status: 'Pendiente'
                };
                taskData.tasks.push(newTask);
                localStorage.setItem('taskData', JSON.stringify(taskData));
                location.reload();
            }
        });

    }
}

customElements.define('task-manager', TaskManager);