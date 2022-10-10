# GitHub Asana Status Action

This action automatically updates linked Asana task statuses:

- PR opened/reopened = 'In Review'
- PR closed/merged = 'Complete' and marked as complete

The link(s) to the Asana task(s) must be present in the PR body for the bot for find the task(s)!

## Inputs

This action requires an `asana-api-token` field as an input. This will be the Asana access point, and the account to move the task status.

## Example usage

```yaml
on:
  pull_request:
    types: [opened, reopened, edited, closed]

jobs:
  set-asana-task-status:
    runs-on: ubuntu-latest
    name: Set Asana task status
    steps:
      - name: Set Asana task status
        uses: OneSignal/GitHubAsanaStatusAction@main
        with:
          asana-api-token: ${{ secrets.ASANA_API_TOKEN }}
```
