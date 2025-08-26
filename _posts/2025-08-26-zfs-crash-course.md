---
title: ZFS Crash Course
author: Danny Willems
post_date: 2025-08-26 21:45:00
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

At LeakIX, we rely on ZFS for our own datasets, where we manage tens of
terabytes of security scan data. The reliability and snapshotting features are
critical for handling that scale safely.

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

### What is a ZFS Scrub?

### Checking Scrub Status

You can check the status of scrubs directly with ZFS commands:

- **Show last or current scrub progress**

```bash
zpool status
```

The output includes a `scan:` line showing when the last scrub was run, how much
data was scanned, and whether errors were found.

- **Run a scrub**

```bash
zpool scrub poolname
```

- **Monitor progress in real time**

```bash
watch -n 10 zpool status poolname
```

- **Stop a running scrub**

```bash
zpool scrub -s poolname
```

A **scrub** is a data integrity check that scans all data in the pool, verifies
checksums, and repairs any corrupted blocks using redundancy (from mirrors or
raidz).  
You can think of it like `fsck` for ZFS, but online and non-disruptive. Scrubs
should be scheduled periodically (e.g., monthly) to catch and fix silent
corruption before it spreads.

### What is atime?

The **atime** property tracks the last access time of files. While useful for
some workloads (e.g., mail servers), it causes additional writes every time a
file is read, which can hurt performance.  
For most datasets, it’s safe and recommended to disable it with:

```bash
zfs set atime=off pool/dataset
```

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

## Understanding the ZFS Cache

ZFS uses an advanced caching system to improve performance:

- **ARC (Adaptive Replacement Cache)**  
  Stored in RAM, ARC caches both frequently accessed and recently accessed data.
  The bigger your RAM, the better your ARC performance.

- **L2ARC (Level 2 ARC)**  
  An optional extension of ARC that lives on fast devices like SSDs or NVMe
  drives. L2ARC is useful if you have limited RAM but still need to accelerate
  read performance.

- **ZIL (ZFS Intent Log)**  
  Handles synchronous writes. By default it lives on the pool itself, but you
  can place it on a fast dedicated SSD (called an SLOG) to speed up workloads
  with many sync writes (databases, VMs).

### Adding an NVMe as a Cache Device

If your pool is backed by slower spinning disks and you don’t want to rely only
on RAM, you can add a fast NVMe drive as an **L2ARC** device. This extends your
ARC cache from RAM to the NVMe, reducing pressure on memory while still
accelerating reads.

Example:

```bash
zpool add tank cache /dev/nvme0n1
```

Keep in mind:

- L2ARC is volatile: cached data is lost on reboot.
- L2ARC helps most with read-heavy workloads on datasets larger than RAM.
- Adding too much L2ARC without enough RAM to index it may reduce performance,
  so balance carefully.

### Best Practices

- Ensure you have enough RAM: the classic guideline is **1 GB per 1 TB of
  storage**, but more RAM almost always improves ARC hit rates.
- Only add an L2ARC device if your working dataset is much larger than RAM and
  read-heavy.
- Consider a dedicated SLOG device if you run applications with heavy
  synchronous writes.

You can inspect ARC stats directly from `/proc/spl/kstat/zfs/arcstats` on Linux
or use monitoring exporters to visualize hit ratios over time.

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

## References and Further Reading

- [OpenZFS Documentation](https://openzfs.github.io/openzfs-docs/)
- [ZFS on Linux Wiki](https://github.com/openzfs/zfs/wiki)
- [Grafana Dashboards for ZFS](https://grafana.com/grafana/dashboards/?search=zfs)
- [LeakIX](https://leakix.net)
