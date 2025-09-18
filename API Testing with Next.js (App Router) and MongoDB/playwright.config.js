export default {
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:3000',
    extraHTTPHeaders: {
      'Accept': 'application/json'
    },
  },
  reporter: 'list',
};
