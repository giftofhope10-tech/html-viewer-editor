const appJson = require('./app.json');

module.exports = {
  ...appJson,
  expo: {
    ...appJson.expo,
    extra: {
      ...(appJson.expo.extra || {}),
      eas: {
        ...(appJson.expo.extra?.eas || {}),
        projectId: process.env.EAS_PROJECT_ID || appJson.expo.extra?.eas?.projectId || undefined,
      },
    },
  },
};
