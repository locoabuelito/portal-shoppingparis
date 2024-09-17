
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('policyModal');
    const checkbox = document.getElementById('check-policy');
    const acceptBtn = document.getElementById('accept-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const result_box = document.querySelector('.result-box');
    const result_box_state = document.querySelector('.result-box-state');
    const result_box_city = document.querySelector('.result-box-city');

    result_box.style.display = 'none'
    result_box_state.style.display = 'none'
    result_box_city.style.display = 'none'

    const pais = document.getElementById('pais');
    const estado = document.getElementById('estado');
    const ciudad = document.getElementById('ciudad');

    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            modal.style.display = 'block';
        } else {
            button.style.display = 'none';
        }
    });

    // Button actions
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

    pais.addEventListener('keyup', async (e) => {
        let searchTerm = e.target.value;
        if (searchTerm) {
            result_box.style.display = 'block';
            const matches = await buscarPaises(searchTerm);
            if (matches.length == 0) {
                alert(`El ${searchTerm} no pertenece a un Pais`)
                pais.value = '';
            } else {
                displayBusquedaPais(matches);
            }

        } else {
            result_box.innerHTML = '';
            //result_box.style.display = 'none'
        }
    });

    estado.addEventListener('keyup', async (e) => {
        const searchState = e.target.value;
        let countryId = pais.getAttribute('data-id');
        if (searchState || countryId) {
            result_box_state.style.display = 'block';
            const matches = await buscarEstado(countryId, searchState); // Pasar el ID del país y el texto del estado
            if (matches.length == 0) {
                alert(`El ${searchState} no pertenece a un Estado`)
                estado.value = '';
            } else {
                displayBusquedaEstado(matches);
            }
        } else {
            result_box_state.innerHTML = '';
        }
    })

    ciudad.addEventListener('keyup', async (e) => {
        const estado = document.getElementById('estado');
        const searchCity = e.target.value;
        let StateId = estado.getAttribute('data-id')
        if (searchCity || StateId) {
            result_box_city.style.display = 'block';
            const matches = await buscarCiudad(StateId, searchCity);
            if (matches.length == 0) {
                result_box_city.style.display = 'none';
                alert(`${searchCity} no pertenece a una ciudad del Estado seleccionado`)
                ciudad.value = '';
            } else {
                displayBusquedaCiudad(matches);
            }
        } else {
            result_box_city.style.display = 'none';
            result_box_city.innerHTML = '';
        }
    })
});

async function buscarPaises(pais) {

    let matches = [];

    try {
        const response = await fetch('./assets/json/countries.json');

        if (!response.ok) {
            throw new Error('Error al obtener el archivo JSON');
        }
        const data = await response.json();
        const countriesArray = data.countries;

        // Normalizar la entrada del usuario
        const normalizedInput = pais.toLowerCase();

        // Buscar coincidencias parciales
        matches = countriesArray.filter(country =>
            country.name.toLowerCase().includes(normalizedInput)
        );
        return matches; // Devolver una lista de coincidencias

    } catch (error) {
        console.error('Error:', error); // Manejar errores
    }
}

async function buscarEstado(country_id, state_name) {
    let matches = [];

    try {
        const response = await fetch('./assets/json/states.json');

        if (!response.ok) {
            throw new Error('Error al obtener el archivo JSON');
        }
        const data = await response.json();
        const stateArray = data.states;

        // Filtrar los estados que coincidan con el id_country (Pais)
        matches = stateArray.filter(state =>
            state.id_country === parseInt(country_id) && state.name.toLowerCase().includes(state_name.toLowerCase())
        );
        displayBusquedaEstado(matches)
        return matches;

    } catch (error) {
        console.error('Error:', error); // Manejar errores
    }
}

async function buscarCiudad(state_id, state_name) {
    let matches = [];

    try {
        const response = await fetch('./assets/json/cities.json');

        if (!response.ok) {
            throw new Error('Error al obtener el archivo JSON');
        }
        const data = await response.json();
        const citiesArray = data.cities;

        const normalizedInput = state_name.toLowerCase();

        // Filtrar las ciudad  que coincidan con el id_state (Estado)
        matches = citiesArray.filter(state =>
            state.id_state === parseInt(state_id) && state.name.toLowerCase().includes(normalizedInput)
        );

        displayBusquedaCiudad(matches)

        return matches;

    } catch (error) {
        console.error('Error:', error); // Manejar errores
    }
}

function displayBusquedaPais(params) {
    const pais = document.getElementById('pais');
    const result_box = document.querySelector('.result-box')
    const contenido = params.map((list) => {
        if (list.name == pais.value) {
            return pais.setAttribute('data-id', list.id);
        } else {
            return `<li onclick=selectPais(this) data-id="${list.id}" data-name="${list.name}">${list.name}</li>`;
        }
    });

    result_box.innerHTML = "<ul>" + contenido.join('') + "</ul>";
}

function selectPais(list) {
    const result_box = document.querySelector('.result-box')
    const pais = document.getElementById('pais');

    // Capturar el name y el id del país seleccionado
    const countryName = list.getAttribute('data-name');
    const countryId = list.getAttribute('data-id');
    pais.value = list.innerHTML;
    pais.setAttribute('data-id', countryId);
    result_box.innerHTML = '';
    buscarEstado(countryId, countryName)
}

function displayBusquedaEstado(params) {
    const result_box_state = document.querySelector('.result-box-state')
    const estado = document.getElementById('estado');
    const contenido = params.map((list) => {
        if (list.name == estado.value) {
            return estado.setAttribute('data-id', list.id);
        } else {
            return `<li onclick=selectEstado(this) data-id="${list.id}" data-name="${list.name}">${list.name}</li>`;
        }

    });
    result_box_state.innerHTML = "<ul>" + contenido.join('') + "</ul>";
}

function selectEstado(list) {
    const result_box_state = document.querySelector('.result-box-state')
    const estado = document.getElementById('estado');

    const StateName = list.getAttribute('data-name');
    const StateId = list.getAttribute('data-id');

    estado.value = list.innerHTML;

    estado.setAttribute('data-id', StateId)

    result_box_state.innerHTML = '';
    result_box_state.style.display = 'none';
    buscarCiudad(StateId, StateName)
}

function selectCiudad(list) {
    const result_box_city = document.querySelector('.result-box-city')
    const ciudad = document.getElementById('ciudad');

    const CityName = list.getAttribute('data-name');
    const CityId = list.getAttribute('data-id');

    ciudad.value = CityName;

    ciudad.setAttribute('data-id', CityId)

    result_box_city.innerHTML = '';
    result_box_city.style.display = 'none'
    buscarCiudad(CityId, CityName)
}

function displayBusquedaCiudad(params) {
    const ciudad = document.getElementById('ciudad');
    const result_box_city = document.querySelector('.result-box-city')
    const contenido = params.map((list) => {
        if (list.name == ciudad.value) {
            return ciudad.setAttribute('data-id', list.id);
        } else {
            return `<li onclick=selectCiudad(this) data-id="${list.id}" data-name="${list.name}">${list.name}</li>`;
        }

    });
    result_box_city.innerHTML = "<ul>" + contenido.join('') + "</ul>";
}


