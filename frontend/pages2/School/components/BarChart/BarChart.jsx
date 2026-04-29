import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import { useEffect, useState } from 'react';
import './BarChart.css';

const colors = ['#45759D', '#BDCDE1', '#284B69', '#6E869A', '#082A46', '#3E5F7B'];

function SchoolBarChart({ stats }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const data = [
    { name: 'Students', value: stats?.total_students ?? 0 },
    { name: 'Predictions', value: stats?.total_predictions ?? 0 },
    { name: 'Pass %', value: stats?.pass_rate ?? 0 },
    { name: 'Average', value: stats?.average_score ?? 0 },
    { name: 'High risk', value: stats?.high_risk_count ?? 0 },
    { name: 'Medium risk', value: stats?.medium_risk_count ?? 0 },
  ];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="bar-chart-container">
      <h3>Bar graph</h3>
      <ResponsiveContainer width="100%" height={isMobile ? 220 : 180}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          barSize={isMobile ? 25 : 40} /* 👈 smaller bars on mobile */
        >
          <CartesianGrid vertical={false} stroke="#eee" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: isMobile ? 9 : 11, fill: '#284B69' }} /* 👈 smaller text on mobile */
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: isMobile ? 9 : 11, fill: '#284B69' }}
            axisLine={false}
            tickLine={false}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={index} fill={colors[index]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SchoolBarChart;
