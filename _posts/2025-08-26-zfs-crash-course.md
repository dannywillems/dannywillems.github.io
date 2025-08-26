---
title: ZFS Crash Course
author: Danny Willems
post_date: 2025-08-26 00:00:00
layout: post
tags: [ZFS, Filesystem, Storage, Linux]
---

ZFS is one of those technologies you only need to set up once to realize you’ll
never go back. Originally developed by Sun Microsystems, it combines the roles
of a volume manager and a filesystem. That means you don’t need LVM + ext4 +
mdadm—ZFS handles storage pooling, snapshots, compression, checksumming,
replication, and more, all in one place.

This crash course is designed for people who just installed ZFS and want to get
productive fast.

## Why ZFS?

- **Data integrity**: Everything is checksummed, preventing silent corruption
  (“bit rot”).
- **Snapshots & clones**: Create instant, lightweight backups or dev
  environments.
- **Pooled storage**: Add disks into a pool; ZFS manages space dynamically.
- **Compression & deduplication**: Save space with built-in algorithms (lz4,
  gzip, etc.).
- **Replication**: Send incremental snapshots to another server for easy
  backups.

## Core Concepts

- **Pool (zpool)**  
  A pool is the top-level storage object. You create it from one or more devices
  (disks, partitions, or files).
- **Vdevs (Virtual Devices)**  
  Under the hood, pools are made of _vdevs_. A vdev can be:
  - a single disk
  - a mirror (like RAID1)
  - a raidz (RAID-like parity: raidz1 ≈ RAID5, raidz2 ≈ RAID6, etc.)

- **Datasets**  
  Once you have a pool, you create filesystems or volumes inside it. These are
  called datasets. Each dataset can have its own properties (compression,
  quotas, mountpoints, etc.).

## Basic Workflow

### 1. Create a Pool

Say you have two disks: `/dev/sdb` and `/dev/sdc`. To create a mirrored pool
named `tank`:

```bash
zpool create tank mirror /dev/sdb /dev/sdc
```

To check its status:

```bash
zpool status
```

### 2. Add a Dataset

Datasets are like sub-filesystems:

```bash
zfs create tank/data
zfs set compression=lz4 tank/data
```

Now `tank/data` is mounted and ready to use.

### 3. Snapshots & Rollbacks

Create a snapshot:

```bash
zfs snapshot tank/data@before-upgrade
```

Rollback if something breaks:

```bash
zfs rollback tank/data@before-upgrade
```

### 4. Send & Receive (Backups)

To send a snapshot to another host:

```bash
zfs send tank/data@before-upgrade | ssh user@backuphost zfs receive backup/data
```

### 5. Monitoring

Check usage:

```bash
zfs list
```

Check health:

```bash
zpool status -v
```

## Recommended Settings

- **Compression**: `lz4` (fast, efficient, always a win).
- **atime**: disable it unless you need access time tracking:
  ```bash
  zfs set atime=off tank/data
  ```
- **Snapshots**: automate them with cron/systemd timers.
- **Scrubs**: schedule monthly checks:
  ```bash
  zpool scrub tank
  ```

## Things to Keep in Mind

- Plan vdevs carefully: you _cannot_ change the layout later (e.g., turning
  single disks into mirrors).
- Deduplication is tempting but memory-hungry. Unless you know what you’re
  doing, skip it.
- Always test restore procedures, not just backups.
- ZFS likes RAM. The rule of thumb is **1 GB RAM per TB of storage**, but it
  runs fine with less for small pools.

## Quick Cheat Sheet

```bash
# Create a pool
zpool create tank mirror /dev/sdb /dev/sdc

# Create a dataset
zfs create tank/projects

# Set compression
zfs set compression=lz4 tank/projects

# Take a snapshot
zfs snapshot tank/projects@2025-08-26

# Rollback to snapshot
zfs rollback tank/projects@2025-08-26

# Backup with send/receive
zfs send tank/projects@2025-08-26 | ssh backup zfs receive tank-backup/projects
```

## Conclusion

ZFS is much more than a filesystem—it’s a full data management platform. With
snapshots, replication, and built-in integrity checks, it’s one of the most
robust choices for anyone who cares about their data.

If you’ve just set it up on your server, spend some time learning its
philosophy: pools, datasets, snapshots. With that foundation, you’ll have a
rock-solid storage system that grows with your needs.
