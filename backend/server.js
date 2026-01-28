const express = require('express');
const axios = require('axios');
const cors = require('cors');
const NodeCache = require('node-cache');
require('dotenv').config();

const app = express();
const cache = new NodeCache({ stdTTL: 300 }); // Cache de 5 minutos

// Middleware
app.use(cors());
app.use(express.json());

// Configurações padrão
const DEFAULT_CONFIG = {
  baserowUrl: process.env.BASEROW_URL || 'https://n8n-baserow.v6s8rs.easypanel.host/api/database/rows/table',
  baserowToken: process.env.BASEROW_TOKEN || 'xUhLDnUtV09UKOSDDd5kgW9E1GBzPA0x',
  tableId: process.env.TABLE_ID || '699'
};

// Armazenar configurações em memória (pode ser expandido para arquivo/BD)
let config = { ...DEFAULT_CONFIG };

// ==================== ROTAS ====================

// GET /api/health - Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// GET /api/settings - Obter configurações atuais
app.get('/api/settings', (req, res) => {
  res.json({
    baserowUrl: config.baserowUrl,
    tableId: config.tableId,
    tokenConfigured: !!config.baserowToken
  });
});

// POST /api/settings - Atualizar configurações
app.post('/api/settings', (req, res) => {
  try {
    const { baserowUrl, baserowToken, tableId } = req.body;

    if (baserowUrl) config.baserowUrl = baserowUrl;
    if (baserowToken) config.baserowToken = baserowToken;
    if (tableId) config.tableId = tableId;

    // Limpar cache ao atualizar configurações
    cache.flushAll();

    res.json({
      success: true,
      message: 'Configurações atualizadas com sucesso',
      config: {
        baserowUrl: config.baserowUrl,
        tableId: config.tableId,
        tokenConfigured: !!config.baserowToken
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// GET /api/jobs - Obter todas as vagas do Baserow
app.get('/api/jobs', async (req, res) => {
  try {
    // Verificar cache
    const cachedData = cache.get('jobs');
    if (cachedData) {
      return res.json({
        data: cachedData,
        cached: true,
        timestamp: new Date().toISOString()
      });
    }

    const url = `${config.baserowUrl}/${config.tableId}/?user_field_names=true`;

    const response = await axios.get(url, {
      headers: {
        'Authorization': `Token ${config.baserowToken}`,
        'Content-Type': 'application/json'
      }
    });

    const jobs = response.data.results || [];

    // Armazenar em cache
    cache.set('jobs', jobs);

    res.json({
      data: jobs,
      cached: false,
      total: jobs.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erro ao buscar vagas:', error.message);
    res.status(500).json({
      error: 'Erro ao buscar vagas do Baserow',
      details: error.message
    });
  }
});

// GET /api/jobs/search - Buscar vagas com filtros
app.get('/api/jobs/search', async (req, res) => {
  try {
    const {
      company,
      source_region,
      location,
      job_title,
      dateFrom,
      dateTo,
      sortBy = 'collected_at',
      sortOrder = 'desc'
    } = req.query;

    // Obter dados do Baserow
    const url = `${config.baserowUrl}/${config.tableId}/?user_field_names=true`;
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Token ${config.baserowToken}`,
        'Content-Type': 'application/json'
      }
    });

    let jobs = response.data.results || [];

    // Aplicar filtros
    if (company) {
      jobs = jobs.filter(job => 
        job.company?.toLowerCase().includes(company.toLowerCase())
      );
    }

    if (source_region) {
      jobs = jobs.filter(job => 
        job.source_region?.toLowerCase().includes(source_region.toLowerCase())
      );
    }

    if (location) {
      jobs = jobs.filter(job => 
        job.location?.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (job_title) {
      jobs = jobs.filter(job => 
        job.job_title?.toLowerCase().includes(job_title.toLowerCase())
      );
    }

    // Filtro de data
    if (dateFrom || dateTo) {
      jobs = jobs.filter(job => {
        const jobDate = new Date(job.collected_at);
        if (dateFrom && jobDate < new Date(dateFrom)) return false;
        if (dateTo) {
          const endDate = new Date(dateTo);
          endDate.setHours(23, 59, 59, 999);
          if (jobDate > endDate) return false;
        }
        return true;
      });
    }

    // Ordenação
    jobs.sort((a, b) => {
      let aVal, bVal;

      if (sortBy === 'collected_at') {
        aVal = new Date(a.collected_at);
        bVal = new Date(b.collected_at);
      } else if (sortBy === 'salary_raw') {
        // Extrair primeiro valor numérico do salário
        aVal = extractSalary(a.salary_raw);
        bVal = extractSalary(b.salary_raw);
      } else {
        aVal = a[sortBy] || '';
        bVal = b[sortBy] || '';
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    res.json({
      data: jobs,
      total: jobs.length,
      filters: { company, source_region, location, job_title, dateFrom, dateTo },
      sort: { sortBy, sortOrder },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erro ao buscar vagas:', error.message);
    res.status(500).json({
      error: 'Erro ao buscar vagas',
      details: error.message
    });
  }
});

// Função auxiliar para extrair salário
function extractSalary(salaryRaw) {
  if (!salaryRaw) return 0;
  const numbers = salaryRaw.match(/\d+/g);
  return numbers ? parseInt(numbers[0]) : 0;
}

// ==================== INICIAR SERVIDOR ====================

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`✅ Backend rodando em http://localhost:${PORT}`);
  console.log(`📊 Baserow URL: ${config.baserowUrl}/${config.tableId}`);
});
