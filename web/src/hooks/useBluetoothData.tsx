import { useState, useCallback } from 'react';
import { BluetoothData, MetricName } from '../api/bluetooth';
import { DataPoint } from '../components/Metric';

export type BluetoothState = Record<MetricName, DataPoint[]>;

export const useBluetoothData = () => {
  const [bluetoothData, setBluetoothData] = useState<BluetoothState>({
    speed: [],
    cadence: [],
    power: [],
    heartRate: [],
    time: [],
  });

  const onNewDataReceived = useCallback(
    (newData: BluetoothData) => {
      // console.log(newData);
      const { time, speed, cadence, power, heartRate } = newData;
      setBluetoothData((oldData) => ({
        speed: [...oldData.speed, { time, value: speed }],
        cadence: [...oldData.cadence, { time, value: cadence }],
        power: [...oldData.power, { time, value: power }],
        heartRate: [...oldData.heartRate, { time, value: heartRate }],
        time: [...oldData.time, { time, value: time }],
      }));
    },
    [setBluetoothData]
  );

  return { bluetoothData, onNewDataReceived };
};