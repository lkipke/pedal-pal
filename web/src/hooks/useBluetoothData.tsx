import { useState, useCallback, useEffect, useRef } from 'react';
import { uploadMetric } from '../api';
import { BluetoothData, MetricName } from '../api/bluetooth';
import { DataPoint } from '../components/Metric';

export type BluetoothState = Record<MetricName, DataPoint[]>;

const EMPTY_STATE: BluetoothState = {
  speed: [],
  cadence: [],
  power: [],
  heartRate: [],
  time: [],
};

export const useBluetoothData = (isRecording: boolean, sessionId?: string) => {
  const [bluetoothData, setBluetoothData] = useState<BluetoothState>(EMPTY_STATE);
  const [unRecordedData, setUnRecordedData] = useState<BluetoothData[]>([]);
  const recordingRef = useRef(isRecording);

  const recordToDatabase = useCallback(async () => {
    if (!sessionId) {
      console.error("Unable to upload data without a session id");
      return;
    }

    setUnRecordedData([]);
    await uploadMetric(unRecordedData, sessionId);
  }, [unRecordedData, sessionId]);

  useEffect(() => {
    recordingRef.current = isRecording;
  }, [isRecording, recordingRef, recordToDatabase]);

  useEffect(() => {
    if (!unRecordedData.length) return;

    let begin = unRecordedData[0].time;
    let end = unRecordedData[unRecordedData.length - 1].time;
    if (end - begin > 5) {
      recordToDatabase();
    }
  }, [unRecordedData, recordToDatabase]);

  const onNewDataReceived = useCallback(
    (newData: BluetoothData) => {
      const { time, speed, cadence, power, heartRate } = newData;
      setBluetoothData((oldData) => ({
        speed: [...oldData.speed, { time, value: speed }],
        cadence: [...oldData.cadence, { time, value: cadence }],
        power: [...oldData.power, { time, value: power }],
        heartRate: [...oldData.heartRate, { time, value: heartRate }],
        time: [...oldData.time, { time, value: time }],
      }));

      if (recordingRef.current) {
        setUnRecordedData((prev) => [...prev, newData]);
      }
    },
    [setBluetoothData, setUnRecordedData, recordingRef]
  );

  const clearData = useCallback(() => {
    setBluetoothData(EMPTY_STATE);
  }, [setBluetoothData]);

  return { bluetoothData, onNewDataReceived, clearData };
};
