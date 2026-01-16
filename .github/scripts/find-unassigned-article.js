/**
 * Find unassigned article issues and assign Copilot to write the article.
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

  // Assign Copilot to the issue
  try {
    await github.rest.issues.addAssignees({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: issue.number,
      assignees: ["Copilot"],
    });
    console.log(`Assigned Copilot to issue #${issue.number}`);
  } catch (error) {
    console.log(`Failed to assign Copilot: ${error.message}`);
    // Add a comment as fallback
    await github.rest.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: issue.number,
      body: `Failed to auto-assign Copilot. Please assign manually from the GitHub UI.`,
    });
  }

  console.log(`URL: ${issue.html_url}`);
};
