## Ideas

### Add build scripts

Find a way to manage build scripts similar to NPM's `"start"` in `package.json`

### Watch changes

When game code changes, the following should happen:
* Server, client, and game code is rebuilt
* After that the server shuts down and restarts
* After that all clients with the old version reload the page to avoid weird mismatches
