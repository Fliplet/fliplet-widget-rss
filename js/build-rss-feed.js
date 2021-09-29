// eslint-disable-next-line no-unused-vars
var rss = (function() {
  $(this).translate();

  // Universal _this reference
  var _this;

  // constructor
  var rss = function(configuration) {
    _this = this;
    this.registerHandlebarsMethods();
    this.online = Fliplet.Navigator.isOnline();

    Fliplet.Navigator.onOffline(function() {
      _this.online = false;
      _this.showOfflineMessage();
    });

    Fliplet.Navigator.onOnline(function() {
      _this.online = true;
      checkConnection(false, configuration);
    });

    $('.pull-to-refresh').on('click', function() {
      var $this = $(this);

      $this.addClass('refreshing').html(T('widgets.rssFeed.actions.refreshing'));
      setTimeout(function() {
        $this.removeClass('refreshing').html(T('widgets.rssFeed.actions.refresh'));
      }, 10000);

      var rssConfig = getFeedConfiguration($(this).data('id'));
      var rssFeed = getFeedPV(rssConfig.rssConf.feed.uniqueName, window.pvObj);

      if (rssFeed && _this.online) {
        loadRSS(rssConfig, rssFeed);
      }
    });

    this.setup(configuration);
  };

  /**
   * Clean up content in case there are incomplete HTML tags
   * @param {String} str - CData content
   * @returns {String} Cleaned up content
   */
  function cleanCData(str) {
    var $div = $('<div></div>');

    $div.html(str || '');

    return $div.html().trim();
  }

  // prototype
  rss.prototype = {
    constructor: rss,
    setup: function(configuration) {
      $(document).ready(function() {
        // valid connection logic
        if (_this.online) {
          checkConnection(true, configuration);
        } else {
          _this.showOfflineMessage();
          initializePV(configuration);
        }
      });
    },
    // Show the offline message
    showOfflineMessage: function() {
      var $offlineWarning = $('.offline-notification');

      $offlineWarning.addClass('offline');
    },

    removeOfflineMessage: function() {
      var $offlineWarning = $('.offline-notification');

      $offlineWarning.removeClass('offline');
    },
    registerHandlebarsMethods: function() {
      // Register a helper
      Handlebars.registerHelper('safeString', function(content) {
        return new Handlebars.SafeString(content);
      });

      // Register a helper
      Handlebars.registerHelper('hasThumbnail', function(thumbnail) {
        // str is the argument passed to the helper when called
        return thumbnail.length === 0 ? 'no-image' : '';
      });

      // Register a helper
      Handlebars.registerHelper('description-only', function(descriptionOnly) {
        // str is the argument passed to the helper when called
        return descriptionOnly ? 'description-only' : '';
      });

      // Register a helper
      Handlebars.registerHelper('isRead', function(read, highlighting) {
        // str is the argument passed to the helper when called
        return read ? '' : highlighting;
      });

      // Register a helper
      Handlebars.registerHelper('clipping', function(clippingValue) {
        // clippingValue is the argument passed to the helper when called
        switch (clippingValue) {
          case 'none':
            return 'hidden';
          case 'no-clip':
            return 'all';
          default:
            return 'clip ' + clippingValue;
        }
      });

      // Register a helper
      Handlebars.registerHelper('getUpdateValue', function(date) {
        // date is the argument passed to the helper when called
        return 'Last updated: ' + moment(new Date(date)).fromNow();
      });


      Handlebars.registerHelper('debug', function(optionalValue) {
        console.log('Current Context');
        console.log('====================');
        console.log(this);

        if (optionalValue) {
          console.log('Value');
          console.log('====================');
          console.log(optionalValue);
        }
      });
    }
  };

  /**
   * Method that checks the device connection.
   * If on page init initializes the Persistence variable.
   * @param {Boolean} onInit - flag to signal page init
   * @param {Object} configuration - rssConf to be passed to the initializedPV();
   * @return {void}
   */
  function checkConnection(onInit, configuration) {
    if (Fliplet.Navigator.isOnline()) {
      _this.removeOfflineMessage();
      _this.online = true;

      if (onInit) {
        initializePV(configuration);
      }
    } else if (_this.online) {
      _this.removeOfflineMessage();
      _this.online = true;

      if (onInit) {
        initializePV(configuration);
      }
    } else {
      _this.showOfflineMessage();
      _this.online = false;

      if (onInit) {
        initializePV(configuration);
      }
    }
  }

  /**
   * method used to initialize the rss plugin Persistence variable
   */

  function setUserDataPV(successCallback, failCallback) {
    var structure = {
      feeds: []
    };

    window.pvName = 'rss_data_' + Fliplet.Env.get('appId');
    Fliplet.Security.Storage.create(pvName, structure).then(function(data) {
      window.pvObj = data;
      successCallback();
    }, failCallback);
  }

  function initializePV(configuration) {
    Fliplet.Security.Storage.init().then(function() {
      setUserDataPV(function() {
        var feedsInUse = [];

        if (typeof pvObj.feeds === 'undefined' || pvObj.feeds.length === 0) {
          $('.feed').addClass('loading');
          pvObj.feeds = [];
        }

        for (var i = 0; i < configuration.length; i++) {
          var feedConf = configuration[i];
          var feedPV = getFeedPV(feedConf.rssConf.feed.uniqueName, pvObj);

          if (!feedPV) {
            var now = moment();

            feedPV = new FlipletFeed(feedConf.rssConf, feedConf.rssConf.feed.source, now, [], feedConf.rssConf.feed.uniqueName, feedConf.overlayTransition, feedConf.uuid);
            pvObj.feeds.push(feedPV);
          }

          feedsInUse.push(feedConf.rssConf.feed.uniqueName);
          loadRSS(configuration[i], feedPV);
        }

        removeUnusedFeedsFromPV(feedsInUse);
      }, function() {
        alert('Error message here', function() {}, 'Error', 'Close');

        return false;
      });
    });
  }

  /**
   * removes feeds fom Persistence variables that are not in use.
   * @param {String[]} feedsInUse - feeds in the configuration.
   * @return {void}
   */
  function removeUnusedFeedsFromPV(feedsInUse) {
    var inUse = false;

    for (var j = 0; j < window.pvObj.feeds; j++) {
      for (var w = 0; w < feedsInUse.length; w++) {
        if (feedsInUse[j] === window.pvObj.feeds[w].feed.uniqueName) {
          inUse = true;
        }
      }

      window.pvObj.feeds.remove(w);
    }
  }

  /**
   * based on a unique name get the feed Persistence variable with that uniqueName
   * @param {String} feedUniqueName - feed unique name
   * @param {Object} rssPVs - persistence variable with feeds available
   * @return {*} A feed object or FALSE if it's not found
   */
  function getFeedPV(feedUniqueName, rssPVs) {
    for (var j = 0; j < rssPVs.feeds.length; j++) {
      if (Number(rssPVs.feeds[j].uniqueName) === Number(feedUniqueName)) {
        return rssPVs.feeds[j];
      }
    }

    return false;
  }

  /**
   * based on a configuration id gets the feed with that configuration.
   * @param {Number} configId - configuration id of the wanted configuration.
   * @return {*} configuration if exists, false if none
   */
  function getFeedConfiguration(configId) {
    for (var j = 0; j < window.rssConf.length; j++) {
      if (Number(window.rssConf[j].rssConf.feed.id) === Number(configId)) {
        return window.rssConf[j];
      }
    }

    return false;
  }

  /**
   * Based on the persistence Variable loads a new RSS content or the old one in case of an Offline device;
   * @param {Object} configuration - recent feed configuration.
   * @param {Object} rssPV - RSS persistence Variable.
   * @return {void}
   */
  function loadRSS(configuration, rssPV) {
    if (!_this.online) {
      if (rssPV !== null) {
        processFeed(rssPV);
      }
    } else {
      Fliplet.API.request({
        dataType: 'xml',
        url: 'v1/communicate/proxy/' + encodeURIComponent(configuration.rssConf.feed.source)
      }).then(function(response) {
        var feed = new JFeed(response);
        var now = moment();

        if (typeof rssPV.items !== 'undefined') {
          collectReadStatesFromOld(rssPV.items, feed.items);
        }

        // Trim feed items
        for (var i = 0; i < feed.items.length; i++) {
          feed.items[i].description = cleanCData(feed.items[i].description);
          feed.items[i].title = cleanCData(feed.items[i].title);
        }

        rssPV.items = feed.items;
        rssPV.updatedTime = now;
        configuration.items = feed.items;
        configuration.updatedTime = now;
        Fliplet.Security.Storage.update();
        $('.rss-fail').removeClass('show');
        $('.feed').removeClass('loading');

        if ($('.pull-to-refresh').hasClass('refreshing')) {
          $('.pull-to-refresh').removeClass('refreshing').html('Tap to refresh');
        }

        processFeed(configuration);
      }).catch(function onError(error) {
        var errorMessage = Fliplet.parseError(error, T('widgets.rssFeed.errors.invalidAppears'));

        $('.rss-fail').addClass('show');
        $('.rss-fail strong').html(errorMessage);
        $('.feed').removeClass('loading').addClass('loaded');

        if ($('.pull-to-refresh').hasClass('refreshing')) {
          $('.pull-to-refresh').removeClass('refreshing').html(T('widgets.rssFeed.actions.refres'));
        }
      });
    }
  }

  /**
   * Used to pass on the old rss items read states to the newer list;
   * @param {Object[]} oldItems - old items to process
   * @param {Object[]} newItems - new items to pass on the read state
   * @return {void}
   */
  function collectReadStatesFromOld(oldItems, newItems) {
    for (var i = 0; i < oldItems.length; i++) {
      var oldItem = oldItems[i];

      if (typeof oldItem.read !== 'undefined' && oldItem.read) {
        for (var j = 0; j < newItems.length; j++) {
          var newItem = newItems[j];

          if (newItem.link === oldItem.link) {
            newItem.read = oldItem.read;
            break;
          }
        }
      }
    }
  }

  function tpl(name) {
    return Fliplet.Widget.Templates['templates.' + name];
  }

  /**
   * Based on the persistence variable e.g RSS configurations and items renders the handlebars template
   * @param {Object} rssConfiguration - rss Persistence Variable
   * @return {void}
   */
  function processFeed(rssConfiguration) {
    var failDiv = $('.rss-fail');

    if (typeof rssConfiguration.items !== 'undefined') {
      if (rssConfiguration.items.length === 0) {
        failDiv.addClass('show');
        $('.rss-fail strong').html(T('widgets.rssFeed.errors.emptyFeed'));

        return;
      }

      failDiv.removeClass('show');

      $('.feed').removeClass('loading').addClass('loaded');
      // Add the compiled html to the page
      $('#' + rssConfiguration.rssConf.feed.id + '').html(tpl('rssfeeds')(rssConfiguration));

      $('.feed-item').off().on('click', function() {
        var itemIndex = Number(this.id);
        var rssConfig = getFeedConfiguration($(this).data('parent'));
        var rssFeed = getFeedPV(rssConfig.rssConf.feed.uniqueName, window.pvObj);
        var listItem = rssFeed.items[itemIndex];
        var title = listItem.title;
        var content = '<div>' + listItem.content + '</div>';
        var overlayContent = '<h1>' + title + '</h1>' + content;

        // read and unread state.
        listItem.read = true;
        $(this).removeClass(rssConfig.rssConf.highlighting);
        Fliplet.Security.Storage.update();

        if (rssConfig.rssConf.offlineCache === false) {
          if (!Fliplet.Navigator.isOnline()) {
            Fliplet.UI.Toast(T('widgets.rssFeed.errors.offline'));

            return;
          }

          Fliplet.Navigate.url(listItem.link);

          return;
        }

        // Open Overlay
        new Fliplet.Utils.Overlay(overlayContent, {
          showOnInit: true,
          title: title,
          actionText: T('widgets.rssFeed.actions.read'),
          actionCallback: function() {
            Fliplet.Navigate.url(listItem.link);
          },
          closeText: T('widgets.rssFeed.actions.close'),
          size: rssConfig.rssConf.overlay.overlaySize,
          entranceAnim: rssConfig.rssConf.overlay.overlayTransition,
          exitAnim: rssConfig.rssConf.overlay.overlayTransitionExit
        });
      });
    }
  }

  // return module
  return rss;
})();

function FlipletFeed(rssConf, source, updateTime, items, uniqueName, transition, uuid) {
  this.rssUrl = source;
  this.updatedTime = updateTime;
  this.items = items;
  this.uniqueName = uniqueName;
  this.uuid = uuid;
  this.overlayTransition = transition;
  this.rssConf = rssConf;
}

FlipletFeed.prototype = {
  title: '',
  updatedTime: '',
  rssUrl: '',
  items: [],
  rssConf: {},
  uniqueName: '',
  overlayTransition: '',
  uuid: ''
};
