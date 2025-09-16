

export default ({ config }) => {
  
  const flavor = "bc_roy";       

  const flavorConfig = {
    xyz: {
      name: "Gbooks",
      slug: "vit",
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
      slug: "vit",
      package: "com.gbooks.bcroy",
      scheme: "bc_roy",
      compId: "ji4C/%2BQbn%2BBofLeoFG9clw==",
      icon: "./assets/images/bc_roy/logo.png",
      splash: "./assets/images/bc_roy/logo.png",
      version: "1.0.0",
      baseUrl: "https://apigst.gsterpsoft.com",
      srcUrl: "https://gsterpsoft.com",
    },
    takehome: {
      name: "TakeHome",
      slug: "vit",
      package: "com.takehome.takehome",
      scheme: "takehome",
      compId: "yFObpUjTIGhK9%2B4bFmadRg==",
      icon: "./assets/images/takehome/splash_n_appIcon.png",
      splash: "./assets/images/takehome/logo.png",
      version: "1.0.2",
      baseUrl: "https://myapps.gsterpsoft.com",
      srcUrl: "https://erp.gsterpsoft.com",
    },
  };

  const selected = flavorConfig[flavor];

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
          image: selected.splash,
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
        // projectId: "8a4d3e0d-1e0d-4d25-8b68-8a46886eee2c",
        projectId: "49ccd396-a8dd-4738-ab6b-db8c2474135b",
      },
      compId: selected.compId,
      baseUrl: selected.baseUrl,
      srcUrl: selected.srcUrl,
    },
    owner: "vit2025",
    updates: {
      // url: "https://u.expo.dev/8a4d3e0d-1e0d-4d25-8b68-8a46886eee2c",
      url: "https://u.expo.dev/49ccd396-a8dd-4738-ab6b-db8c2474135b",
      // checkAutomatically: "NEVER",
      // fallbackToCacheTimeout: 0
    },
    runtimeVersion: { policy: "appVersion" },

    name: selected.name,           
    slug: selected.slug,
    icon: selected.icon,
    scheme: selected.scheme,
    version: selected.version,
    android: {
      adaptiveIcon: {
        foregroundImage: selected.icon,
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      package: selected.package,
    },
  }
};
