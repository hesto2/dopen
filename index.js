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

if (argv._[0] == 'p' || argv._[0] == 'pull') {
  newPR()
}

if (argv._[0] == 'op' || argv._[0] == 'open-pulls') {
  goToOpenPrs()
}

if (argv._[0] == 'j' || argv._[0] == 'jira') {
  goToJira()
}

function goToJira() {
  getBranch()
    .then(branch => {
      let url = `${jiraUrl}/browse/${branch}`
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