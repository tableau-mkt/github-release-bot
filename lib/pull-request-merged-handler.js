const releaseBuilder = require('./github-release-body-builder');

module.exports = async context => {
  // Ignore pull requests that were closed but not merged.
  if (!context.payload.pull_request.merged) return

  const release = await releaseBuilder(context);

  if (release.draftExist === false) {
    await context.github.repos.createRelease(release.data);
  } else {
    await context.github.repos.updateRelease(release.data);
  }
}
