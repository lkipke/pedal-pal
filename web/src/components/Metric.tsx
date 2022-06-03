import { Card } from 'evergreen-ui';
import React from 'react';
import { Line, LineChart } from 'recharts';

interface Props {}
const Metric: React.FC<Props> = () => {
  const data = [
    { name: 'Page A', uv: 400, pv: 2400, amt: 2400 },
    { name: 'Page B', uv: 500, pv: 2500, amt: 2500 },
  ];
  return (
    <Card border={true}>
      <LineChart width={400} height={400} data={data}>
        <Line type='monotone' dataKey='uv' stroke='#8884d8' />
      </LineChart>
    </Card>
  );
};

export default Metric;
