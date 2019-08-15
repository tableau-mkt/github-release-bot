const moment = require('moment');
const date = moment().format('YYYY.MM.DD');

module.exports = async context => {
  // Grab the <org|user>/<repo> information from payload.
  const ghOwnerRepo = context.payload.pull_request.head.repo.full_name;
  const gh = ghOwnerRepo.split('/');
  context.log(gh);

  // Get most recent release in the repository. 
  const releases = await context.github.repos.listReleases({
    owner: gh[0],
    repo: gh[1],
    per_page: 1,
    page: 1
  });

  const release = {
    draftExist: releases.data[0] !== undefined ? releases.data[0].draft : false,
    data: {
      owner: gh[0],
      repo: gh[1],
      tag_name: `v${date}`,
      name: date
    }
  }

  // Construct a string to add to Github Release body.
  const devNotesRegExp = /## ?(?:Dev Notes|Developer Notes)\r\n([\s\S]+?)(?:\r\n#|$)/i;
  const releaseNotesRegExp = /## ?(?:Release|Stakeholder) Notes\r\n([\s\S]+?)(?:\r\n#|$)/i;
  const pr = context.payload.pull_request;
  const devNotes = pr.body.match(devNotesRegExp) !== null ? pr.body.match(devNotesRegExp)[1] : 'N/A';
  const stakeholderNotes = pr.body.match(releaseNotesRegExp) !== null ? pr.body.match(releaseNotesRegExp)[1] : 'N/A';
  release.data.body = `## ${pr.title} #${pr.number} @${pr.user.login}\r\n### Stakeholder notes\r\n ${stakeholderNotes} \r\n### Developer notes\r\n${devNotes}\r\n`;

  if (release.draftExist) {
    release.data.release_id = releases.data[0].id;
    release.data.body += '\r\n' + releases.data[0].body; 

    return release;
  } else {
    release.data.draft = true;

    return release;
  }
}
