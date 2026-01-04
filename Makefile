# Use bash and source rvm if available
SHELL := /bin/bash
RVM_SCRIPT := $(HOME)/.rvm/scripts/rvm
ifneq ($(wildcard $(RVM_SCRIPT)),)
    SHELL := /bin/bash --login
endif

.PHONY: help
help: ## Ask for help!
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.PHONY: install
install: ## Install dependencies
	bundle install

.PHONY: serve
serve: ## Serve the site locally
	bundle exec jekyll serve --livereload

.PHONY: build
build: ## Build the site
	bundle exec jekyll build

.PHONY: clean
clean: ## Clean generated files
	bundle exec jekyll clean
	rm -rf _site/

.PHONY: drafts
drafts: ## Serve with drafts included
	bundle exec jekyll serve --drafts --livereload

.PHONY: check
check: ## Check for broken links and issues
	bundle exec jekyll build --strict
	bundle exec htmlproofer _site --check-html --check-opengraph --report-missing-names --log-level :debug

.PHONY: test
test: build check ## Run tests (build and check)

.PHONY: lint
lint: ## Lint markdown files
	@if command -v markdownlint >/dev/null 2>&1; then \
		markdownlint _posts/ _drafts/ *.md; \
	else \
		echo "markdownlint not installed. Install with: npm install -g markdownlint-cli"; \
	fi

.PHONY: format
format: ## Format files with prettier
	@if command -v prettier >/dev/null 2>&1; then \
		prettier --write "**/*.css" "*.md" "_posts/*.md"; \
	else \
		echo "prettier not installed. Install with: npm install -g prettier"; \
		exit 1; \
	fi

.PHONY: check-format
check-format: ## Check formatting with prettier
	@if command -v prettier >/dev/null 2>&1; then \
		prettier --check "**/*.css" "*.md" "_posts/*.md"; \
	else \
		echo "prettier not installed. Install with: npm install -g prettier"; \
		exit 1; \
	fi

RUBY_VERSION := $(shell cat .ruby-version 2>/dev/null || echo "3.2.2")

.PHONY: check-ruby
check-ruby: ## Check if Ruby is installed
	@if command -v ruby >/dev/null 2>&1; then \
		echo "Ruby is installed: $$(ruby --version)"; \
		echo "Ruby path: $$(which ruby)"; \
	else \
		echo "Ruby is not installed"; \
		exit 1; \
	fi

.PHONY: install-rvm
install-rvm: ## Install rvm (Ruby Version Manager)
	@if command -v rvm >/dev/null 2>&1; then \
		echo "rvm is already installed"; \
	else \
		echo "Installing rvm..."; \
		curl -sSL https://get.rvm.io | bash -s stable; \
		echo ""; \
		echo "Please restart your shell or run: source ~/.rvm/scripts/rvm"; \
	fi

.PHONY: install-ruby
install-ruby: ## Install Ruby via rvm
	@if ! command -v rvm >/dev/null 2>&1; then \
		echo "rvm is not installed. Run 'make install-rvm' first."; \
		exit 1; \
	fi; \
	echo "Installing Ruby $(RUBY_VERSION) via rvm..."; \
	rvm install $(RUBY_VERSION); \
	rvm use $(RUBY_VERSION) --default