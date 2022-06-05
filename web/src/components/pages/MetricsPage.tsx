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
  ChangeEventHandler,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { getLastSession, getSessionById } from '../../api';
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
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [graphWidth, setGraphWidth] = useState<number>(500);
  const [graphHeight, setGraphHeight] = useState<number>(175);

  const { bluetoothData, onNewDataReceived, clearData } = useBluetoothData(
    isRecording,
    currentSession?.id
  );

  useEffect(() => {
    getLastSession().then((session) => {
      if
      setCurrentSession(session);
      getSessionById(session?.id)
    });
  }, []);

  useEffect(() => {
    clearData();
  }, [currentSession, clearData]);

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

  const onToggleRecordClicked: ChangeEventHandler<HTMLInputElement> =
    useCallback(
      (event) => {
        setIsRecording(event.target.checked);
      },
      [setIsRecording]
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
          <Switch
            marginRight={5}
            checked={isRecording}
            onChange={onToggleRecordClicked}
          />
          <Text>Record</Text>
        </Pane>
        <Pane marginTop={10} display='flex'>
          <Text>Graph width</Text>
          <Strong size={100} marginLeft={15}>
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
          <Strong size={100} marginLeft={15}>
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

export default MetricsPage;
