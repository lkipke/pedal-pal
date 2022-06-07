import { Card, Heading, Pane } from 'evergreen-ui';
import React, { useEffect, useState } from 'react';
import { Line, LineChart, XAxis, YAxis } from 'recharts';
import { convertUtcToReadable } from '../utils/formatting';

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

const round2Places = (toRound: number) => Math.round(toRound * 100) / 100;

const Metric: React.FC<Props> = ({ data, name, chart }) => {
  let total = 0;
  let max = Math.max(...data.map((d) => {
    total += d.value;
    return d.value;
  }));
  let average = Math.round(total / data.length) || null;
  let current = data[data.length - 1];

  return (
    <Card
      paddingLeft={15}
      paddingTop={15}
      paddingRight={15}
      margin={10}
      border={true}
      display='flex'
      flexDirection='column'
      alignItems='center'
    >
      <Pane display='flex' position='relative' width='100%' left={0}>
        <Pane display='flex' flexDirection='column'>
          <Heading width='215px' size={900}>
            {name}
          </Heading>
          {average && (
            <Pane display='flex'>
              <Pane display='flex' flexDirection='column'>
                <Heading size={500}>avg</Heading>
                <Heading size={900}>{average}</Heading>
              </Pane>
              <Pane
                borderLeft
                marginLeft={10}
                paddingLeft={10}
                display='flex'
                flexDirection='column'
              >
                <Heading size={500}>max</Heading>
                <Heading size={900}>{max}</Heading>
              </Pane>
            </Pane>
          )}
        </Pane>
        <Pane
          display='flex'
          flexDirection='column'
          textAlign='right'
          width='100%'
        >
          {current && (
            <Heading
              float='right'
              style={{ fontSize: 75, lineHeight: '100px' }}
            >
              {current.value}
            </Heading>
          )}
        </Pane>
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
