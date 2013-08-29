You will need:

- a POSIX shell (OS X, Linux, any other Unix derivatives, Cygwin, any other POSIX emulators for Windows, etc.)
- Git
- Node.js

## Running

If it's your first time running the middleware:

```
$ git clone https://github.com/westhouseproject/middleware
$ cd middleware
$ npm install
```

Then create a settings file, which should look something like:

{
  "mControlHost": "example.com"
}

Where:

- `mControlHost` is the hostname of where the mControl server listens for HTTP requests.

```
$ npm start
```

## Deployment

Be sure that you have the settings set. Afterwards, run deploy.sh, and it should be good to go from there.
