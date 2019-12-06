# Peymynt-web

## Notes : 

Latest code (sales module) is on `release2` branch.

## How to maintain code

1. All branch name must be in lowercase
2. User branch - Create a new branch with your name (ex irfan) from `release2` branch
3. Task branch - Based on jira id assigned to you, create new branch from your own branch
4. Branch naming convention should be <name-initials>/<jira-id> (ex ir/134)
5. Once you are done with task, merge task branch(jira id branch) to User branch (your name). ex git merge ir/134
6. Send PR from user branch to `release2` branch

## Setup firebase

1. `npm install -g firebase-tools`
2. `firebase deploy --only hosting:dev-peymynt`