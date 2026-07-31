import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

function Reports() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:8000/api/transactions/category_breakdown/')
      .then(res => res.json())
      .then(resData => {
        // Prepare data for recharts
        const chartData = resData.map(item => ({
          name: item.category__name || 'Uncategorized',
          value: parseFloat(item.total)
        }))
        setData(chartData)
        setLoading(false)
      })
      .catch(err => {
        console.error("Error fetching report data:", err)
        setLoading(false)
      })
  }, [])

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ffc658'];

  if (loading) return <p>Loading reports...</p>

  return (
    <div className="page-content">
      
      
      <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', marginTop: '20px' }}>
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
    </div>
  )
}

export default Reports
