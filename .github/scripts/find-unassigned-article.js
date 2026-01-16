/**
 * Find unassigned article issues and assign Copilot to write the article.
 *
 * This script is used by the daily-claude-code-article.yml workflow.
 *
 * @param {Object} github - GitHub API client from actions/github-script
 * @param {Object} context - GitHub Actions context
 */
module.exports = async ({ github, context }) => {
  // Copilot's bot ID (obtained from an issue where Copilot was manually assigned)
  const COPILOT_BOT_ID = "BOT_kgDOC9w8XQ";

  // Find open issues that are article tasks (start with "Article:")
  const issues = await github.rest.issues.listForRepo({
    owner: context.repo.owner,
    repo: context.repo.repo,
    state: "open",
    per_page: 100,
  });

  // Filter for article issues without Copilot assigned
  const articleIssues = issues.data.filter(
    (issue) =>
      issue.title.startsWith("Article:") &&
      !issue.assignees.some((a) => a.login === "Copilot")
  );

  if (articleIssues.length === 0) {
    console.log("No article issues without Copilot assigned.");
    return;
  }

  // Pick the first unassigned article issue
  const issue = articleIssues[0];
  console.log(
    `Found article issue without Copilot: #${issue.number} - ${issue.title}`
  );

  // Get the issue's node ID
  const issueQuery = `
    query($owner: String!, $repo: String!, $issueNumber: Int!) {
      repository(owner: $owner, name: $repo) {
        issue(number: $issueNumber) {
          id
        }
      }
    }
  `;

  try {
    const issueResult = await github.graphql(issueQuery, {
      owner: context.repo.owner,
      repo: context.repo.repo,
      issueNumber: issue.number,
    });

    const issueId = issueResult.repository.issue.id;
    console.log(`Issue node ID: ${issueId}`);

    // Assign Copilot using its bot ID
    const assignMutation = `
      mutation($issueId: ID!, $actorIds: [ID!]!) {
        addAssigneesToAssignable(input: {
          assignableId: $issueId,
          assigneeIds: $actorIds
        }) {
          assignable {
            ... on Issue {
              id
            }
          }
        }
      }
    `;

    const assignResult = await github.graphql(assignMutation, {
      issueId: issueId,
      actorIds: [COPILOT_BOT_ID],
      headers: {
        "GraphQL-Features": "issues_copilot_assignment_api_support",
      },
    });

    console.log(`Assigned Copilot to issue #${issue.number}`);
    console.log(`Result: ${JSON.stringify(assignResult)}`);
  } catch (error) {
    console.log(`Failed to assign Copilot: ${error.message}`);

    // Fallback: add a comment
    await github.rest.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: issue.number,
      body: `Failed to auto-assign Copilot. Please assign Copilot manually from the GitHub UI.`,
    });
  }

  console.log(`URL: ${issue.html_url}`);
};
