const releaseBuilder = require('./lib/github-release-body-builder');

/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Application} app
 */
module.exports = app => {
  app.on('pull_request.closed', async context => {
    // Ignore pull requests that were closed but not merged.
    if (!context.payload.pull_request.merged) return

    // Also ignore pull requests that don't merge into master (ie base:master).
    if (context.payload.pull_request.base.ref !== 'master') return

    // Renew token.
    context.github = await app.auth(context.payload.installation.id);

    const release = await releaseBuilder(context);

    // Create new release or update existing draft.
    if (release.draftExist === false) {
      await context.github.repos.createRelease(release.data);
    } else {
      await context.github.repos.updateRelease(release.data);
    }
  });
}
