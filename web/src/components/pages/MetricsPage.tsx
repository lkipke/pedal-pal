import {
  Button,
  Pane,
  PauseIcon,
  PlayIcon,
  Strong,
  Switch,
  Text,
} from 'evergreen-ui';
import React, {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { getLastSession, getSessionById } from '../../api';
import { MetricName, pause, play } from '../../api/bluetooth';
import { Session, User } from '../../api/types';
import { useBluetoothData } from '../../hooks/useBluetoothData';
import { DataSourceContext } from '../../providers/DataSourceContext';
import Metric from '../Metric';
import SessionInput from '../SessionInput';
import Slider from '../Slider';

const METRIC_KEY_TO_NAME: Record<MetricName, string> = {
  speed: 'speed',
  cadence: 'cadence',
  power: 'power',
  heartRate: 'heart rate',
  time: 'time',
};

interface Props {
  // user: User;
}

const MetricsPage: React.FC<Props> = () => {
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [graphWidth, setGraphWidth] = useState<number>(500);
  const [graphHeight, setGraphHeight] = useState<number>(175);

  const { set, toggle, connect, disconnect, ...dataSource } =
    useContext(DataSourceContext);

  const { bluetoothData, appendData, clearData } = useBluetoothData(
    dataSource.isRecording,
    currentSession?.id
  );

  useEffect(() => {
    if (!currentSession) {
      console.log("*** getting new session");
      getLastSession().then((session) => {
        setCurrentSession(session);
        if (session) {
          getSessionById(session.id);
        }
      });
    }
  }, [currentSession]);

  useEffect(() => {
    clearData();
  }, [currentSession, clearData]);

  const onPlayPauseToggle = useCallback(() => {
    if (dataSource.isPaused) {
      play();
    } else {
      pause();
    }
    toggle('isPaused');
  }, [dataSource.isPaused, toggle]);

  return (
    <>
      <Pane marginLeft={25} float='left' display='flex' flexDirection='column'>
        {dataSource.isConnected ? (
          <>
            <Strong size={300}>{dataSource.name}</Strong>
            <Button marginTop={5} onClick={disconnect}>
              Disconnect
            </Button>
          </>
        ) : (
          <Button
            disabled={!!currentSession}
            onClick={() => connect(appendData)}
          >
            Connect
          </Button>
        )}
        <Button
          marginTop={10}
          onClick={onPlayPauseToggle}
          disabled={!dataSource.isConnected}
        >
          {dataSource.isPaused ? <PlayIcon /> : <PauseIcon />}
        </Button>
        <Pane marginTop={10} display='flex' alignItems='center'>
          <Switch
            marginRight={5}
            checked={dataSource.isFake}
            onChange={() => toggle('isFake')}
          />
          <Text>Use fake data</Text>
        </Pane>
        <Pane marginTop={10} display='flex' alignItems='center'>
          <Switch
            marginRight={5}
            checked={dataSource.isRecording}
            onChange={() => toggle('isRecording')}
          />
          <Text>Record</Text>
        </Pane>
        <Pane marginTop={10} display='flex'>
          <Text>Graph width</Text>
          <Strong size='small' marginLeft={15}>
            {graphWidth}
          </Strong>
        </Pane>
        <Slider
          value={graphWidth}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setGraphWidth(parseInt(e.target.value))
          }
        />
        <Pane marginTop={5} display='flex'>
          <Text>Graph height</Text>
          <Strong size='small' marginLeft={15}>
            {graphHeight}
          </Strong>
        </Pane>
        <Slider
          value={graphHeight}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setGraphHeight(parseInt(e.target.value))
          }
        />
      </Pane>
      <Pane
        display='flex'
        justifyContent='center'
        alignItems='center'
        flexDirection='column'
      >
        <SessionInput
          setCurrentSession={setCurrentSession}
          currentSessionName={currentSession?.name}
        />
        <Pane marginTop={10} marginLeft={50} display='flex' flexWrap='wrap'>
          {(Object.keys(bluetoothData) as MetricName[])
            .filter((key) => key !== 'time')
            .map((key) => (
              <Metric
                key={key}
                name={METRIC_KEY_TO_NAME[key]}
                data={bluetoothData[key]}
                chart={{ width: graphWidth, height: graphHeight }}
              />
            ))}
        </Pane>
      </Pane>
    </>
  );
};

// (MetricsPage as any).whyDidYouRender = true;

export default MetricsPage;
