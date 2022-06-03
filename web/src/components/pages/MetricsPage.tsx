import { Button, Pane, Switch, Text } from 'evergreen-ui';
import React, {
  ChangeEventHandler,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { getLastSession } from '../../api';
import {
  BluetoothData,
  connectToBluetooth,
  connectToFakeData,
  disconnectAll,
} from '../../api/bluetooth';
import { Session, User } from '../../api/types';
import Metric from '../Metric';
import SessionInput from '../SessionInput';

interface Props {
  user: User;
}

const MetricsPage: React.FC<Props> = ({ user }) => {
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [useFakeData, setUseFakeData] = useState<boolean>(false);
  const [dataSourceConnected, setDataSourceConnected] =
    useState<boolean>(false);

  useEffect(() => {
    getLastSession().then(setCurrentSession);
  }, []);

  const onNewDataReceived = useCallback((data: BluetoothData) => {
    console.log(data);
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
  }, [setDataSourceConnected, useFakeData, onNewDataReceived]);

  const onToggleDataSourceClicked: ChangeEventHandler<HTMLInputElement> =
    useCallback(
      (event) => {
        setUseFakeData(!event.target.checked);
        disconnect();
      },
      [setUseFakeData, disconnect]
    );

  return (
    <>
      <Pane marginLeft={25} float='left' display='flex' flexDirection='column'>
        {dataSourceConnected ? (
          <Button onClick={disconnect}>Disconnect</Button>
        ) : (
          <Button onClick={connect}>Connect</Button>
        )}
        <Pane marginTop={10} display='flex' alignItems='center'>
          <Switch marginRight={5} checked={!useFakeData} onChange={onToggleDataSourceClicked} />
          <Text>Bluetooth</Text>
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
        <Pane marginTop={50} display='flex' flexWrap="wrap">
          <Metric />
          <Metric />
          <Metric />
        </Pane>
      </Pane>
    </>
  );
};

export default MetricsPage;
