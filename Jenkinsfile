pipeline {
    agent {label 'agent-1'}
    environment {
        SONAR_HOME = tool 'sonar-scanner'
    }

    stages {

         stage('Clone repo') {
            steps {
                git url: 'https://github.com/awsdevop183/react-frontend-ecommerce.git',branch: 'main'
            }
        }
         stage("Static code analysis with SonarQube") {
            steps {
                withSonarQubeEnv("sonar") {
                    sh "$SONAR_HOME/bin/sonar-scanner -Dsonar.projectKey=devsecopsb03 -Dsonar.projectName=demo"
                }

            }
         }

         stage("Dependency scan") {
            steps {
               dependencyCheck additionalArguments: '--scan ./', odcInstallation: 'OWASP'
               dependencyCheckPublisher pattern: '**/dependency-check-report.xml'

            }
         }
    
         stage("Scan filesystem using Trivy") {
            steps {
                sh "trivy fs -f table -o trivy-output.xml ."
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
        stage('create a container') {
            steps {
                sh "docker compose up -d"
                // sh "docker run -d --name dev -p 80:80 awsdevops183/jenkinstest"
            }
        }
    }


}

