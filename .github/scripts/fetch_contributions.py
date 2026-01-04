#!/usr/bin/env python3
"""
Fetch GitHub contributions and aggregate by repository and time period.
Outputs JSON to stdout.
"""

import json
import urllib.request
from datetime import datetime, timedelta
from collections import defaultdict


def get_events(username, page=1):
    """Fetch events from GitHub API"""
    url = f"https://api.github.com/users/{username}/events/public?per_page=100&page={page}"
    req = urllib.request.Request(url, headers={"User-Agent": "GitHub-Action"})
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode())
    except Exception as e:
        print(f"Error fetching page {page}: {e}", file=__import__('sys').stderr)
        return []


def get_all_events(username, max_pages=3):
    """Fetch multiple pages of events"""
    all_events = []
    for page in range(1, max_pages + 1):
        events = get_events(username, page)
        if not events:
            break
        all_events.extend(events)
    return all_events


def main():
    username = "dannywillems"
    events = get_all_events(username)

    # Time boundaries
    now = datetime.utcnow()
    week_ago = now - timedelta(days=7)
    month_ago = now - timedelta(days=30)
    quarter_ago = now - timedelta(days=90)
    year_ago = now - timedelta(days=365)

    # Aggregate by repo and time period
    contributions = defaultdict(lambda: {
        "week": {"commits": 0, "prs": 0, "issues": 0, "reviews": 0, "total": 0},
        "month": {"commits": 0, "prs": 0, "issues": 0, "reviews": 0, "total": 0},
        "quarter": {"commits": 0, "prs": 0, "issues": 0, "reviews": 0, "total": 0},
        "year": {"commits": 0, "prs": 0, "issues": 0, "reviews": 0, "total": 0},
    })

    totals = {
        "week": {"commits": 0, "prs": 0, "issues": 0, "reviews": 0, "total": 0},
        "month": {"commits": 0, "prs": 0, "issues": 0, "reviews": 0, "total": 0},
        "quarter": {"commits": 0, "prs": 0, "issues": 0, "reviews": 0, "total": 0},
        "year": {"commits": 0, "prs": 0, "issues": 0, "reviews": 0, "total": 0},
    }

    for event in events:
        repo = event["repo"]["name"]
        event_time = datetime.fromisoformat(
            event["created_at"].replace("Z", "+00:00")
        ).replace(tzinfo=None)
        event_type = event["type"]

        # Determine which time periods this event falls into
        periods = []
        if event_time >= week_ago:
            periods.append("week")
        if event_time >= month_ago:
            periods.append("month")
        if event_time >= quarter_ago:
            periods.append("quarter")
        if event_time >= year_ago:
            periods.append("year")

        # Count by type
        for period in periods:
            if event_type == "PushEvent":
                commit_count = len(event.get("payload", {}).get("commits", []))
                contributions[repo][period]["commits"] += commit_count
                contributions[repo][period]["total"] += commit_count
                totals[period]["commits"] += commit_count
                totals[period]["total"] += commit_count
            elif event_type == "PullRequestEvent":
                contributions[repo][period]["prs"] += 1
                contributions[repo][period]["total"] += 1
                totals[period]["prs"] += 1
                totals[period]["total"] += 1
            elif event_type == "IssuesEvent":
                contributions[repo][period]["issues"] += 1
                contributions[repo][period]["total"] += 1
                totals[period]["issues"] += 1
                totals[period]["total"] += 1
            elif event_type in ["PullRequestReviewEvent", "PullRequestReviewCommentEvent"]:
                contributions[repo][period]["reviews"] += 1
                contributions[repo][period]["total"] += 1
                totals[period]["reviews"] += 1
                totals[period]["total"] += 1

    # Convert to list and sort by total contributions
    repos = []
    for repo, data in contributions.items():
        repos.append({
            "name": repo,
            "url": f"https://github.com/{repo}",
            "week": data["week"],
            "month": data["month"],
            "quarter": data["quarter"],
            "year": data["year"],
        })

    # Sort by year total, then month, then week
    repos.sort(
        key=lambda x: (x["year"]["total"], x["month"]["total"], x["week"]["total"]),
        reverse=True
    )

    output = {
        "updated_at": now.isoformat() + "Z",
        "totals": totals,
        "repositories": repos,
    }

    print(json.dumps(output, indent=2))


if __name__ == "__main__":
    main()
