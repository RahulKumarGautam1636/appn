

export default ({ config }) => {
  
  const flavorConfig = {
    xyz: {
      name: "Gbooks",
      package: "com.gbooks.gbooks",
      scheme: "gbooks",
      compId: "FFCeIi27FQMTNGpatwiktw==",
      icon: "./assets/images/xyz/logo.png",
      splash: "./assets/images/xyz/logo.png",
      version: "1.0.0",
      baseUrl: "https://myapps.gsterpsoft.com",
      srcUrl: "https://erp.gsterpsoft.com",
    },
    bc_roy: {
      name: "B.C. ROY",
      package: "com.gbooks.bcroy",
      scheme: "bcroy",
      compId: "ji4C/%2BQbn%2BBofLeoFG9clw==",
      icon: "./assets/images/bc_roy/logo.png",
      splash: "./assets/images/bc_roy/logo.png",
      version: "1.0.2",
      baseUrl: "https://apigst.gsterpsoft.com",
      srcUrl: "https://gsterpsoft.com",
    },
    takehome: {
      name: "TakeHome",
      package: "com.takehome.takehome",
      scheme: "takehome",
      compId: "yFObpUjTIGhK9%2B4bFmadRg==",
      icon: "./assets/images/takehome/splash_n_appIcon.png",
      splash: "./assets/images/takehome/logo.png",
      version: "1.1.5",
      baseUrl: "https://myapps.gsterpsoft.com",
      srcUrl: "https://erp.gsterpsoft.com",
    },
    ecom: {
      name: "Gbooks Shopping",
      package: "com.gbooks.ecom",
      scheme: "gbooksecom",
      compId: "KHLqDFK8CUUxe1p1EotU3g==",
      icon: "./assets/images/pharmacy/logo.png",
      splash: "./assets/images/pharmacy/logo.png",
      version: "1.0.0",
      baseUrl: "https://myapps.gsterpsoft.com",
      srcUrl: "https://erp.gsterpsoft.com",
    },
  };

  const accounts = {
    rk: {
      owner: "rkatexpo",
      projectId: "8a4d3e0d-1e0d-4d25-8b68-8a46886eee2c",
      updateUrl: "https://u.expo.dev/8a4d3e0d-1e0d-4d25-8b68-8a46886eee2c",
      slug: "myapp"
    },
    vit: {
      owner: "vit2025",
      projectId: "49ccd396-a8dd-4738-ab6b-db8c2474135b",
      updateUrl: "https://u.expo.dev/49ccd396-a8dd-4738-ab6b-db8c2474135b",
      slug: "vit"
    }
  }

  const testBuild = false;
  const flavor = flavorConfig["takehome"];
  const account = accounts["vit"];

  return {
    ...config,
    orientation: "portrait",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: { supportsTablet: true },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: flavor.splash,
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
    ],
    experiments: { typedRoutes: true },
    extra: {
      router: {},
      eas: {
        projectId: account.projectId,
      },
      compId: flavor.compId,
      baseUrl: flavor.baseUrl,
      srcUrl: flavor.srcUrl,
    },
    owner: account.owner,
    updates: {
      url: account.updateUrl,
      checkAutomatically: "NEVER",
      fallbackToCacheTimeout: 0
    },
    runtimeVersion: { policy: "appVersion" },

    name: flavor.name,           
    slug: account.slug,
    icon: flavor.icon,
    scheme: flavor.scheme,
    version: flavor.version,
    android: {
      softwareKeyboardLayoutMode: "pan",
      adaptiveIcon: {
        foregroundImage: flavor.icon,
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      package: testBuild ? 'com.testBuild.' + flavor.package.split('.')[2] : flavor.package,
    },
  }
};
