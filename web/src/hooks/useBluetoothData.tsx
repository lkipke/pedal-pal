import { useState, useCallback, useEffect, useRef } from 'react';
import { uploadMetric } from '../api';
import { BluetoothData } from '../utils/bluetooth';

type State = Record<keyof BluetoothData, { time: number; value: number }[]>;
const EMPTY_STATE: State = {
  speed: [],
  cadence: [],
  power: [],
  heartRate: [],
  time: [],
};

export const useBluetoothData = (isRecording: boolean, sessionId?: string) => {
  const [bluetoothData, setBluetoothData] = useState<State>(EMPTY_STATE);
  const [unrecordedData, setUnrecordedData] = useState<BluetoothData[]>([]);
  const recordingRef = useRef(isRecording);

  const recordToDatabase = useCallback(async () => {
    if (!sessionId) {
      console.error('Unable to upload data without a session id');
      return;
    }

    setUnrecordedData([]);
    await uploadMetric(unrecordedData, sessionId);
  }, [unrecordedData, sessionId]);

  useEffect(() => {
    recordingRef.current = isRecording;
  }, [isRecording, recordingRef, recordToDatabase]);

  useEffect(() => {
    if (!unrecordedData.length) return;

    let begin = unrecordedData[0].time;
    let end = unrecordedData[unrecordedData.length - 1].time;
    if ((end - begin) / 1000 > 10) {
      recordToDatabase();
    }
  }, [unrecordedData, recordToDatabase]);

  const onNewData = useCallback(
    (newData: BluetoothData[], disableRecord = false) => {
      let newState = newData.reduce(
        (agg, val) => {
          return {
            speed: [...agg.speed, { time: val.time, value: val.speed }],
            cadence: [...agg.cadence, { time: val.time, value: val.cadence }],
            power: [...agg.power, { time: val.time, value: val.power }],
            heartRate: [
              ...agg.heartRate,
              { time: val.time, value: val.heartRate },
            ],
            time: [...agg.time, { time: val.time, value: val.time }],
          };
        },
        { ...EMPTY_STATE }
      );

      setBluetoothData((oldState) => ({
        speed: [...oldState.speed, ...newState.speed],
        cadence: [...oldState.cadence, ...newState.cadence],
        power: [...oldState.power, ...newState.power],
        heartRate: [...oldState.heartRate, ...newState.heartRate],
        time: [...oldState.time, ...newState.time],
      }));

      if (recordingRef.current && !disableRecord) {
        setUnrecordedData((oldState) => [...oldState, ...newData]);
      }
    },
    [setBluetoothData, setUnrecordedData, recordingRef]
  );

  const clearData = useCallback(() => {
    setBluetoothData(EMPTY_STATE);
  }, [setBluetoothData]);

  return { bluetoothData, onNewData, clearData, recordCachedData: recordToDatabase };
};
