# Dopen
Tool that will take care of the following for you from the command line:
- Open a github repo's page
- Open up to a specific branch
- Open a new PR
- Open to a Jira ticket (that matches your branch name)

## Installation
`npm install -g dopen`

## Usage
Dopen must be run from within a github project in order to work. Here are a list of the available commands:
```
dopen r  - Opens the github's main repo page
dopen b  - Opens the branch on github
dopen p  - Opens the "new pull request" page
dopen op - Opens the "Open Pull requests" page
dopen j  - Opens the ticket with the same name as the current branch in Jira
```