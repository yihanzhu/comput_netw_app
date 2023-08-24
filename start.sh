#!/bin/bash

# turn off to avoid conflicts when changing student ids
docker-compose down

# List of student IDs
student_ids=("id1" "id2" "id3")

# Base port numbers
backend_base_port=5100
frontend_base_port=3100

# Base docker-compose.yml content with master services
cat <<EOF > docker-compose.yml
version: '3'

services:
  backend-master:
    build:
      context: ./master/backend
      dockerfile: Dockerfile
    ports:
      - "5000:5000"

  frontend-master:
    build:
      context: ./master/frontend
      dockerfile: Dockerfile
      args:
        - NODE_TYPE=MASTER
    ports:
      - "3000:3000"
    depends_on:
      - backend-master
EOF

# Append slave services to docker-compose.yml
for index in "${!student_ids[@]}"; do
    student_id=${student_ids[$index]}
    backend_port=$((backend_base_port + index))
    frontend_port=$((frontend_base_port + index))

    cat <<EOF >> docker-compose.yml

  backend-slave-$student_id:
    build:
      context: ./slave/backend
      dockerfile: Dockerfile
    environment:
      - SLAVE_ID=$student_id
    ports:
      - '$backend_port:5000'

  frontend-slave-$student_id:
    build:
      context: ./slave/frontend
      dockerfile: Dockerfile
      args:
        - NODE_TYPE=SLAVE
    ports:
      - '$frontend_port:3000'
    depends_on:
      - backend-slave-$student_id
EOF
done


docker-compose up -d