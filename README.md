## Run locally

```
sudo apt-get install gnupg2 ruby-dev
```

- Use rvm and install jekyll and builder 2.0.2:
```
gpg2 --keyserver hkp://pool.sks-keyservers.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3 7D2BAF1CF37B13E2069D6956105BD0E739499BDB
curl -sSL https://get.rvm.io | bash -s stable --ruby
gem install bundler jekyll --user-install
```

- build and serve the website:
```
# to build locally in a vendor directory
bundle config set --local path 'vendor/bundle'
bundle install
bundle exec jekyll serve
```
