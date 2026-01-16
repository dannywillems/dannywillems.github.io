/**
 * Validate article format and front matter.
 *
 * This script is used by the validate-article.yml workflow.
 *
 * @param {Object} github - GitHub API client from actions/github-script
 * @param {Object} context - GitHub Actions context
 * @param {Object} core - GitHub Actions core utilities
 * @param {string} changedFilesStr - Space-separated list of changed files
 */
module.exports = async ({ github, context, core, changedFilesStr }) => {
  const fs = require("fs");
  const path = require("path");

  const changedFiles = changedFilesStr.split(" ").filter((f) => f);
  const errors = [];
  const warnings = [];

  for (const file of changedFiles) {
    if (!file.endsWith(".md")) continue;

    const content = fs.readFileSync(file, "utf8");

    // Check filename format
    const filename = path.basename(file);
    const filenameRegex = /^\d{4}-\d{2}-\d{2}-[\w-]+\.md$/;
    if (!filenameRegex.test(filename)) {
      errors.push(`${file}: Filename should match YYYY-MM-DD-slug.md format`);
    }

    // Check front matter
    const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontMatterMatch) {
      errors.push(`${file}: Missing front matter`);
      continue;
    }

    const frontMatter = frontMatterMatch[1];

    // Required fields
    const requiredFields = ["layout", "title", "date", "author"];
    for (const field of requiredFields) {
      if (!frontMatter.includes(`${field}:`)) {
        errors.push(`${file}: Missing required field: ${field}`);
      }
    }

    // Check layout is 'post'
    if (!frontMatter.includes("layout: post")) {
      warnings.push(`${file}: Layout should be 'post'`);
    }

    // Check author
    if (!frontMatter.includes("author: Danny Willems")) {
      warnings.push(`${file}: Author should be 'Danny Willems'`);
    }

    // Check for tags
    if (!frontMatter.includes("tags:")) {
      warnings.push(`${file}: Consider adding tags`);
    }

    // Check content length (warn if too short)
    const bodyContent = content.replace(/^---[\s\S]*?---/, "").trim();
    if (bodyContent.length < 500) {
      warnings.push(`${file}: Article seems short (${bodyContent.length} chars)`);
    }

    console.log(`Validated: ${file}`);
  }

  // Create comment body
  let comment = "## Article Validation Results\n\n";

  if (errors.length === 0 && warnings.length === 0) {
    comment += "All articles passed validation!\n";
  } else {
    if (errors.length > 0) {
      comment += "### Errors\n\n";
      errors.forEach((e) => (comment += `- ${e}\n`));
      comment += "\n";
    }

    if (warnings.length > 0) {
      comment += "### Warnings\n\n";
      warnings.forEach((w) => (comment += `- ${w}\n`));
    }
  }

  // Post comment on PR
  await github.rest.issues.createComment({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: context.issue.number,
    body: comment,
  });

  // Fail if there are errors
  if (errors.length > 0) {
    core.setFailed(`Validation failed with ${errors.length} error(s)`);
  }
};
