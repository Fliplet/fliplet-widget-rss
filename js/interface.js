var overlay_transition_exit_map = {
    "bounce" : "zoomOut",
    "flash" : "zoomOut",
    "pulse" : "zoomOut",
    "rubberBand" : "zoomOut",
    "shake" : "hinge",
    "swing" : "hinge",
    "tada" : "zoomOut",
    "wobble" : "zoomOut",
    "bounceIn" : "bounceOut",
    "bounceInDown" : "bounceOutUp",
    "bounceInLeft" : "bounceOutLeft",
    "bounceInRight" : "bounceOutRight",
    "bounceInUp" : "bounceOutDown",
    "fadeIn" : "fadeOut",
    "fadeInDown" : "fadeOutUp",
    "fadeInDownBig" : "fadeOutUpBig",
    "fadeInLeft" : "fadeOutLeft",
    "fadeInLeftBig" : "fadeOutLeftBig",
    "fadeInRight" : "fadeOutRight",
    "fadeInRightBig" : "fadeOutRightBig",
    "fadeInUp" : "fadeOutDown",
    "fadeInUpBig" : "fadeOutDownBig",
    "flipInX" : "flipOutX",
    "flipInY" : "flipOutY",
    "lightSpeedIn" : "lightSpeedOut",
    "rotateIn" : "rotateOut",
    "rotateInDownLeft" : "rotateOutUpLeft",
    "rotateInDownRight" : "rotateOutUpRight",
    "rotateInUpLeft" : "rotateOutDownLeft",
    "rotateInUpRight" : "rotateOutDownRight",
    "zoomIn" : "zoomOut",
    "zoomInDown" : "zoomOutUp",
    "zoomInLeft" : "zoomOutLeft",
    "zoomInRight" : "zoomOutRight",
    "zoomInUp" : "zoomOutDown",
    "slideInDown" : "slideOutUp",
    "slideInLeft" : "slideOutLeft",
    "slideInRight" : "slideOutRight",
    "slideInUp" : "slideOutDown",
    "rollIn" : "rollOut"
};

var data = Fliplet.Widget.getData() || {};

var organizationId = Fliplet.Env.get('organizationId');
var checkState = {
    NOT_VALID: 1,
    IN_VALIDATION: 2,
    VALID: 3
};
var feedCheckTimeout, // For delay URL check
    URLContent; // For storing last checked content

function jFeedSuccess (result, url) {

    var settingsArea = $('#rss-feed-settings');

    if (typeof result.link === "string") {
        data.rssUrl = url;
        data.checkState = checkState.VALID;
        settingsArea.removeClass('checking').removeClass('failed').addClass('active checked');
    } else {
        data.checkState = checkState.NOT_VALID;
        settingsArea.removeClass('checking').addClass('failed');
        $('.rss-fail strong').html("We couldn't find a valid RSS feed. Please verify the URL and try again.");
    }
}

function isValidURL(url) {
    return /^(http(s)?:\/\/)?(www\.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(url);
}

function checkRSSIsOnlineAndGetContent(url) {
    var settingsArea = $('#rss-feed-settings');

    data.checkState = checkState.IN_VALIDATION;
    settingsArea.addClass('checking').removeClass('checked');
    if (isValidURL(url)) {
        jQuery.getFeed({
            url: encodeURI(Fliplet.Env.get('apiUrl') + 'v1/communicate/proxy/' + url + '?auth_token=' + Fliplet.User.getAuthToken()),
            success: function (result){
                jFeedSuccess(result, url);
            },
            error: function () {
                jQuery.getFeed({
                    url: "http://crossorigin.me/" + url,
                    success: function (result){
                        jFeedSuccess(result, url);
                    },
                    error: function () {
                        data.checkState = checkState.NOT_VALID;
                        settingsArea.removeClass('checking').addClass('failed');
                        $('.rss-fail strong').html("The URL you entered seems to lead to an invalid RSS feed or the website is offline. Please verify the URL and try again.");
                    }
                });
            }
        });
    } else {
        data.checkState = checkState.NOT_VALID;
        settingsArea.removeClass('checking').addClass('failed');
        $('.rss-fail strong').html("You have entered an invalid URL. Please try again.");
    }
}

function hashCode(s){
    return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
}

$('#rss-layout input[name="rss_layout_style"]').on('change', function () {
    $('#rss-layout-control').removeClass('active');
    $('#rss-layout').removeClass('active');
    $('#rss-settings-control').addClass('active');
    $('#rss-settings').addClass('active');

    var disabledTabs = $('.nav-tabs').find('.disabled');
    disabledTabs.each(function () {
        $(this).removeClass('disabled');
    });

    $('input[name="rss_layout_style"]').removeClass('checked');
    $(this).addClass('checked');
});

// URL Check
$('#rss-feed-url').on('keyup blur change paste input', function () {
    var _this = $(this),
        url = _this.val().trim();

    if (!url.match(/^[a-zA-Z]+:\/\//))
    {
        url = 'http://' + url;
        _this.val(url);
    }

    clearTimeout(feedCheckTimeout);
    feedCheckTimeout = setTimeout(function () {
        _this.val(url);

        // Checks if URL has changed since last check
        if (url != URLContent) {
            URLContent = url;
            checkRSSIsOnlineAndGetContent(url);
        }

    }, 1000); // Timeout to delay URL check
});

// Change state of highlight styles
$('input[name="highlight_style"]').on('change', function () {
    $('input[name="highlight_style"]').removeClass('checked');
    $(this).addClass('checked');
});

// Change state of overlay sizes
$('input[name="overlay_size"]').on('change', function () {
    $('input[name="overlay_size"]').removeClass('checked');
    $(this).addClass('checked');
});

// Change state of separation style
$('input[name="separate_style"]').on('change', function () {
    $('input[name="separate_style"]').removeClass('checked');
    $(this).addClass('checked');
});

Fliplet.Widget.onSaveRequest(function () {
  save(true);
});

function save(notifyComplete){

  if(!(data.checkState === checkState.VALID)) {
    return;
  }

  data.overlayTransition = $('#overlay-transition').val();
  data.rssConf = {
  feedLayout: $("input[name='rss_layout_style']:checked").val(),
    clippingSettings: {
        title: $('#title-clipping').val(),
        description: $('#description-clipping').val()
    },
    highlighting: $("input[name='highlight_style']:checked").val(),
    overlay: {
        overlaySize: $("input[name='overlay_size']:checked").val(),
        overlayTransition: data.overlayTransition ,
        overlayTransitionExit: overlay_transition_exit_map[data.overlayTransition]
    },
    designSettings: {
        separationType: $("input[name='separate_style']:checked").val()
    },
    feed: {
        id: data.id !== null ? data.id: new Date().getTime(),
        source: data.rssUrl,
        uniqueName: hashCode(data.rssUrl)
    }
  };

  console.log(data);

  if(notifyComplete) {
    Fliplet.Widget.save(data).then(function () {
      // Close the interface for good
      Fliplet.Widget.complete();
    });
  } else {
    // Partial save while typing/using the interface
    Fliplet.Widget.save(data).then(function () {
      Fliplet.Studio.emit('reload-widget-instance', widgetId);
    });
  }
}

function loadSettings(data) {

  if (!('rssConf' in data)) {
      return false;
  }

  data.checkState = checkState.VALID;
  var rssConf = data.rssConf;
  //rss and highlight settings
  $("input[name='rss_layout_style'][value=" + rssConf.feedLayout + "]").click();
  $("input[name='highlight_style'][value=" + rssConf.highlighting + "]").click();

  //set of clipping settings
  $("#title-clipping").val(rssConf.clippingSettings.title);
  $("#description-clipping").val(rssConf.clippingSettings.description);

  //set of overlay settings
  $("input[name='overlay_size'][value=" + rssConf.overlay.overlaySize + "]").click();
  $('#overlay-transition').val(rssConf.overlay.overlayTransition);

  //set of design settings
  $("input[name='separate_style'][value=" + rssConf.designSettings.separationType + "]").click();

  //set of feedURL
  data.rssUrl = rssConf.feed.source;
  $('#rss-feed-url').val(rssConf.feed.source);
  $('#rss-feed-settings').removeClass('checking').removeClass('failed').addClass('active checked');
}

// LOAD SETTINGS
loadSettings(data);
