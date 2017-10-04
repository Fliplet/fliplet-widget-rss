this["Fliplet"] = this["Fliplet"] || {};
this["Fliplet"]["Widget"] = this["Fliplet"]["Widget"] || {};
this["Fliplet"]["Widget"]["Templates"] = this["Fliplet"]["Widget"]["Templates"] || {};

this["Fliplet"]["Widget"]["Templates"]["templates.rssfeeds"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression, alias4=container.lambda;

  return "        <li id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" data-parent=\""
    + alias3(alias4(((stack1 = ((stack1 = (depths[1] != null ? depths[1].rssConf : depths[1])) != null ? stack1.feed : stack1)) != null ? stack1.id : stack1), depth0))
    + "\" class=\"linked feed-item clearfix "
    + alias3((helpers.hasThumbnail || (depth0 && depth0.hasThumbnail) || alias2).call(alias1,(depth0 != null ? depth0.thumbnail : depth0),{"name":"hasThumbnail","hash":{},"data":data}))
    + " "
    + alias3((helpers.isRead || (depth0 && depth0.isRead) || alias2).call(alias1,(depth0 != null ? depth0.read : depth0),((stack1 = (depths[1] != null ? depths[1].rssConf : depths[1])) != null ? stack1.highlighting : stack1),{"name":"isRead","hash":{},"data":data}))
    + "\">\n            <span class=\"icon fa fa-angle-right\"></span> "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.thumbnail : depth0)) != null ? stack1.length : stack1),{"name":"if","hash":{},"fn":container.program(2, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "            <div class=\"list-text-holder\">\n                <p class=\"list-title "
    + alias3((helpers.clipping || (depth0 && depth0.clipping) || alias2).call(alias1,((stack1 = ((stack1 = (depths[1] != null ? depths[1].rssConf : depths[1])) != null ? stack1.clippingSettings : stack1)) != null ? stack1.title : stack1),{"name":"clipping","hash":{},"data":data}))
    + "\">\n                    <span class=\"circle-icon\"></span> "
    + alias3(alias4((depth0 != null ? depth0.title : depth0), depth0))
    + "\n                </p>\n                <p class=\"list-description "
    + alias3((helpers.clipping || (depth0 && depth0.clipping) || alias2).call(alias1,((stack1 = ((stack1 = (depths[1] != null ? depths[1].rssConf : depths[1])) != null ? stack1.clippingSettings : stack1)) != null ? stack1.description : stack1),{"name":"clipping","hash":{},"data":data}))
    + "\">\n                    "
    + alias3(alias4((depth0 != null ? depth0.description : depth0), depth0))
    + "\n                </p>\n            </div>\n        </li>\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "\n            <div class=\"list-image\" style=\"background-image: url('"
    + container.escapeExpression(container.lambda((depth0 != null ? depth0.thumbnail : depth0), depth0))
    + "');\"></div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.escapeExpression, alias3=container.lambda;

  return "<div id=\"date\">"
    + alias2((helpers.getUpdateValue || (depth0 && depth0.getUpdateValue) || helpers.helperMissing).call(alias1,(depth0 != null ? depth0.updatedTime : depth0),{"name":"getUpdateValue","hash":{},"data":data}))
    + "</div>\n<div class=\"offline-notification animated\">Your device is offline</div>\n<div class=\"feed\">\n\n    <div class=\"loading-message-holder\">\n        <div class=\"loading-message\">We’re loading the feed for the first time. This will take just a couple of minutes.</div>\n    </div>\n\n    <ul class=\"feed-panels "
    + alias2(alias3(((stack1 = ((stack1 = (depth0 != null ? depth0.rssConf : depth0)) != null ? stack1.designSettings : stack1)) != null ? stack1.separationType : stack1), depth0))
    + " "
    + alias2(alias3(((stack1 = (depth0 != null ? depth0.rssConf : depth0)) != null ? stack1.feedLayout : stack1), depth0))
    + "\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.items : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </ul>\n</div>\n";
},"useData":true,"useDepths":true});