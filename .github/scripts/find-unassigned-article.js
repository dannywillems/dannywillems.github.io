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

  // Assign Copilot to the issue using GraphQL API with Copilot assignment support
  // See: https://github.blog/changelog/2025-12-03-assign-issues-to-copilot-using-the-api/
  try {
    const mutation = `
      mutation($issueId: ID!) {
        addAssigneesToAssignable(input: {
          assignableId: $issueId,
          assigneeIds: ["copilot"]
        }) {
          assignable {
            ... on Issue {
              id
              assignees(first: 5) {
                nodes {
                  login
                }
              }
            }
          }
        }
      }
    `;

    const result = await github.graphql(mutation, {
      issueId: issue.node_id,
      headers: {
        "GraphQL-Features": "issues_copilot_assignment_api_support",
      },
    });

    console.log(`Assigned Copilot to issue #${issue.number}`);
    console.log(`Result: ${JSON.stringify(result)}`);
  } catch (error) {
    console.log(`Failed to assign Copilot via GraphQL: ${error.message}`);

    // Fallback: add a comment
    await github.rest.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: issue.number,
      body: `@copilot Please write an article for this issue.\n\nFailed to auto-assign. Please assign Copilot manually from the GitHub UI.`,
    });
  }

  console.log(`URL: ${issue.html_url}`);
};
