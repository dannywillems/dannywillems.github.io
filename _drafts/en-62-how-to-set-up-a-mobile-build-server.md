---
ID: 62
post_title: How to set up a mobile build server
author: Danny Willems
post_date: 2015-12-30 22:35:59
post_excerpt: ""
layout: post
permalink: >
  https://blog.danny-willems.be/en/how-to-set-up-a-mobile-build-server/
published: true
bitly_url:
  - http://bit.ly/1OD0fXC
bitly_hash:
  - 1OD0fXC
bitly_long_url:
  - >
    http://blog.danny-willems.be/how-to-set-up-a-mobile-build-server/
---
<h2 style="text-align: center">Why a mobile build server ?</h2>
To develop mobile applications whether for Android, iOS, Tizen or Windows Phone, we need to use the SDK for the appropriate platform. The size of these SDK is more than 1Go for the basics and it can reach around 10-15Go if we download sdk for different versions.

Frequently, in a company, several developers works on a mobile project and it's very annoying to download the SDK on each workstation. An other case it's when you work with different OS or different computers: you need to download the SDK multiple times.
<h3>Centralized the SDK</h3>
A solution is to install the SDK only once on a server which will compile and build the archive for the platform. A mobile project will be in a git repository which will be on the server. The project will be compiled and the archive will be sent to the developer. It will follow this simple process:
<ol>
	<li>Server-side: Create a git repository on the server</li>
	<li>Client-side: Clone the repository, work on it, commit and push.</li>
	<li>Client-side: Execute a script which will build the project on the server and copy locally the remote archive (apk, ipa, etc).</li>
</ol>
I will present this solution for the Android SDK which is the easiest to put in place. More specifically the server will be a solution for decentralized cordova/ionic build system.

No graphical interface is needed. This process could be used on an old server, a raspberry pi or anything else. Just need a terminal.
<h3>Wait... Other solutions like a docker container or continuous integration system exist. What's the difference ?</h3>
There're some docker images like <a href="https://hub.docker.com/r/ahazem/android/">this</a> which does the job. Even if I like docker and use it, we must download the image, run it and it takes some place and resources (not a lot) and we don't have always these resources.

Generally, continuous integration system provide more than we need. And when we want to modify a behavior, we wast time to learn how it's working. Also some continuous integration system needs some specific resources requirement.

An other point is this method doesn't require root privileges (for Android SDK): it could be used independantly by a user.

Last this method works on Mac OS X server and only the build script (see below) must be changed. The Mac OS X script will also be given.
<div class="dw-quote">
No root privileges required, no need a lot of resources, easy to install and to use, no graphical interface needed.
</div>

<div class="dw-quote">This tutorial is tested and developed for a ssh server running on Linux with git, wget and npm installed (cordova/ionic).</div>
<h2 style="text-align: center">Now, let's go !</h2>
This "How-To" tutorial will be separated into 3 parts for the server configuration and a script for the client.
<ol>
	<li><a href="http://blog.danny-willems.be/how-to-set-up-a-mobile-build-server-step-1/">Server-side and client-side: (Optional) Create and configure an user on the build server</a></li>
	<li><a href="http://blog.danny-willems.be/how-to-set-up-a-mobile-build-server-step-2/">Server-side: Install and configure the Android SDK</a></li>
	<li><a href="http://blog.danny-willems.be/how-to-set-up-a-mobile-build-server-step-3/">Server-side: Install and configure cordova/ionic</a></li>
	<li><a href="http://blog.danny-willems.be/how-to-set-up-a-mobile-build-server-step-4/">Client-side: Automate the build process</a></li>
</ol>

At the end of each part, a script to automate everything will be given.

<strong>Important</strong>: we can transform the server for another type of compilation such as C, LaTeX, etc with the same idea. We only have to change the username and the client build script.

<span class="dashicons dashicons-arrow-right-alt"></span><a href="http://blog.danny-willems.be/how-to-set-up-a-mobile-build-server-part-1/">Go to the first part</a>