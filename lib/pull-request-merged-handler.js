const releaseBuilder = require('./github-release-body-builder');

module.exports = async context => {
  // Ignore pull requests that were closed but not merged.
  if (!context.payload.pull_request.merged) return

  // Also ignore pull requests that don't merge into master (ie base:master).
  if (context.payload.pull_request.base.ref !== 'master') return

  const release = await releaseBuilder(context);

  if (release.draftExist === false) {
    await context.github.repos.createRelease(release.data);
  } else {
    await context.github.repos.updateRelease(release.data);
  }
}
