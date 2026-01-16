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

  // Step 1: Get Copilot's actor ID using suggestedActors query
  // See: https://github.com/orgs/community/discussions/164267
  try {
    const actorQuery = `
      query($owner: String!, $repo: String!, $issueNumber: Int!) {
        repository(owner: $owner, name: $repo) {
          issue(number: $issueNumber) {
            id
            suggestedActors(first: 10, capabilities: [CAN_BE_ASSIGNED]) {
              nodes {
                id
                login
              }
            }
          }
        }
      }
    `;

    const actorResult = await github.graphql(actorQuery, {
      owner: context.repo.owner,
      repo: context.repo.repo,
      issueNumber: issue.number,
      headers: {
        "GraphQL-Features": "issues_copilot_assignment_api_support",
      },
    });

    console.log(`Suggested actors: ${JSON.stringify(actorResult)}`);

    const issueId = actorResult.repository.issue.id;
    const actors = actorResult.repository.issue.suggestedActors.nodes;
    const copilot = actors.find(
      (a) => a.login && a.login.toLowerCase() === "copilot"
    );

    if (!copilot) {
      console.log("Copilot not found in suggested actors. Available actors:");
      actors.forEach((a) => console.log(`  - ${a.login} (${a.id})`));
      throw new Error("Copilot not available as assignee");
    }

    console.log(`Found Copilot actor ID: ${copilot.id}`);

    // Step 2: Assign Copilot using the actor ID
    const assignMutation = `
      mutation($issueId: ID!, $actorIds: [ID!]!) {
        addAssigneesToAssignable(input: {
          assignableId: $issueId,
          assigneeIds: $actorIds
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

    const assignResult = await github.graphql(assignMutation, {
      issueId: issueId,
      actorIds: [copilot.id],
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
