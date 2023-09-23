import * as nock from 'nock';

module.exports = async function () {
  if (!process.env.GITHUB_ACTIONS) {
    nock.disableNetConnect();
    nock.enableNetConnect(/127\.0\.0\.1/);
  }
};
