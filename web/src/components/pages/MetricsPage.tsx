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
  ChangeEventHandler,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { getLastSession } from '../../api';
import {
  connectToBluetooth,
  connectToFakeData,
  disconnectAll,
  MetricName,
  pause,
  play,
} from '../../api/bluetooth';
import { Session, User } from '../../api/types';
import { useBluetoothData } from '../../hooks/useBluetoothData';
import Metric from '../Metric';
import SessionInput from '../SessionInput';

const METRIC_KEY_TO_NAME: Record<MetricName, string> = {
  speed: 'speed',
  cadence: 'cadence',
  power: 'power',
  heartRate: 'heart rate',
  time: 'time',
};

interface Props {
  user: User;
}

const MetricsPage: React.FC<Props> = ({ user }) => {
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [useFakeData, setUseFakeData] = useState<boolean>(false);
  const [dataSourceConnected, setDataSourceConnected] =
    useState<boolean>(false);
  const [dataSourceName, setDataSourceName] = useState<string>('');
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const { bluetoothData, onNewDataReceived } = useBluetoothData();

  useEffect(() => {
    getLastSession().then(setCurrentSession);
  }, []);

  const disconnect = useCallback(() => {
    disconnectAll();
    setDataSourceConnected(false);
  }, [setDataSourceConnected]);

  const connect = useCallback(async () => {
    let connectToDatasource = useFakeData
      ? connectToFakeData
      : connectToBluetooth;

    let result = await connectToDatasource(onNewDataReceived);
    setDataSourceConnected(result.success);

    if (result.success) {
      setIsPaused(false);
      setDataSourceName(result.name);
    } else {
      setIsPaused(true);
    }
  }, [setDataSourceConnected, useFakeData, onNewDataReceived]);

  const onToggleDataSourceClicked: ChangeEventHandler<HTMLInputElement> =
    useCallback(
      (event) => {
        setUseFakeData(!event.target.checked);
        disconnect();
      },
      [setUseFakeData, disconnect]
    );

  const onTogglePauseClicked = useCallback(() => {
    if (isPaused) {
      play();
    } else {
      pause();
    }

    setIsPaused(!isPaused);
  }, [isPaused, setIsPaused]);

  return (
    <>
      <Pane marginLeft={25} float='left' display='flex' flexDirection='column'>
        {dataSourceConnected ? (
          <>
            <Strong size={300}>{dataSourceName}</Strong>
            <Button marginTop={5} onClick={disconnect}>
              Disconnect
            </Button>
          </>
        ) : (
          <Button onClick={connect}>Connect</Button>
        )}
        <Button
          marginTop={10}
          onClick={onTogglePauseClicked}
          disabled={!dataSourceConnected}
        >
          {isPaused ? <PlayIcon /> : <PauseIcon />}
        </Button>
        <Pane marginTop={10} display='flex' alignItems='center'>
          <Switch
            marginRight={5}
            checked={!useFakeData}
            onChange={onToggleDataSourceClicked}
          />
          <Text>Bluetooth</Text>
        </Pane>
        <Pane marginTop={10} display='flex' alignItems='center'>
          <Switch marginRight={5} checked={true} />
          <Text>Record</Text>
        </Pane>
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
        <Pane marginTop={50} marginLeft={50} display='flex' flexWrap='wrap'>
          {(Object.keys(bluetoothData) as MetricName[])
            .filter((key) => key !== 'time')
            .map((key) => (
              <Metric
                key={key}
                name={METRIC_KEY_TO_NAME[key]}
                data={bluetoothData[key]}
              />
            ))}
        </Pane>
      </Pane>
    </>
  );
};

export default MetricsPage;
