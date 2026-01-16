/**
 * Find unassigned article issues and add a comment prompting Copilot assignment.
 *
 * This script is used by the daily-claude-code-article.yml workflow.
 *
 * @param {Object} github - GitHub API client from actions/github-script
 * @param {Object} context - GitHub Actions context
 */
module.exports = async ({ github, context }) => {
  // Find open issues that are article tasks (start with "Article:")
  const issues = await github.rest.issues.listForRepo({
    owner: context.repo.owner,
    repo: context.repo.repo,
    state: "open",
    per_page: 100,
  });

  // Filter for article issues without assignees
  const articleIssues = issues.data.filter(
    (issue) =>
      issue.title.startsWith("Article:") && issue.assignees.length === 0
  );

  if (articleIssues.length === 0) {
    console.log("No unassigned article issues found.");
    return;
  }

  // Pick the first unassigned article issue
  const issue = articleIssues[0];
  console.log(
    `Found unassigned article issue: #${issue.number} - ${issue.title}`
  );

  // Add a comment with instructions
  await github.rest.issues.createComment({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: issue.number,
    body: `This issue is ready for Copilot to work on.

To assign Copilot, open this issue in the GitHub UI and assign "Copilot" from the assignee dropdown.`,
  });

  console.log(`Added comment to issue #${issue.number}`);
  console.log(`URL: ${issue.html_url}`);
};
