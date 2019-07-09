---
ID: 70
post_title: 'How to set up a mobile build server: step 1'
author: Danny Willems
post_date: 2015-12-31 15:20:01
post_excerpt: ""
layout: post
permalink: >
  https://blog.danny-willems.be/en/how-to-set-up-a-mobile-build-server-step-1/
published: true
bitly_url:
  - http://bit.ly/1OD0dir
bitly_hash:
  - 1OD0dir
bitly_long_url:
  - >
    http://blog.danny-willems.be/how-to-set-up-a-mobile-build-server-step-1/
---
<ol>
        <li><a href="http://blog.danny-willems.be/how-to-set-up-a-mobile-build-server/">Introduction</a></li>
	<li><a href="http://blog.danny-willems.be/how-to-set-up-a-mobile-build-server-step-1/">Server-side and client-side: (Optional) Create and configure an user on the build server</a></li>
	<li><a href="http://blog.danny-willems.be/how-to-set-up-a-mobile-build-server-step-2/">Server-side: Install and configure the Android SDK</a></li>
	<li><a href="http://blog.danny-willems.be/how-to-set-up-a-mobile-build-server-step-3/">Server-side: Install and configure cordova/ionic</a></li>
	<li><a href="http://blog.danny-willems.be/how-to-set-up-a-mobile-build-server-step-4/">Client-side: Automate the build process</a></li>
</ol>

<h2 style="text-align: center">Server-side and client-side: (Optional) Create and configure an user on the build server</h2>

In this part, we will create a new user and configure ssh access. It's an optional part because you can use an existing user.
I chose to separate the user because I think an user on a server must create for only one thing.
On top of that, as I said <a href="http://blog.danny-willems.be/how-to-set-up-a-mobile-build-server/">in the introduction</a>, this method can be used for a C, LaTeX (or anything else) build server. An user for each build method is better in this case.

The user will be called <span style="font-weight: bold">android-sdk</span>.
<div class="dw-quote">It's the only part of this tutorial you need root access to create the user</div>
<h3>Server-side: Create the user</h3>
Connect to the server and create a new user:
[code lang="bash"]
adduser android-sdk
[/code]
You'll be prompted for some informations such as a name, full name, and a password.
<h3>Client-side: create a ssh key and add it to the server</h3>
To avoid having to type the password each time we push, we create a ssh key and add it to the android-sdk's authorized keys.
[code lang="bash"]
ssh-keygen -t rsa -f ~/.ssh/android-sdk
ssh-copy-id -i ~/.ssh/android-sdk android-sdk@[your-server]
[/code]
<div class="dw-quote">Replace [your-server] by your server ip/alias/domain name. If you're on Mac OS X, install ssh-copy-id with brew (brew install ssh-copy-id).</div>
<div class="dw-quote">It's recommended to have different ssh keys for each ssh user that is for github.com, bitbucket.com or other users on your server.</div>
<h3>Client-side: add a rule in the ssh config</h3>
If you followed the previous command, you must add a rule in the ~/.ssh/config file to match the appropriate ssh key file.
Open with your favorite text editor (<a href="http://blog.danny-willems.be/vim-ide/">vim</a> of course :D) and add these lines

[code lang="bash"]
Host build-server
Hostname [your-server-adress/ip/alias]
IdentityFile ~/.ssh/android-sdk
User android-sdk
[/code]
<div class="dw-quote">See <a href="http://nerderati.com/2011/03/17/simplify-your-life-with-an-ssh-config-file/">this excellent tutorial</a> for more informations about the ssh config file. Don't forget to change the user if you're using another user. Same for the ssh key file.</div>
The host will be used when you'll clone the repository. You will use somethink like
[code lang="bash"]
git clone android-sdk@build-server:~/my_amazing_project.git
[/code]

<h2 style="text-align: center">Scripts</h2>
As promised, I give you scripts to automate the configuration. There're two scripts: one for the server and one on the client machine.
<h3>Server</h3>
We only need to create the user. I only add a variable to let you choose your user name.

[code lang="bash"]
## Change it if you want another username.
## Don't forget to change in the client script too.
USERNAME = android-sdk

## DON'T EDIT THESE FOLLOWING LINES
adduser $USERNAME
##
[/code]
<h3>Client</h3>
We need to create a ssh key, add the ssh key to the server and modify the ssh config file. If you changed the username in the script server.

[code lang="bash"]
##### Change it if you want another username.
## Don't forget to change in the server script too.
## [default = android-sdk]
USERNAME = android-sdk

## Your server IP adress or alias
HOSTNAME = danny-willems.be

## The host name you want to use when you'll clone
## [default = build-server]
HOST = build-server

## SSH key name
## [default = android-sdk]
SSH_KEY_NAME = android-sdk

## DON'T EDIT THESE FOLLOWING LINES
## Create SSH keys
ssh-keygen -t rsa -f ~/.ssh/$SSH_KEY_NAME

## Copy to the server
ssh-copy-id -i ~/.ssh/$SSH_KEY_NAME $USERNAME@$HOSTNAME

## Modify the ssh config file
echo 'Host $HOSTn Hostname $HOSTNAMEn IdentityFile ~/.ssh/$SSH_KEY_NAMEn User $USERNAME' &gt;&gt; ~/.ssh/config
[/code]

<h2 style="text-align: center">And now ?</h2>

OK, user configured. Now, let's download and install the Android SDK in our new user environment.

<span class="dashicons dashicons-arrow-right-alt"></span><a href="http://blog.danny-willems.be/how-to-set-up-a-mobile-build-server-step-2/">Go to the second part</a>