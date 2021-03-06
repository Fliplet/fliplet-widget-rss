/* jFeed : jQuery feed parser plugin
 * Copyright (C) 2007 Jean-François Hovinne - http://www.hovinne.com/
 * Dual licensed under the MIT (MIT-license.txt)
 * and GPL (GPL-license.txt) licenses.
 */

/* Custom changes
 *
 * - Added additional thumbnail tags for scanning to fix
 *   https://github.com/Fliplet/fliplet-studio/issues/2527
 */

/* eslint-disable */

function getItemThumbnail(item) {
    var thumbnailPaths = [
        {
            path: 'thumbnail'
        },
        {
            path: 'media\\:thumbnail'
        },
        {
            path: 'media\\:content'
        },
        {
            path: 'image url',
            type: 'html'
        }
    ];
    var url;
    var tag;
    var $thumbnail;

    // Tries to find tags
    for (var i = 0, l = thumbnailPaths.length; i < l; i++) {
        tag = thumbnailPaths[i];
        $thumbnail = jQuery(item).find(tag.path).eq(0);

        if (!$thumbnail.length) {
            continue;
        }

        switch (tag.type) {
            case 'attr':
                url = $thumbnail.attr(tag.attr);
                break;
            case 'html':
                url = $thumbnail.html();
                break;
            default:
                url = $thumbnail.attr('url');
                break;
        }

        if (url) {
            break;
        }
    }

    return url;
}

jQuery.getFeed = function(options) {

    options = jQuery.extend({

        url: null,
        data: null,
        cache: true,
        success: null,
        failure: null,
        error: null,
        global: true

    }, options);

    if (options.url) {

        if (jQuery.isFunction(options.failure) && jQuery.type(options.error)==='null') {
          // Handle legacy failure option
          options.error = function(xhr, msg, e){
            options.failure(msg, e);
          };
        } else if (jQuery.type(options.failure) === jQuery.type(options.error) === 'null') {
          // Default error behavior if failure & error both unspecified
          options.error = function(xhr, msg, e){
            window.console&&console.log('getFeed failed to load feed', xhr, msg, e);
          };
        }

        return $.ajax({
            type: 'GET',
            url: options.url,
            data: options.data,
            cache: options.cache,
            dataType: (navigator.userAgent.match(/msie [6]/i)) ? "text" : "xml",
            success: function(xml) {
                var feed = new JFeed(xml);
                if (jQuery.isFunction(options.success)) options.success(feed);
            },
            error: options.error,
            global: options.global
        });
    }
};

function JFeed(xml) {
    if (xml) this.parse(xml);
}


JFeed.prototype = {

    type: '',
    version: '',
    title: '',
    link: '',
    description: '',
    parse: function(xml) {

        if (navigator.userAgent.match(/msie [6]/i)) {
            var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.loadXML(xml);
            xml = xmlDoc;
        }

        if (jQuery('channel', xml).length == 1) {

            this.type = 'rss';
            var feedClass = new JRss(xml);

        } else if (jQuery('feed', xml).length == 1) {

            this.type = 'atom';
            var feedClass = new JAtom(xml);
        } else {

            throw new Error('Invalid RSS feed. The XML feed must contain a root &lt;channel&gt; or &lt;feed&gt;.');
        }

        if (feedClass) jQuery.extend(this, feedClass);
    }
};

function JFeedItem() {};

JFeedItem.prototype = {

    title: '',
    link: '',
    description: '',
    descriptionOnly: '',
    content: '',
    updated: '',
    id: '',
    thumbnail: ''

};

function JAtom(xml) {
    this._parse(xml);
}


function JRss(xml) {
    this._parse(xml);
}

JAtom.prototype = {

    _parse: function(xml) {

        var channel = jQuery('feed', xml).eq(0);

        this.version = '1.0';
        this.title = jQuery(channel).find('title:first').text();
        this.link = jQuery(channel).find('link:first').attr('href');
        this.description = jQuery(channel).find('subtitle:first').text();
        this.language = jQuery(channel).attr('xml:lang');
        this.updated = jQuery(channel).find('updated:first').text();

        this.items = new Array();

        var feed = this;

        jQuery('entry', xml).each( function() {

            var item = new JFeedItem();

            item.title = jQuery(this).find('title').eq(0).text();
            item.link = jQuery(this).find('link').eq(0).attr('href');
            //description and content
            var description = jQuery(this).find('description').eq(0),
                content = jQuery(this).find('encoded').eq(0);
            if(typeof content === 'undefined' || content.length === 0) {
                // Add a different way to find the <content:encoded> tag
                content = jQuery(this).children().filter(function () {
                    return this.tagName.indexOf('content') === 0 || this.tagName.indexOf('encoded') > -1
                }).eq(0);
            }
            if(typeof content === 'undefined' || content.length === 0) {
                item.content = description.text();
                item.descriptionOnly = true;
            } else {
                item.content = content.text();
            }
            var thumbnail = getItemThumbnail(this);
            if (thumbnail) {
                item.thumbnail = thumbnail;
            } else {
                item.thumbnail = extractImgFromHtml('<div>' + item.content + '</div>');
            }
            item.description = jQuery('<div>' + description.text() + '</div>').text();
            item.updated = jQuery(this).find('updated').eq(0).text();
            item.id = jQuery(this).find('id').eq(0).text();

            feed.items.push(item);

        });
    }
};


JRss.prototype  = {

    _parse: function(xml) {

        if(jQuery('rss', xml).length == 0) this.version = '1.0';
        else this.version = jQuery('rss', xml).eq(0).attr('version');

        var channel = jQuery('channel', xml).eq(0);

        this.title = jQuery(channel).find('title:first').text();
        this.link = jQuery(channel).find('link:first').text();
        this.description = jQuery(channel).find('description:first').text();
        this.language = jQuery(channel).find('language:first').text();
        this.updated = jQuery(channel).find('lastBuildDate:first').text();

        this.items = new Array();

        var feed = this;

        jQuery('item', xml).each( function() {

            var item = new JFeedItem();

            item.title = jQuery(this).find('title').eq(0).text();
            item.link = jQuery(this).find('link').eq(0).text();
            var description = jQuery(this).find('description').eq(0),
                content = jQuery(this).find('encoded').eq(0);
            if(typeof content === 'undefined' || content.length === 0) {
                // Add a different way to find the <content:encoded> tag
                content = jQuery(this).children().filter(function () {
                    return this.tagName.indexOf('content') === 0 || this.tagName.indexOf('encoded') > -1
                }).eq(0);
            }
            if(typeof content === 'undefined' || content.length === 0) {
                item.content = description.text();
                item.descriptionOnly = true;
            } else {
                item.content = content.text();
            }

            var thumbnail = getItemThumbnail(this);
            if (thumbnail) {
                item.thumbnail = thumbnail;
            } else {
                item.thumbnail = extractImgFromHtml('<div>' + item.content + '</div>');
            }
            item.description = jQuery('<div>' + description.text() + '</div>').text();
            item.updated = jQuery(this).find('pubDate').eq(0).text();
            item.id = jQuery(this).find('guid').eq(0).text();

            feed.items.push(item);

        });
    }
};

/**
 * Function used to extract first image from a html content;
 * exclude images that have invalid attributes to use as a thumbnail (e.g. border with size 0)
 * @param feedItemContent html content
 * @returns {*} image url or empty string
 */
function extractImgFromHtml(feedItemContent) {

    var images = $(feedItemContent).find('img'),
        image,
        i;
    if( typeof images === 'undefined') {
        return '';
    }
    for(i = 0; i < images.length; i++) {
        image = images[i];
        if(attributesAreValid(image.attributes)) {
            return image.src;
        }
    }
    return '';
}

/**
 * based on a set of attributes checks if a images is valid to use as a thumbnail
 * @param imageAttributes image attributes
 * @returns {boolean} true if valid, false if invalid
 */
function attributesAreValid(imageAttributes) {
    if(typeof imageAttributes === 'undefined') {
        return true;
    }
    var attr,
        validHeight = true,
        validWidth = true;
    for(var i = 0; i < imageAttributes.length; i++) {
        attr = imageAttributes[i];
        if(attr.name === 'border' && attr.value === '0' ||
           attr.name === 'height' && attr.value === '0' ||
           attr.name === 'width' && attr.value === '0') {
            return false;
        }
        if((attr.name === 'height' && attr.value === '1')) {
            validHeight = false;
        }
        if((attr.name === 'width' && attr.value === '1')) {
            validWidth = false;
        }
    }
    return validHeight || validWidth;
}
