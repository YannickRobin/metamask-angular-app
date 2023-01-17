# metamask-angular-app

## Local setup guide
After cloning the repo, install the application and start Angular:

```bash
cd metamask-angular-app
nvm use
yarn install
yarn start
```

## Demo

![metamask-ng-demo](metamask-ng-demo.gif)

## Deployment on BTP
- Clone repo
- Go to **metamask-angular-app**
```
cd metamask-angular-app
```
- Build **metamask-angular-app**
```
yarn build
```
- Login to BTP
```
yarn cf api https://api.cf.eu20.hana.ondemand.com
yarn cf login --sso
```
- Select your target organisation and space
```
Select an org:
1. dbs-cx-services_cx-boosters-41n7uah4

Org (enter to skip): 1
Targeted org dbs-cx-services_cx-boosters-41n7uah4.

Targeted space dev.

API endpoint:   https://api.cf.eu20.hana.ondemand.com
API version:    3.124.0
user:           yannick.robin@sap.com
org:            dbs-cx-services_cx-boosters-41n7uah4
space:          dev
```
- Push the application (this will create the route, deploy and start the application)
```
yarn deploy
```
- Wait for **metamask-angular-app** to start
```
name:              metamask-angular-app
requested state:   started
routes:            metamask-angular-app-palm-sitatunga-vj.cfapps.eu20.hana.ondemand.com
last uploaded:     Tue 08 Nov 18:41:44 +08 2022
stack:             cflinuxfs3
buildpacks:
	name                                              version   detect output   buildpack name
	https://github.com/cloudfoundry/nginx-buildpack   1.1.45    nginx           nginx

type:            web
sidecars:
instances:       1/1
memory usage:    128M
start command:   varify -buildpack-yml-path ./buildpack.yml ./nginx.conf $HOME/modules $DEP_DIR/nginx/modules && nginx -p $PWD -c ./nginx.conf
     state     since                  cpu    memory   disk     logging      details
#0   running   2022-11-08T10:41:58Z   0.0%   0 of 0   0 of 0   0/s of 0/s
```
- Go the the route indicated into the logs
```
curl 'https://metamask-angular-app-palm-sitatunga-vj.cfapps.eu20.hana.ondemand.com'
```
- Add the route to Allowed Origins CORS Filter configuration in SAP Commerce Cloud (**Environment** > **Services** > **API** > **Properties**)

```
corsfilter.easyrest.allowedOrigins=http://localhost:4200 https://localhost:4200 https://metamask-angular-app-palm-sitatunga-vj.cfapps.eu20.hana.ondemand.com
```