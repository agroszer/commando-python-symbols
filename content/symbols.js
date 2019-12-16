(function() {
    const log       = require("ko/logging").getLogger("commando-python-symbols")
    const commando  = require("commando/commando");
    const {Cc, Ci}  = require("chrome");
    const legacy    = require("ko/windows").getMain().ko;
    const stoppers  = new Array("def", "class");

    var local = {};

    //log.setLevel(require("ko/logging").LOG_DEBUG);

    var editor = function()
    {
        if ( ! ("editor" in local))
            local.editor = require('ko/editor');
        return local.editor;
    }

    this.onSearch = function(query, uuid, onComplete)
    {
        log.debug(uuid + " - Starting Scoped Search");

        var view = legacy.views.manager.currentView;
        var results = [];

        var alltext = view.scimoz.text;
        var lines = alltext.match(/^.*((\r\n|\n|\r)|$)/gm);

        for (var curLineIdx=0; curLineIdx<lines.length; curLineIdx++) {
          curLine = lines[curLineIdx].trim();
          for (var idx in stoppers) {
            var stopper = stoppers[idx];
            if (curLine.startsWith(stopper+' ')) {
              var fname = view.koDoc.displayPath;
              var id = fname + '#' + (curLineIdx+1);
              var name = curLine.substring(stopper.length);
              var parplace = name.indexOf('(');
              var colplace = name.indexOf(':');
              if (parplace > 0) {
                name = name.substring(1, parplace);
              } else if (colplace > 0) {
                name = name.substring(1, colplace);
              }

              if (query != "") {
                if (query.toLowerCase() == query) {
                    // all lowercase query, ignore case
                    if (name.toLowerCase().indexOf(query) == -1) continue;
                } else {
                    // match case
                    if (name.indexOf(query) == -1) continue;
                }
              }

              results.push({
                  id: id,
                  name: name,
                  description: curLine,
                  icon: "koicon://ko-svg/chrome/icomoon/skin/box.svg?size=14",
                  classList: 'small-icon',
                  scope: "scope-python-symbols",
                  allowMultiSelect: false,
                  data: {
                      line: curLineIdx+1
                  }
              });

              }
            }
        }

        log.debug(uuid + " " + results.length + " results");

        if (results.length)
            commando.renderResults(results, uuid);

        onComplete(uuid);
    }

    this.onSelectResult = function(selectedItems)
    {
        var item = selectedItems.slice(0)[0];
        var line = item.resultData.data.line;
        var e = editor();

        e.setCursor(e.getLineStartPos(line));

        commando.hide();
        legacy.commands.doCommandAsync('cmd_focusEditor');
    }

}).apply(module.exports);
