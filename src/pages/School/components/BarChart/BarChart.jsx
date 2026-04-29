import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import { useEffect, useState } from 'react';
import './BarChart.css';

const data = [
  { name: 'Excellent', value: 40 },
  { name: 'Very good', value: 65 },
  { name: 'Good', value: 25 },
  { name: 'Average', value: 45 },
  { name: 'Weak', value: 70 },
  { name: 'Poor', value: 50 },
];

const colors = ['#45759D', '#BDCDE1', '#284B69', '#6E869A', '#082A46', '#3E5F7B'];

function SchoolBarChart() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

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