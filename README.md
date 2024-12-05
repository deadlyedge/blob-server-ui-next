# pyBlobServer UI

a simple UI for pyBlobServer

# usage

you'd have your own pyBlobServer, and set `API_BASE_URL` to your server url.

then you can use this UI to manage your files.

# develop


# todo

- ~~read user info~~
- change token
- ~~upload file (batch)~~

# tips

for security reason, token should be hidden like password, but I just show it for developing.

# deploy

just fork this repo and use vercel to deploy. with this env setting:

```
API_BASE_URL='https://your-pyblobserver.deploy.site'
```