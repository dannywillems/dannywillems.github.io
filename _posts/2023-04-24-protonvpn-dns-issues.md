---
layout: post
title: ProtonVPN - DNS issue
date:2023-04-24 13:02:36
author: Danny Willems
tags: [protonvpn, dns, ipv6, leak protection, Linux, cli]
---

You may encounter issues while using protonvpn on Ubuntu.
I ended up multiple times without any way to reach servers.
Pinging IP works, but not DNS resolution.
It was related to a ProtonVPN issue.

When connecting to ProtonVPN, some connections are created.
```
nmcli connection show --active # to list all active connections
nmcli connection show # to list active and inactive connections
```

When you are not connected to a ProtonVPN server, there is still one active
connection related to ipv6, `pvpn-ipv6leak-protection`.

Delete the connection:
```
nmcli connection delete pvpn-ipv6leak-protection
```

Should be fine now.

It is also causing issues while my laptop is suspended.
