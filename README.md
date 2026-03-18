# dannywillems.github.io

Personal website of Danny Willems. Mathematician, cryptography researcher and
engineer. Founder of [BaDaaS](https://badaas.be). Co-founder of
[LeakIX](https://leakix.net).

Live at: https://dannywillems.github.io

## Development

### Prerequisites

- Ruby (see `.ruby-version`)
- Bundler
- Node.js (for prettier/markdownlint)

### Quick start

```bash
make install  # Install Ruby dependencies
make serve    # Serve locally at http://localhost:4000
```

### All commands

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

## Structure

- `_data/jobs.yml` - Work experience
- `_data/education.yml` - Education
- `_data/publications.yml` - Research publications
- `_data/talks.yml` - Public talks
- `_data/opensource.yml` - Open source contributions
- `_posts/` - Blog posts
- `cv.html` - CV page (print-optimized)
- `index.md` - Homepage

## Adding content

### Blog posts

Add a new file in `_posts/` with the format `YYYY-MM-DD-title.md`.

### Countries visited

Edit `_data/countries.yml`:

```yaml
- code: JP
  name: Japan
  continent: Asia
  first_visit: 2024
```

Country codes: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
