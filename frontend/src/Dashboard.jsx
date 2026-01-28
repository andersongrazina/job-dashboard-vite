import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import './Dashboard.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

export default function Dashboard() {
  const [jobs, setJobs] = useState([])
  const [filteredJobs, setFilteredJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showSettings, setShowSettings] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)

  // Filtros
  const [filters, setFilters] = useState({
    company: '',
    source_region: '',
    location: '',
    job_title: '',
    dateFrom: null,
    dateTo: null,
    sortBy: 'collected_at',
    sortOrder: 'desc'
  })

  // Configurações
  const [settings, setSettings] = useState({
    baserowUrl: '',
    tableId: '',
    tokenConfigured: false
  })

  const [newSettings, setNewSettings] = useState({
    baserowUrl: '',
    baserowToken: '',
    tableId: ''
  })

  // Carregar dados ao montar
  useEffect(() => {
    loadSettings()
    loadJobs()
  }, [])

  // Aplicar filtros quando jobs ou filtros mudam
  useEffect(() => {
    applyFilters()
  }, [jobs, filters])

  const loadSettings = async () => {
    try {
      const response = await axios.get(`${API_URL}/settings`)
      setSettings(response.data)
      setNewSettings({
        baserowUrl: response.data.baserowUrl,
        baserowToken: '',
        tableId: response.data.tableId
      })
    } catch (err) {
      console.error('Erro ao carregar configurações:', err)
    }
  }

  const loadJobs = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get(`${API_URL}/jobs`)
      setJobs(response.data.data || [])
    } catch (err) {
      setError('Erro ao carregar vagas. Verifique as configurações.')
      console.error('Erro:', err)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...jobs]

    // Aplicar filtros de texto
    if (filters.company) {
      filtered = filtered.filter(job =>
        job.company?.toLowerCase().includes(filters.company.toLowerCase())
      )
    }

    if (filters.source_region) {
      filtered = filtered.filter(job =>
        job.source_region?.toLowerCase().includes(filters.source_region.toLowerCase())
      )
    }

    if (filters.location) {
      filtered = filtered.filter(job =>
        job.location?.toLowerCase().includes(filters.location.toLowerCase())
      )
    }

    if (filters.job_title) {
      filtered = filtered.filter(job =>
        job.job_title?.toLowerCase().includes(filters.job_title.toLowerCase())
      )
    }

    // Filtro de data
    if (filters.dateFrom || filters.dateTo) {
      filtered = filtered.filter(job => {
        const jobDate = new Date(job.collected_at)
        if (filters.dateFrom && jobDate < new Date(filters.dateFrom)) return false
        if (filters.dateTo) {
          const endDate = new Date(filters.dateTo)
          endDate.setHours(23, 59, 59, 999)
          if (jobDate > endDate) return false
        }
        return true
      })
    }

    // Ordenação
    filtered.sort((a, b) => {
      let aVal, bVal

      if (filters.sortBy === 'collected_at') {
        aVal = new Date(a.collected_at)
        bVal = new Date(b.collected_at)
      } else if (filters.sortBy === 'salary_raw') {
        aVal = extractSalary(a.salary_raw)
        bVal = extractSalary(b.salary_raw)
      } else {
        aVal = a[filters.sortBy] || ''
        bVal = b[filters.sortBy] || ''
      }

      if (filters.sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })

    setFilteredJobs(filtered)
  }

  const extractSalary = (salaryRaw) => {
    if (!salaryRaw) return 0
    const numbers = salaryRaw.match(/\d+/g)
    return numbers ? parseInt(numbers[0]) : 0
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleDateChange = (date, type) => {
    setFilters(prev => ({
      ...prev,
      [type]: date
    }))
    if (type === 'dateFrom') setShowCalendar(false)
  }

  const clearFilters = () => {
    setFilters({
      company: '',
      source_region: '',
      location: '',
      job_title: '',
      dateFrom: null,
      dateTo: null,
      sortBy: 'collected_at',
      sortOrder: 'desc'
    })
  }

  const handleSettingsChange = (e) => {
    const { name, value } = e.target
    setNewSettings(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const saveSettings = async () => {
    try {
      await axios.post(`${API_URL}/settings`, newSettings)
      await loadSettings()
      await loadJobs()
      setShowSettings(false)
      alert('Configurações salvas com sucesso!')
    } catch (err) {
      alert('Erro ao salvar configurações: ' + err.message)
    }
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>📊 Dashboard de Vagas</h1>
        <button
          className="settings-btn"
          onClick={() => setShowSettings(!showSettings)}
        >
          ⚙️ Configurações
        </button>
      </header>

      {showSettings && (
        <div className="settings-panel">
          <h2>Configurações</h2>
          <div className="settings-form">
            <div className="form-group">
              <label>URL do Baserow:</label>
              <input
                type="text"
                name="baserowUrl"
                value={newSettings.baserowUrl}
                onChange={handleSettingsChange}
                placeholder="https://..."
              />
            </div>
            <div className="form-group">
              <label>Token do Baserow:</label>
              <input
                type="password"
                name="baserowToken"
                value={newSettings.baserowToken}
                onChange={handleSettingsChange}
                placeholder="Token..."
              />
            </div>
            <div className="form-group">
              <label>ID da Tabela:</label>
              <input
                type="text"
                name="tableId"
                value={newSettings.tableId}
                onChange={handleSettingsChange}
                placeholder="699"
              />
            </div>
            <div className="settings-actions">
              <button className="btn-primary" onClick={saveSettings}>
                💾 Salvar
              </button>
              <button className="btn-secondary" onClick={() => setShowSettings(false)}>
                ❌ Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="filters-section">
        <h2>🔍 Filtros</h2>
        <div className="filters-grid">
          <div className="filter-group">
            <label>Empresa:</label>
            <input
              type="text"
              name="company"
              value={filters.company}
              onChange={handleFilterChange}
              placeholder="Digite a empresa..."
            />
          </div>

          <div className="filter-group">
            <label>Região:</label>
            <input
              type="text"
              name="source_region"
              value={filters.source_region}
              onChange={handleFilterChange}
              placeholder="Digite a região..."
            />
          </div>

          <div className="filter-group">
            <label>Localização:</label>
            <input
              type="text"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              placeholder="Digite a localização..."
            />
          </div>

          <div className="filter-group">
            <label>Cargo:</label>
            <input
              type="text"
              name="job_title"
              value={filters.job_title}
              onChange={handleFilterChange}
              placeholder="Digite o cargo..."
            />
          </div>

          <div className="filter-group">
            <label>Data De:</label>
            <input
              type="date"
              value={filters.dateFrom ? filters.dateFrom.toISOString().split('T')[0] : ''}
              onChange={(e) => {
                const date = e.target.value ? new Date(e.target.value) : null
                handleDateChange(date, 'dateFrom')
              }}
            />
          </div>

          <div className="filter-group">
            <label>Data Até:</label>
            <input
              type="date"
              value={filters.dateTo ? filters.dateTo.toISOString().split('T')[0] : ''}
              onChange={(e) => {
                const date = e.target.value ? new Date(e.target.value) : null
                handleDateChange(date, 'dateTo')
              }}
            />
          </div>

          <div className="filter-group">
            <label>Ordenar por:</label>
            <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
              <option value="collected_at">Data</option>
              <option value="salary_raw">Salário</option>
              <option value="company">Empresa</option>
              <option value="job_title">Cargo</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Ordem:</label>
            <select name="sortOrder" value={filters.sortOrder} onChange={handleFilterChange}>
              <option value="desc">Decrescente</option>
              <option value="asc">Crescente</option>
            </select>
          </div>
        </div>

        <div className="filter-actions">
          <button className="btn-primary" onClick={loadJobs}>
            🔄 Recarregar
          </button>
          <button className="btn-secondary" onClick={clearFilters}>
            🗑️ Limpar Filtros
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading && <div className="loading">Carregando vagas...</div>}

      <div className="results-section">
        <h2>📋 Resultados ({filteredJobs.length} vagas)</h2>

        {filteredJobs.length === 0 ? (
          <div className="no-results">Nenhuma vaga encontrada com os filtros aplicados.</div>
        ) : (
          <div className="table-responsive">
            <table className="jobs-table">
              <thead>
                <tr>
                  <th>Empresa</th>
                  <th>Cargo</th>
                  <th>Localização</th>
                  <th>Região</th>
                  <th>Salário</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map((job, index) => (
                  <tr key={index}>
                    <td>{job.company || '-'}</td>
                    <td>{job.job_title || '-'}</td>
                    <td>{job.location || '-'}</td>
                    <td>{job.source_region || '-'}</td>
                    <td>{job.salary_raw || '-'}</td>
                    <td>{new Date(job.collected_at).toLocaleDateString('pt-BR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
