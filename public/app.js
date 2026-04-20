const API_URL = 'http://localhost:3000/api';
const AUTH_URL = 'http://localhost:3000/auth';
const playersBody = document.getElementById('players-body');
const playerForm = document.getElementById('player-form');
const apiLog = document.getElementById('api-log');
const refreshBtn = document.getElementById('refresh-btn');
const cancelBtn = document.getElementById('cancel-btn');
const submitBtn = document.getElementById('submit-btn');
const formTitle = document.getElementById('form-title');
const teamSelect = document.getElementById('team_id');
const authStatus = document.getElementById('auth-status');

// Pagination elements
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');
const pageInfo = document.getElementById('page-info');

let isEditing = false;
let teams = [];
let currentUser = JSON.parse(localStorage.getItem('user'));
let token = localStorage.getItem('token');
let currentPage = 1;
let totalPages = 1;

// --- Auth Handling ---

async function checkLoginStatus() {
    try {
        const response = await fetch(`${AUTH_URL}/me`, { credentials: 'include' });
        const data = await response.json();
        if (data.loggedIn) {
            currentUser = data.user;
            // No hay token JWT en session de Google, pero el servidor nos reconoce por cookie
        }
    } catch (err) { console.error('Error checking auth:', err); }
    updateAuthUI();
}

function updateAuthUI() {
    if (token || currentUser) {
        authStatus.innerHTML = `
            <div class="user-info">
                <span>Hola, <strong>${currentUser ? currentUser.name : 'Usuario'}</strong></span>
                <button onclick="logout()" class="secondary-btn sm">Salir</button>
            </div>
        `;
        document.querySelector('.form-section').style.opacity = '1';
        document.querySelector('.form-section').style.pointerEvents = 'all';
    } else {
        authStatus.innerHTML = `
            <a href="/auth.html" class="primary-btn sm">Iniciar Sesión</a>
        `;
        document.querySelector('.form-section').style.opacity = '0.5';
        document.querySelector('.form-section').style.pointerEvents = 'none';
    }
}

window.logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/auth/logout';
};

function getFetchOptions(method = 'GET', body = null) {
    const options = {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include' // IMPORTANTE: Para que Google/Cookies funcionen
    };
    if (token) options.headers['Authorization'] = `Bearer ${token}`;
    if (body) options.body = JSON.stringify(body);
    return options;
}

// --- API Functions ---

async function fetchTeams() {
    try {
        const response = await fetch(`${API_URL}/teams`, getFetchOptions());
        teams = await response.json();
        renderTeamSelect();
    } catch (error) { console.error('Error teams:', error); }
}

async function fetchPlayers(page = 1) {
    currentPage = page;
    const url = `${API_URL}/players?page=${page}&limit=5`;
    logRequest('GET', url);
    try {
        const response = await fetch(url, getFetchOptions());
        const result = await response.json();
        totalPages = result.pagination.totalPages;
        renderPlayers(result.data);
        updatePaginationUI(result.pagination);
    } catch (error) { console.error('Error players:', error); }
}

async function savePlayer(event) {
    event.preventDefault();
    const id = document.getElementById('player-id').value;
    const playerData = {
        name: document.getElementById('name').value,
        team_id: parseInt(document.getElementById('team_id').value),
        position: document.getElementById('position').value,
        number: parseInt(document.getElementById('number').value)
    };

    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `${API_URL}/players/${id}` : `${API_URL}/players`;

    logRequest(method, url);
    try {
        const response = await fetch(url, getFetchOptions(method, playerData));
        const data = await response.json();
        if (!response.ok) {
            alert(`Error: ${data.error}`);
            logRequest('ERROR', data.error);
            return;
        }
        resetForm();
        fetchPlayers(1);
    } catch (error) { console.error('Error saving:', error); }
}

async function deletePlayer(id) {
    if (!token && !currentUser) return alert('Inicia sesión');
    if (!confirm('¿Seguro?')) return;
    
    logRequest('DELETE', `${API_URL}/players/${id}`);
    try {
        const response = await fetch(`${API_URL}/players/${id}`, getFetchOptions('DELETE'));
        if (response.ok) fetchPlayers(currentPage);
        else {
            const data = await response.json();
            alert(data.error);
        }
    } catch (error) { console.error('Error deleting:', error); }
}

// --- UI Helpers ---

function renderTeamSelect() {
    teamSelect.innerHTML = '<option value="">Selecciona un equipo</option>';
    teams.forEach(team => {
        const option = document.createElement('option');
        option.value = team.id;
        option.textContent = `${team.name} (${team.city})`;
        teamSelect.appendChild(option);
    });
}

function renderPlayers(players) {
    playersBody.innerHTML = '';
    players.forEach(player => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><span class="player-name">${player.name}</span></td>
            <td>${player.position}</td>
            <td><span class="player-team">${player.team_name || 'N/A'}</span></td>
            <td>${player.number}</td>
            <td>
                <button class="action-btn" onclick='editPlayer(${JSON.stringify(player)})'>✏️</button>
                <button class="action-btn" onclick="deletePlayer(${player.id})">🗑️</button>
            </td>
        `;
        playersBody.appendChild(tr);
    });
}

function updatePaginationUI(pagination) {
    pageInfo.textContent = `Página ${pagination.page} de ${pagination.totalPages || 1}`;
    prevPageBtn.disabled = pagination.page <= 1;
    nextPageBtn.disabled = pagination.page >= pagination.totalPages;
}

window.editPlayer = function(player) {
    isEditing = true;
    formTitle.textContent = 'Editar Jugador';
    submitBtn.textContent = 'Actualizar Datos';
    cancelBtn.classList.remove('hidden');
    document.getElementById('player-id').value = player.id;
    document.getElementById('name').value = player.name;
    document.getElementById('team_id').value = player.team_id;
    document.getElementById('position').value = player.position;
    document.getElementById('number').value = player.number;
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

function resetForm() {
    isEditing = false;
    formTitle.textContent = 'Añadir Jugador';
    submitBtn.textContent = 'Guardar Jugador';
    cancelBtn.classList.add('hidden');
    playerForm.reset();
}

function logRequest(method, url) {
    if (apiLog.querySelector('.empty-log')) apiLog.innerHTML = '';
    const entry = document.createElement('div');
    entry.className = `log-entry ${method}`;
    entry.innerHTML = `<span class="log-time">[${new Date().toLocaleTimeString()}]</span> <span class="log-method">${method}</span> <span class="log-url">${url}</span>`;
    apiLog.prepend(entry);
}

// --- Events ---
playerForm.addEventListener('submit', savePlayer);
refreshBtn.addEventListener('click', () => fetchPlayers(currentPage));
cancelBtn.addEventListener('click', resetForm);
prevPageBtn.addEventListener('click', () => currentPage > 1 && fetchPlayers(currentPage - 1));
nextPageBtn.addEventListener('click', () => currentPage < totalPages && fetchPlayers(currentPage + 1));

// Initial Load
(async () => {
    await checkLoginStatus();
    await fetchTeams();
    await fetchPlayers(1);
})();
