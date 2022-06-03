type OnNewData = (data: BluetoothData) => void;
type Result =
  | { success: true; name: string }
  | { success: false; error: string };

export interface BluetoothData {
  speed: number;
  cadence: number;
  power: number;
  heartRate: number;
  time: number;
}
export type MetricName = keyof BluetoothData;

let bluetoothDevice: BluetoothDevice | null = null;
let bluetoothCharacteristic: BluetoothRemoteGATTCharacteristic | null = null;
let fakeInterval: NodeJS.Timer | null = null;
let fakeIntervalListener: OnNewData | null = null;

const getEpoch = () => Math.round(Date.now() / 1000);

export const connectToFakeData = async (
  onNewData: OnNewData
): Promise<Result> => {
  disconnectBluetooth();
  fakeIntervalListener = onNewData;

  const rnd = (max: number) => Math.floor(Math.random() * Math.floor(max));
  fakeInterval = setInterval(() => {
    onNewData({
      speed: rnd(20),
      cadence: rnd(100),
      power: rnd(400),
      heartRate: rnd(180),
      time: getEpoch(),
    });
  }, 200);

  return { success: true, name: 'Fake data' };
};

export const connectToBluetooth = async (
  onNewData: OnNewData
): Promise<Result> => {
  disconnectFakeData();

  if (bluetoothDevice?.gatt?.connected) {
    console.log(
      'Device is already connected, not attempting another connection'
    );
    return { success: true, name: bluetoothDevice.name || '[unknown name]' };
  }

  const serviceId = 'fitness_machine';
  const characteristicId = 'indoor_bike_data';
  let options = {
    filters: [{ services: [serviceId] }],
  };

  try {
    bluetoothDevice = await navigator.bluetooth.requestDevice(options);
    const server = await bluetoothDevice.gatt!.connect();
    const service = await server.getPrimaryService(serviceId);
    bluetoothCharacteristic = await service.getCharacteristic(characteristicId);

    bluetoothCharacteristic.addEventListener(
      'characteristicvaluechanged',
      (event) => {
        let value = (event.target as any).value as DataView;
        let flags = value.getUint16(0, true).toString(2);

        onNewData({
          speed: value.getUint16(2, true) / 100,
          cadence: value.getUint16(4, true) / 2,
          power: value.getInt16(6, true),
          heartRate: value.getUint8(8),
          time: getEpoch(),
        });
      }
    );

    await bluetoothCharacteristic.startNotifications();
    return { success: true, name: bluetoothDevice.name || '[unknown name]' };
  } catch (e) {
    disconnectBluetooth();
    console.error(e);
    return {
      success: false,
      error: `${e}`,
    };
  }
};

export const pause = () => {
  console.log('pausing!');
  if (bluetoothCharacteristic) {
    bluetoothCharacteristic.stopNotifications();
    return true;
  } else if (fakeInterval !== null) {
    clearInterval(fakeInterval);
    return true;
  } else {
    console.error('No data source is connected to pause');
    return false;
  }
};

export const play = () => {
  if (bluetoothCharacteristic) {
    bluetoothCharacteristic.startNotifications();
    return true;
  } else if (fakeIntervalListener) {
    connectToFakeData(fakeIntervalListener);
    return true;
  } else {
    console.error('No data source is connected to play');
    return false;
  }
};

export const disconnectBluetooth = () => {
  if (bluetoothCharacteristic) {
    bluetoothCharacteristic = null;
  }

  if (bluetoothDevice?.gatt?.connected) {
    console.log('Disconnecting bluetooth device');
    bluetoothDevice.gatt?.disconnect();
    bluetoothDevice = null;
  } else {
    console.log('Bluetooth device is already disconnected');
  }
};

export const disconnectFakeData = () => {
  if (fakeInterval !== null) {
    console.log('Disconnecting fake data');
    clearInterval(fakeInterval);
    fakeInterval = null;
    fakeIntervalListener = null;
  } else {
    console.log('Fake data is already disconnected');
  }
};

export const disconnectAll = () => {
  disconnectBluetooth();
  disconnectFakeData();
};
