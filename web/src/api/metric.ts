import { BluetoothData } from '../utils/bluetooth';
import { API_BASE_URL, fetchWithAuth } from './common';

export const uploadMetric = async (metricData: BluetoothData[], sessionId: string) => {
  const postData = {
    data: metricData,
    session: {
      id: sessionId
    }
  };

  const response = await fetchWithAuth(`${API_BASE_URL}/metric`, {
    method: 'POST',
    body: JSON.stringify(postData),
  });

  if (!response.ok) {
    let message = await response.json();
    return {
      success: false,
      ...message
    }
  }

  return { success: true };
};
