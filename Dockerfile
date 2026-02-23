FROM ghcr.io/bon5co/opencode-webui-workspace:latest

RUN chmod +x /root/.opencode/bin/opencode 2>/dev/null || true
RUN chmod +x /entrypoint.sh 2>/dev/null || true

EXPOSE 4096

CMD ["/entrypoint.sh"]
