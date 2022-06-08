const FITBIT_API_URL = 'https://www.fitbit.com';

export const performFitbitOauth = () => {
  fetch(`${FITBIT_API_URL}/oauth2/authorize`, {
    method: 'POST'
  });
}