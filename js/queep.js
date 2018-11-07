// Generated by CoffeeScript 2.3.2
(function() {

  /*
  This function checks the EPR/OPR content for duplicate acronyms
  by duplicates we mean using both CDR and CMDR in the same text
  since these mean the same thing, you should be consistent
  */
  /*
  highlights all items in the array passed to it

  TODO: tie together elements from the same array
  */
  var acronym_and_word_check, add_tooltip_custom, add_tooltips, check_single_acronym, duplicate_acronym_check, highlight_dupes, highlight_typos, highlight_valid_acros, highlight_word_acro_pairs, queep, spell_check,
    indexOf = [].indexOf;

  check_single_acronym = function(text_array, acronym_list) {
    var acronym1, acronym2, i, j, len, len1, matches;
    matches = [];
    for (i = 0, len = acronym_list.length; i < len; i++) {
      acronym1 = acronym_list[i];
      for (j = 0, len1 = acronym_list.length; j < len1; j++) {
        acronym2 = acronym_list[j];
        if (indexOf.call(text_array, acronym1) >= 0 && indexOf.call(text_array, acronym2) >= 0 && acronym1 !== acronym2 && indexOf.call(matches, acronym1) < 0) {
          matches.push(acronym1);
          if (matches.length === acronym_list.length) {
            break;
          }
        }
      }
    }
    return matches;
  };

  duplicate_acronym_check = function(text_content) {
    var acronym_list, clean_text, duplicate_acronym_list, duplicate_acronym_list_raw, duplicate_acronyms, i, j, len, len1, new_elem, text_array;
    // get the actual text in the duplicate acronyms text box
    duplicate_acronym_list_raw = $('#duplicate_acronyms').val();
    // lowercase it, we don't care about case for dupes
    // duplicate_acronym_list_raw = duplicate_acronym_list_raw.toLowerCase()

    //get rid of spaces
    duplicate_acronym_list_raw = duplicate_acronym_list_raw.replace(/[ ]/g, "");
    
    // make our text an array split on newlines
    duplicate_acronym_list = duplicate_acronym_list_raw.split("\n");

// split each line on commas (only supports csv right now)
    for (i = 0, len = duplicate_acronym_list.length; i < len; i++) {
      acronym_list = duplicate_acronym_list[i];
      duplicate_acronym_list[duplicate_acronym_list.indexOf(acronym_list)] = acronym_list.split(",");
    }
    clean_text = text_content.replace(/[.,\/()\;:{}!?-]/g, " ");
    // clean_text = clean_text.toLowerCase()
    clean_text = clean_text.replace(/\s+/g, " ");
    text_array = clean_text.split(" ");
    duplicate_acronyms = [];
    for (j = 0, len1 = duplicate_acronym_list.length; j < len1; j++) {
      acronym_list = duplicate_acronym_list[j];
      new_elem = check_single_acronym(text_array, acronym_list);
      if (new_elem) {
        duplicate_acronyms.push(new_elem);
      }
    }
    return duplicate_acronyms;
  };

  highlight_dupes = function(duplicate_acronyms, text_content) {
    var acronym, acronym_list, i, j, len, len1;
    for (i = 0, len = duplicate_acronyms.length; i < len; i++) {
      acronym_list = duplicate_acronyms[i];
      for (j = 0, len1 = acronym_list.length; j < len1; j++) {
        acronym = acronym_list[j];
        text_content = text_content.replace(RegExp(`(?<=[^a-zA-Z]|^)${acronym}(?=([^a-zA-Z]|$))`, "gi"), '<span class="dupe">' + acronym + '</span>');
      }
    }
    return text_content;
  };

  highlight_typos = function(typos, text_content) {
    var i, len, typo;
    for (i = 0, len = typos.length; i < len; i++) {
      typo = typos[i];
      text_content = text_content.replace(RegExp(`(?<=[^a-zA-Z]|^)${typo}(?=([^a-zA-Z]|$))`, "gi"), '<span class="typo">' + typo + '</span>');
    }
    return text_content;
  };

  spell_check = function(text_content, dict_array) {
    var clean_text, i, len, ref, text_array, typos, word;
    clean_text = text_content.replace(/[.,\/()\;:{}!?-]/g, " ");
    clean_text = clean_text.replace(/\s+/g, " ");
    text_array = clean_text.split(" ");
    typos = [];
    for (i = 0, len = text_array.length; i < len; i++) {
      word = text_array[i];
      if ((ref = word.toLowerCase(), indexOf.call(dict_array, ref) < 0) && indexOf.call(typos, word) < 0) {
        typos.push(word);
      }
    }
    return typos;
  };

  acronym_and_word_check = function(text_content, word_acro_array) {};

  // text_array = text_content.split(" ")
  // acronym_words = []

  // lower_case_tokens = []

  // `text_array.forEach(function(ele){
  // lower_case_tokens.push(ele.toLowerCase());
  // })`

  // for word in text_array
  // 	word = word.toLowerCase();

  // 	#If the word is an ancronym
  // 	if word_acro_array[word] 
  // 		#See if any of the spelled out versions exists in the input
  // 		for alt_word in word_acro_array[word]
  // 			if alt_word in lower_case_tokens and [word, word_acro_array[word]] not in acronym_words
  // 				acronym_words.push([word,alt_word])

  // return acronym_words

  // This has been changed to a pure regex version,
  // this function will detect multi-words (e.g. Air Force)

  highlight_word_acro_pairs = function(text_content, word_acro_array) {
    var acro_flag, acronym, i, j, len, len1, ref, ref1, regex_acro, regex_spelled, spelled_word, tooltipped_words;
    tooltipped_words = [];
    ref = Object.keys(word_acro_array);
    for (i = 0, len = ref.length; i < len; i++) {
      acronym = ref[i];
      regex_acro = RegExp(`(\\b${acronym}(?![a-zA-Z<"=]))`, "gim");
      if (regex_acro.test(text_content)) {
        acro_flag = true;
        ref1 = word_acro_array[acronym];
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          spelled_word = ref1[j];
          regex_spelled = RegExp(`(\\b${spelled_word}(?![a-zA-Z<"=]))`, "gim");
          if (regex_spelled.test(text_content)) {
            acro_flag = false;
            text_content = text_content.replace(regex_acro, '<span id="' + acronym + spelled_word + '" class="acro_pair">$&</span>');
            text_content = text_content.replace(regex_spelled, '<span id="' + spelled_word + acronym + '" class="acro_pair">$&</span>');
            tooltipped_words.push([acronym, spelled_word]);
          }
        }
        if (acro_flag) {
          text_content = text_content.replace(regex_acro, '<span id="' + acronym + '" class="acro_green">$&</span>');
        }
      }
    }
    console.log(tooltipped_words);
    return {
      "html": text_content,
      "tooltipped_words": tooltipped_words
    };
  };

  add_tooltip_custom = function(selector, msg) {
    tippy(selector, {
      content: msg,
      flip: false
    });
  };

  add_tooltips = function(acronym_words) {
    var i, len, pair;
    for (i = 0, len = acronym_words.length; i < len; i++) {
      pair = acronym_words[i];
      add_tooltip_custom('#' + pair[0] + pair[1], "Change to: " + pair[1]);
      add_tooltip_custom('#' + pair[1] + pair[0], "Change to: " + pair[0]);
    }
  };

  highlight_valid_acros = function(text_content, word_acro_array) {
    var acro, acronym_array, i, len, lower_word, regex, text_array;
    acronym_array = Object.keys(word_acro_array);
    text_array = text_content.split(" ");
    for (i = 0, len = acronym_array.length; i < len; i++) {
      acro = acronym_array[i];
      lower_word = acro.toLowerCase();
      regex = RegExp(`(\\b${acro})(?=([\\n \\!\\-/\\;]|$))`, "gim");
      text_content = text_content.replace(regex, '<span id="' + acro + '" class="acro_green">$&</span>');
    }
    return text_content;
  };

  queep = function() {
    var result, text_content;
    text_content = $('#output').html();
    result = highlight_word_acro_pairs(text_content, word_acro_data);
    return result; // returning: {'html': text_content, 'tooltipped_words':[]}
  };

  $(function() {
    return $("#input").on("input propertychange paste", function() {
      var result;
      //Adds the text you type in, to the output. 
      $('#output').text($('#input').val());
      result = queep();
      $('#output').html(result['html']);
      add_tooltips(result['tooltipped_words']);
      add_tooltip_custom(".acro_green", "Approved abbreviation");
    });
  });

}).call(this);
