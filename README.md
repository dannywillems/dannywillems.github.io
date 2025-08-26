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

## Makefile Commands

Use the provided Makefile for common development tasks:

```bash
make help     # Show available commands
make install  # Install dependencies
make serve    # Serve the site locally
make build    # Build the site
make clean    # Clean generated files
make drafts   # Serve with drafts included
make test     # Run tests (build and check)
make lint     # Lint markdown files
make format   # Format markdown files with prettier
```

### Prerequisites

For linting and formatting, install the required tools:

```bash
npm install -g markdownlint-cli prettier
```
