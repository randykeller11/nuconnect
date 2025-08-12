(base) dub_ceo@Cs-MacBook-Pro nuconnect % git push heroku main
Enumerating objects: 1179, done.
Counting objects: 100% (1179/1179), done.
Delta compression using up to 16 threads
Compressing objects: 100% (1049/1049), done.
Writing objects: 100% (1179/1179), 108.14 MiB | 18.26 MiB/s, done.
Total 1179 (delta 531), reused 0 (delta 0), pack-reused 0
remote: Resolving deltas: 100% (531/531), done.
remote: Updated 730 paths from 8d61cc9
remote: Compressing source files... done.
remote: Building source:
remote: 
remote: -----> Building on the Heroku-24 stack
remote: -----> Determining which buildpack to use for this app
remote: -----> Node.js app detected
remote:        
remote: -----> Creating runtime environment
remote:        
remote:        NPM_CONFIG_LOGLEVEL=error
remote:        NODE_VERBOSE=false
remote:        NODE_ENV=production
remote:        NODE_MODULES_CACHE=true
remote:        
remote: -----> Installing binaries
remote:        engines.node (package.json):   18.x
remote:        engines.npm (package.json):    unspecified (use default)
remote:        
remote:        Resolving node version 18.x...
remote:        Downloading and installing node 18.20.8...
remote:        Validating checksum
remote:        Using default npm version: 10.8.2
remote:        
remote: -----> Installing dependencies
remote:        Installing node modules
remote:        npm error code EUSAGE
remote:        npm error
remote:        npm error `npm ci` can only install packages when your package.json and package-lock.json or npm-shrinkwrap.json are in sync. Please update your lock file with `npm install` before continuing.
remote:        npm error
remote:        npm error Missing: @faker-js/faker@9.9.0 from lock file
remote:        npm error Missing: @playwright/test@1.54.2 from lock file
remote:        npm error Invalid: lock file's @radix-ui/react-slider@1.2.4 does not satisfy @radix-ui/react-slider@1.3.5
remote:        npm error Invalid: lock file's @radix-ui/react-switch@1.1.4 does not satisfy @radix-ui/react-switch@1.2.5
remote:        npm error Missing: @supabase/ssr@0.6.1 from lock file
remote:        npm error Invalid: lock file's @supabase/supabase-js@2.53.0 does not satisfy @supabase/supabase-js@2.55.0
remote:        npm error Missing: @testing-library/jest-dom@6.6.4 from lock file
remote:        npm error Missing: @testing-library/react@16.3.0 from lock file
remote:        npm error Missing: @testing-library/dom@10.4.1 from lock file
remote:        npm error Missing: jest@30.0.5 from lock file
remote:        npm error Missing: jest-environment-jsdom@30.0.5 from lock file
remote:        npm error Missing: node-mocks-http@1.17.2 from lock file
remote:        npm error Missing: sonner@2.0.7 from lock file
remote:        npm error Missing: playwright@1.54.2 from lock file
remote:        npm error Missing: @radix-ui/react-collection@1.1.7 from lock file
remote:        npm error Missing: @radix-ui/react-primitive@2.1.3 from lock file
remote:        npm error Missing: @radix-ui/react-use-controllable-state@1.2.2 from lock file
remote:        npm error Missing: @radix-ui/react-primitive@2.1.3 from lock file
remote:        npm error Missing: @radix-ui/react-use-controllable-state@1.2.2 from lock file
remote:        npm error Missing: cookie@1.0.2 from lock file
remote:        npm error Invalid: lock file's @supabase/realtime-js@2.11.15 does not satisfy @supabase/realtime-js@2.15.1
remote:        npm error Missing: @types/aria-query@5.0.4 from lock file
remote:        npm error Missing: aria-query@5.3.0 from lock file
remote:        npm error Missing: dom-accessibility-api@0.5.16 from lock file
remote:        npm error Missing: lz-string@1.5.0 from lock file
remote:        npm error Missing: pretty-format@27.5.1 from lock file
remote:        npm error Missing: @adobe/css-tools@4.4.3 from lock file
remote:        npm error Missing: css.escape@1.5.1 from lock file
remote:        npm error Missing: dom-accessibility-api@0.6.3 from lock file
remote:        npm error Missing: redent@3.0.0 from lock file
remote:        npm error Missing: @jest/core@30.0.5 from lock file
remote:        npm error Missing: @jest/types@30.0.5 from lock file
remote:        npm error Missing: import-local@3.2.0 from lock file
remote:        npm error Missing: jest-cli@30.0.5 from lock file
remote:        npm error Missing: @jest/console@30.0.5 from lock file
remote:        npm error Missing: @jest/pattern@30.0.1 from lock file
remote:        npm error Missing: @jest/reporters@30.0.5 from lock file
remote:        npm error Missing: @jest/test-result@30.0.5 from lock file
remote:        npm error Missing: @jest/transform@30.0.5 from lock file
remote:        npm error Missing: ansi-escapes@4.3.2 from lock file
remote:        npm error Missing: ci-info@4.3.0 from lock file
remote:        npm error Missing: exit-x@0.2.2 from lock file
remote:        npm error Missing: jest-changed-files@30.0.5 from lock file
remote:        npm error Missing: jest-config@30.0.5 from lock file
remote:        npm error Missing: jest-haste-map@30.0.5 from lock file
remote:        npm error Missing: jest-message-util@30.0.5 from lock file
remote:        npm error Missing: jest-regex-util@30.0.1 from lock file
remote:        npm error Missing: jest-resolve@30.0.5 from lock file
remote:        npm error Missing: jest-resolve-dependencies@30.0.5 from lock file
remote:        npm error Missing: jest-runner@30.0.5 from lock file
remote:        npm error Missing: jest-runtime@30.0.5 from lock file
remote:        npm error Missing: jest-snapshot@30.0.5 from lock file
remote:        npm error Missing: jest-util@30.0.5 from lock file
remote:        npm error Missing: jest-validate@30.0.5 from lock file
remote:        npm error Missing: jest-watcher@30.0.5 from lock file
remote:        npm error Missing: pretty-format@30.0.5 from lock file
remote:        npm error Missing: slash@3.0.0 from lock file
remote:        npm error Missing: @bcoe/v8-coverage@0.2.3 from lock file
remote:        npm error Missing: collect-v8-coverage@1.0.2 from lock file
remote:        npm error Missing: istanbul-lib-coverage@3.2.2 from lock file
remote:        npm error Missing: istanbul-lib-instrument@6.0.3 from lock file
remote:        npm error Missing: istanbul-lib-report@3.0.1 from lock file
remote:        npm error Missing: istanbul-lib-source-maps@5.0.6 from lock file
remote:        npm error Missing: istanbul-reports@3.1.7 from lock file
remote:        npm error Missing: jest-worker@30.0.5 from lock file
remote:        npm error Missing: string-length@4.0.2 from lock file
remote:        npm error Missing: v8-to-istanbul@9.3.0 from lock file
remote:        npm error Missing: @types/istanbul-lib-coverage@2.0.6 from lock file
remote:        npm error Invalid: lock file's @babel/core@7.26.0 does not satisfy @babel/core@7.28.0
remote:        npm error Missing: babel-plugin-istanbul@7.0.0 from lock file
remote:        npm error Invalid: lock file's pirates@4.0.6 does not satisfy pirates@4.0.7
remote:        npm error Missing: write-file-atomic@5.0.1 from lock file
remote:        npm error Invalid: lock file's @babel/code-frame@7.26.2 does not satisfy @babel/code-frame@7.27.1
remote:        npm error Invalid: lock file's @babel/generator@7.26.9 does not satisfy @babel/generator@7.28.0
remote:        npm error Invalid: lock file's @babel/helper-compilation-targets@7.25.9 does not satisfy @babel/helper-compilation-targets@7.27.2
remote:        npm error Invalid: lock file's @babel/helper-module-transforms@7.26.0 does not satisfy @babel/helper-module-transforms@7.27.3
remote:        npm error Invalid: lock file's @babel/helpers@7.26.0 does not satisfy @babel/helpers@7.28.2
remote:        npm error Invalid: lock file's @babel/parser@7.26.9 does not satisfy @babel/parser@7.28.0
remote:        npm error Invalid: lock file's @babel/template@7.26.9 does not satisfy @babel/template@7.27.2
remote:        npm error Invalid: lock file's @babel/traverse@7.26.9 does not satisfy @babel/traverse@7.28.0
remote:        npm error Invalid: lock file's @babel/types@7.26.9 does not satisfy @babel/types@7.28.2
remote:        npm error Invalid: lock file's @babel/helper-validator-identifier@7.25.9 does not satisfy @babel/helper-validator-identifier@7.27.1
remote:        npm error Invalid: lock file's @jridgewell/gen-mapping@0.3.5 does not satisfy @jridgewell/gen-mapping@0.3.13
remote:        npm error Invalid: lock file's @jridgewell/trace-mapping@0.3.25 does not satisfy @jridgewell/trace-mapping@0.3.30
remote:        npm error Invalid: lock file's jsesc@3.0.2 does not satisfy jsesc@3.1.0
remote:        npm error Invalid: lock file's @babel/compat-data@7.26.2 does not satisfy @babel/compat-data@7.28.0
remote:        npm error Invalid: lock file's @babel/helper-validator-option@7.25.9 does not satisfy @babel/helper-validator-option@7.27.1
remote:        npm error Invalid: lock file's @babel/helper-module-imports@7.25.9 does not satisfy @babel/helper-module-imports@7.27.1
remote:        npm error Missing: @babel/helper-globals@7.28.0 from lock file
remote:        npm error Invalid: lock file's @babel/helper-string-parser@7.25.9 does not satisfy @babel/helper-string-parser@7.27.1
remote:        npm error Missing: @jest/schemas@30.0.5 from lock file
remote:        npm error Missing: @types/istanbul-reports@3.0.4 from lock file
remote:        npm error Missing: @types/yargs@17.0.33 from lock file
remote:        npm error Missing: @sinclair/typebox@0.34.38 from lock file
remote:        npm error Missing: @types/istanbul-lib-report@3.0.3 from lock file
remote:        npm error Missing: @types/yargs-parser@21.0.3 from lock file
remote:        npm error Missing: type-fest@0.21.3 from lock file
remote:        npm error Missing: @istanbuljs/load-nyc-config@1.1.0 from lock file
remote:        npm error Missing: @istanbuljs/schema@0.1.3 from lock file
remote:        npm error Missing: test-exclude@6.0.0 from lock file
remote:        npm error Missing: camelcase@5.3.1 from lock file
remote:        npm error Missing: find-up@4.1.0 from lock file
remote:        npm error Missing: get-package-type@0.1.0 from lock file
remote:        npm error Missing: js-yaml@3.14.1 from lock file
remote:        npm error Missing: resolve-from@5.0.0 from lock file
remote:        npm error Missing: pkg-dir@4.2.0 from lock file
remote:        npm error Missing: resolve-cwd@3.0.0 from lock file
remote:        npm error Missing: semver@7.7.2 from lock file
remote:        npm error Missing: make-dir@4.0.0 from lock file
remote:        npm error Missing: html-escaper@2.0.2 from lock file
remote:        npm error Missing: execa@5.1.1 from lock file
remote:        npm error Missing: get-stream@6.0.1 from lock file
remote:        npm error Missing: human-signals@2.1.0 from lock file
remote:        npm error Missing: is-stream@2.0.1 from lock file
remote:        npm error Missing: merge-stream@2.0.0 from lock file
remote:        npm error Missing: npm-run-path@4.0.1 from lock file
remote:        npm error Missing: onetime@5.1.2 from lock file
remote:        npm error Missing: signal-exit@3.0.7 from lock file
remote:        npm error Missing: strip-final-newline@2.0.0 from lock file
remote:        npm error Missing: jest-config@30.0.5 from lock file
remote:        npm error Missing: yargs@17.7.2 from lock file
remote:        npm error Missing: @jest/environment@30.0.5 from lock file
remote:        npm error Missing: @jest/environment-jsdom-abstract@30.0.5 from lock file
remote:        npm error Missing: jsdom@26.1.0 from lock file
remote:        npm error Missing: @types/jsdom@21.1.7 from lock file
remote:        npm error Missing: @jest/fake-timers@30.0.5 from lock file
remote:        npm error Missing: jest-mock@30.0.5 from lock file
remote:        npm error Missing: @sinonjs/fake-timers@13.0.5 from lock file
remote:        npm error Missing: @sinonjs/commons@3.0.1 from lock file
remote:        npm error Missing: type-detect@4.0.8 from lock file
remote:        npm error Missing: @types/tough-cookie@4.0.5 from lock file
remote:        npm error Missing: parse5@7.3.0 from lock file
remote:        npm error Missing: fb-watchman@2.0.2 from lock file
remote:        npm error Missing: walker@1.0.8 from lock file
remote:        npm error Missing: bser@2.1.1 from lock file
remote:        npm error Missing: node-int64@0.4.0 from lock file
remote:        npm error Missing: @types/stack-utils@2.0.3 from lock file
remote:        npm error Missing: pretty-format@30.0.5 from lock file
remote:        npm error Missing: stack-utils@2.0.6 from lock file
remote:        npm error Missing: jest-pnp-resolver@1.2.3 from lock file
remote:        npm error Missing: emittery@0.13.1 from lock file
remote:        npm error Missing: jest-docblock@30.0.1 from lock file
remote:        npm error Missing: jest-environment-node@30.0.5 from lock file
remote:        npm error Missing: jest-leak-detector@30.0.5 from lock file
remote:        npm error Missing: source-map-support@0.5.13 from lock file
remote:        npm error Missing: detect-newline@3.1.0 from lock file
remote:        npm error Missing: @jest/get-type@30.0.1 from lock file
remote:        npm error Missing: pretty-format@30.0.5 from lock file
remote:        npm error Missing: @jest/globals@30.0.5 from lock file
remote:        npm error Missing: @jest/source-map@30.0.1 from lock file
remote:        npm error Missing: cjs-module-lexer@2.1.0 from lock file
remote:        npm error Missing: strip-bom@4.0.0 from lock file
remote:        npm error Missing: @jest/expect@30.0.5 from lock file
remote:        npm error Missing: expect@30.0.5 from lock file
remote:        npm error Missing: @jest/expect-utils@30.0.5 from lock file
remote:        npm error Missing: jest-matcher-utils@30.0.5 from lock file
remote:        npm error Missing: jest-diff@30.0.5 from lock file
remote:        npm error Missing: pretty-format@30.0.5 from lock file
remote:        npm error Missing: @jest/diff-sequences@30.0.1 from lock file
remote:        npm error Missing: pretty-format@30.0.5 from lock file
remote:        npm error Missing: @babel/plugin-syntax-jsx@7.27.1 from lock file
remote:        npm error Missing: @babel/plugin-syntax-typescript@7.27.1 from lock file
remote:        npm error Missing: @jest/snapshot-utils@30.0.5 from lock file
remote:        npm error Missing: babel-preset-current-node-syntax@1.2.0 from lock file
remote:        npm error Missing: pretty-format@30.0.5 from lock file
remote:        npm error Missing: semver@7.7.2 from lock file
remote:        npm error Missing: synckit@0.11.11 from lock file
remote:        npm error Invalid: lock file's @babel/helper-plugin-utils@7.25.9 does not satisfy @babel/helper-plugin-utils@7.27.1
remote:        npm error Missing: @babel/plugin-syntax-async-generators@7.8.4 from lock file
remote:        npm error Missing: @babel/plugin-syntax-bigint@7.8.3 from lock file
remote:        npm error Missing: @babel/plugin-syntax-class-properties@7.12.13 from lock file
remote:        npm error Missing: @babel/plugin-syntax-class-static-block@7.14.5 from lock file
remote:        npm error Missing: @babel/plugin-syntax-import-attributes@7.27.1 from lock file
remote:        npm error Missing: @babel/plugin-syntax-import-meta@7.10.4 from lock file
remote:        npm error Missing: @babel/plugin-syntax-json-strings@7.8.3 from lock file
remote:        npm error Missing: @babel/plugin-syntax-logical-assignment-operators@7.10.4 from lock file
remote:        npm error Missing: @babel/plugin-syntax-nullish-coalescing-operator@7.8.3 from lock file
remote:        npm error Missing: @babel/plugin-syntax-numeric-separator@7.10.4 from lock file
remote:        npm error Missing: @babel/plugin-syntax-object-rest-spread@7.8.3 from lock file
remote:        npm error Missing: @babel/plugin-syntax-optional-catch-binding@7.8.3 from lock file
remote:        npm error Missing: @babel/plugin-syntax-optional-chaining@7.8.3 from lock file
remote:        npm error Missing: @babel/plugin-syntax-private-property-in-object@7.14.5 from lock file
remote:        npm error Missing: @babel/plugin-syntax-top-level-await@7.14.5 from lock file
remote:        npm error Missing: picomatch@4.0.3 from lock file
remote:        npm error Missing: camelcase@6.3.0 from lock file
remote:        npm error Missing: leven@3.1.0 from lock file
remote:        npm error Missing: pretty-format@30.0.5 from lock file
remote:        npm error Missing: @ungap/structured-clone@1.3.0 from lock file
remote:        npm error Missing: supports-color@8.1.1 from lock file
remote:        npm error Missing: cssstyle@4.6.0 from lock file
remote:        npm error Missing: data-urls@5.0.0 from lock file
remote:        npm error Missing: decimal.js@10.6.0 from lock file
remote:        npm error Missing: html-encoding-sniffer@4.0.0 from lock file
remote:        npm error Missing: http-proxy-agent@7.0.2 from lock file
remote:        npm error Missing: https-proxy-agent@7.0.6 from lock file
remote:        npm error Missing: is-potential-custom-element-name@1.0.1 from lock file
remote:        npm error Missing: nwsapi@2.2.21 from lock file
remote:        npm error Missing: rrweb-cssom@0.8.0 from lock file
remote:        npm error Missing: saxes@6.0.0 from lock file
remote:        npm error Missing: symbol-tree@3.2.4 from lock file
remote:        npm error Missing: tough-cookie@5.1.2 from lock file
remote:        npm error Missing: w3c-xmlserializer@5.0.0 from lock file
remote:        npm error Missing: webidl-conversions@7.0.0 from lock file
remote:        npm error Missing: whatwg-encoding@3.1.1 from lock file
remote:        npm error Missing: whatwg-mimetype@4.0.0 from lock file
remote:        npm error Missing: whatwg-url@14.2.0 from lock file
remote:        npm error Missing: xml-name-validator@5.0.0 from lock file
remote:        npm error Missing: @asamuzakjp/css-color@3.2.0 from lock file
remote:        npm error Missing: @csstools/css-calc@2.1.4 from lock file
remote:        npm error Missing: @csstools/css-parser-algorithms@3.0.5 from lock file
remote:        npm error Missing: @csstools/css-tokenizer@3.0.4 from lock file
remote:        npm error Missing: @csstools/css-color-parser@3.0.10 from lock file
remote:        npm error Missing: lru-cache@10.4.3 from lock file
remote:        npm error Missing: @csstools/color-helpers@5.0.2 from lock file
remote:        npm error Missing: whatwg-url@14.2.0 from lock file
remote:        npm error Missing: agent-base@7.1.4 from lock file
remote:        npm error Missing: depd@1.1.2 from lock file
remote:        npm error Missing: mimic-fn@2.1.0 from lock file
remote:        npm error Missing: entities@6.0.1 from lock file
remote:        npm error Missing: find-up@4.1.0 from lock file
remote:        npm error Missing: fsevents@2.3.2 from lock file
remote:        npm error Missing: playwright-core@1.54.2 from lock file
remote:        npm error Missing: ansi-regex@5.0.1 from lock file
remote:        npm error Missing: ansi-styles@5.2.0 from lock file
remote:        npm error Missing: react-is@17.0.2 from lock file
remote:        npm error Missing: indent-string@4.0.0 from lock file
remote:        npm error Missing: strip-indent@3.0.0 from lock file
remote:        npm error Missing: resolve-from@5.0.0 from lock file
remote:        npm error Missing: xmlchars@2.2.0 from lock file
remote:        npm error Missing: escape-string-regexp@2.0.0 from lock file
remote:        npm error Missing: char-regex@1.0.2 from lock file
remote:        npm error Missing: strip-ansi@6.0.1 from lock file
remote:        npm error Missing: min-indent@1.0.1 from lock file
remote:        npm error Missing: @pkgr/core@0.2.9 from lock file
remote:        npm error Missing: glob@7.2.3 from lock file
remote:        npm error Missing: minimatch@3.1.2 from lock file
remote:        npm error Missing: tldts@6.1.86 from lock file
remote:        npm error Missing: tldts-core@6.1.86 from lock file
remote:        npm error Missing: makeerror@1.0.12 from lock file
remote:        npm error Missing: tmpl@1.0.5 from lock file
remote:        npm error Missing: iconv-lite@0.6.3 from lock file
remote:        npm error Missing: cliui@8.0.1 from lock file
remote:        npm error Missing: get-caller-file@2.0.5 from lock file
remote:        npm error Missing: require-directory@2.1.1 from lock file
remote:        npm error Missing: string-width@4.2.3 from lock file
remote:        npm error Missing: y18n@5.0.8 from lock file
remote:        npm error Missing: yargs-parser@21.1.1 from lock file
remote:        npm error Missing: string-width@4.2.3 from lock file
remote:        npm error Missing: strip-ansi@6.0.1 from lock file
remote:        npm error Missing: wrap-ansi@7.0.0 from lock file
remote:        npm error Missing: locate-path@5.0.0 from lock file
remote:        npm error Missing: argparse@1.0.10 from lock file
remote:        npm error Missing: esprima@4.0.1 from lock file
remote:        npm error Missing: sprintf-js@1.0.3 from lock file
remote:        npm error Missing: p-locate@4.1.0 from lock file
remote:        npm error Missing: p-limit@2.3.0 from lock file
remote:        npm error Missing: p-try@2.2.0 from lock file
remote:        npm error Missing: @jest/test-sequencer@30.0.5 from lock file
remote:        npm error Missing: babel-jest@30.0.5 from lock file
remote:        npm error Missing: deepmerge@4.3.1 from lock file
remote:        npm error Missing: jest-circus@30.0.5 from lock file
remote:        npm error Missing: parse-json@5.2.0 from lock file
remote:        npm error Missing: babel-preset-jest@30.0.1 from lock file
remote:        npm error Missing: babel-plugin-jest-hoist@30.0.1 from lock file
remote:        npm error Missing: co@4.6.0 from lock file
remote:        npm error Missing: dedent@1.6.0 from lock file
remote:        npm error Missing: is-generator-fn@2.1.0 from lock file
remote:        npm error Missing: jest-each@30.0.5 from lock file
remote:        npm error Missing: pretty-format@30.0.5 from lock file
remote:        npm error Missing: pure-rand@7.0.1 from lock file
remote:        npm error Missing: pretty-format@30.0.5 from lock file
remote:        npm error Missing: error-ex@1.3.2 from lock file
remote:        npm error Missing: json-parse-even-better-errors@2.3.1 from lock file
remote:        npm error Missing: is-arrayish@0.2.1 from lock file
remote:        npm error Missing: ansi-styles@5.2.0 from lock file
remote:        npm error Missing: @radix-ui/react-slot@1.2.3 from lock file
remote:        npm error Missing: @radix-ui/react-slot@1.2.3 from lock file
remote:        npm error Missing: dequal@2.0.3 from lock file
remote:        npm error Missing: emoji-regex@8.0.0 from lock file
remote:        npm error Missing: ansi-regex@5.0.1 from lock file
remote:        npm error Missing: ansi-styles@4.3.0 from lock file
remote:        npm error Missing: tr46@5.1.1 from lock file
remote:        npm error Missing: webidl-conversions@7.0.0 from lock file
remote:        npm error Missing: semver@7.7.2 from lock file
remote:        npm error Missing: ansi-styles@5.2.0 from lock file
remote:        npm error Missing: pretty-format@30.0.5 from lock file
remote:        npm error Missing: ansi-styles@5.2.0 from lock file
remote:        npm error Missing: ansi-styles@5.2.0 from lock file
remote:        npm error Missing: ansi-styles@5.2.0 from lock file
remote:        npm error Missing: ansi-styles@5.2.0 from lock file
remote:        npm error Missing: ansi-styles@5.2.0 from lock file
remote:        npm error Missing: ansi-styles@5.2.0 from lock file
remote:        npm error Missing: ansi-styles@5.2.0 from lock file
remote:        npm error Missing: ansi-styles@5.2.0 from lock file
remote:        npm error Missing: agent-base@7.1.4 from lock file
remote:        npm error Missing: tr46@5.1.1 from lock file
remote:        npm error Missing: locate-path@5.0.0 from lock file
remote:        npm error Missing: p-locate@4.1.0 from lock file
remote:        npm error Missing: p-limit@2.3.0 from lock file
remote:        npm error Missing: ansi-regex@5.0.1 from lock file
remote:        npm error Missing: brace-expansion@1.1.12 from lock file
remote:        npm error Missing: emoji-regex@8.0.0 from lock file
remote:        npm error Missing: strip-ansi@6.0.1 from lock file
remote:        npm error Missing: ansi-regex@5.0.1 from lock file
remote:        npm error
remote:        npm error Clean install a project
remote:        npm error
remote:        npm error Usage:
remote:        npm error npm ci
remote:        npm error
remote:        npm error Options:
remote:        npm error [--install-strategy <hoisted|nested|shallow|linked>] [--legacy-bundling]
remote:        npm error [--global-style] [--omit <dev|optional|peer> [--omit <dev|optional|peer> ...]]
remote:        npm error [--include <prod|dev|optional|peer> [--include <prod|dev|optional|peer> ...]]
remote:        npm error [--strict-peer-deps] [--foreground-scripts] [--ignore-scripts] [--no-audit]
remote:        npm error [--no-bin-links] [--no-fund] [--dry-run]
remote:        npm error [-w|--workspace <workspace-name> [-w|--workspace <workspace-name> ...]]
remote:        npm error [-ws|--workspaces] [--include-workspace-root] [--install-links]
remote:        npm error
remote:        npm error aliases: clean-install, ic, install-clean, isntall-clean
remote:        npm error
remote:        npm error Run "npm help ci" for more info
remote:        npm notice
remote:        npm notice New major version of npm available! 10.8.2 -> 11.5.2
remote:        npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.5.2
remote:        npm notice To update run: npm install -g npm@11.5.2
remote:        npm notice
remote:        npm error A complete log of this run can be found in: /tmp/npmcache.f7dkB/_logs/2025-08-12T16_29_21_680Z-debug-0.log
remote: 
remote: -----> Build failed
remote:        
remote:        We're sorry this build is failing! You can troubleshoot common issues here:
remote:        https://devcenter.heroku.com/articles/troubleshooting-node-deploys
remote:        
remote:        If you're stuck, please submit a ticket so we can help:
remote:        https://help.heroku.com/
remote:        
remote:        Love,
remote:        Heroku
remote:        
remote:  !     Push rejected, failed to compile Node.js app.
remote: 
remote:  !     Push failed
remote: Verifying deploy...
remote: 
remote: !       Push rejected to nuconnect.
remote: 
To https://git.heroku.com/nuconnect.git
 ! [remote rejected] main -> main (pre-receive hook declined)
error: failed to push some refs to 'https://git.heroku.com/nuconnect.git'
(base) dub_ceo@Cs-MacBook-Pro nuconnect % 