import * as XLSX from 'xlsx'

/**
 * Exporta dados para CSV
 */
export const exportToCSV = (jobs, filename = 'vagas.csv') => {
  if (!jobs || jobs.length === 0) {
    alert('Nenhuma vaga para exportar')
    return
  }

  // Preparar dados
  const data = jobs.map(job => ({
    'Cargo': job.job_title || '-',
    'Empresa': job.company || '-',
    'Localização': job.location || '-',
    'Região': job.source_region || '-',
    'Salário': job.salary_raw || '-',
    'Data': new Date(job.collected_at).toLocaleDateString('pt-BR'),
    'Link': job.job_link || '-'
  }))

  // Converter para CSV
  const csv = [
    // Headers
    Object.keys(data[0]).join(','),
    // Rows
    ...data.map(row =>
      Object.values(row)
        .map(value => {
          // Escapar aspas e envolver em aspas se contiver vírgula
          const stringValue = String(value)
          if (stringValue.includes(',') || stringValue.includes('"')) {
            return `"${stringValue.replace(/"/g, '""')}"`
          }
          return stringValue
        })
        .join(',')
    )
  ].join('\n')

  // Criar blob e download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Exporta dados para Excel
 */
export const exportToExcel = (jobs, filename = 'vagas.xlsx') => {
  if (!jobs || jobs.length === 0) {
    alert('Nenhuma vaga para exportar')
    return
  }

  // Preparar dados
  const data = jobs.map(job => ({
    'Cargo': job.job_title || '-',
    'Empresa': job.company || '-',
    'Localização': job.location || '-',
    'Região': job.source_region || '-',
    'Salário': job.salary_raw || '-',
    'Data': new Date(job.collected_at).toLocaleDateString('pt-BR'),
    'Link': job.job_link || '-'
  }))

  // Criar workbook
  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Vagas')

  // Ajustar largura das colunas
  const columnWidths = [
    { wch: 25 }, // Cargo
    { wch: 20 }, // Empresa
    { wch: 20 }, // Localização
    { wch: 15 }, // Região
    { wch: 20 }, // Salário
    { wch: 12 }, // Data
    { wch: 30 }  // Link
  ]
  worksheet['!cols'] = columnWidths

  // Estilizar header
  const headerStyle = {
    fill: { fgColor: { rgb: 'FF4CAF50' } },
    font: { bold: true, color: { rgb: 'FFFFFFFF' } },
    alignment: { horizontal: 'center', vertical: 'center' }
  }

  // Aplicar estilo ao header
  for (let i = 0; i < Object.keys(data[0]).length; i++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: i })
    if (worksheet[cellAddress]) {
      worksheet[cellAddress].s = headerStyle
    }
  }

  // Download
  XLSX.writeFile(workbook, filename)
}

/**
 * Exporta estatísticas para Excel
 */
export const exportStatsToExcel = (jobs, stats, filename = 'estatisticas.xlsx') => {
  if (!jobs || jobs.length === 0) {
    alert('Nenhum dado para exportar')
    return
  }

  // Criar workbook com múltiplas abas
  const workbook = XLSX.utils.book_new()

  // Aba 1: Estatísticas Gerais
  const statsData = [
    { Métrica: 'Total de Vagas', Valor: stats.totalJobs },
    { Métrica: 'Empresas Únicas', Valor: stats.uniqueCompanies },
    { Métrica: 'Salário Médio', Valor: `R$ ${stats.averageSalary.toLocaleString('pt-BR')}` },
    { Métrica: 'Regiões', Valor: Object.keys(stats.jobsByRegion).length }
  ]

  const statsSheet = XLSX.utils.json_to_sheet(statsData)
  statsSheet['!cols'] = [{ wch: 20 }, { wch: 20 }]
  XLSX.utils.book_append_sheet(workbook, statsSheet, 'Estatísticas')

  // Aba 2: Vagas por Região
  const regionData = Object.entries(stats.jobsByRegion).map(([region, count]) => ({
    'Região': region,
    'Quantidade': count
  }))

  const regionSheet = XLSX.utils.json_to_sheet(regionData)
  regionSheet['!cols'] = [{ wch: 25 }, { wch: 15 }]
  XLSX.utils.book_append_sheet(workbook, regionSheet, 'Vagas por Região')

  // Aba 3: Todas as Vagas
  const jobsData = jobs.map(job => ({
    'Cargo': job.job_title || '-',
    'Empresa': job.company || '-',
    'Localização': job.location || '-',
    'Região': job.source_region || '-',
    'Salário': job.salary_raw || '-',
    'Data': new Date(job.collected_at).toLocaleDateString('pt-BR'),
    'Link': job.job_link || '-'
  }))

  const jobsSheet = XLSX.utils.json_to_sheet(jobsData)
  jobsSheet['!cols'] = [
    { wch: 25 },
    { wch: 20 },
    { wch: 20 },
    { wch: 15 },
    { wch: 20 },
    { wch: 12 },
    { wch: 30 }
  ]
  XLSX.utils.book_append_sheet(workbook, jobsSheet, 'Todas as Vagas')

  // Download
  XLSX.writeFile(workbook, filename)
}
