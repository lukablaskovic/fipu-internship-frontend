#!/usr/bin/env python3
"""Poll main and deploy the corresponding published frontend image with Compose."""
import fcntl
import hashlib
import os
from pathlib import Path
import re
import subprocess
import time
from urllib.request import urlopen

SERVICE = "fipu-praksa-frontend"
IMAGE = "lukablaskovic/fp-fipu-internship-frontend"
SITE = "https://fipu-praksa.unipu.hr"
CONFIG = Path("docker-compose.yml")


def output(*args):
    return subprocess.check_output(args, text=True).strip()


def activate():
    subprocess.run(["docker", "compose", "config", "--quiet"], check=True)
    subprocess.run(["docker", "compose", "up", "-d", "--no-deps", SERVICE], check=True)
    # The edge resolves the container IP when it loads its configuration.
    subprocess.run(["docker", "exec", "nginx", "nginx", "-t"], check=True)
    subprocess.run(["docker", "exec", "nginx", "nginx", "-s", "reload"], check=True)


def verify(image_id):
    if output("docker", "inspect", "-f", "{{.Image}}", SERVICE) != image_id:
        raise RuntimeError("Unexpected running frontend image")
    expected = output("docker", "exec", SERVICE, "sha256sum", "/usr/share/nginx/html/index.html").split()[0]
    for attempt in range(6):
        try:
            with urlopen(SITE + "/prijava", timeout=8) as response:
                shell = response.read()
            if hashlib.sha256(shell).hexdigest() != expected:
                raise RuntimeError("Public HTML differs from the running frontend")
            asset = re.search(rb'<script[^>]+src="(/assets/[^"]+\.js)"', shell)
            if not asset:
                raise RuntimeError("Missing frontend entry script")
            with urlopen(SITE + asset[1].decode(), timeout=8) as response:
                if "javascript" not in response.headers.get_content_type() or not response.read(1):
                    raise RuntimeError("Frontend entry script unavailable")
            return
        except (OSError, RuntimeError):
            if attempt == 5:
                raise
            time.sleep(2)


def main_revision():
    return output("git", "ls-remote", "--exit-code", "https://github.com/lukablaskovic/fipu-internship-frontend.git", "refs/heads/main").split()[0]


def deploy():
    revision = main_revision()
    if not re.fullmatch(r"[a-f0-9]{40}", revision):
        raise RuntimeError("Unexpected main revision")
    label = '{{index .Config.Labels "org.opencontainers.image.revision"}}'
    if output("docker", "inspect", "-f", label, SERVICE) == revision:
        return
    state = Path.home() / ".local/state/praksa-frontend"
    failed = state / "failed-revision"
    if failed.exists() and failed.read_text().strip() == revision:
        return
    tag = IMAGE + ":sha-" + revision
    subprocess.run(["docker", "pull", tag], check=True)
    refs = output("docker", "image", "inspect", "-f", '{{range .RepoDigests}}{{println .}}{{end}}', tag).splitlines()
    image = next(ref for ref in refs if re.fullmatch(re.escape(IMAGE) + r"@sha256:[a-f0-9]{64}", ref))
    if main_revision() != revision:
        return
    if output("docker", "image", "inspect", "-f", label, image) != revision:
        raise RuntimeError("Image revision differs from the pushed commit")
    image_id = output("docker", "image", "inspect", "-f", "{{.Id}}", image)
    previous = CONFIG.read_bytes()
    # Change only the frontend image, retaining the live configuration and file permissions.
    pattern = rb"(?m)(^  fipu-praksa-frontend:\n(?:    [^\n]*\n)*?    image: )[^\n]+"
    updated, matches = re.subn(pattern, lambda m: m[1] + image.encode(), previous)
    if matches != 1:
        raise RuntimeError("Could not identify a unique frontend image")
    previous_id = output("docker", "inspect", "-f", "{{.Image}}", SERVICE)
    backup = state / "compose.previous.yml"
    backup.parent.mkdir(mode=0o700, parents=True, exist_ok=True)
    backup.write_bytes(previous)
    if CONFIG.read_bytes() != previous:
        raise RuntimeError("Compose file changed during deployment")
    try:
        CONFIG.write_bytes(updated)
        activate()
        verify(image_id)
    except BaseException:
        if CONFIG.read_bytes() != updated:
            raise RuntimeError("Compose file changed; inspect it before rollback")
        CONFIG.write_bytes(previous)
        activate()
        verify(previous_id)
        failed.write_text(revision + "\n")
        raise
    print("Deployed frontend", revision, image)


if __name__ == "__main__":
    os.umask(0o077)
    os.chdir("/home/ntankovic/praksa")
    with (Path.home() / ".praksa-frontend.lock").open("a") as lock:
        try:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            pass
        else:
            deploy()
