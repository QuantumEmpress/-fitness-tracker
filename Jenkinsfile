pipeline {
    agent { label 'dat' }

    environment {
        DOCKER_HUB_USER = 'quantumempress'
        BACKEND_IMAGE = "${DOCKER_HUB_USER}/fitness-tracker-backend"
        FRONTEND_IMAGE = "${DOCKER_HUB_USER}/fitness-tracker-frontend"
    }

    stages {

        stage('Checkout') {
            steps {
                git url: 'https://github.com/QuantumEmpress/-fitness-tracker.git', branch: 'main'
            }
        }

        stage('Unit Tests') {
            steps {
                dir('fitness-tracker-backend') {
                    bat 'mvn test'
                }
            }
        }

        stage('Build Backend') {
            steps {
                dir('fitness-tracker-backend') {
                    bat 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('fitness-tracker-frontend') {
                    bat 'npm install --legacy-peer-deps'
                    bat 'npm run build'
                }
            }
        }

        stage('Docker Build & Push') {
            steps {
                script {
                    withCredentials([usernamePassword(
                        credentialsId: 'docker-hub',
                        usernameVariable: 'USERNAME',
                        passwordVariable: 'PASSWORD'
                    )]) {
                        bat "docker login -u %USERNAME% -p %PASSWORD%"
                        bat "docker build -t ${BACKEND_IMAGE}:v1.0 fitness-tracker-backend"
                        bat "docker push ${BACKEND_IMAGE}:v1.0"
                        bat "docker build -t ${FRONTEND_IMAGE}:v1.0 fitness-tracker-frontend"
                        bat "docker push ${FRONTEND_IMAGE}:v1.0"
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                bat 'kubectl apply -f k8s\\secrets.yaml --validate=false'
                bat 'kubectl apply -f k8s\\backend.yaml --validate=false'
                bat 'kubectl apply -f k8s\\frontend.yaml --validate=false'
                bat 'kubectl rollout restart deployment/fitness-backend'
                bat 'kubectl rollout restart deployment/fitness-frontend'
            }
        }
    }

    post {
        always {
            script {
                try {
                    mail to: 'prexcy99@gmail.com',
                         subject: "Pipeline Completed: ${currentBuild.fullDisplayName}",
                         body: "Build finished with status: ${currentBuild.currentResult}\n\n${env.BUILD_URL}"
                } catch (Exception e) {
                    echo "Email notification failed: ${e.message}"
                }
            }
        }
    }
}
