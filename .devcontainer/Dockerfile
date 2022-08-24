ARG NODE_VERSION
FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:0-${NODE_VERSION}
ARG NPM_VERSION

# Install Global NPM Dependencies
RUN npm install -g \
    npm@${NPM_VERSION}

# Install APT Deps
RUN apt update -y \
    && apt install -y \
        yarn