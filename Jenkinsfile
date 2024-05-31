def COLOR_MAP = ['SUCCESS': 'good', 'FAILURE': 'danger', 'UNSTABLE': 'danger', 'ABORTED': 'danger']
pipeline {
    agent any
    environment {       
        // xxxx.dkr.ecr.ap-southeast-3.amazonaws.com/{repository_name}
        registry = '103247472190.dkr.ecr.ap-southeast-3.amazonaws.com/kokarmina-accounting-inventory-e2e'
        // registry credential id 
        registryCredential = 'ecr-creds'
        BRANCH_NAME = "${GIT_BRANCH.split("/")[1]}"
        dockerImageTag = "$BUILD_NUMBER-$BRANCH_NAME"
    }
    options {
        timeout(time: 1, unit: 'HOURS') 
        skipDefaultCheckout false
        disableResume()
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
        durabilityHint 'MAX_SURVIVABILITY'       
    }

    stages {  
         stage('Build,Tag and Push Image') {
            steps{
                script {
                    dockerImage = docker.build(registry + ":$dockerImageTag", "-f Dockerfile --no-cache ./")
                }
                script{
                    docker.withRegistry("https://" + registry ,"ecr:ap-southeast-3:" + registryCredential) {
                        dockerImage.push()
                    }
                }
                script {
                    sh "docker rmi $registry:$dockerImageTag"
                }
            }    
        }
    }
}
