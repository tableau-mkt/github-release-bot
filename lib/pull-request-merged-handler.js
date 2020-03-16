const releaseBuilder = require('./github-release-body-builder');

module.exports = async (context, app) => {
  // Ignore pull requests that were closed but not merged.
  if (!context.payload.pull_request.merged) return

  // Also ignore pull requests that don't merge into master (ie base:master).
  if (context.payload.pull_request.base.ref !== 'master') return

  // Create authenticated Github client.
  const gh = await app.auth(context.payload.installation.id);

  const release = await releaseBuilder(context, gh);

  if (release.draftExist === false) {
    await gh.repos.createRelease(release.data);
  } else {
    await gh.repos.updateRelease(release.data);
  }
}
