---
ID: 159
post_title: 'How to set up a mobile build server: step 3'
author: Danny Willems
post_date: 2016-01-03 18:25:58
post_excerpt: ""
layout: post
permalink: >
  https://blog.danny-willems.be/en/how-to-set-up-a-mobile-build-server-step-3/
published: true
bitly_url:
  - 'a:1:{i:0;s:21:"http://bit.ly/1OD0dim";}'
bitly_hash:
  - 'a:1:{i:0;s:7:"1OD0dim";}'
bitly_long_url:
  - 'a:1:{i:0;s:72:"http://blog.danny-willems.be/how-to-set-up-a-mobile-build-server-step-3/";}'
---
<ol>
	<li><a href="http://blog.danny-willems.be/how-to-set-up-a-mobile-build-server/">Introduction</a></li>
	<li><a href="http://blog.danny-willems.be/how-to-set-up-a-mobile-build-server-step-1/">Server-side and client-side: (Optional) Create and configure an user on the build server</a></li>
	<li><a href="http://blog.danny-willems.be/how-to-set-up-a-mobile-build-server-step-2/">Server-side: Install and configure the Android SDK</a></li>
	<li><a href="http://blog.danny-willems.be/how-to-set-up-a-mobile-build-server-step-3/">Server-side: Install and configure cordova/ionic</a></li>
	<li><a href="http://blog.danny-willems.be/how-to-set-up-a-mobile-build-server-step-4/">Client-side: Automate the build process</a></li>
</ol>

<h2 style="text-align: center">Server-side: Install and configure cordova/ionic</h2>

This step will be very short. We would like to install globally cordova and/or ionic without root privileges. By default, we need to use sudo with npm install -g (to install globally).
We can avoid these root command by changing the directory where the npm packages are installed.

<div>Each command is executed on the server</div>

<h3>Change npm packages installation directory</h3>

The new directory will be in your home and called .npm-packages. Create the directory and change the npm prefix by using
[code lang="bash"]
mkdir -p ~/.npm-packages
npm config set prefix &quot;~/.npm-packages&quot;
[/code]

The executable files like <strong>cordova</strong> and <strong>ionic</strong> will now be in ~/.npm-packages/bin. We need to add this directory to your PATH to be able to use directly the command.

[code lang="bash"]
echo &quot;export PATH=$PATH:~/.npm-packages/bin&quot; &gt;&gt; ~/.${SHELL##*/}rc
[/code]

You need to reload your shell configuration. You can do it by closing and reopening your terminal or by using the command
[code lang="bash"]
source ~/.${SHELL##*/}rc
[/code]

Before continuing, check you have the directory ~/.npm-packages/bin in your PATH with
[code lang="bash"]
echo $PATH
[/code]

<h3>Install cordova and ionic without root privileges</h3>

Now, we can install cordova and/or ionic. Here, we will install only cordova.

[code lang="bash"]
npm install -g cordova
[/code]

<h3>What's next?</h3>

It's time to write our build script.

<span class="dashicons dashicons-arrow-right-alt"></span><a href="http://blog.danny-willems.be/how-to-set-up-a-mobile-build-server-step-4/">Go to the last part</a> (coming soon). I'm working on several projects now, I don't have time to write this last part.

<h2 style="text-align: center">Script</h2>

You can download it <a href="http://blog.danny-willems.be/download/script-how-to-set-up-a-mobile-build-server-step-3/">here</a>.