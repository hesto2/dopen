#!/usr/bin/env node
const argv = require('minimist')(process.argv.slice(2));
const {
  exec
} = require('child_process');
const open = require('open')
const jiraUrl = 'https://podiumco.atlassian.net'

if (argv._[0] == 'r' || argv._[0] == 'repo') {
  goToRepo()
}

if (argv._[0] == 'b' || argv._[0] == 'branch') {
  goToBranch()
}

if (argv._[0] == 'p' || argv._[0] == 'pull' || argv._[0] == 'pr') {
  newPR()
}

if (argv._[0] == 'op' || argv._[0] == 'open-pulls') {
  goToOpenPrs()
}

if (argv._[0] == 'j' || argv._[0] == 'jira') {
  goToJira()
}

if (argv._[0] == 'h' || argv._[0] == 'help' || argv.h || argv.help || argv._.length == 0) {
  showHelp()
}

function showHelp(){
  console.log("dopen help:")
  console.log("usage: dopen <argument>")
  console.log("")
  console.log("r  | repo        Opens the proejct's repo page")
  console.log("b  | branch      Opens the proejct to the current branch")
  console.log("p  | pull | pr   Opens the new pr dialogue for the current branch")
  console.log("op | open-pulls Opens to the page where you can view all open PRs for the current repo")
  console.log("j  | jira        Opens to the jira ticket associated with the branch (branch name must include the jira ticket in it somewhere)")
  console.log("h  | help        Opens the help dialogue")
  console.log("")
}

function goToJira() {
  getBranch()
    .then(branch => {
      let url = `${jiraUrl}/browse/${parseJiraTicket(branch)}`
      open(url)
    })
}

function newPR() {
  getBranch()
    .then(branch => {
      getRemote()
        .then(url => {
          url = `${url}/compare/${branch}?expand=1`
          open(url);
        })
    })
}

function goToBranch() {
  getBranch()
    .then(branch => {
      getRemote()
        .then(url => {
          url = `${url}/tree/${branch}`
          open(url);
        })
    })
}

function goToOpenPrs() {
  getRemote()
    .then(url => {
      url = `${url}/pulls`
      open(url);
    })
}


function goToRepo() {
  getRemote().then(url => {
    open(url);
  })
}

function getRemote() {
  return new Promise((resolve, reject) => {
    exec(`git -C ${process.cwd()} remote get-url origin`, (err, stdout, stderr) => {
      let url = parseRemote(stdout)
      resolve(url)
    })
  })
}

function getBranch() {
  return new Promise((resolve, reject) => {
    exec(`git -C ${process.cwd()} rev-parse --abbrev-ref HEAD`, (err, stdout, stderr) => {
      resolve(stdout.trim())
    })
  })
}

function parseJiraTicket(branch) {
  const result = /\w+-\d+/.exec(branch);
  if (result == null) return branch;
  return result[0];
}

function parseRemote(remote) {
  remote = remote.replace('.git', '');
  if (remote.indexOf('http') >= 0) {
    return remote.trim();
  } else {
    remote = remote.replace('git@', '');
    remote = remote.replace(':', '/')
    return `https://${remote}`.trim()
  }
}
