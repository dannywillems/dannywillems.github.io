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

## Adding Content

### Countries Visited

Edit `_data/countries.yml` to add countries you've visited:

```yaml
- code: JP # ISO 3166-1 alpha-2 code (required for map highlighting)
  name: Japan # Country name
  continent: Asia # Africa, Asia, Europe, North America, South America, Oceania
  first_visit: 2024 # Year of first visit (optional)
  visits: 2 # Number of visits (optional)
  favorite: true # Highlight as favorite (optional)
  notes: Amazing! # Short note (optional)
```

Country codes: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2

### Cities Visited

Edit `_data/cities.yml` to add cities (coming soon):

```yaml
- name: Tokyo
  country: JP
  lat: 35.6762
  lng: 139.6503
  visited: 2024-03
  notes: Cherry blossom season
```
