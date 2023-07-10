import * as nock from 'nock';

module.exports = async function () {
  nock.disableNetConnect();
};
