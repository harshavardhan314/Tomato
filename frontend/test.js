import http from 'k6/http';

export const options = {
  vus: 1000000,
  duration: '10s',
};

export default function () {
  http.get('https://tomato-frontend-new.onrender.com');
}