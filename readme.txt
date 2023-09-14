run `sam build` to build project
run `sam sam local invoke -n env.json -e xxx-event.json` to local run
run `sam deploy --config-file stage-samconfig.toml` to deploy project to test env.
run `sam deploy --config-file main-samconfig.toml` to deploy project to prod env.