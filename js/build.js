Fliplet.Navigator.onReady().then(function() {
  Fliplet.Widget.instance('rss', function(config) {

    if (!window.rssConf) {
        window.rssConf = [];
    }

    window.rssConf.push(config);

    window.reloadTime = null;

    // multiple event prevention
    var currentTime = new Date();

    if (currentTime - window.reloadTime < 1000) {
        return;
    }

    if (typeof window.rssInit === "undefined") {
        window.rssInit = new rss(window.rssConf);
    } else {
        window.rssInit.setup(window.rssConf);
    }

    window.reloadTime = currentTime;
  });
});
