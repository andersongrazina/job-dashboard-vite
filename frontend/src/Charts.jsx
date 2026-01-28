import React from 'react'
import { Bar, Pie, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'
import './Charts.css'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

export default function Charts({ jobs, darkMode }) {
  if (!jobs || jobs.length === 0) {
    return <div className="charts-empty">Nenhum dado disponível para gráficos</div>
  }

  // Gráfico 1: Vagas por Região
  const jobsByRegion = {}
  jobs.forEach(job => {
    const region = job.source_region || 'Não especificado'
    jobsByRegion[region] = (jobsByRegion[region] || 0) + 1
  })

  const regionChartData = {
    labels: Object.keys(jobsByRegion),
    datasets: [
      {
        label: 'Vagas por Região',
        data: Object.values(jobsByRegion),
        backgroundColor: [
          '#4CAF50',
          '#2196F3',
          '#FF9800',
          '#F44336',
          '#9C27B0',
          '#00BCD4',
          '#FFEB3B',
          '#795548'
        ],
        borderColor: darkMode ? '#1e1e1e' : '#ffffff',
        borderWidth: 2
      }
    ]
  }

  // Gráfico 2: Top 10 Empresas
  const jobsByCompany = {}
  jobs.forEach(job => {
    const company = job.company || 'Não especificado'
    jobsByCompany[company] = (jobsByCompany[company] || 0) + 1
  })

  const topCompanies = Object.entries(jobsByCompany)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)

  const companyChartData = {
    labels: topCompanies.map(([company]) => company),
    datasets: [
      {
        label: 'Vagas por Empresa',
        data: topCompanies.map(([, count]) => count),
        backgroundColor: '#2196F3',
        borderColor: darkMode ? '#1e1e1e' : '#ffffff',
        borderWidth: 1
      }
    ]
  }

  // Gráfico 3: Distribuição de Salários
  const salaryRanges = {
    'Até R$ 2.000': 0,
    'R$ 2.000 - R$ 4.000': 0,
    'R$ 4.000 - R$ 6.000': 0,
    'R$ 6.000 - R$ 8.000': 0,
    'R$ 8.000 - R$ 10.000': 0,
    'Acima de R$ 10.000': 0
  }

  jobs.forEach(job => {
    if (job.salary_raw) {
      const numbers = job.salary_raw.match(/\d+/g)
      if (numbers) {
        const salary = parseInt(numbers[0])
        if (salary <= 2000) salaryRanges['Até R$ 2.000']++
        else if (salary <= 4000) salaryRanges['R$ 2.000 - R$ 4.000']++
        else if (salary <= 6000) salaryRanges['R$ 4.000 - R$ 6.000']++
        else if (salary <= 8000) salaryRanges['R$ 6.000 - R$ 8.000']++
        else if (salary <= 10000) salaryRanges['R$ 8.000 - R$ 10.000']++
        else salaryRanges['Acima de R$ 10.000']++
      }
    }
  })

  const salaryChartData = {
    labels: Object.keys(salaryRanges),
    datasets: [
      {
        label: 'Distribuição de Salários',
        data: Object.values(salaryRanges),
        backgroundColor: '#FF9800',
        borderColor: darkMode ? '#1e1e1e' : '#ffffff',
        borderWidth: 1
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        labels: {
          color: darkMode ? '#e0e0e0' : '#333',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: darkMode ? '#2d2d2d' : '#333',
        titleColor: darkMode ? '#e0e0e0' : '#fff',
        bodyColor: darkMode ? '#e0e0e0' : '#fff'
      }
    },
    scales: {
      x: {
        ticks: {
          color: darkMode ? '#e0e0e0' : '#333'
        },
        grid: {
          color: darkMode ? '#404040' : '#e0e0e0'
        }
      },
      y: {
        ticks: {
          color: darkMode ? '#e0e0e0' : '#333'
        },
        grid: {
          color: darkMode ? '#404040' : '#e0e0e0'
        }
      }
    }
  }

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        labels: {
          color: darkMode ? '#e0e0e0' : '#333',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: darkMode ? '#2d2d2d' : '#333',
        titleColor: darkMode ? '#e0e0e0' : '#fff',
        bodyColor: darkMode ? '#e0e0e0' : '#fff'
      }
    }
  }

  return (
    <div className="charts-section">
      <h2>📊 Análise de Dados</h2>
      
      <div className="charts-grid">
        <div className="chart-container">
          <h3>Vagas por Região</h3>
          <Pie data={regionChartData} options={pieOptions} />
        </div>

        <div className="chart-container">
          <h3>Top 10 Empresas</h3>
          <Bar data={companyChartData} options={chartOptions} />
        </div>

        <div className="chart-container">
          <h3>Distribuição de Salários</h3>
          <Bar data={salaryChartData} options={chartOptions} />
        </div>
      </div>
    </div>
  )
}
