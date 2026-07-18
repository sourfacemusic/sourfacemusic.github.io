from __future__ import annotations

import argparse
import base64
import re
from pathlib import Path

from cryptography.hazmat.primitives.ciphers.aead import AESGCM


MAGIC = b"SFMBAK1"


def main() -> None:
    parser = argparse.ArgumentParser(description="Restore the encrypted legacy Git backup")
    parser.add_argument("archive", type=Path)
    parser.add_argument("key_file", type=Path)
    parser.add_argument("output_zip", type=Path)
    args = parser.parse_args()

    match = re.search(r"^Key:\s*(\S+)\s*$", args.key_file.read_text(encoding="utf-8"), re.MULTILINE)
    if not match:
        raise SystemExit("Restore key not found in key file")

    encrypted = args.archive.read_bytes()
    if encrypted[: len(MAGIC)] != MAGIC:
        raise SystemExit("Archive header is invalid")

    nonce_start = len(MAGIC)
    nonce_end = nonce_start + 12
    nonce = encrypted[nonce_start:nonce_end]
    ciphertext = encrypted[nonce_end:]
    key = base64.urlsafe_b64decode(match.group(1))
    restored = AESGCM(key).decrypt(nonce, ciphertext, MAGIC)

    args.output_zip.parent.mkdir(parents=True, exist_ok=True)
    args.output_zip.write_bytes(restored)
    print(f"Restored {args.output_zip}")


if __name__ == "__main__":
    main()
