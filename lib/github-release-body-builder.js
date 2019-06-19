const moment = require('moment');
const date = moment().format('YYYY.MM.DD');
// Github by default sets the environment variable GITHUB_REPOSITORY,
// in the format octocat/hello-word.
// See https://developer.github.com/actions/creating-github-actions/accessing-the-runtime-environment/
const ghOwnerRepo = process.env.GITHUB_REPOSITORY;

module.exports = async context => {
  context.log(ghOwnerRepo);
  const gh = ghOwnerRepo.split('/');

  // Get most recent release in the repository. 
  const releases = await context.github.repos.listReleases({
    owner: gh[0],
    repo: gh[1],
    per_page: 1,
    page: 1
  });

  const release = {
    draftExist: releases.data[0].draft,
    data: {
      owner: gh[0],
      repo: gh[1],
      tag_name: date,
      name: `Deployment ${date}`
    }
  }

  // Construct a string to add to Github Release body.
  const devNotesRegExp = /## ?(?:Dev Notes|Developer Notes)\r\n([\s\S]+?)(?:\r\n#|$)/i;
  const releaseNotesRegExp = /## ?(?:Release|Stakeholder) Notes\r\n([\s\S]+?)(?:\r\n#|$)/i;
  const pr = context.payload.pull_request;
  release.data.body = '## ' + pr.title + '\r\n' +
                '### Stakeholder notes' + '\r\n' + pr.body.match(releaseNotesRegExp)[1] + '\r\n' +
                '### Developer notes' + '\r\n' + pr.body.match(devNotesRegExp)[1] + '\r\n';

  if (release.draftExist) {
    release.data.release_id = releases.data[0].id;
    release.data.body += '\r\n' + releases.data[0].body; 

    return release;
  } else {
    release.data.draft = true;

    return release;
  }
}
