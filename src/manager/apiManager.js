import {DEV_API_URL, ENVIRONMENT, PROD_API_URL} from '@env';
import {InternetCheck} from '../utils/InternetConnection';
import CookieManager from '@react-native-cookies/cookies';

const apiManager = {
  _fetchPost(
    classes,
    param,
    header,
    json = false,
    responseJson = true,
    cookieCb = () => null,
    credentials = null,
  ) {
    return new Promise(async resolve => {
      const internet = await InternetCheck();
      if (!internet) {
        resolve(undefined);
        return;
      }

      await CookieManager.clearAll();
      const urlHeader = await urlHeaderCreation(classes, header, responseJson);
      console.info(
        `FILTERING LOGGER ----- Cookie header in post for ${classes}   ------  `,
        urlHeader.header,
      );
      fetch(urlHeader.url, {
        method: 'POST',
        headers: urlHeader.header,
        body: JSON.stringify(param),
        ...(credentials && {
          credentials: credentials,
        }),
      })
        .then(response => {
          cookieCb(response.headers.get('set-cookie'));
          console.info(
            `FILTERING LOGGER ----- Cookie response in post for ${classes}   ------  `,
            response,
          );
          return responseJson ? response.json() : response.text();
        })
        .then(async responseJson => {
          const res = await appCodeErrorHandle(classes, responseJson);
          resolve(res);
        })
        .catch(error => {
          if (!json) {
            catchErrorHandle(classes, error);
          }

          console.warn('ERROR', error);

          resolve(undefined);
        }); //end of fetch
    }); //end of Promise
  }, //end of _fetchPost
  _fetchGet(
    classes,
    header,
    json = false,
    responseJson = true,
    cookieCb = () => null,
    credentials = null,
  ) {
    return new Promise(async resolve => {
      const internet = await InternetCheck();
      if (!internet) {
        resolve(undefined);
        return;
      }
      await CookieManager.clearAll();
      const urlHeader = await urlHeaderCreation(classes, header, responseJson);
      console.info(
        `FILTERING LOGGER ----- Cookie header in get for ${classes}   ------  `,
        urlHeader.header,
      );
      fetch(urlHeader.url, {
        method: 'GET',
        ...(header && {
          headers: urlHeader.header,
        }),
        ...(credentials && {
          credentials: credentials,
        }),
      })
        .then(response => {
          cookieCb(response.headers.get('set-cookie'));
          console.info(
            `FILTERING LOGGER ----- Cookie response in get for ${classes}   ------  `,
            response,
          );
          return responseJson ? response.json() : response.text();
        })
        .then(async responseJson => {
          const res = await appCodeErrorHandle(classes, responseJson);
          resolve(res);
        })
        .catch(error => {
          if (!json) {
            catchErrorHandle(classes, error);
          }

          console.warn('ERROR', error);

          resolve(undefined);
        }); //end of fetch
    }); //end of Promise
  }, //end of _fetchPost
}; //end of API MANAGER

export default apiManager;

function appCodeErrorHandle(classes, response) {
  return new Promise(resolve => {
    //Handling Custom ERROR CODE

    resolve(response);
    return;
  });
}

async function catchErrorHandle(classes, error) {
  return new Promise(resolve => {
    if (
      error.toString().includes('Error: Request failed with status code 401')
    ) {
      resolve(undefined);
      console.warn('Api not found!', '');
      return;
    } else {
      console.log(classes.toUpperCase() + ' Error By Catch==>\n' + error);
      resolve(undefined);
      console.warn(error.toString(), '');
      return;
    }
  });
}

function urlHeaderCreation(classes, header, responseJson) {
  return new Promise(async resolve => {
    let response = {};
    let url_ = null;
    let header_ = null;

    if (!!classes) {
      if (ENVIRONMENT == 'production') {
        console.log('PROD_API_URL USING URL HEADER CREATION', PROD_API_URL);

        url_ = PROD_API_URL + classes;
      } else {
        console.log('DEV_API_URL', DEV_API_URL);
        url_ = DEV_API_URL + classes;
      }

      header_ = header
        ? header
        : responseJson
        ? {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          }
        : {};

      if (!!header) {
        for (let i = 0; i < header.length; i++) {
          const key = Object.keys(header[i]);
          const values = Object.values(header[i]);
          header_[key[0]] = values[0];
        }
      }
      response['url'] = url_;
      response['header'] = header_;

      resolve(response);
    } else {
      console.warn('API url is not valid!');
      resolve();
    }
  });
}
