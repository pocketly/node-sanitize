TESTS = test/sanitize.test

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--require should \
		--harmony \
		$(TESTS) \
		--bail

test-in-docker:
	docker build \
		-t node-sanitize-test:latest .
	docker run --rm -it \
		-v $(PWD):/src \
		-w /src \
		node-sanitize-test:latest

.PHONY: test test-in-docker
