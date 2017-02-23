this["Fliplet"] = this["Fliplet"] || {};
this["Fliplet"]["Widget"] = this["Fliplet"]["Widget"] || {};
this["Fliplet"]["Widget"]["Templates"] = this["Fliplet"]["Widget"]["Templates"] || {};

this["Fliplet"]["Widget"]["Templates"]["templates.rssfeeds"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression, alias4=container.lambda;

  return "        <li id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" data-parent=\""
    + "\" class=\"linked feed-item clearfix "
    + alias3((helpers.hasThumbnail || (depth0 && depth0.hasThumbnail) || alias2).call(alias1,(depth0 != null ? depth0.thumbnail : depth0),{"name":"hasThumbnail","hash":{},"data":data}))
    + " "
    + "\">\r\n            <span class=\"icon fa fa-angle-right\"></span> "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.thumbnail : depth0)) != null ? stack1.length : stack1),{"name":"if","hash":{},"fn":container.program(2, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "            <div class=\"list-text-holder\">\r\n                <p class=\"list-title "
    + "\">\r\n                    <span class=\"circle-icon\"></span> "
    + alias3(alias4((depth0 != null ? depth0.title : depth0), depth0))
    + "\r\n                </p>\r\n                <p class=\"list-description "
    + "\">\r\n                    "
    + alias3(alias4((depth0 != null ? depth0.description : depth0), depth0))
    + "\r\n                </p>\r\n            </div>\r\n        </li>\r\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "\r\n            <div class=\"list-image\" style=\"background-image: url('"
    + container.escapeExpression(container.lambda((depth0 != null ? depth0.thumbnail : depth0), depth0))
    + "');\"></div>\r\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {

  return "<div id=\"date\">"
    + "</div>\r\n<div class=\"feed\">\r\n\r\n    <div class=\"loading-message-holder\">\r\n        <div class=\"loading-message\">We’re loading the feed for the first time. This will take just a couple of minutes.</div>\r\n    </div>\r\n\r\n    <ul class=\"feed-panels "
    + " "
    + "\">\r\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.items : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </ul>\r\n</div>\r\n";
},"useData":true,"useDepths":true});
