# Encrypted legacy repository backup

`legacy-repositories.sfmbackup` contains verified Git bundle backups of every
nonempty SOURFACEMUSIC repository that existed before the July 18, 2026 GitHub
cleanup. The bundles preserve all branches and commit history.

The archive uses authenticated AES-256-GCM encryption because several source
repositories were private. The restore key is intentionally not stored in this
public repository. It was saved in the owner's local cleanup recovery files.

`SOURFACEMUSIC-LLC/.codex` was not included because it was an empty repository
with no commits, tracked files, or branches. The thousands of files shown for it
were local Codex-generated files that were never committed or uploaded.

Use `restore_backup.py` with the local restore-key file to decrypt the archive.
