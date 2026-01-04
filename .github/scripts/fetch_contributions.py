#!/usr/bin/env python3
"""
Fetch GitHub contributions using GraphQL API for accurate historical data.
Outputs JSON to stdout.

Requires GH_TOKEN environment variable for authentication.
"""

import json
import os
import urllib.request
from datetime import datetime, timedelta


def graphql_query(query, token):
    """Execute a GraphQL query against GitHub API"""
    url = "https://api.github.com/graphql"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
        "User-Agent": "GitHub-Action"
    }
    data = json.dumps({"query": query}).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers=headers)
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode())
    except Exception as e:
        print(f"Error: {e}", file=__import__('sys').stderr)
        return None


def get_contributions_for_period(username, token, from_date, to_date):
    """Get contribution stats for a specific time period"""
    query = f"""
    {{
      user(login: "{username}") {{
        contributionsCollection(from: "{from_date.isoformat()}Z", to: "{to_date.isoformat()}Z") {{
          totalCommitContributions
          totalPullRequestContributions
          totalPullRequestReviewContributions
          totalIssueContributions
          totalRepositoriesWithContributedCommits
          commitContributionsByRepository(maxRepositories: 100) {{
            repository {{
              nameWithOwner
              url
            }}
            contributions {{
              totalCount
            }}
          }}
          pullRequestContributionsByRepository(maxRepositories: 100) {{
            repository {{
              nameWithOwner
              url
            }}
            contributions {{
              totalCount
            }}
          }}
          issueContributionsByRepository(maxRepositories: 100) {{
            repository {{
              nameWithOwner
              url
            }}
            contributions {{
              totalCount
            }}
          }}
          pullRequestReviewContributionsByRepository(maxRepositories: 100) {{
            repository {{
              nameWithOwner
              url
            }}
            contributions {{
              totalCount
            }}
          }}
        }}
      }}
    }}
    """
    return graphql_query(query, token)


def aggregate_repo_contributions(data):
    """Aggregate contributions by repository from GraphQL response"""
    repos = {}

    if not data or "data" not in data or not data["data"]["user"]:
        return repos, {}

    collection = data["data"]["user"]["contributionsCollection"]

    totals = {
        "commits": collection["totalCommitContributions"],
        "prs": collection["totalPullRequestContributions"],
        "reviews": collection["totalPullRequestReviewContributions"],
        "issues": collection["totalIssueContributions"],
        "repos_contributed": collection["totalRepositoriesWithContributedCommits"],
        "total": (
            collection["totalCommitContributions"] +
            collection["totalPullRequestContributions"] +
            collection["totalPullRequestReviewContributions"] +
            collection["totalIssueContributions"]
        )
    }

    # Aggregate by repository
    for item in collection.get("commitContributionsByRepository", []):
        repo_name = item["repository"]["nameWithOwner"]
        if repo_name not in repos:
            repos[repo_name] = {"url": item["repository"]["url"], "commits": 0, "prs": 0, "reviews": 0, "issues": 0, "total": 0}
        repos[repo_name]["commits"] = item["contributions"]["totalCount"]
        repos[repo_name]["total"] += item["contributions"]["totalCount"]

    for item in collection.get("pullRequestContributionsByRepository", []):
        repo_name = item["repository"]["nameWithOwner"]
        if repo_name not in repos:
            repos[repo_name] = {"url": item["repository"]["url"], "commits": 0, "prs": 0, "reviews": 0, "issues": 0, "total": 0}
        repos[repo_name]["prs"] = item["contributions"]["totalCount"]
        repos[repo_name]["total"] += item["contributions"]["totalCount"]

    for item in collection.get("issueContributionsByRepository", []):
        repo_name = item["repository"]["nameWithOwner"]
        if repo_name not in repos:
            repos[repo_name] = {"url": item["repository"]["url"], "commits": 0, "prs": 0, "reviews": 0, "issues": 0, "total": 0}
        repos[repo_name]["issues"] = item["contributions"]["totalCount"]
        repos[repo_name]["total"] += item["contributions"]["totalCount"]

    for item in collection.get("pullRequestReviewContributionsByRepository", []):
        repo_name = item["repository"]["nameWithOwner"]
        if repo_name not in repos:
            repos[repo_name] = {"url": item["repository"]["url"], "commits": 0, "prs": 0, "reviews": 0, "issues": 0, "total": 0}
        repos[repo_name]["reviews"] = item["contributions"]["totalCount"]
        repos[repo_name]["total"] += item["contributions"]["totalCount"]

    return repos, totals


def main():
    username = "dannywillems"
    token = os.environ.get("GH_TOKEN") or os.environ.get("GITHUB_TOKEN")

    if not token:
        print("Error: GH_TOKEN or GITHUB_TOKEN environment variable required", file=__import__('sys').stderr)
        __import__('sys').exit(1)

    now = datetime.utcnow()

    # Define time periods
    periods_config = {
        "week": (now - timedelta(days=7), now),
        "month": (now - timedelta(days=30), now),
        "quarter": (now - timedelta(days=90), now),
        "year": (now - timedelta(days=365), now),
    }

    all_repos = {}
    totals = {}

    for period_name, (from_date, to_date) in periods_config.items():
        data = get_contributions_for_period(username, token, from_date, to_date)
        repos, period_totals = aggregate_repo_contributions(data)
        totals[period_name] = period_totals

        for repo_name, repo_data in repos.items():
            if repo_name not in all_repos:
                all_repos[repo_name] = {
                    "name": repo_name,
                    "url": repo_data["url"],
                    "week": {"commits": 0, "prs": 0, "reviews": 0, "issues": 0, "total": 0},
                    "month": {"commits": 0, "prs": 0, "reviews": 0, "issues": 0, "total": 0},
                    "quarter": {"commits": 0, "prs": 0, "reviews": 0, "issues": 0, "total": 0},
                    "year": {"commits": 0, "prs": 0, "reviews": 0, "issues": 0, "total": 0},
                }
            all_repos[repo_name][period_name] = {
                "commits": repo_data["commits"],
                "prs": repo_data["prs"],
                "reviews": repo_data["reviews"],
                "issues": repo_data["issues"],
                "total": repo_data["total"],
            }

    # Convert to sorted list
    repos_list = list(all_repos.values())
    repos_list.sort(
        key=lambda x: (x["year"]["total"], x["quarter"]["total"], x["month"]["total"]),
        reverse=True
    )

    output = {
        "updated_at": now.isoformat() + "Z",
        "totals": totals,
        "repositories": repos_list,
    }

    print(json.dumps(output, indent=2))


if __name__ == "__main__":
    main()
