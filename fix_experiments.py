import json
import re

experiments = [
  {
    "id": 1, "title": "Git Operations & PR", "category": "git", "tagLabel": "Git", "tagClass": "tag-git",
    "goal": "Perform Git operations to commit, push, merge branches, and create a pull request on GitHub.",
    "steps": [
      { "text": "Initialise repo & first commit", "code": 'git init myproject\ncd myproject\necho "# My DevOps Project" > README.md\ngit add README.md\ngit commit -m "Initial commit: add README"', "lang": "bash" },
      { "text": "Create a feature branch & make changes", "code": 'git checkout -b feature/hello\necho "Hello from feature branch" > hello.txt\ngit add hello.txt\ngit commit -m "feat: add hello.txt"', "lang": "bash" },
      { "text": "Push to GitHub & open Pull Request", "code": "git remote add origin https://github.com/<username>/myproject.git\ngit push -u origin feature/hello", "lang": "bash" },
      { "text": "Merge & push main", "code": "git checkout main\ngit merge feature/hello\ngit push origin main\ngit log --oneline --graph", "lang": "bash" }
    ],
    "tip": "On GitHub → go to your repo → click Compare & pull request → add a description → click Create pull request."
  },
  {
    "id": 2, "title": "Dockerise Flask + Hub", "category": "docker", "tagLabel": "Docker", "tagClass": "tag-docker",
    "goal": "Containerise a Flask application using Docker and deploy the image to Docker Hub.",
    "steps": [
      { "text": "Create <code>app.py</code>", "code": "from flask import Flask\napp = Flask(__name__)\n\n@app.route('/')\ndef home():\n    return \"Hello from Dockerised Flask!\"\n\nif __name__ == '__main__':\n    app.run(host='0.0.0.0', port=5000)", "lang": "python" },
      { "text": "Create <code>requirements.txt</code>", "code": "flask", "lang": "text" },
      { "text": "Create <code>Dockerfile</code>", "code": "FROM python:3.11-slim\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install -r requirements.txt\nCOPY . .\nEXPOSE 5000\nCMD [\"python\", \"app.py\"]", "lang": "dockerfile" },
      { "text": "Build, run & push to Docker Hub", "code": "docker build -t <dockerhub-username>/flask-app:latest .\ndocker run -d -p 5000:5000 <dockerhub-username>/flask-app:latest\ndocker login\ndocker push <dockerhub-username>/flask-app:latest", "lang": "bash" }
    ],
    "tip": "Browser shows Hello from Dockerised Flask! — Image visible on Docker Hub under your repository."
  },
  {
    "id": 3, "title": "Monolithic App", "category": "python", "tagLabel": "Python", "tagClass": "tag-python",
    "goal": "Develop and demonstrate a simple monolithic application model using Python or Flask.",
    "steps": [
      { "text": "Create <code>app.py</code> (Complete monolithic app)", "code": "from flask import Flask, request, jsonify\n\napp = Flask(__name__)\nstudents = {}\nnext_id = 1\n\n@app.route('/students', methods=['GET'])\ndef get_students():\n    return jsonify(list(students.values()))\n\n@app.route('/students', methods=['POST'])\ndef add_student():\n    global next_id\n    data = request.get_json()\n    student = {'id': next_id, 'name': data['name'], 'roll': data['roll']}\n    students[next_id] = student\n    next_id += 1\n    return jsonify(student), 201\n\n@app.route('/students/<int:sid>', methods=['DELETE'])\ndef delete_student(sid):\n    students.pop(sid, None)\n    return jsonify({'msg': 'Deleted'})\n\nif __name__ == '__main__':\n    app.run(debug=True)", "lang": "python" },
      { "text": "Run & test with curl", "code": "pip install flask\npython app.py\n\n# Add a student\ncurl -X POST http://localhost:5000/students \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"name\":\"Alice\",\"roll\":\"CS001\"}'\n\n# List all students\ncurl http://localhost:5000/students", "lang": "bash" }
    ],
    "tip": "A monolithic app bundles all features — UI, business logic, and data — into a single deployable unit. Below is a Student CRUD REST API in Flask."
  },
  {
    "id": 4, "title": "CI – GitHub Actions", "category": "ci", "tagLabel": "CI/CD", "tagClass": "tag-ci",
    "goal": "Create a CI pipeline using GitHub Actions to build and push a Docker image of a Python app to Docker Hub.",
    "steps": [
      { "text": "Add secrets to GitHub repo: <code>DOCKER_USERNAME</code> and <code>DOCKER_PASSWORD</code>" },
      { "text": "Create <code>.github/workflows/docker-publish.yml</code>", "code": "name: Build and Push Docker Image\n\non:\n  push:\n    branches: [ main ]\n\njobs:\n  build-push:\n    runs-on: ubuntu-latest\n    steps:\n      - name: Checkout code\n        uses: actions/checkout@v3\n\n      - name: Log in to Docker Hub\n        uses: docker/login-action@v3\n        with:\n          username: ${{ secrets.DOCKER_USERNAME }}\n          password: ${{ secrets.DOCKER_PASSWORD }}\n\n      - name: Build Docker image\n        run: docker build -t ${{ secrets.DOCKER_USERNAME }}/python-app:latest .\n\n      - name: Push to Docker Hub\n        run: docker push ${{ secrets.DOCKER_USERNAME }}/python-app:latest", "lang": "yaml" }
    ],
    "tip": "Every push to main triggers a green workflow run in the Actions tab and the image appears on Docker Hub."
  },
  {
    "id": 5, "title": "Jenkins Pipeline", "category": "jenkins", "tagLabel": "Jenkins", "tagClass": "tag-jenkins",
    "goal": "Configure a Jenkins pipeline to automate the building and deployment of a Dockerized application from GitHub.",
    "steps": [
      { "text": "Start Jenkins container", "code": "docker volume create jenkins-data\ndocker run -d \\\n  --name jenkins \\\n  -p 8080:8080 -p 50000:50000 \\\n  -v jenkins-data:/var/jenkins_home \\\n  -v /var/run/docker.sock:/var/run/docker.sock \\\n  jenkins/jenkins:lts\n\n# Get initial password\ndocker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword", "lang": "bash" },
      { "text": "Install Docker CLI inside Jenkins container", "code": "docker exec -u root jenkins bash -c \\\n  \"apt-get update && apt-get install -y docker.io\"", "lang": "bash" },
      { "text": "Create <code>Jenkinsfile</code> in root of GitHub repo", "code": "pipeline {\n    agent any\n    environment {\n        IMAGE_NAME      = \"myapp\"\n        DOCKER_HUB_USER = \"<your-dockerhub-username>\"\n    }\n    stages {\n        stage('Clone') {\n            steps {\n                git branch: 'main',\n                    url: 'https://github.com/<username>/<repo>.git'\n            }\n        }\n        stage('Build Image') {\n            steps {\n                sh 'docker build -t $DOCKER_HUB_USER/$IMAGE_NAME:latest .'\n            }\n        }\n        stage('Push to Hub') {\n            steps {\n                withCredentials([usernamePassword(\n                    credentialsId: 'dockerhub-creds',\n                    usernameVariable: 'DOCKER_USER',\n                    passwordVariable: 'DOCKER_PASS'\n                )]) {\n                    sh '''\n                      echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin\n                      docker push $DOCKER_HUB_USER/$IMAGE_NAME:latest\n                    '''\n                }\n            }\n        }\n        stage('Deploy') {\n            steps {\n                sh 'docker run -d -p 5000:5000 $DOCKER_HUB_USER/$IMAGE_NAME:latest'\n            }\n        }\n    }\n}", "lang": "groovy" },
      { "text": "Jenkins pipeline setup: New Item → Pipeline → Pipeline script from SCM → Add Docker Hub credentials → Build Now" }
    ],
    "tip": "Jenkins runs inside Docker — no Java installation needed on the host. The Docker socket is mounted so Jenkins can build and push images directly."
  },
  {
    "id": 6, "title": "kubectl Basics", "category": "k8s", "tagLabel": "Kubernetes", "tagClass": "tag-k8s",
    "goal": "Use kubectl commands to create, scale, and manage Kubernetes resources like pods and deployments.",
    "steps": [
      { "text": "Create a deployment", "code": "kubectl create deployment myapp --image=nginx:latest\nkubectl get deployments\nkubectl get pods", "lang": "bash" },
      { "text": "Scale the deployment", "code": "# Scale up to 3 replicas\nkubectl scale deployment myapp --replicas=3\nkubectl get pods\n\n# Scale back down\nkubectl scale deployment myapp --replicas=1", "lang": "bash" },
      { "text": "Expose, inspect & clean up", "code": "kubectl expose deployment myapp --port=80 --type=NodePort\nkubectl get services\nkubectl describe pod <pod-name>\nkubectl logs <pod-name>\n\n# Clean up\nkubectl delete deployment myapp\nkubectl delete service myapp", "lang": "bash" },
      { "text": "Using a YAML manifest (<code>deployment.yaml</code>)", "code": "apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: myapp\nspec:\n  replicas: 2\n  selector:\n    matchLabels:\n      app: myapp\n  template:\n    metadata:\n      labels:\n        app: myapp\n    spec:\n      containers:\n      - name: myapp\n        image: nginx:latest\n        ports:\n        - containerPort: 80", "lang": "yaml" },
      { "text": "Apply the manifest", "code": "kubectl apply -f deployment.yaml\nkubectl get all", "lang": "bash" }
    ],
    "tip": "kubectl is the command line tool to interact with your Kubernetes cluster."
  },
  {
    "id": 7, "title": "Actions Auto Push", "category": "ci", "tagLabel": "CI/CD", "tagClass": "tag-ci",
    "goal": "Create a GitHub Actions pipeline to automatically build and push a Docker image of a Python app to Docker Hub.",
    "steps": [
      { "text": "Create <code>.github/workflows/build-push.yml</code>", "code": "name: Docker Build & Push\n\non:\n  push:\n    branches: [ main ]\n  pull_request:\n    branches: [ main ]\n\njobs:\n  docker:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v3\n\n      - name: Set up Docker Buildx\n        uses: docker/setup-buildx-action@v3\n\n      - name: Login to Docker Hub\n        uses: docker/login-action@v3\n        with:\n          username: ${{ secrets.DOCKER_USERNAME }}\n          password: ${{ secrets.DOCKER_PASSWORD }}\n\n      - name: Build and push\n        uses: docker/build-push-action@v5\n        with:\n          context: .\n          push: true\n          tags: ${{ secrets.DOCKER_USERNAME }}/python-app:latest", "lang": "yaml" }
    ],
    "tip": "Uses the official docker/build-push-action for best-practice multi-platform builds with Docker Buildx."
  },
  {
    "id": 8, "title": "Containerise Flask", "category": "docker", "tagLabel": "Docker", "tagClass": "tag-docker",
    "goal": "Containerise a Flask application using Docker.",
    "steps": [
      { "text": "Create <code>app.py</code>", "code": "from flask import Flask\napp = Flask(__name__)\n\n@app.route('/')\ndef index():\n    return \"<h1>Flask app running in Docker!</h1>\"\n\nif __name__ == '__main__':\n    app.run(host='0.0.0.0', port=5000)", "lang": "python" },
      { "text": "Create <code>Dockerfile</code>", "code": "FROM python:3.11-slim\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\nCOPY . .\nEXPOSE 5000\nCMD [\"python\", \"app.py\"]", "lang": "dockerfile" },
      { "text": "Build & run", "code": "docker build -t flask-container .\ndocker run -d -p 5000:5000 --name myflask flask-container\ndocker ps\n# Visit http://localhost:5000", "lang": "bash" }
    ],
    "tip": "This question focuses only on containerisation — no push to Docker Hub required (that's Q2)."
  },
  {
    "id": 9, "title": "Clone Modify Push", "category": "git", "tagLabel": "Git", "tagClass": "tag-git",
    "goal": "Clone a GitHub repository, modify a file and push the changes back to the repository.",
    "steps": [
      { "text": "Clone repository", "code": "git clone https://github.com/<username>/<repo-name>.git\ncd <repo-name>", "lang": "bash" },
      { "text": "Modify a file", "code": "echo \"Updated content\" >> README.md\ncat README.md\ngit diff", "lang": "bash" },
      { "text": "Commit & push", "code": "git add README.md\ngit commit -m \"docs: update README with new content\"\ngit push origin main\ngit log --oneline -3", "lang": "bash" }
    ],
    "tip": "Make sure you have access to the repository and have authenticated Git."
  },
  {
    "id": 10, "title": "Actions Build & Test", "category": "ci", "tagLabel": "CI/CD", "tagClass": "tag-ci",
    "goal": "Configure a GitHub Actions workflow to automatically build and test a Python application.",
    "steps": [
      { "text": "Create <code>app.py</code>", "code": "def add(a, b):\n    return a + b\n\ndef greet(name):\n    return f\"Hello, {name}!\"", "lang": "python" },
      { "text": "Create <code>test_app.py</code>", "code": "from app import add, greet\n\ndef test_add():\n    assert add(2, 3) == 5\n\ndef test_greet():\n    assert greet(\"World\") == \"Hello, World!\"", "lang": "python" },
      { "text": "Create <code>requirements.txt</code>", "code": "pytest", "lang": "text" },
      { "text": "Create <code>.github/workflows/python-test.yml</code>", "code": "name: Python Build & Test\n\non:\n  push:\n    branches: [ main ]\n  pull_request:\n    branches: [ main ]\n\njobs:\n  build-test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v3\n\n      - name: Set up Python\n        uses: actions/setup-python@v4\n        with:\n          python-version: '3.11'\n\n      - name: Install dependencies\n        run: pip install -r requirements.txt\n\n      - name: Run tests\n        run: pytest test_app.py -v", "lang": "yaml" }
    ],
    "tip": "GitHub Actions shows 2 passed with green checkmarks. Every push to main automatically runs the tests."
  }
]

json_data = json.dumps(experiments, indent=2)

with open('/Users/albert/IdeaProjects/gcp/24CS2019_DevOps_Lab.html', 'r') as f:
    html = f.read()

match = re.search(r'const experiments = \[.*?\];', html, flags=re.DOTALL)
if match:
    html = html[:match.start()] + f'const experiments = {json_data};' + html[match.end():]

with open('/Users/albert/IdeaProjects/gcp/24CS2019_DevOps_Lab.html', 'w') as f:
    f.write(html)
