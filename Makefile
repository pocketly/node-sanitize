TESTS = test/sanitize.test

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--require should \
		--harmony \
		$(TESTS) \
		--bail

.PHONY: test