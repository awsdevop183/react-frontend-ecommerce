pipeline {
    agent {label 'agent-1'}

    stages {
        stage('Clone repo') {
            steps {
                git url: "https://github.com/awsdevop183/react-frontend-ecommerce.git", branch: "main"
            }
        }
         stage('Build Docker image') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-creds', usernameVariable: 'user', passwordVariable: 'pass')]) {

                sh "docker build -t ${env.user}/jenkinstest ."
                sh "docker login -u ${env.user} -p ${env.pass}"
                sh "docker push ${env.user}/jenkinstest"
            }
            }
        }
        // stage('Push image to Dockerhub') {
        //     steps {
        //         sh "docker build - ."
        //     }
        // }
        stage('create a container') {
            steps {
                sh "docker rm -f dev || true"
                sh "docker run -d --name dev -p 80:80 awsdevops183/jenkinstest"
            }
        }
    }


}



// withCredentials([usernamePassword(credentialsId: 'docker-creds', usernameVariable: 'user', passwordVariable: 'pass')])
