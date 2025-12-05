const core = require('@actions/core');
const github = require('@actions/github');

const MISSIVE_LINK_PATTERN = /https:\/\/mail\.missiveapp\.com\/#[^\s]+\/conversations\/[a-zA-Z0-9-]+/;

function containsMissiveLink(text) {
  if (!text) return false;
  return MISSIVE_LINK_PATTERN.test(text);
}

async function run() {
  try {
    const token = core.getInput('github-token', { required: true });
    const label = core.getInput('label') || 'missive-linked';
    
    const octokit = github.getOctokit(token);
    const context = github.context;
    
    core.info(`Event name: ${context.eventName}`);
    core.info(`Action: ${context.payload.action}`);
    
    let commentBody = '';
    let issueNumber = null;
    
    if (context.eventName === 'issue_comment') {
      commentBody = context.payload.comment?.body || '';
      issueNumber = context.payload.issue?.number;
    } else if (context.eventName === 'pull_request_review_comment') {
      commentBody = context.payload.comment?.body || '';
      issueNumber = context.payload.pull_request?.number;
    } else if (context.eventName === 'pull_request_review') {
      commentBody = context.payload.review?.body || '';
      issueNumber = context.payload.pull_request?.number;
    } else if (context.eventName === 'issues') {
      commentBody = context.payload.issue?.body || '';
      issueNumber = context.payload.issue?.number;
    } else if (context.eventName === 'pull_request') {
      commentBody = context.payload.pull_request?.body || '';
      issueNumber = context.payload.pull_request?.number;
    } else {
      core.info(`Unsupported event: ${context.eventName}`);
      return;
    }
    
    if (!issueNumber) {
      core.warning('Could not determine issue/PR number');
      return;
    }
    
    core.info(`Checking comment for Missive links...`);
    core.debug(`Comment body: ${commentBody}`);
    
    if (containsMissiveLink(commentBody)) {
      core.info(`Missive conversation link found! Adding label: ${label}`);
      
      await octokit.rest.issues.addLabels({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: issueNumber,
        labels: [label]
      });
      
      core.info(`Successfully added label "${label}" to issue/PR #${issueNumber}`);
    } else {
      core.info('No Missive conversation link found in this comment');
    }
  } catch (error) {
    core.setFailed(`Action failed: ${error.message}`);
  }
}

module.exports = { run, containsMissiveLink, MISSIVE_LINK_PATTERN };

run();
