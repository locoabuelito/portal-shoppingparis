document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('policyModal');
    const checkbox = document.getElementById('check-policy');
    const acceptBtn = document.getElementById('accept-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const paisSelect = document.getElementById('pais');
    const estadoSelect = document.getElementById('estado');
    const ciudadSelect = document.getElementById('ciudad');
    
    const paisNameInput = document.getElementById('pais_name');
    const estadoNameInput = document.getElementById('estado_name');
    const ciudadNameInput = document.getElementById('ciudad_name');

    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            modal.style.display = 'block';
        } else {
            button.style.display = 'none';
        }
    });

    acceptBtn.addEventListener('click', () => {
        modal.style.display = 'none';

        if (checkbox.checked) {
            button.style.display = 'block';
        } else {
            button.style.display = 'none';
        }
    });

    cancelBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        checkbox.checked = false;

        if (!checkbox.checked) {
            button.style.display = 'none';
        }
    });

    async function loadPaises() {
        try {
            const response = await fetch('./assets/json/countries.json');
            const data = await response.json();
            populateSelect(paisSelect, data.countries, 'id', 'name');
        } catch (error) {
            console.error('Error al cargar países:', error);
        }
    }

    async function loadEstados(paisId) {
        try {
            const response = await fetch('./assets/json/states.json');
            const data = await response.json();
            const states = data.states.filter(state => state.id_country === parseInt(paisId));
            populateSelect(estadoSelect, states, 'id', 'name');
            estadoNameInput.value = ''; // Resetear nombre del estado
            ciudadNameInput.value = ''; // Resetear nombre de la ciudad
        } catch (error) {
            console.error('Error al cargar estados:', error);
        }
    }

    async function loadCiudades(estadoId) {
        try {
            const response = await fetch('./assets/json/cities.json');
            const data = await response.json();
            const cities = data.cities.filter(city => city.id_state === parseInt(estadoId));
            populateSelect(ciudadSelect, cities, 'id', 'name');
            ciudadNameInput.value = ''; // Resetear nombre de la ciudad
        } catch (error) {
            console.error('Error al cargar ciudades:', error);
        }
    }

    function populateSelect(selectElement, data, valueKey, textKey) {    
        selectElement.innerHTML = `<option value="">Seleccionar ${selectElement.dataset.label}</option>`;
        data.forEach(item => {
            const option = document.createElement('option');
            option.value = item[valueKey];
            option.textContent = item[textKey];
            selectElement.appendChild(option);
        });
    }

    paisSelect.addEventListener('change', (event) => {
        const paisId = event.target.value;
        const paisName = event.target.options[event.target.selectedIndex].text;
        paisNameInput.value = paisName;
        
        if (paisId) {
            loadEstados(paisId);
        } else {
            estadoSelect.innerHTML = '<option value="">Seleccionar Estado</option>';
            ciudadSelect.innerHTML = '<option value="">Seleccionar Ciudad</option>';
        }
    });

    estadoSelect.addEventListener('change', (event) => {
        const estadoId = event.target.value;
        const estadoName = event.target.options[event.target.selectedIndex].text;
        estadoNameInput.value = estadoName;
        if (estadoId) {
            loadCiudades(estadoId);
        } else {
            ciudadSelect.innerHTML = '<option value="">Seleccionar Ciudad</option>';
        }
    });

    ciudadSelect.addEventListener('change', (event) => {
        const ciudadName = event.target.options[event.target.selectedIndex].text;
        ciudadNameInput.value = ciudadName;
    });

    loadPaises();
});
