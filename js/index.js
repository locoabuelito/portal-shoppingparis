
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

    let selectedState = false;

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

    pais.addEventListener('keyup', debounce(async (e) => {
        let searchTerm = e.target.value;
        if (searchTerm) {
            result_box.style.display = 'block';
            const matches = await buscarPaises(searchTerm);
            if (matches.length == 0) {
                alert(`${searchTerm} no pertenece a un Pais`)
                result_box.style.display = 'none';
                pais.value = '';
                selectedState = false;
            } else {
                displayBusquedaPais(matches);
                selectedState = true;
            }

        } else {
            result_box.innerHTML = '';
            selectedState = false;
            //result_box.style.display = 'none'
        }
    }, 200));

    estado.addEventListener('keyup', debounce (async (e) => {
        const searchState = e.target.value;
        let countryId = pais.getAttribute('data-id');
        if (searchState || countryId) {
            result_box_state.style.display = 'block';
            const matches = await buscarEstado(countryId, searchState); // Pasar el ID del país y el texto del estado
            if (matches.length == 0) {
                alert(`${searchState} no pertenece a un Estado de ${pais.value}`)
                estado.value = '';
                result_box_state.style.display = 'none'
                selectedState = false;
            } else {
                displayBusquedaEstado(matches);
                selectedState = true;
            }
        } else {
            result_box_state.innerHTML = '';
            selectedState = false;
        }
    },200))

    estado.addEventListener('blur', () => {
        setTimeout(() => {
            if (estado.value && !estado.getAttribute('data-id')) {
                alert(`${estado.value} no pertenece a un Estado válido.`);
                result_box_state.style.display = 'none';
                result_box_state.innerHTML = '';
                estado.value = ''; // Limpiar el campo si no es válido
            }
        }, 100);  // Retrasar la validación para permitir clics
    });


    ciudad.addEventListener('keyup', debounce (async (e) => {
        const estado = document.getElementById('estado');
        const searchCity = e.target.value;
        let StateId = estado.getAttribute('data-id')
        if (searchCity && StateId) {
            result_box_city.style.display = 'block';
            const matches = await buscarCiudad(StateId, searchCity);
            if (matches.length == 0) {
                result_box_city.style.display = 'none';
                alert(`${searchCity} no pertenece a una ciudad del estado de ${estado.value}`)
                ciudad.value = '';
                selectedState = false;
            } else {
                displayBusquedaCiudad(matches);
                selectedState = true;
            }
        } else {
            result_box_city.style.display = 'none';
            result_box_city.innerHTML = '';
            selectedState = false;
        }
    }, 200));

    ciudad.addEventListener('blur', () => {
        if (estado.value && !ciudad.getAttribute('data-id')) {
            setTimeout(() => {
                alert(`${estado.value} no pertenece a una ciudad del estado de ${estado.value}`)
                result_box_city.style.display = 'none';
                result_box_city.innerHTML = '';
                estado.value = ''; // Limpiar el campo si no es válido
            }, 200);
        }
    });
});



function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

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

function displayBusquedaEstado(params) {
    // const result_box_state = document.querySelector('.result-box-state')
    // const estado = document.getElementById('estado');
    
    // const contenido = params.map((list) => {
    //     return `<li onclick=selectEstado(this) data-id="${list.id}" data-name="${list.name}">${list.name}</li>`;
    // });
    // result_box_state.innerHTML = "<ul>" + contenido.join('') + "</ul>";
    const result_box_state = document.querySelector('.result-box-state');

    const contenido = params.map((list) => {
        return `<li data-id="${list.id}" data-name="${list.name}">${list.name}</li>`;
    }).join('');

    result_box_state.innerHTML = "<ul>" + contenido + "</ul>";

    // Asignar el evento de clic a cada <li>
    const items = result_box_state.querySelectorAll('li');
    items.forEach(item => {
        item.addEventListener('click', function () {
            selectEstado(this); // Llama a la función selectEstado con el elemento seleccionado
        });
    });
}

function selectEstado(list) {
    
    const result_box_state = document.querySelector('.result-box-state');
    const estado = document.getElementById('estado');

    const StateName = list.getAttribute('data-name');
    const StateId = list.getAttribute('data-id');

    // Asignar el nombre y el ID al input
    estado.value = StateName;
    estado.setAttribute('data-id', StateId);

    // Limpiar y ocultar el cuadro de resultados
    result_box_state.innerHTML = '';
    result_box_state.style.display = 'none';
    buscarCiudad(StateId, StateName)
}


async function buscarCiudad(state_id, city_name) {
    let matches = [];

    try {
        const response = await fetch('./assets/json/cities.json');

        if (!response.ok) {
            throw new Error('Error al obtener el archivo JSON');
        }
        const data = await response.json();
        const citiesArray = data.cities;

        const normalizedInput = city_name.toLowerCase();

        // Filtrar las ciudad  que coincidan con el id_state (Estado)
        matches = citiesArray.filter(state =>
            state.id_state === parseInt(state_id) && state.name.toLowerCase().includes(normalizedInput)
        );
        //console.log(matches)
        displayBusquedaCiudad(matches)

        return matches;

    } catch (error) {
        console.error('Error:', error); // Manejar errores
    }
}

function displayBusquedaCiudad(params) {
    const result_box_city = document.querySelector('.result-box-city')
    const contenido = params.map((list) => {
        return `<li data-id="${list.id}" data-name="${list.name}">${list.name}</li>`;
    }).join('');
    result_box_city.innerHTML = "<ul>" + contenido + "</ul>";

    // Asignar el evento de clic a cada <li>
    const items = result_box_city.querySelectorAll('li');
    items.forEach(item => {
        item.addEventListener('click', function () {
            selectCiudad(this); // Llama a la función selectEstado con el elemento seleccionado
        });
    });
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
}



