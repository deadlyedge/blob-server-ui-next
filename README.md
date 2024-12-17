# pyBlobServer UI

a simple UI for pyBlobServer

# usage

you'd have your own pyBlobServer, and set `API_BASE_URL` to your server url.

add an environment setting at `NEXT_PUBLIC_SOCKET_ENDPOINT=`, which should be 
just like your API_BASE_URL, but like this partern: `wss://your.api.address/upload` 
this variable should be passed to client to enable point-to-point socket file transfer
so it MUST start with NEXT_PUBLIC_

then you can use this UI to manage your files.

# develop

10 days, pyBlobServer with pydantic, fastapi, sqlalchemy, sqlite, peewee, tortoist, zustand, and react query, and lot more, without AI assistance, i can't image it.

# todo

- ~~read user info~~
- ~~change token~~
- ~~upload file (batch)~~
- first time visit get token
- ~~use zustand to manage cookies~~

# tips

for security reason, token should be hidden like password, but I just show it for developing.

# deploy

just fork this repo and use vercel to deploy. with this env setting:

```
API_BASE_URL='https://your-pyblobserver.deploy.site'
```