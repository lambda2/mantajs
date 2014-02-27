
/**
 * Définition de l'objet CleverCodeParser
 */
(function()
{
    /**
     * Constructeur
     * @param {jquery object} data the dom element to parse
     */
    function	CleverCodeParser(data, target)
    {
        this.source = data;
        this.dest = target;
        this.lang = "php";

        if (typeof(this.source) == "object")
        {
            this.lang = $(this.source).attr("data-language") || "php";
        }

        if (_.has(CleverCode.definitions, this.lang))
        {
            console.log("Definitions found for [" + this.lang + "]");
            this.definition = CleverCode.definitions[this.lang];

            if (typeof(this.source) == "object")
            {
                this.source = $(this.source).text();
            }

            var text = this.source.replace(/^[\s|\t|\n]$/gm, "").replace(/^[ ]*\n/m, "");
            window.text = text; //debug;
            var re = new RegExp(this.definition.commentBlock);
            window.rere = re;
            var code = this.cleanArray(text.split(re));
            var me = this;
            console.log(code);

            _.each(code, function(value, key, list)
            {
                // On enleve les lignes vides
                var comments = me.cleanArray(re.exec(text));
                console.log("comments", comments, re.lastIndex);

                // On enleve les asterisques
                var cleanedComment = me.cleanComment(comments.join(""));

                // Et on passe le tout en markdown
                cleanedComment = me.cleanString(marked(cleanedComment));

                value = value.replace(/^\n$/gm, "");
                var lastIndex = me.getInnerBracesEnd(value);

                console.log("aftertext", lastIndex);
                var afterText = undefined;

                if (lastIndex != -1)
                {
                    afterText = value.substr(lastIndex + 1);
                    value = value.substring(value.search(/[^\S]/), lastIndex);
                }

                if (value.match(/^[\s]*$/) == null)
                {
                    var element = $(me.getRowTemplate(
                                        {
                                            comment: cleanedComment,
                                            source: value,
                                            lang: me.lang
                                        }));
                }
                else
                {
                    var element = $(me.getSingleRowTemplate(
                                        {
                                            comment: cleanedComment
                                        }));
                }

                $(me.dest).append(element);
                var codeElement = $(element).find(".row-source")[0];

                Prism.highlightElement(codeElement);

                if (afterText !== undefined && afterText.match(/\S/))
                {
                    console.log("aftertext => ", "["+afterText+"]");
                    var element = $(me.getSingleCodeTemplate(
                                        {
                                            source: afterText,
                                            lang: me.lang
                                        }));

                    $(me.dest).append(element);
                    var codeElement = $(element).find(".row-source")[0];

                    Prism.highlightElement(codeElement);
                }

            });
        }
        else
        {
            console.log("No definitions found for [" + this.lang + "]");
        }
    };

    CleverCodeParser.prototype.cleanString = function(str) {
        var reg = new RegExp();
        console.log(CleverCode.annotations);

        _.each(CleverCode.annotations, function(val)
        {
            var annotTemplate = "<p class='annotation'>\
                                <span class='annotation-key'>\
                                    <span class=\"<%= icon %>\"></span> \
                                    <%= key %>\
                                </span> - \
                                <span class='annotation-value'><%= value %></span>\
                            </p>";

            reg.compile("(" + val.name + ") (.*(?!@|/\n))");
            reg.global = true;
            var matcher;
            while(matcher = str.match(reg))
            {
                if (matcher != null)
                {
                    str = str.replace(reg, _.template(annotTemplate)({
                                                                         icon: val.icon,
                                                                         key: val.name,
                                                                         value: matcher[2]
                                                                     }));
                }
            }
        });
        return (str.replace(/[=|-|~]{5,}/, ""));
    };

    CleverCodeParser.prototype.getInnerBracesEnd = function(text)
    {
        console.log("searching into ", text);
        var open = this.definition.blockDelimiter.start;
        var close = this.definition.blockDelimiter.end;
        var firstBr = text.search(open);
        console.log("firstBr: ", firstBr, open, close);
        var max = text.length;

        if (firstBr >= 0)
        {
            var	br_counter = 1;
            while (br_counter > 0 && ++firstBr < max)
            {
                if (text.charAt(firstBr) == open)
                {
                    br_counter++;
                }
                else if (text.charAt(firstBr) == close)
                {
                    br_counter--;
                }
            }
        }
        return (firstBr >= max ? -1 : ++firstBr);
    };


    CleverCodeParser.prototype.cleanArray = function(arr) {
        var cleanRegex = /\S|\n/;
        var cleaned = _.reject(arr, function(e){
            return (e == undefined || e.match(cleanRegex) == null);
        });
        return (cleaned);
    };

    CleverCodeParser.prototype.cleanComment = function(comment) {
        var withoutAst = comment.replace(this.definition.commentBlockDelimiters, "");
        withoutAst = withoutAst.replace(/^[\s]*/gm, "");
        return (withoutAst);
    };

    CleverCodeParser.prototype.getSingleCodeTemplate = function(data) {
        var template = "<div class='row'>\
                            <div class='row-source language-<%= lang %>'><%= source %></div>\
                        </div>";
        return (_.template(template)(data));
    };

    CleverCodeParser.prototype.getSingleRowTemplate = function(data) {
        var template = "<div class='row'>\
                            <div class='row-comment'><%= comment %></div>\
                        </div>";
        return (_.template(template)(data));
    };

    CleverCodeParser.prototype.getRowTemplate = function(data) {
        var template = "<div class='row'>\
                            <div class='row-comment'><%= comment %></div>\
                            <div class='row-source language-<%= lang %>'><%= source %></div>\
                        </div>";
        return (_.template(template)(data));
    };

    window.CleverCodeParser = CleverCodeParser;

})();

