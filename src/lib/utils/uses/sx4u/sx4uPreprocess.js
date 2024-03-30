export const sx4uPreprocess = {

    render: (args) => {
        // console.log(args);
        const {content} = args
        //  console.log(content);
        // split css by line
        // console.log(parseCSSText(content));
        let css_rows = content.split('\n');
        // filter out empty elements and strip ';'
        css_rows = css_rows.filter(function (x) {
            return x != ''
        }).map(function (x) {
            return x.trim().replace(';', '')
        });

        let json_name = css_rows[0].trim().replace(/[\.\{\ \#]/g, '');

        return {code: args.content};

        function parseCSSText(cssText) {
            var cssTxt = cssText.replace(/\/\*(.|\s)*?\*\//g, " ").replace(/\s+/g, " ");

            var style = {}, [, ruleName, rule] = cssTxt.match(/ ?(.*?) ?{([^}]*)}/) || [, , cssTxt];

            var cssToJs = s => s.replace(/\W+\w/g, match => match.slice(-1).toUpperCase());
            var properties = rule.split(";").map(o => o.split(":").map(x => x && x.trim()));
            for (var [property, value] of properties) style[cssToJs(property)] = value;
            return {cssText, ruleName, style};
        } /* updated 2017-09-28 */
    }
};