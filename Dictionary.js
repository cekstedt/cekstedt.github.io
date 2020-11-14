// Helper functions.
function choose(arr) {
    return arr[Math.floor(arr.length * Math.random())];
}

function sum(arr) {
    return arr.reduce(function(a,b){return a+b}, 0);
}

function randint(begin, end) {
    return Math.floor(Math.random() * (end - begin)) + begin;
}

function split(str, sep) {
    var i = str.indexOf(sep);
    return [str.substring(0, i), str.substring(i + sep.length)];
}

function fix(str) {
    /*
        Fixes the following sentence issues:
         - Capitalization at the beginning of sentences.
             - TODO (even when quoted or multiples).
         - TODO: Fixes a/an disagreement.
    */

    // Capitalize first alphabetic character of the string.
    if (/^[A-Z]$/i.test(str.charAt(0))) {
        str = str.slice(0, 1).toUpperCase() + str.slice(1);
    } else {
        str = str.slice(0, 1) + str.slice(1, 2).toUpperCase() + str.slice(2);
    }

    return str;
}

class Dictionary {
    constructor(data) {
        this.dictionary = data[0];
        this.templates = data[1];
    }

    get_word(part_of_speech, form, syllables) {
        // Returns a random Word object that fits the given criteria.
        // if none exist, returns null.

        var partial = this.dictionary.filter(word => (! part_of_speech || word.part_of_speech === part_of_speech) &&
                                                     (! syllables      || word.syllables      === syllables) &&
                                                     (! form           || word.form           === form));
        if (partial.length > 0) {
            return choose(partial);
        } else {
            return null;
        }
    }

    parse_template(syllables) {
        while (true) {
            var temp = choose(this.templates);
            var ret = this.try_template(temp, syllables);
            if (ret) {
                return ret;
            }
        }
    }

    try_template(template, syllables) {
        // Will try to create a sentence with the given number of syllables.
        // If it fails, it returns null.
        
        var temp_str = template.template;
        syllables -= template.syllables;
        var syl_list = new Array(template.substitutions).fill(1);
        if (syl_list.length > 1) {
            while (sum(syl_list) < syllables) {
                syl_list[randint(0, syl_list.length)] += 1;
            }
        } else {
            syl_list[0] = syllables;
        }

        var syl_index = 0;
        var ret = [];

        while (temp_str.length > 0) {
            if (! temp_str.includes("<")) {
                ret.push(temp_str);
                break;
            } else {
                let prefix, pos;
                [prefix, temp_str] = split(temp_str, "<");
                [pos, temp_str]    = split(temp_str, ">");

                if (prefix.length > 0) {
                    ret.push(prefix);
                }

                let form;
                if (pos.includes(" ")) {
                    [pos, form] = pos.split(" ");
                } else {
                    form = "";
                }

                var word = this.get_word(pos, form, syl_list[syl_index]);
                syl_index += 1;
                if (! word) {
                    return null;
                }

                ret.push(word.phrase);
            }
        }

        var ret_val = ret.join("");
        return fix(ret_val);
    }
}

