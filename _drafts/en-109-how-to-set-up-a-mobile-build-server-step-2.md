---
ID: 109
post_title: 'How to set up a mobile build server: step 2'
author: Danny Willems
post_date: 2015-12-31 21:59:32
post_excerpt: ""
layout: post
permalink: >
  https://blog.danny-willems.be/en/how-to-set-up-a-mobile-build-server-step-2/
published: true
bitly_url:
  - http://bit.ly/1OD0dip
bitly_hash:
  - 1OD0dip
bitly_long_url:
  - >
    http://blog.danny-willems.be/how-to-set-up-a-mobile-build-server-step-2/
---
<ol>
	<li><a href="http://blog.danny-willems.be/how-to-set-up-a-mobile-build-server/">Introduction</a></li>
	<li><a href="http://blog.danny-willems.be/how-to-set-up-a-mobile-build-server-step-1/">Server-side and client-side: (Optional) Create and configure an user on the build server</a></li>
	<li><a href="http://blog.danny-willems.be/how-to-set-up-a-mobile-build-server-step-2/">Server-side: Install and configure the Android SDK</a></li>
	<li><a href="http://blog.danny-willems.be/how-to-set-up-a-mobile-build-server-step-3/">Server-side: Install and configure cordova/ionic</a></li>
	<li><a href="http://blog.danny-willems.be/how-to-set-up-a-mobile-build-server-step-4/">Client-side: Automate the build process</a></li>
</ol>

<h2 style="text-align: center">Server-side: Install and configure the Android SDK</h2>

It's time now to install the Android SDK with the command line interface.
<div class="dw-quote">If you want to set up a build server for Mac OS X, you only need to download XCode and the iOS SDK will be downloaded. For LaTeX, see the appropriate install section for your distribution. At the end, some links will be listed for more informations about these alternatives</div>
Each commands must be executed on the server so first connect you on the server.

<h3>Download and install the Android SDK</h3>
Go to <a href="http://developer.android.com/sdk/index.html#Other">the Android website</a> to download the SDK. Copy the link for the Linux version and use wget.
The actual version is r24.4.1, so the command is

[code lang="bash"]
    wget http://dl.google.com/android/android-sdk_r24.4.1-linux.tgz -O /tmp/android-sdk.tgz
[/code]

<div class="dw-quote">I wrote a small python script which parse the html page and get the link of the most recent SDK version. <a href="http://blog.danny-willems.be/download/parse-android-website-and-download-android-sdk/">Download it</a></div>
We extract the android sdk into a new hidden directory in the home named .android-sdk.

[code lang="bash"]
    mkdir -p ~/.android-sdk
    tar xvf /tmp/android-sdk.tgz -C ~/.android-sdk
[/code]

<h3>Configure the PATH</h3>

Now we have to add the android executables such as android (SDK Manager) and adb to the PATH. An ANDROID_HOME variable is also necessary.

[code lang="bash"]
    echo &quot;ANDROID_HOME=~/.android-sdk/android-sdk-linux&quot; &gt;&gt; ~/.${SHELL##*/}rc
    echo &quot;PATH=$PATH:~/.android-sdk/android-sdk-linux/tools:~/.android-sdk/android-sdk-linux/platform-tools&quot; &gt;&gt; ~/.${SHELL##*/}rc
[/code]

Reload your shell configuration file with

[code lang="bash"]
    source ~/.${SHELL##*/}rc
[/code]

to update the PATH for the current ssh session.

<h3>Choose SDK API to install</h3>
SDK is installed and the PATH is configured. Now we have to install which SDK versions we want to install.

The SDK manager can be managed with the <strong>android</strong> command. By default, it launched the SDK Manager window.
To use the SDK manager in command line, you have to add the <strong>--no-ui</strong> at the end of each andoid command.

For example, to list all sdk versions, you use

[code lang="bash"]
    android list sdk --no-ui
[/code]

and you get a similar output than

<a href="http://blog.danny-willems.be/wp-content/uploads/2015/12/Screen-Shot-2015-12-31-at-22.02.53.png" rel="attachment wp-att-132"><img src="http://blog.danny-willems.be/wp-content/uploads/2015/12/Screen-Shot-2015-12-31-at-22.02.53.png" alt="Screen Shot 2015-12-31 at 22.02.53" width="635" height="757" class="alignnone size-full wp-image-132" /></a>

The numbered list in the output let you choose which SDK API you want to install with the command <strong>android update sdk -u -a -t </strong>.

First we update the sdk with the command
[code lang="bash"]
    android update sdk --no-ui
[/code]

Accept the licence and as it's the first time you launch this command, it will download the last Android SDK API (Now: Android 6.0 ie API 23).

If you want to install more SDK API, use

[code lang="bash"]
    android update sdk -u -a -t &lt;package no.&gt;
[/code]
where <strong></strong> is the number in the previous numbered list. (-u is a shortcut --no-ui, -t for filters and -a for all, see <strong>android -h</strong>).

With my previous screenshot, if you want to install the API for Android 5.1.1 (API 22), you use

[code lang="bash"]
    android update sdk -u -a -t 4
[/code]

Install the API you want.

<h3>And now ?</h3>

The SDK is installed, only using the command line. Great !
Now it's time to configure cordova and ionic. It would be a small step.

<span class="dashicons dashicons-arrow-right-alt"></span><a href="http://blog.danny-willems.be/how-to-set-up-a-mobile-build-server-step-3/">Go to the third part</a>

<h2 style="text-align:center">Script</h2>

<a href="http://blog.danny-willems.be/download/server-side-install-and-configure-the-android-sdk-script/">Download it</a>. Don't forget: it's a server-side script !