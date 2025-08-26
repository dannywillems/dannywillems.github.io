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
format: ## Format markdown files with prettier
	@if command -v prettier >/dev/null 2>&1; then \
		prettier --write _posts/*.md _drafts/*.md *.md; \
	else \
		echo "prettier not installed. Install with: npm install -g prettier"; \
	fi