module.exports = {
  expo: {
    name: "HTML Viewer & Editor",
    slug: "html-viewer-editor",
    version: "1.3.0",
    orientation: "default",
    icon: "./assets/images/icon.png",
    scheme: "htmlviewer",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.iftechstudio.html_live_editor",
    },
    android: {
      package: "com.iftechstudio.html_live_editor",
      versionCode: 1,
      adaptiveIcon: {
        foregroundImage: "./assets/images/icon.png",
        backgroundColor: "#0f172a",
      },
      permissions: [],
      edgeToEdgeEnabled: true,
      enableProguardInReleaseBuilds: true,
      enableShrinkResourcesInReleaseBuilds: true,
    },
    web: {
      bundler: "metro",
      output: "single",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      "expo-font",
      "expo-file-system",
      "expo-document-picker",
      "expo-sharing",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/icon.png",
          resizeMode: "contain",
          backgroundColor: "#0f172a",
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      eas: {
        projectId:
          process.env.EAS_PROJECT_ID || "e18e27a5-760e-4ff2-b4de-439f47000438",
      },
    },
  },
};
