var overlayTransitionExitMap = {
  'bounce': 'zoomOut',
  'flash': 'zoomOut',
  'pulse': 'zoomOut',
  'rubberBand': 'zoomOut',
  'shake': 'hinge',
  'swing': 'hinge',
  'tada': 'zoomOut',
  'wobble': 'zoomOut',
  'bounceIn': 'bounceOut',
  'bounceInDown': 'bounceOutUp',
  'bounceInLeft': 'bounceOutLeft',
  'bounceInRight': 'bounceOutRight',
  'bounceInUp': 'bounceOutDown',
  'fadeIn': 'fadeOut',
  'fadeInDown': 'fadeOutUp',
  'fadeInDownBig': 'fadeOutUpBig',
  'fadeInLeft': 'fadeOutLeft',
  'fadeInLeftBig': 'fadeOutLeftBig',
  'fadeInRight': 'fadeOutRight',
  'fadeInRightBig': 'fadeOutRightBig',
  'fadeInUp': 'fadeOutDown',
  'fadeInUpBig': 'fadeOutDownBig',
  'flipInX': 'flipOutX',
  'flipInY': 'flipOutY',
  'lightSpeedIn': 'lightSpeedOut',
  'rotateIn': 'rotateOut',
  'rotateInDownLeft': 'rotateOutUpLeft',
  'rotateInDownRight': 'rotateOutUpRight',
  'rotateInUpLeft': 'rotateOutDownLeft',
  'rotateInUpRight': 'rotateOutDownRight',
  'zoomIn': 'zoomOut',
  'zoomInDown': 'zoomOutUp',
  'zoomInLeft': 'zoomOutLeft',
  'zoomInRight': 'zoomOutRight',
  'zoomInUp': 'zoomOutDown',
  'slideInDown': 'slideOutUp',
  'slideInLeft': 'slideOutLeft',
  'slideInRight': 'slideOutRight',
  'slideInUp': 'slideOutDown',
  'rollIn': 'rollOut'
};

var sampleOverlayClosing;

var data = Fliplet.Widget.getData() || {};
var widgetId = Fliplet.Widget.getDefaultId();

var checkState = {
  NOT_VALID: 1,
  IN_VALIDATION: 2,
  VALID: 3
};
var feedCheckTimeout; // For delay URL check
var URLContent; // For storing last checked content

function jFeedSuccess(result) {
  var settingsArea = $('#rss-feed-settings');

  if (typeof result.link === 'string') {
    data.checkState = checkState.VALID;
    settingsArea.removeClass('checking').removeClass('failed').addClass('active checked');
  } else {
    data.checkState = checkState.NOT_VALID;
    settingsArea.removeClass('checking').addClass('failed');
    $('.rss-fail strong').html('We couldn\'t find a valid RSS feed. Please verify the URL and try again.');
  }
}

function isValidURL(url) {
  return /^(http(s)?:\/\/)?(www\.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(url);
}

function checkRSSIsOnlineAndGetContent(url) {
  var settingsArea = $('#rss-feed-settings');

  data.checkState = checkState.IN_VALIDATION;
  settingsArea.addClass('checking').removeClass('checked');

  if (!isValidURL(url)) {
    data.checkState = checkState.NOT_VALID;
    settingsArea.removeClass('checking').addClass('failed');
    $('.rss-fail strong').html('You have entered an invalid URL. Please try again.');

    return;
  }

  data.rssUrl = url;

  Fliplet.API.request({
    dataType: 'xml',
    url: 'v1/communicate/proxy/' + encodeURIComponent(url)
  }).then(function(response) {
    var feed = new JFeed(response);

    jFeedSuccess(feed, url);
  }).catch(function onError(error) {
    jQuery.getFeed({
      url: 'https://crossorigin.me/' + url,
      success: function(result) {
        jFeedSuccess(result, url);
      },
      error: function() {
        var defaultError = 'Feed URL appears to be invalid or offline. Please verify the URL and try again.';

        data.checkState = checkState.NOT_VALID;
        settingsArea.removeClass('checking').addClass('failed');

        if (error.status >= 400) {
          error = defaultError;
        }

        $('.rss-fail strong').html(Fliplet.parseError(error, defaultError));
      }
    });
  });
}

function hashCode(s) {
  return s.split('').reduce(function(a, b) {
    a = ((a << 5) - a) + b.charCodeAt(0);

    return a & a;
  }, 0);
}

function debouncedRSSValidation() {
  var url = $('#rss-feed-url').val().trim();

  if (feedCheckTimeout) {
    clearTimeout(feedCheckTimeout);
    feedCheckTimeout = null;
  }

  feedCheckTimeout = setTimeout(function() {
    if (url && !url.match(/^[a-zA-Z]+:\/\//)) {
      url = 'http://' + url;
      $('#rss-feed-url').val(url);
    }

    // Checks if URL has changed since last check
    if (url !== URLContent) {
      URLContent = url;
      checkRSSIsOnlineAndGetContent(url);
    }
  }, 500); // Timeout to delay URL check
}

$('#form').on('submit', function(e) {
  e.preventDefault();
  debouncedRSSValidation();
});

$('#rss-layout input[name="rss_layout_style"]').on('change', function() {
  $('#rss-layout-control').removeClass('active');
  $('#rss-layout').removeClass('active');
  $('#rss-settings-control').addClass('active');
  $('#rss-settings').addClass('active');

  var disabledTabs = $('.nav-tabs').find('.disabled');

  disabledTabs.each(function() {
    $(this).removeClass('disabled');
  });

  $('input[name="rss_layout_style"]').removeClass('checked');
  $(this).addClass('checked');
});

// URL Check
$('#rss-feed-url').on('keyup blur change paste input', function() {
  debouncedRSSValidation();
});

// Change state of highlight styles
$('input[name="highlight_style"]').on('change', function() {
  $('input[name="highlight_style"]').removeClass('checked');
  $(this).addClass('checked');
});

// Change state of overlay sizes
$('input[name="overlay_size"]').on('change', function() {
  $('input[name="overlay_size"]').removeClass('checked');
  $(this).addClass('checked');
});

// Change state of separation style
$('input[name="separate_style"]').on('change', function() {
  $('input[name="separate_style"]').removeClass('checked');
  $(this).addClass('checked');
});

// Click to preview overlay animation
$('#preview-overlay-animation').on('click', previewOverlayAnimation);

Fliplet.Widget.onSaveRequest(function() {
  var url = $('#rss-feed-url').val();

  if (url && !url.match(/^[a-zA-Z]+:\/\//)) {
    url = 'http://' + url;
    $('#rss-feed-url').val(url);
  }

  save(true);
});

Fliplet.Widget.toggleCancelButton(false);
Fliplet.Widget.onCancelRequest(function() {
  Fliplet.Widget.complete();
  Fliplet.Studio.emit('reload-widget-instance', widgetId);
});

function save(notifyComplete) {
  var validateFeed = Promise.resolve(false);

  if (!(data.checkState === checkState.VALID)) {
    validateFeed = Fliplet.Modal.confirm({
      title: 'Invalid RSS feed',
      message: 'Please make sure the feed is valid before continuing',
      buttons: {
        cancel: {
          label: 'Save anyway'
        }
      }
    });
  }

  validateFeed.then(function(feedIsInvalid) {
    if (feedIsInvalid) {
      return;
    }

    data.overlayTransition = $('#overlay-transition').val();
    data.rssConf = {
      feedLayout: $('input[name="rss_layout_style"]:checked').val(),
      clippingSettings: {
        title: $('#title-clipping').val(),
        description: $('#description-clipping').val()
      },
      offlineCache: $('input[name="offline_cache"]:checked').val() !== 'false',
      highlighting: $('input[name="highlight_style"]:checked').val(),
      overlay: {
        overlaySize: $('input[name="overlay_size"]:checked').val(),
        overlayTransition: data.overlayTransition,
        overlayTransitionExit: overlayTransitionExitMap[data.overlayTransition]
      },
      designSettings: {
        separationType: $('input[name="separate_style"]:checked').val()
      },
      feed: {
        id: data.id !== null
          ? data.id
          : new Date().getTime(),
        source: data.rssUrl,
        uniqueName: hashCode(data.rssUrl)
      }
    };

    if (notifyComplete) {
      Fliplet.Widget.save(data).then(function() {
        // Close the interface for good
        Fliplet.Widget.complete();
        Fliplet.Studio.emit('reload-widget-instance', widgetId);
      });
    } else {
      // Partial save while typing/using the interface
      Fliplet.Widget.save(data).then(function() {
        Fliplet.Studio.emit('reload-widget-instance', widgetId);
      });
    }
  });
}

function loadSettings(data) {
  if (!('rssConf' in data)) {
    return false;
  }

  data.checkState = checkState.VALID;

  var rssConf = data.rssConf;

  // rss and highlight settings
  $('input[name="rss_layout_style"][value="' + rssConf.feedLayout + '"]').click();
  $('input[name="highlight_style"][value="' + rssConf.highlighting + '"]').click();

  // set of clipping settings
  $('#title-clipping').val(rssConf.clippingSettings.title);
  $('#description-clipping').val(rssConf.clippingSettings.description);

  // set of offline cache settings
  $('input[name="offline_cache"][value="' + (typeof rssConf.offlineCache !== 'undefined' ? '' + !!rssConf.offlineCache : 'true') + '"]').prop('checked', true);

  // set of overlay settings
  $('input[name="overlay_size"][value="' + rssConf.overlay.overlaySize + '"]').click();
  $('#overlay-transition').val(rssConf.overlay.overlayTransition);

  // set of design settings
  $('input[name="separate_style"][value="' + rssConf.designSettings.separationType + '"]').click();

  // set of feedURL
  $('#rss-feed-url').val(rssConf.feed.source);
  $('#rss-feed-settings').removeClass('checking').removeClass('failed').addClass('active checked');
}

function previewOverlayAnimation() {
  var $sampleOverlay = $('#sample-overlay');
  var $sampleOverlayPanel = $sampleOverlay.find('.overlay-panel');
  var selectedAnimation = $('#overlay-transition').val();
  var autoCloseSampleOverlay = true;

  $sampleOverlayPanel.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
    $sampleOverlayPanel.removeClass('animated');
    $sampleOverlayPanel.removeClass(selectedAnimation);

    if ((!sampleOverlayClosing || typeof sampleOverlayClosing === 'undefined') && autoCloseSampleOverlay) {
      setTimeout(closeOverlayPreview, 250);
    }
  });

  $sampleOverlayPanel.addClass(selectedAnimation);
  $sampleOverlayPanel.addClass('animated');

  setTimeout(function() {
    $sampleOverlay.addClass('active');
  }, 0);
}

function closeOverlayPreview() {
  var $sampleOverlay = $('#sample-overlay');
  var $sampleOverlayPanel = $sampleOverlay.find('.overlay-panel');
  var selectedAnimation = $('#overlay-transition').val();
  var exitAnimation = overlayTransitionExitMap[selectedAnimation];

  if (!sampleOverlayClosing || typeof sampleOverlayClosing === 'undefined') {
    sampleOverlayClosing = true;

    $sampleOverlayPanel.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
      sampleOverlayClosing = false;
      $sampleOverlay.removeClass('active');
      $sampleOverlayPanel.removeClass('animated');
      $sampleOverlayPanel.removeClass(exitAnimation);
    });

    $sampleOverlayPanel.addClass(exitAnimation);
    $sampleOverlayPanel.addClass('animated');

    // Set up a timeout to make sure it takes no longer than the timeout limit to close overlay preview
    setTimeout(function() {
      $sampleOverlay.removeClass('active');
    }, 1400);
  }
}

// LOAD SETTINGS
loadSettings(data);
