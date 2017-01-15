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
