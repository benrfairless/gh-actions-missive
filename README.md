# Missive Conversation Tagger

A GitHub Action that automatically tags issues and PRs with a customizable label when a Missive conversation link is found in comments.

## Features

- Automatically detects Missive conversation links in issue/PR comments
- Adds a customizable label to the issue or PR
- Supports issue comments, PR comments, PR reviews, and issue/PR body text

## Usage

Add this workflow to your repository (e.g., `.github/workflows/missive-tagger.yml`):

```yaml
name: Missive Conversation Tagger

on:
  issue_comment:
    types: [created, edited]
  pull_request_review_comment:
    types: [created, edited]
  pull_request_review:
    types: [submitted, edited]
  issues:
    types: [opened, edited]
  pull_request:
    types: [opened, edited]

jobs:
  tag-missive:
    runs-on: ubuntu-latest
    permissions:
      issues: write
      pull-requests: write
    steps:
      - name: Tag Missive Conversations
        uses: benrfairless/gh-actions-missive@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          label: 'missive-linked'  # Optional: customize the label
```

## Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `github-token` | GitHub token for API access | Yes | `${{ github.token }}` |
| `label` | The label to apply when a Missive conversation is linked | No | `missive-linked` |

## Example

When a comment like this is added to an issue or PR:

> Missive conversation: https://mail.missiveapp.com/#inbox/conversations/1abc23-be16-b987-a123-cab31756ee47

The action will automatically add the configured label (default: `missive-linked`) to that issue or PR.

## Supported Events

- `issue_comment` - Comments on issues
- `pull_request_review_comment` - Comments on PR code reviews
- `pull_request_review` - PR review submissions
- `issues` - Issue body creation/edits
- `pull_request` - PR body creation/edits

## License

MIT License - see [LICENSE](LICENSE) for details.
