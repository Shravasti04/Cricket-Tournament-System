// Helper function to handle form submission
async function submitForm(formId, endpoint) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        try {
            const response = await fetch(`/api/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            const alertBox = document.getElementById('alertMessage');
            
            if (response.ok) {
                alertBox.className = 'alert success';
                alertBox.textContent = result.message || 'Operation successful!';
                form.reset();
            } else {
                alertBox.className = 'alert error';
                alertBox.textContent = result.error || 'Something went wrong.';
            }
        } catch (error) {
            const alertBox = document.getElementById('alertMessage');
            alertBox.className = 'alert error';
            alertBox.textContent = 'Network error occurred.';
        }
    });
}

// Helper to populate select dropdowns
async function populateSelect(endpoint, selectId, valueField, textField) {
    const select = document.getElementById(selectId);
    if (!select) return;

    try {
        const response = await fetch(`/api/${endpoint}`);
        const data = await response.json();
        
        data.forEach(item => {
            const option = document.createElement('option');
            option.value = item[valueField];
            
            // Handle nested objects (like team_name in team_id)
            if (textField.includes('.')) {
                const fields = textField.split('.');
                option.textContent = item[fields[0]][fields[1]];
            } else {
                option.textContent = item[textField];
            }
            select.appendChild(option);
        });
    } catch (error) {
        console.error(`Error populating ${selectId}:`, error);
    }
}

// Page Specific Initializations
document.addEventListener('DOMContentLoaded', () => {
    // Add Tournament Page
    if (document.getElementById('addTournamentForm')) {
        submitForm('addTournamentForm', 'addTournament');
    }

    // Add Team Page
    if (document.getElementById('addTeamForm')) {
        populateSelect('tournaments', 'tournament_id', '_id', 'tournament_name');
        submitForm('addTeamForm', 'addTeam');
    }

    // Add Player Page
    if (document.getElementById('addPlayerForm')) {
        populateSelect('teams', 'team_id', '_id', 'team_name');
        submitForm('addPlayerForm', 'addPlayer');
    }

    // Schedule Match Page
    if (document.getElementById('scheduleMatchForm')) {
        populateSelect('tournaments', 'tournament_id', '_id', 'tournament_name');
        populateSelect('teams', 'team1_id', '_id', 'team_name');
        populateSelect('teams', 'team2_id', '_id', 'team_name');
        submitForm('scheduleMatchForm', 'addMatch');
    }

    // Enter Score Page
    if (document.getElementById('enterScoreForm')) {
        populateSelect('tournaments', 'tournament_id_filter', '_id', 'tournament_name');
        populateMatchesDropdown();
        submitForm('enterScoreForm', 'addScore');
    }

    // View Data Page Dashboard
    if (document.getElementById('viewDataTables')) {
        populateSelect('tournaments', 'globalTournamentFilter', '_id', 'tournament_name').then(() => {
            loadDashboardData('');
            document.getElementById('globalTournamentFilter').addEventListener('change', (e) => {
                const val = e.target.value === 'all' ? '' : e.target.value;
                loadDashboardData(val);
            });
        });
    }

    // Points Table Page
    if (document.getElementById('pointsTableContainer')) {
        populateSelect('tournaments', 'pointsTournamentFilter', '_id', 'tournament_name').then(() => {
            loadPointsTable('');
            document.getElementById('pointsTournamentFilter').addEventListener('change', (e) => {
                const val = e.target.value === 'all' ? '' : e.target.value;
                loadPointsTable(val, '#pointsTable tbody');
            });
        });
    }
});

async function populateMatchesDropdown() {
    const select = document.getElementById('match_id');
    const teamSelect = document.getElementById('team_id');
    const filterSelect = document.getElementById('tournament_id_filter');
    if (!select) return;

    let allMatches = [];

    async function fetchAndRenderMatches() {
        try {
            const response = await fetch('/api/matches');
            allMatches = await response.json();
            renderMatches('');
        } catch (error) {
            console.error(`Error populating matches:`, error);
        }
    }

    function renderMatches(tournamentId) {
        select.innerHTML = '<option value="">Select Match</option>';
        teamSelect.innerHTML = '<option value="">Select Team</option>';
        
        const filteredMatches = tournamentId 
            ? allMatches.filter(m => m.tournament_id && m.tournament_id._id === tournamentId)
            : allMatches;

        filteredMatches.forEach(match => {
            const option = document.createElement('option');
            option.value = match._id;
            const date = new Date(match.date).toLocaleDateString();
            const tournamentPrefix = match.tournament_id ? match.tournament_id.tournament_name + ' – ' : '';
            option.textContent = `${tournamentPrefix}${match.team1_id.team_name} vs ${match.team2_id.team_name} (${date})`;
            option.dataset.team1Id = match.team1_id._id;
            option.dataset.team1Name = match.team1_id.team_name;
            option.dataset.team2Id = match.team2_id._id;
            option.dataset.team2Name = match.team2_id.team_name;
            select.appendChild(option);
        });
    }

    if (filterSelect) {
        filterSelect.addEventListener('change', (e) => {
            renderMatches(e.target.value);
        });
    }

    // Event listener to update teams when a match is selected
    select.addEventListener('change', (e) => {
        teamSelect.innerHTML = '<option value="">Select Team (Innings)</option>';
        if (e.target.value) {
            const selectedOption = e.target.options[e.target.selectedIndex];
            
            const opt1 = document.createElement('option');
            opt1.value = selectedOption.dataset.team1Id;
            opt1.textContent = selectedOption.dataset.team1Name;
            
            const opt2 = document.createElement('option');
            opt2.value = selectedOption.dataset.team2Id;
            opt2.textContent = selectedOption.dataset.team2Name;
            
            teamSelect.appendChild(opt1);
            teamSelect.appendChild(opt2);
        }
    });

    fetchAndRenderMatches();
}

async function loadDashboardData(tournamentId) {
    const query = tournamentId ? `?tournament_id=${tournamentId}` : '';

    // Load Teams
    try {
        const res = await fetch(`/api/teams${query}`);
        const teams = await res.json();
        const tbody = document.querySelector('#teamsTable tbody');
        if (tbody) {
            tbody.innerHTML = '';
            if (teams.length === 0) tbody.innerHTML = '<tr><td colspan="2">No teams found.</td></tr>';
            teams.forEach(t => {
                tbody.innerHTML += `<tr><td>${t.team_name}</td><td>${t.coach}</td></tr>`;
            });
        }
    } catch(e) { console.error(e); }

    // Load Players
    try {
        const res = await fetch(`/api/players${query}`);
        const players = await res.json();
        const tbody = document.querySelector('#playersTable tbody');
        if (tbody) {
            tbody.innerHTML = '';
            if (players.length === 0) tbody.innerHTML = '<tr><td colspan="4">No players found.</td></tr>';
            players.forEach(p => {
                tbody.innerHTML += `<tr><td>${p.player_name}</td><td>${p.age}</td><td>${p.role}</td><td>${p.team_id ? p.team_id.team_name : 'N/A'}</td></tr>`;
            });
        }
    } catch(e) { console.error(e); }

    // Load Points Table
    loadPointsTable(tournamentId, '#dashboardPointsTable tbody');

    // Load Grouped Matches
    loadGroupedMatches(tournamentId);
}

async function loadPointsTable(tournamentId = '', selector = '#pointsTable tbody') {
    const query = tournamentId ? `?tournament_id=${tournamentId}` : '';
    try {
        const res = await fetch(`/api/points-table${query}`);
        const points = await res.json();
        const tbody = document.querySelector(selector);
        if (!tbody) return;
        
        tbody.innerHTML = '';
        if (points.length === 0) tbody.innerHTML = '<tr><td colspan="6">No points data available.</td></tr>';
        
        points.forEach((p, index) => {
            tbody.innerHTML += `<tr>
                <td>${index + 1}</td>
                <td><strong>${p.team_name}</strong></td>
                <td>${p.matchesPlayed}</td>
                <td>${p.wins}</td>
                <td>${p.losses}</td>
                <td><strong>${p.points}</strong></td>
            </tr>`;
        });
    } catch(e) { console.error('Error loading points table:', e); }
}

let allGroupedMatches = [];

async function loadGroupedMatches(tournamentIdFilter = '') {
    try {
        const res = await fetch('/api/matches-grouped');
        allGroupedMatches = await res.json();
        
        renderGroupedMatches(tournamentIdFilter);
    } catch (e) { console.error('Error loading grouped matches:', e); }
}

function renderGroupedMatches(filterId) {
    const container = document.getElementById('tournamentResultsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    const tournamentsToRender = !filterId 
        ? allGroupedMatches 
        : allGroupedMatches.filter(t => t._id === filterId);
        
    if (tournamentsToRender.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding: 2rem;">No matches found for this tournament.</p>';
        return;
    }
        
    tournamentsToRender.forEach(t => {
        let matchesHtml = '';
        if (t.matches && t.matches.length > 0) {
            t.matches.forEach(m => {
                const date = new Date(m.date).toLocaleDateString();
                const t1Name = m.team1 ? m.team1.team_name : 'Unknown';
                const t2Name = m.team2 ? m.team2.team_name : 'Unknown';
                
                const t1ScoreStr = m.team1_score ? `${m.team1_score.runs}/${m.team1_score.wickets}` : 'N/A';
                const t2ScoreStr = m.team2_score ? `${m.team2_score.runs}/${m.team2_score.wickets}` : 'N/A';
                
                let winnerText = '';
                let highlightClass = '';
                
                if (m.winner_id) {
                    const winnerName = m.winner_id === (m.team1 ? m.team1._id : null) ? t1Name : t2Name;
                    winnerText = `<span class="winner-text">Winner: ${winnerName} 🏆</span>`;
                    highlightClass = 'winner-highlight';
                }

                matchesHtml += `
                    <div class="match-item ${highlightClass}">
                        <div class="match-info">
                            <strong>${t1Name} vs ${t2Name}</strong><br>
                            ${m.venue} | ${date}
                            <br>
                            ${winnerText}
                        </div>
                        <div class="match-score">
                            Score: ${t1ScoreStr} vs ${t2ScoreStr}
                        </div>
                    </div>
                `;
            });
        } else {
            matchesHtml = '<p>No matches scheduled yet.</p>';
        }

        container.innerHTML += `
            <div class="tournament-card">
                <h3>${t.tournament_name}</h3>
                <div class="match-list">
                    ${matchesHtml}
                </div>
            </div>
        `;
    });
}
