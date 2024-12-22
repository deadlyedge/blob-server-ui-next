# pyBlobServer UI

a simple UI for [pyBlobServer](https://github.com/deadlyedge/pyBlobServer)

This two project working together for just one goal: Make your VPS investment worthy.


As a hobby programer, I learn programing just for fun and buy a VPS just for show off, or at least at the beginning.  And then I found if I want to safe my files for some more show offs, I can't, I need to pay more for some blob services again.  So I'm very angry and I have to write something to get back my control.

And when I did, I found something fun from it.

So here we are.

This project is not finished but very usable, just for some funciton not finished yet.  But I expect it will save your cost in the future but it's all depends on the project you want to host.

Still, you can consider this is public beta, have some fun!

During my coding works, AI did 80% works somehow, I just drink some coffee and do minor adjustments.  It's amazing.  Time's changed,
people can now do only thinking works, and left 80% for AI.  Pretty cool!

# usage

you'd have your own pyBlobServer, and set `API_BASE_URL` to your server url.

add an environment setting at `NEXT_PUBLIC_SOCKET_ENDPOINT=`, which should be
just like your API*BASE_URL, but like this partern: `wss://your.api.address/upload`
this variable should be passed to client to enable point-to-point socket file transfer
so it MUST start with NEXT_PUBLIC*

then you can use this UI to manage your files.

# develop

10 days, pyBlobServer with pydantic, fastapi, sqlalchemy, sqlite, peewee, tortoist, zustand, and react query, and lot more, without AI assistance, i can't image it.

# todo

- ~~read user info~~
- ~~change token~~
- ~~upload file (batch)~~
- first time visit get token? for now, you must use an api GET @ your.domain/checkUser
- ~~use zustand to manage cookies~~
- kill CORS errors
- put upload switch into cookies
- add correct response info

# tips

for security reason, token should be hidden like password, but I just show it for developing.

# deploy

just fork this repo and use vercel to deploy. with this env setting:

```
API_BASE_URL='https://your-pyblobserver.deploy.site'
```
