---
title: Booting a LUKS root with a USB keyfile (Debian/Ubuntu initramfs-tools)
author: Danny Willems
post_date: 2025-08-23 00:00:00
layout: post
tags: [linux, luks, cryptsetup, security, initramfs]
---

I boot my laptop probably ten times a day. Every single time, LUKS asks for my
passphrase. It got old fast, especially in coworking spaces where someone is
always sitting close enough to watch you type.

So I set up a USB stick as a physical key. Plug it in, machine unlocks. No
stick, it falls back to the passphrase. Here is how.

---

# What you need

- An encrypted root partition (e.g. `/dev/nvme0n1p3`) that currently unlocks
  with a passphrase
- A USB stick
- A system using **initramfs-tools** (Debian/Ubuntu default)

Keep at least one passphrase slot active. If you lose the USB, you still need a
way in.

---

# 1) Format the USB

Find your stick and partition it:

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

FAT works too (`mkfs.vfat -n KEYSTICK /dev/sdX1`), just swap `ext4` for `vfat`
in the initramfs modules later.

---

# 2) Generate a keyfile

```bash
sudo dd if=/dev/urandom of=/mnt/keystick/luks-keyfile bs=4096 count=1 status=none
sudo chmod 0400 /mnt/keystick/luks-keyfile
sudo sync
sudo umount /mnt/keystick
```

4096 random bytes. That is your key.

---

# 3) Add the keyfile to LUKS

```bash
sudo mount /dev/sdX1 /mnt/keystick
sudo cryptsetup luksAddKey /dev/nvme0n1p3 /mnt/keystick/luks-keyfile
sudo umount /mnt/keystick
```

It will ask for your existing passphrase. To verify it worked:

```bash
sudo mount /dev/sdX1 /mnt/keystick
sudo cryptsetup open --test-passphrase --key-file /mnt/keystick/luks-keyfile /dev/nvme0n1p3
sudo umount /mnt/keystick
```

Exit code 0 means you are good.

---

# 4) Grab the UUIDs

You need two:

```bash
# the encrypted partition
sudo blkid -s UUID -o value /dev/nvme0n1p3
# the USB partition
sudo blkid -s UUID -o value /dev/sdX1
```

---

# 5) Edit `/etc/crypttab`

This is the part that took me a while to get right. For initramfs-tools, you
want the **passdev** keyscript. The format is:

```
<name> UUID=<LUKS-UUID> /dev/disk/by-uuid/<USB-UUID>:/luks-keyfile luks,keyscript=passdev
```

With a 30-second timeout for slow USBs:

```
dm_crypt-0 UUID=80edd8a0-51ef-43ac-b2c1-62ababd1809a /dev/disk/by-uuid/09179c27-02cd-43a8-a59b-fd6eb8ef9e32:/luks-keyfile:30 luks,keyscript=passdev
```

Do **not** use `keydev=` or `x-systemd.*` options. Those are for systemd/dracut,
not initramfs-tools.

---

# 6) Add the initramfs modules

The initramfs needs to know about your USB filesystem and USB storage:

```bash
echo ext4        | sudo tee -a /etc/initramfs-tools/modules
echo usb_storage | sudo tee -a /etc/initramfs-tools/modules
echo uas         | sudo tee -a /etc/initramfs-tools/modules
```

Replace `ext4` with `vfat` if you used FAT.

---

# 7) Rebuild and check

```bash
sudo update-initramfs -u
ls -l /lib/cryptsetup/scripts/passdev
ls -l /dev/disk/by-uuid/<USB-UUID>
sudo mount /dev/disk/by-uuid/<USB-UUID> /mnt && ls -l /mnt/luks-keyfile && sudo umount /mnt
```

---

# 8) Reboot

- USB plugged in: unlocks automatically.
- USB not there: passphrase prompt as usual.

If it still asks for the passphrase with the USB in, boot normally and check:

```bash
journalctl -b -u systemd-cryptsetup@<name>.service
```

Common problems: wrong UUID, USB too slow (bump the timeout to 60), missing
kernel modules.

---

# Maintenance

Check your keyslots periodically:

```bash
sudo cryptsetup luksDump /dev/nvme0n1p3 | grep -A1 'Keyslot'
```

Back up the keyfile somewhere offline and encrypted. If you need to rotate the
key:

```bash
sudo mount /dev/sdX1 /mnt/keystick
sudo dd if=/dev/urandom of=/mnt/keystick/luks-keyfile bs=4096 count=1 status=none
sudo chmod 0400 /mnt/keystick/luks-keyfile
sudo sync
sudo cryptsetup luksAddKey /dev/nvme0n1p3 /mnt/keystick/luks-keyfile
sudo cryptsetup luksRemoveKey /dev/nvme0n1p3     # prompts for the old key
sudo umount /mnt/keystick
```

---

# Without a USB (local key in initramfs)

If you just want to skip the passphrase prompt without a physical key, you can
embed the keyfile in the initramfs itself:

```
<name> UUID=<LUKS-UUID> /etc/keys/luks-keyfile luks
```

Put the file at `/etc/keys/luks-keyfile`, `chmod 0400`, rebuild with
`sudo update-initramfs -u`. No `keyscript=passdev` needed. But the key lives on
disk, not on a separate device.
