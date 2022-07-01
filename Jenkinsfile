def commitId

pipeline {
  environment {
    SERVER_DIR = "packages/server/"
  }
  agent any
  stages {
    stage('Init') {
      steps {
        script {
          commitId = sh (
              script: 'git rev-parse HEAD',
              returnStdout: true
          ).trim()
          currentBuild.displayName = "#${BUILD_NUMBER} - ${GIT_BRANCH}"
        }
      }
    }
    stage('Install dependencies') {
      steps {
        echo 'Installing dependencies...'
        dir(SERVER_DIR) {
          sh 'yarn install'
        }
      }
    }
    stage('Test') {
      steps {
        echo 'Testing server...'
        dir(SERVER_DIR) {
          sh 'npm run test'
        }
      }
    }
  }

  post {
    always {
      notifyBitbucket commitSha1: commitId,
                      considerUnstableAsSuccess: false,
                      credentialsId: '18464ebb-94fb-40c4-91cb-167f9e1d88ea',
                      disableInprogressNotification: false,
                      ignoreUnverifiedSSLPeer: true,
                      includeBuildNumberInKey: false,
                      prependParentProjectKey: false,
                      projectKey: '',
                      stashServerBaseUrl: 'https://bitbucket.fraunhofer.pt',
                      buildStatus: currentBuild.result,
                      buildName: currentBuild.description
    }
  }
}