/**
 * Retarget a PR from master to develop.
 *
 * This script is used by the retarget-dependabot.yml workflow.
 *
 * @param {Object} github - GitHub API client from actions/github-script
 * @param {Object} context - GitHub Actions context
 */
module.exports = async ({ github, context }) => {
  const prNumber = context.payload.pull_request.number;

  console.log(`Retargeting PR #${prNumber} from master to develop`);

  await github.rest.pulls.update({
    owner: context.repo.owner,
    repo: context.repo.repo,
    pull_number: prNumber,
    base: "develop",
  });

  await github.rest.issues.createComment({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: prNumber,
    body: "Automatically retargeted this PR from `master` to `develop`.",
  });

  console.log(`PR #${prNumber} retargeted to develop`);
};
