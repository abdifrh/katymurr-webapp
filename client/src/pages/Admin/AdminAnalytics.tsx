import { useState, useEffect } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { fetchAdminAnalytics } from '../../services/api'
import './AdminAnalytics.css'

interface AnalyticsStats {
  total_visits: number
  unique_pages: number
  top_pages: { path: string; count: number }[]
  visits_by_date: { date: string; count: number }[]
  visits_by_country: { country: string; count: number }[]
  average_duration: number
}

function AdminAnalytics() {
  const [stats, setStats] = useState<AnalyticsStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  useEffect(() => {
    loadAnalytics()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      const params: any = {}
      if (startDate) params.start_date = startDate
      if (endDate) params.end_date = endDate
      const data = await fetchAdminAnalytics(params)
      setStats(data)
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDateFilter = () => {
    loadAnalytics()
  }

  const handleClearFilter = () => {
    setStartDate('')
    setEndDate('')
  }

  if (loading) {
    return <div className="wp-admin-loading">Loading analytics...</div>
  }

  if (!stats) {
    return <div className="wp-admin-loading">No analytics data available</div>
  }

  return (
    <div className="wp-admin-analytics">
      <div className="analytics-filters">
        <div className="filter-group">
          <label>Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="regular-text"
          />
        </div>
        <div className="filter-group">
          <label>End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="regular-text"
          />
        </div>
        <button className="button button-primary" onClick={handleDateFilter}>
          Apply Filter
        </button>
        <button className="button" onClick={handleClearFilter}>
          Clear
        </button>
      </div>

      <div className="analytics-stats-grid">
        <div className="stat-card">
          <h3>Total Visits</h3>
          <p className="stat-number">{stats.total_visits.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <h3>Unique Pages</h3>
          <p className="stat-number">{stats.unique_pages}</p>
        </div>
        <div className="stat-card">
          <h3>Avg. Duration</h3>
          <p className="stat-number">{Math.floor(stats.average_duration / 60)}m {stats.average_duration % 60}s</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="analytics-charts">
        {/* Visits Over Time - Line Chart */}
        {stats.visits_by_date.length > 0 && (
          <div className="chart-container">
            <h3>Visits Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart 
                data={stats.visits_by_date.map(item => ({
                  date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                  fullDate: item.date,
                  visits: item.count
                }))}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis 
                  dataKey="date" 
                  stroke="#646970"
                  style={{ fontSize: '12px' }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  stroke="#646970"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #c3c4c7',
                    borderRadius: '3px',
                    fontSize: '12px'
                  }}
                  labelFormatter={(value, payload) => {
                    if (payload && payload[0]) {
                      return `Date: ${payload[0].payload.fullDate}`
                    }
                    return value
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="visits" 
                  stroke="#9A4818" 
                  strokeWidth={2}
                  dot={{ fill: '#9A4818', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Visits"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Top Pages - Bar Chart */}
        {stats.top_pages.length > 0 && (
          <div className="chart-container">
            <h3>Top Pages</h3>
            <ResponsiveContainer width="100%" height={Math.max(300, stats.top_pages.slice(0, 10).length * 30)}>
              <BarChart 
                data={stats.top_pages.slice(0, 10).map(page => ({
                  page: page.path.length > 40 ? page.path.substring(0, 40) + '...' : page.path,
                  fullPath: page.path,
                  visits: page.count
                }))}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis 
                  type="number"
                  stroke="#646970"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  type="category"
                  dataKey="page"
                  stroke="#646970"
                  style={{ fontSize: '12px' }}
                  width={250}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #c3c4c7',
                    borderRadius: '3px',
                    fontSize: '12px'
                  }}
                  formatter={(value: number | undefined) => value !== undefined ? [value, 'Visits'] : ['', '']}
                  labelFormatter={(value, payload) => {
                    if (payload && payload[0]) {
                      return `Page: ${payload[0].payload.fullPath}`
                    }
                    return value
                  }}
                />
                <Bar 
                  dataKey="visits" 
                  fill="#9A4818"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Visits by Country - Pie Chart */}
        {stats.visits_by_country.length > 0 && (
          <div className="chart-container">
            <h3>Visits by Country</h3>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={stats.visits_by_country.slice(0, 8).map(country => ({
                    name: country.country,
                    value: country.count
                  }))}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => percent && percent > 0.05 ? `${name}: ${(percent * 100).toFixed(0)}%` : ''}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.visits_by_country.slice(0, 8).map((_, index) => {
                    const colors = [
                      '#9A4818', '#D69B71', '#674439', '#8B7355',
                      '#A67C52', '#C4A484', '#E8D5C4', '#B89B7A'
                    ]
                    return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  })}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #c3c4c7',
                    borderRadius: '3px',
                    fontSize: '12px'
                  }}
                  formatter={(value: number | undefined) => value !== undefined ? [value, 'Visits'] : ['', '']}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value) => value}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Tables Section */}
      <div className="analytics-sections">
        <div className="analytics-section">
          <h3>Top Pages (Detailed)</h3>
          <table className="wp-list-table">
            <thead>
              <tr>
                <th>Page</th>
                <th>Visits</th>
              </tr>
            </thead>
            <tbody>
              {stats.top_pages.length > 0 ? (
                stats.top_pages.map((page, index) => (
                  <tr key={index}>
                    <td>{page.path}</td>
                    <td>{page.count}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} style={{ textAlign: 'center', color: '#646970' }}>
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="analytics-section">
          <h3>Visits by Country (Detailed)</h3>
          <table className="wp-list-table">
            <thead>
              <tr>
                <th>Country</th>
                <th>Visits</th>
              </tr>
            </thead>
            <tbody>
              {stats.visits_by_country.length > 0 ? (
                stats.visits_by_country.map((country, index) => (
                  <tr key={index}>
                    <td>{country.country}</td>
                    <td>{country.count}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} style={{ textAlign: 'center', color: '#646970' }}>
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminAnalytics

