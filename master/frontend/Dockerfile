# Use the official Node.js 14 image.
# https://hub.docker.com/_/node
FROM node:14

# Sample for frontend's Dockerfile
ARG NODE_TYPE
ENV REACT_APP_NODE_TYPE=$NODE_TYPE

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install production dependencies.
RUN npm install --only=production

RUN npm install socket.io-client
RUN npm install

# Copy local code to the container image.
COPY . ./

# Build the app
RUN npm run build

# Run the web service on container startup.
CMD [ "npm", "start" ]
