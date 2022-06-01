Fliplet.Widget.instance('rss', function(data) {
  $container = $(this);

  function init() {
    if (!window.rssConf) {
      window.rssConf = [];
    }

    window.rssConf.push(data);
    window.reloadTime = null;

    // multiple event prevention
    var currentTime = new Date();

    if (currentTime - window.reloadTime < 1000) {
      return;
    }

    if (typeof window.rssInit === 'undefined') {
      window.rssInit = new rss(window.rssConf);
    } else {
      window.rssInit.setup(window.rssConf);
    }

    window.reloadTime = currentTime;
  }

  Fliplet().then(function() {
    $container.translate();

    init();
  });
});
