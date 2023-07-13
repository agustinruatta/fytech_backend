import * as nock from 'nock';

module.exports = async function () {
  if (!process.env.GITHUB_ACTIONS) {
    nock.disableNetConnect();
  }
};
