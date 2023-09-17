import * as nock from 'nock';

console.log('OUT GLOBAL SETUP');

module.exports = async function () {
  console.log('IN GLOBAL SETUP');
  console.log(process.env.GITHUB_ACTIONS);
  if (!process.env.GITHUB_ACTIONS) {
    nock.disableNetConnect();
    nock.enableNetConnect(/127\.0\.0\.1/);
  }
};
