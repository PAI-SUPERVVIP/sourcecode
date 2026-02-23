FROM node:20-slim

RUN apt-get update && apt-get install -y \
    curl \
    git \
    python3 \
    sudo \
    && rm -rf /var/lib/apt/lists/*

RUN npm install -g opencode-ai

ENV OPENCODE_SERVER_PASSWORD=vipvip
ENV OPENCODE_SERVER_USERNAME=sloth

WORKDIR /workspace

EXPOSE 4096

CMD ["sh", "-c", "opencode web --hostname 0.0.0.0 --port ${PORT:-4096}"]
