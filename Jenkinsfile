pipeline {
  agent any

  environment {
    DOCKER_REGISTRY = ''
    IMAGE_BACKEND = 'bhavyan_backend'
    IMAGE_FRONTEND = 'bhavyan_frontend'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build Backend Image') {
      steps {
        dir('backend') {
          script {
            docker.build("${IMAGE_BACKEND}")
          }
        }
      }
    }

    stage('Build Frontend Image') {
      steps {
        dir('frontend') {
          script {
            docker.build("${IMAGE_FRONTEND}")
          }
        }
      }
    }

    stage('Deploy') {
      steps {
        dir('docker') {
          sh 'docker-compose down'
          sh 'docker-compose up -d'
        }
      }
    }
  }

  post {
    always {
      echo 'Pipeline finished.'
    }
  }
}
