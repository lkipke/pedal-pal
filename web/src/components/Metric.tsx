import { Card, Heading, Pane, Strong, Text } from 'evergreen-ui';
import React, { useEffect, useState } from 'react';
import { Line, LineChart, XAxis, YAxis } from 'recharts';

export interface DataPoint {
  time: number;
  value: number;
}

interface Props {
  name: string;
  data: DataPoint[];
  chart?: {
    width?: number;
    height?: number;
  };
}

const DEFAULT_CHART_WIDTH = 500;
const DEFAULT_CHART_HEIGHT = 200;

const convertUtcToReadable = (utc: number) => {
  let date = new Date(0);
  date.setUTCSeconds(utc);
  return date.toLocaleTimeString();
};

const round = (toRound: number) => Math.round(toRound * 100) / 100;

const Metric: React.FC<Props> = ({ data, name, chart }) => {
  let [currentTotal, setCurrentTotal] = useState<number>(0);

  useEffect(() => {
    if (data.length) {
      setCurrentTotal((prev) => prev + data[data.length - 1].value);
    }
  }, [data.length]);

  let average = round(currentTotal / data.length) || null;
  let current = data[data.length - 1];
  return (
    <Card padding={25} margin={10} border={true}>
      <Heading size={900} float='left'>
        {name}
      </Heading>
      {average && (
        <Pane float='right' display='flex' flexDirection='column'>
          <Heading size={900}>{average}</Heading>
          <Heading size={600}>average</Heading>
        </Pane>
      )}
      <Pane display='flex' alignItems='center' width='100%' flexDirection='column'>
        {current && <Heading style={{ fontSize: 75 }}>{current.value}</Heading>}
      </Pane>
      <Pane marginTop={25}>
        <LineChart
          width={chart?.width || DEFAULT_CHART_WIDTH}
          height={chart?.height || DEFAULT_CHART_HEIGHT}
          data={data}
        >
          <Line
            type='monotone'
            dataKey='value'
            stroke='#8884d8'
            isAnimationActive={false}
            dot={false}
          />
          <YAxis width={24} tick={{ fontSize: 11 }} />
          <XAxis
            dataKey='time'
            tickFormatter={convertUtcToReadable}
            interval='preserveStart'
            tick={{ fontSize: 11 }}
            tickCount={3}
          />
        </LineChart>
      </Pane>
    </Card>
  );
};

export default Metric;
