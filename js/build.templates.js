this["Fliplet"] = this["Fliplet"] || {};
this["Fliplet"]["Widget"] = this["Fliplet"]["Widget"] || {};
this["Fliplet"]["Widget"]["Templates"] = this["Fliplet"]["Widget"]["Templates"] || {};

this["Fliplet"]["Widget"]["Templates"]["templates.rssfeeds"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "        <li id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" data-parent=\""
    + alias3(container.lambda(((stack1 = ((stack1 = (depths[1] != null ? depths[1].rssConf : depths[1])) != null ? stack1.feed : stack1)) != null ? stack1.id : stack1), depth0))
    + "\" class=\"linked feed-item clearfix "
    + alias3((helpers.hasThumbnail || (depth0 && depth0.hasThumbnail) || alias2).call(alias1,(depth0 != null ? depth0.thumbnail : depth0),{"name":"hasThumbnail","hash":{},"data":data}))
    + " "
    + alias3((helpers.isRead || (depth0 && depth0.isRead) || alias2).call(alias1,(depth0 != null ? depth0.read : depth0),((stack1 = (depths[1] != null ? depths[1].rssConf : depths[1])) != null ? stack1.highlighting : stack1),{"name":"isRead","hash":{},"data":data}))
    + "\">\r\n            <span class=\"icon fa fa-angle-right\"></span> "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.thumbnail : depth0)) != null ? stack1.length : stack1),{"name":"if","hash":{},"fn":container.program(2, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "            <div class=\"list-text-holder\">\r\n                <p class=\"list-title "
    + alias3((helpers.clipping || (depth0 && depth0.clipping) || alias2).call(alias1,((stack1 = ((stack1 = (depths[1] != null ? depths[1].rssConf : depths[1])) != null ? stack1.clippingSettings : stack1)) != null ? stack1.title : stack1),{"name":"clipping","hash":{},"data":data}))
    + "\">\r\n                    <span class=\"circle-icon\"></span> "
    + alias3((helpers.safeString || (depth0 && depth0.safeString) || alias2).call(alias1,(depth0 != null ? depth0.title : depth0),{"name":"safeString","hash":{},"data":data}))
    + "\r\n                </p>\r\n                <p class=\"list-description "
    + alias3((helpers.clipping || (depth0 && depth0.clipping) || alias2).call(alias1,((stack1 = ((stack1 = (depths[1] != null ? depths[1].rssConf : depths[1])) != null ? stack1.clippingSettings : stack1)) != null ? stack1.description : stack1),{"name":"clipping","hash":{},"data":data}))
    + "\">\r\n                    "
    + alias3((helpers.safeString || (depth0 && depth0.safeString) || alias2).call(alias1,(depth0 != null ? depth0.description : depth0),{"name":"safeString","hash":{},"data":data}))
    + "\r\n                </p>\r\n            </div>\r\n        </li>\r\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "\r\n            <div class=\"list-image\" style=\"background-image: url('"
    + container.escapeExpression(container.lambda((depth0 != null ? depth0.thumbnail : depth0), depth0))
    + "');\"></div>\r\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression, alias4=container.lambda;

  return "<div id=\"date\">"
    + alias3((helpers.getUpdateValue || (depth0 && depth0.getUpdateValue) || alias2).call(alias1,(depth0 != null ? depth0.updatedTime : depth0),{"name":"getUpdateValue","hash":{},"data":data}))
    + "</div>\r\n<div class=\"offline-notification animated\">"
    + alias3((helpers.T || (depth0 && depth0.T) || alias2).call(alias1,"widgets.rssFeed.offline",{"name":"T","hash":{},"data":data}))
    + "</div>\r\n<div class=\"feed\">\r\n\r\n    <div class=\"loading-message-holder\">\r\n        <div class=\"loading-message\">"
    + alias3((helpers.T || (depth0 && depth0.T) || alias2).call(alias1,"widgets.rssFeed.loading",{"name":"T","hash":{},"data":data}))
    + "</div>\r\n    </div>\r\n\r\n    <ul class=\"feed-panels "
    + alias3(alias4(((stack1 = ((stack1 = (depth0 != null ? depth0.rssConf : depth0)) != null ? stack1.designSettings : stack1)) != null ? stack1.separationType : stack1), depth0))
    + " "
    + alias3(alias4(((stack1 = (depth0 != null ? depth0.rssConf : depth0)) != null ? stack1.feedLayout : stack1), depth0))
    + "\">\r\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.items : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </ul>\r\n</div>\r\n";
},"useData":true,"useDepths":true});