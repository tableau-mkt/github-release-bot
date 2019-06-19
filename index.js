const pullRequestMergedHandler = require('./lib/pull-request-merged-handler');

/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Application} app
 */
module.exports = app => {
  app.on('pull_request.closed', pullRequestMergedHandler);
}
