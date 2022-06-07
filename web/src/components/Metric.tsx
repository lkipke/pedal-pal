import { Card, Heading, Pane } from 'evergreen-ui';
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
  date.setUTCMilliseconds(utc);
  return date.toLocaleTimeString();
};

const round2Places = (toRound: number) => Math.round(toRound * 100) / 100;

const Metric: React.FC<Props> = ({ data, name, chart }) => {
  let [prevDataLength, setPrevDataLength] = useState(0);
  let [currentTotal, setCurrentTotal] = useState<number>(0);
  let [max, setMax] = useState<number>(0);

  useEffect(() => {
    if (!data.length) {
      setCurrentTotal(0);
      setMax(0);
      setPrevDataLength(0);
      return;
    }

    let newData = data.slice(prevDataLength);
    setCurrentTotal((prev) =>
      newData.reduce((total, next) => total + next.value, prev)
    );
    setMax((prev) => Math.max(prev, ...newData.map((d) => d.value)));
    setPrevDataLength(data.length);
  }, [data, prevDataLength]);

  let average = Math.round(currentTotal / data.length) || null;
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
