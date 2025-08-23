---
title: Booting a LUKS root with a USB keyfile (Debian/Ubuntu initramfs-tools)
author: Danny Willems
post_date: 2025-08-23 00:00:00
layout: post
tags: [linux, luks, cryptsetup, security, initramfs]
---

# A quick story

A few winters ago, I landed in a coworking space before sunrise with a coffee in one hand and a deadline in the other. My laptop greeted me with the familiar LUKS prompt. Fine—except a neighbor kept chatting while I typed my passphrase. I mistyped it twice, glanced at the shoulder behind me, and realized two things: 1) shoulder‑surfing is real, 2) convenience matters when you boot ten times a day.

That night I set up a small USB stick as a physical key. If the stick is plugged in, the machine unlocks silently and quickly. If it is not, LUKS falls back to the passphrase. Same security model, better ergonomics, and far less chance of leaking a passphrase in a crowded room.

# Goal
Keep a keyfile on a USB stick and have the system read it at boot to unlock an encrypted root SSD. If the USB is present, the system auto-unlocks; if not, it falls back to the passphrase.

> Acronyms (once): LUKS = Linux Unified Key Setup. UUID = Universally Unique Identifier.

---

# 0) Prerequisites
- You already boot with an encrypted root (e.g., `/dev/nvme0n1p3`) using a passphrase.
- A USB stick you control (clean it if needed).
- System uses **initramfs-tools** (Debian/Ubuntu default).

Security note: anyone holding the USB can unlock the disk. Keep at least one passphrase slot active as a backup.

---

# 1) Prepare the USB (ext4 example)
Identify the stick and create a single partition:
```bash
lsblk -o NAME,SIZE,MODEL,MOUNTPOINT
sudo parted /dev/sdX --script mklabel gpt
sudo parted /dev/sdX --script mkpart primary ext4 0% 100%
sudo mkfs.ext4 -L KEYSTICK /dev/sdX1
```
Mount it:
```bash
sudo mkdir -p /mnt/keystick
sudo mount /dev/sdX1 /mnt/keystick
```

> If you prefer FAT, use `mkfs.vfat -n KEYSTICK /dev/sdX1` and later add `vfat` (not `ext4`) to the initramfs modules.

---

# 2) Create a keyfile on the USB
Use strong random bytes (testing with a short string is fine, but replace it before production):
```bash
sudo dd if=/dev/urandom of=/mnt/keystick/luks-keyfile bs=4096 count=1 status=none
sudo chmod 0400 /mnt/keystick/luks-keyfile
sudo sync
sudo umount /mnt/keystick
```

---

# 3) Add the USB keyfile to the LUKS volume
Authorize the new key using your existing passphrase:
```bash
sudo mount /dev/sdX1 /mnt/keystick
# replace with your encrypted root partition, e.g. /dev/nvme0n1p3
sudo cryptsetup luksAddKey /dev/nvme0n1p3 /mnt/keystick/luks-keyfile
sudo umount /mnt/keystick
```

Optional: verify the key **without** opening a second mapping (exit code 0 means OK):
```bash
sudo mount /dev/sdX1 /mnt/keystick
sudo cryptsetup open --test-passphrase --key-file /mnt/keystick/luks-keyfile /dev/nvme0n1p3
sudo umount /mnt/keystick
```

---

# 4) Get the two UUIDs you need
```bash
# LUKS (encrypted NVMe partition)
sudo blkid -s UUID -o value /dev/nvme0n1p3
# USB partition
sudo blkid -s UUID -o value /dev/sdX1
```

---

# 5) Edit `/etc/crypttab` (initramfs-tools style)
Use the existing mapper name (e.g., `dm_crypt-0` or `cryptroot`). The simplest working USB setup for initramfs-tools is to use the **passdev** keyscript and a device:path key field:
```
<name> UUID=<LUKS-UUID> /dev/disk/by-uuid/<USB-UUID>:/luks-keyfile luks,keyscript=passdev
```
Example with a 30-second wait for slow USBs (wait is part of the **third** field):
```
dm_crypt-0 UUID=80edd8a0-51ef-43ac-b2c1-62ababd1809a /dev/disk/by-uuid/09179c27-02cd-43a8-a59b-fd6eb8ef9e32:/luks-keyfile:30 luks,keyscript=passdev
```
Do **not** use `keydev=` or `x-systemd.*` options here; those are for systemd/dracut-based initramfs, not for initramfs-tools.

---

# 6) Ensure the initramfs has the right modules
Add filesystem and USB storage modules (match your USB FS: `ext4` or `vfat`):
```bash
echo ext4        | sudo tee -a /etc/initramfs-tools/modules    # or: echo vfat | sudo tee -a ...
echo usb_storage | sudo tee -a /etc/initramfs-tools/modules
echo uas         | sudo tee -a /etc/initramfs-tools/modules
```

---

# 7) Rebuild initramfs and sanity-check
```bash
sudo update-initramfs -u
ls -l /lib/cryptsetup/scripts/passdev
ls -l /dev/disk/by-uuid/<USB-UUID>
sudo mount /dev/disk/by-uuid/<USB-UUID> /mnt && ls -l /mnt/luks-keyfile && sudo umount /mnt
```

---

# 8) Reboot and expected behavior
- USB inserted → the system unlocks automatically with the keyfile.
- USB absent or unreadable → you’re prompted for your passphrase (fallback).

If you still get prompted with the USB inserted, boot using your passphrase and inspect the unit logs:
```bash
journalctl -b -u systemd-cryptsetup@<name>.service
```
Typical fixes: wrong USB UUID or path, USB too slow (use `:/luks-keyfile:60`), or missing modules in initramfs.

---

# 9) Maintenance and safety
- Keep at least one passphrase keyslot enabled:
```bash
sudo cryptsetup luksDump /dev/nvme0n1p3 | grep -A1 'Keyslot'
```
- Back up the keyfile to a second secure medium (offline, encrypted).
- If you tested with a weak key, rotate to a random key and then remove the old one:
```bash
sudo mount /dev/sdX1 /mnt/keystick
sudo dd if=/dev/urandom of=/mnt/keystick/luks-keyfile bs=4096 count=1 status=none
sudo chmod 0400 /mnt/keystick/luks-keyfile
sudo sync
sudo cryptsetup luksAddKey /dev/nvme0n1p3 /mnt/keystick/luks-keyfile
sudo cryptsetup luksRemoveKey /dev/nvme0n1p3     # it will prompt for the old key or passphrase
sudo umount /mnt/keystick
```

---

# Alternative: local key (no USB at boot)
If you want a zero-options `crypttab`, embed the key in the initramfs (less “physical key”, but simpler):
```
<name> UUID=<LUKS-UUID> /etc/keys/luks-keyfile luks
```
Place the file at `/etc/keys/luks-keyfile`, `chmod 0400`, then `sudo update-initramfs -u`. This removes the need for `keyscript=passdev`, but the key is no longer external.
