const moment = require('moment');
const date = moment().format('YYYY.MM.DD');
const ghOwner = process.env.GH_OWNER;
const ghRepo = process.env.GH_REPO;

module.exports = async context => {
  // Get most recent release in the repository. 
  const releases = await context.github.repos.listReleases({
    owner: ghOwner,
    repo: ghRepo,
    per_page: 1,
    page: 1
  });

  const release = {
    draftExist: releases.data[0].draft,
    data: {
      owner: ghOwner,
      repo: ghRepo,
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
                '### Developer notes' + '\r\n' + pr.body.match(devNotesRegExp)[1] + '\r\n'

  if (release.draftExist) {
    release.data.release_id = releases.data[0].id;
    release.data.body += '\r\n' + releases.data[0].body; 

    return release;
  } else {
    release.data.draft = true;

    return release;
  }
}
