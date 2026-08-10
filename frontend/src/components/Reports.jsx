import { useState, useEffect, useContext } from 'react'
import AuthContext from '../context/AuthContext'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts'

function Reports() {
  const [data, setData] = useState([])
  const [trendData, setTrendData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { authTokens, logoutUser } = useContext(AuthContext)

  useEffect(() => {
    if (!authTokens) return;

    Promise.all([
      fetch('http://localhost:8000/api/transactions/category_breakdown/', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + String(authTokens.access)
        }
      }),
      fetch('http://localhost:8000/api/transactions/monthly_trend/', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + String(authTokens.access)
        }
      })
    ])
      .then(async ([catRes, trendRes]) => {
        if(catRes.status === 401 || trendRes.status === 401) {
          logoutUser();
          throw new Error('Unauthorized');
        }
        if(!catRes.ok || !trendRes.ok) throw new Error('Failed to fetch');
        
        const catData = await catRes.json();
        const trendData = await trendRes.json();
        
        // Prepare data for recharts
        const chartData = catData.map(item => ({
          name: item.category__name || 'Uncategorized',
          value: parseFloat(item.total)
        }));
        
        const lineData = trendData.map(item => ({
          name: item.month,
          Total: parseFloat(item.total)
        }));

        setData(chartData);
        setTrendData(lineData);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching report data:", err)
        setError("Failed to load report data.")
        setLoading(false)
      })
  }, [authTokens, logoutUser])

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ffc658'];

  if (loading) return <p>Loading reports...</p>
  if (error) return <p className="error-state" style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}>{error}</p>

  return (
    <div className="page-content">
      
      
      <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', marginTop: '20px' }}>
        {/* Day 22: React dashboard charts (spending by category using Recharts) */}
        <h3>Spending by Category</h3>
        {data.length === 0 ? (
          <p className="empty-state">No expense data available for charts.</p>
        ) : (
          <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `Rs ${value}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', marginTop: '20px' }}>
        <h3>Monthly Trend</h3>
        {trendData.length === 0 ? (
          <p className="empty-state">No trend data available.</p>
        ) : (
          <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
              <LineChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `Rs ${value}`} />
                <Legend />
                <Line type="monotone" dataKey="Total" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}

export default Reports
