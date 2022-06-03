type OnNewData = (data: BluetoothData) => void;
type Result = { success: true } | { success: false; error: string };
export interface BluetoothData {
  speed: number;
  cadence: number;
  power: number;
  heartRate: number;
  time: number;
}

let bluetoothDevice: BluetoothDevice | null = null;
let fakeInterval: NodeJS.Timer | null = null;

const getEpoch = () => Math.round(Date.now() / 1000);

export const connectToFakeData = async (
  onNewData: OnNewData
): Promise<Result> => {
  disconnectBluetooth();

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

  return { success: true };
};

export const connectToBluetooth = async (
  onNewData: OnNewData
): Promise<Result> => {
  disconnectFakeData();

  if (bluetoothDevice?.gatt?.connected) {
    console.log(
      'Device is already connected, not attempting another connection'
    );
    return { success: true };
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
    const characteristic = await service.getCharacteristic(characteristicId);

    await characteristic.startNotifications();
    characteristic.addEventListener('characteristicvaluechanged', (event) => {
      let value = (event.target as any).value as DataView;
      let flags = value.getUint16(0, true).toString(2);

      onNewData({
        speed: value.getUint16(2, true) / 100,
        cadence: value.getUint16(4, true) / 2,
        power: value.getInt16(6, true),
        heartRate: value.getUint8(8),
        time: getEpoch(),
      });
    });

    return { success: true };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      error: `${e}`,
    };
  }
};

export const disconnectBluetooth = () => {
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
  } else {
    console.log('Fake data is already disconnected');
  }
};

export const disconnectAll = () => {
  disconnectBluetooth();
  disconnectFakeData();
}