import React, { useState, useEffect, useMemo } from 'react';
import { Offcanvas } from 'bootstrap'; // Importar Offcanvas

// ... (el resto de tus importaciones y el componente SortIcon)

// Pequeño componente para los íconos de ordenamiento en la tabla
const SortIcon = ({ direction }) => {
  if (!direction) return null;
  return direction === 'asc' ? <i className="bi bi-arrow-up-short"></i> : <i className="bi bi-arrow-down-short"></i>;
};

function App() {
  // Estados existentes
  const [stats, setStats] = useState({ top50Players: [], top10Lists: {}, lastUpdated: null });
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'rank', direction: 'asc' });

  // Nuevos estados para los filtros avanzados
  const [filters, setFilters] = useState({
    level_min: '', level_max: '',
    xp_min: '', xp_max: '',
    wins_min: '', wins_max: '',
    goals_min: '', goals_max: '',
    assists_min: '', assists_max: '',
    matches_min: '', matches_max: '',
    mvps_min: '', mvps_max: '',
  });
  const [activeFilters, setActiveFilters] = useState({});

  // Cargar datos
  useEffect(() => {
    fetch(process.env.PUBLIC_URL + '/stats.json')
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => setStats({ 
        top50Players: data.top50Players || [], 
        top10Lists: data.top10Lists || {}, 
        lastUpdated: data.lastUpdated 
      }))
      .catch(error => {
        console.error('Error fetching stats:', error);
        setError(error.message);
      });
  }, []);

  // Lógica de filtrado y ordenamiento
  const sortedAndFilteredPlayers = useMemo(() => {
    let filteredData = [...stats.top50Players];

    // 1. Filtro por nombre
    if (searchTerm) {
      filteredData = filteredData.filter(player =>
        player.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 2. Filtros avanzados por rango
    Object.entries(activeFilters).forEach(([key, values]) => {
      const [baseKey] = key.split('_');
      filteredData = filteredData.filter(player => {
        const playerValue = player[baseKey];
        const min = values.min !== '' ? Number(values.min) : -Infinity;
        const max = values.max !== '' ? Number(values.max) : Infinity;
        return playerValue >= min && playerValue <= max;
      });
    });

    // 3. Ordenamiento
    if (sortConfig.key) {
      filteredData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredData;
  }, [stats.top50Players, searchTerm, sortConfig, activeFilters]);

  // --- Manejadores de eventos ---
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    const newActiveFilters = {};
    Object.keys(filters).forEach(key => {
      const [baseKey, type] = key.split('_');
      if (filters[key] !== '') {
        if (!newActiveFilters[baseKey]) newActiveFilters[baseKey] = { min: '', max: '' };
        newActiveFilters[baseKey][type] = filters[key];
      }
    });
    setActiveFilters(newActiveFilters);
    const offcanvas = Offcanvas.getInstance(document.getElementById('advancedFilters'));
    offcanvas.hide();
  };

  const clearFilters = () => {
    setFilters({ level_min: '', level_max: '', xp_min: '', xp_max: '', wins_min: '', wins_max: '', goals_min: '', goals_max: '', assists_min: '', assists_max: '', matches_min: '', matches_max: '', mvps_min: '', mvps_max: '' });
    setActiveFilters({});
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleString('es-AR', { dateStyle: 'medium', timeStyle: 'medium' });
  };

  const headers = [
    { key: 'rank', label: '#' }, { key: 'name', label: 'Nombre' },
    { key: 'level', label: 'Nivel' }, { key: 'xp', label: 'XP' },
    { key: 'wins', label: 'Victorias' }, { key: 'goals', label: 'Goles' },
    { key: 'assists', label: 'Asistencias' }, { key: 'matches', label: 'Partidos' },
    { key: 'mvps', label: 'MVPs' },
  ];

  const filterFields = [
      {label: 'Nivel', baseKey: 'level'}, {label: 'XP', baseKey: 'xp'},
      {label: 'Victorias', baseKey: 'wins'}, {label: 'Goles', baseKey: 'goals'},
      {label: 'Asistencias', baseKey: 'assists'}, {label: 'Partidos', baseKey: 'matches'},
      {label: 'MVPs', baseKey: 'mvps'}
  ];

  const categories = [
    { key: 'xp', field: 'xp', name: 'Top XP' },
    { key: 'wins', field: 'victorias', name: 'Top Victorias' },
    { key: 'goals', field: 'goles', name: 'Top Goles' },
    { key: 'assists', field: 'asistencias', name: 'Top Asistencias' },
    { key: 'matches', field: 'partidos', name: 'Top Partidos' },
    { key: 'mvps', field: 'mvps', name: 'Top MVPs' },
    { key: 'cleanSheets', field: 'vallasInvictas', name: 'Top Vallas Invictas' },
    { key: 'hatTricks', field: 'hatTricks', name: 'Top Hat-Tricks' }
  ];

  return (
    <div className="App" data-bs-theme="dark">
      {/* --- Barra de Navegación --- */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4 border-bottom border-body">
        <div className="container">
          <a className="navbar-brand d-flex align-items-center" href="/">
            <img src={process.env.PUBLIC_URL + '/lnb-logo.png'} alt="LNB Logo" style={{ height: '30px', marginRight: '10px' }} />
            BW Bigger Web
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="/" role="button" data-bs-toggle="dropdown">
                  <i className="bi bi-list-ul me-1"></i> Menú
                </a>
                <ul className="dropdown-menu dropdown-menu-dark">
                  <li><a className="dropdown-item" href="https://github.com/PasqualeAlexander/BIGGER-WEB/actions/workflows/update-stats.yml" target="_blank" rel="noopener noreferrer"><i className="bi bi-arrow-clockwise me-2"></i>Forzar Actualización</a></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><a className="dropdown-item" href="https://www.tiktok.com/@liganacionaldebigger" target="_blank" rel="noopener noreferrer"><i className="bi bi-tiktok me-2"></i>TikTok</a></li>
                  <li><a className="dropdown-item" href="https://www.instagram.com/lnbhaxball/" target="_blank" rel="noopener noreferrer"><i className="bi bi-instagram me-2"></i>Instagram</a></li>
                  <li><a className="dropdown-item" href="https://youtube.com/liganacionaldebigger" target="_blank" rel="noopener noreferrer"><i className="bi bi-youtube me-2"></i>YouTube</a></li>
                  <li><a className="dropdown-item" href="https://twitch.tv/liganacionalbigger" target="_blank" rel="noopener noreferrer"><i className="bi bi-twitch me-2"></i>Twitch</a></li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* --- Sección de Top 10 --- */}
      <div className="container mb-4">
        <h3 className="mb-3 text-white">🏆 Tops por Categoría</h3>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3">
          {Object.entries(stats.top10Lists).map(([key, list]) => (
            <div className="col" key={key}>
              <div className="card h-100 shadow-sm bg-dark text-white border-secondary">
                <div className="card-header bg-primary text-white">{list.length > 0 ? categories.find(cat => cat.key === key)?.name : `Top ${key.toUpperCase()}`}</div>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-sm table-dark table-striped table-hover mb-0">
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Nombre</th>
                          <th scope="col">Valor</th>
                        </tr>
                      </thead>
                      <tbody>
                        {list.map((player, index) => (
                          <tr key={player.name || index}>
                            <td>{player.rank}</td>
                            <td>{player.name}</td>
                            <td>{player.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- Contenido Principal --- */}
      <main className="container">
        <div className="mb-4">
          <button className="btn btn-primary w-100 d-flex justify-content-between align-items-center" type="button" data-bs-toggle="collapse" data-bs-target="#top50Collapse" aria-expanded="false" aria-controls="top50Collapse">
            <span>📊 Top 50 Jugadores (Desplegable)</span>
            <i className="bi bi-chevron-down"></i>
          </button>
          <div className="collapse show" id="top50Collapse">
            <div className="card shadow mt-2">
              <div className="card-header bg-dark-subtle">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                    <div className="mb-2 mb-md-0">
                        <h4 className="mb-0">Top 50 Jugadores</h4>
                        <small className="text-muted">Última actualización: {formatDate(stats.lastUpdated)}</small>
                    </div>
                    <div className="d-flex gap-2 w-100" style={{ maxWidth: '450px' }}>
                        <input type="text" className="form-control" placeholder="🔍 Buscar por nombre..." onChange={(e) => setSearchTerm(e.target.value)} />
                        <button className="btn btn-outline-secondary flex-shrink-0" type="button" data-bs-toggle="offcanvas" data-bs-target="#advancedFilters">
                            <i className="bi bi-funnel-fill me-1"></i> Filtros
                        </button>
                    </div>
                </div>
              </div>

              <div className="card-body">
                {error ? (
                  <div className="alert alert-danger"><strong>Error:</strong> No se pudieron cargar las estadísticas. ({error})</div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-dark table-striped table-hover">
                      <thead>
                        <tr>
                          {headers.map(header => (
                            <th key={header.key} scope="col" onClick={() => requestSort(header.key)} style={{ cursor: 'pointer' }}>
                              {header.label} <SortIcon direction={sortConfig.key === header.key ? sortConfig.direction : null} />
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {sortedAndFilteredPlayers.map((player, index) => (
                          <tr key={player.rank || index}>
                            <th scope="row">{sortConfig.key === 'rank' && sortConfig.direction === 'asc' ? index + 1 : player.rank}</th>
                            <td>{player.name}</td>
                            <td>{player.level}</td>
                            <td>{player.xp}</td>
                            <td>{player.wins}</td>
                            <td>{player.goals}</td>
                            <td>{player.assists}</td>
                            <td>{player.matches}</td>
                            <td>{player.mvps}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <footer className="text-center mt-4 text-muted"><p>Creado para el Bot de LNB</p></footer>
      </main>

      {/* --- Panel de Filtros Avanzados (Offcanvas) --- */}
      <div className="offcanvas offcanvas-end text-bg-dark" tabIndex="-1" id="advancedFilters">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title"><i className="bi bi-funnel-fill me-2"></i>Filtros Avanzados</h5>
          <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas"></button>
        </div>
        <div className="offcanvas-body">
          <p className="text-muted">Filtra por rangos para una o más estadísticas.</p>
          <div className="d-grid gap-3">
            {filterFields.map(field => (
                <div key={field.baseKey}>
                    <label className="form-label">{field.label}</label>
                    <div className="input-group">
                        <input type="number" className="form-control" name={`${field.baseKey}_min`} value={filters[`${field.baseKey}_min`]} onChange={handleFilterChange} placeholder="Mínimo" />
                        <input type="number" className="form-control" name={`${field.baseKey}_max`} value={filters[`${field.baseKey}_max`]} onChange={handleFilterChange} placeholder="Máximo" />
                    </div>
                </div>
            ))}
          </div>
          <div className="d-grid gap-2 mt-4">
            <button className="btn btn-primary" type="button" onClick={applyFilters}>Aplicar Filtros</button>
            <button className="btn btn-outline-secondary" type="button" onClick={clearFilters}>Limpiar Filtros</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;