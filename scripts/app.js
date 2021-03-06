/* global webkitSpeechRecognition:true $:true searchSpotify:true*/

// try to get SpeechRecognition
try {
  var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition || null;
}
catch(err) {
  console.error("Starting Web Speech API Error:", err.message);
  var SpeechRecognition = null;
}

// languages
var langs ={
  "Afrikaans": "af-ZA",
  "Bahasa Indonesia": "id-ID",
  "Bahasa Melayu": "ms-MY",
  "Català": "ca-ES",
  "Čeština": "cs-CZ",
  "Dansk": "da-DK",
  "Deutsch": "de-DE",
  "English (Australia)": "en-AU",
  "English (Canada)": "en-CA",
  "English (India)": "en-IN",
  "English (New Zealand)": "en-NZ",
  "English (South Africa)": "en-ZA",
  "English (United Kingdom)": "en-GB",
  "English (United States)": "en-US",
  "Español Argentina": "es-AR",
  "Español Bolivia": "es-BO",
  "Español Chile": "es-CL",
  "Español Colombia": "es-CO",
  "Español Costa Rica": "es-CR",
  "Español Ecuador": "es-EC",
  "Español El Salvador": "es-SV",
  "Español España": "es-ES",
  "Español Estados Unidos": "es-US",
  "Español Guatemala": "es-GT",
  "Español Honduras": "es-HN",
  "Español México": "es-MX",
  "Español Nicaragua": "es-NI",
  "Español Panamá": "es-PA",
  "Español Paraguay": "es-PY",
  "Español Perú": "es-PE",
  "Español Puerto Rico": "es-PR",
  "Español República Dominicana": "es-DO",
  "Español Uruguay": "es-UY",
  "Español Venezuela": "es-VE",
  "Euskara": "eu-ES",
  "Filipino": "fil-PH",
  "Français": "fr-FR",
  "Galego": "gl-ES",
  "Hrvatski": "hr_HR",
  "IsiZulu": "zu-ZA",
  "Íslenska": "is-IS",
  "Italiano (Italia)": "it-IT",
  "Italiano (Svizzera)": "it-CH",
  "Lietuvių": "lt-LT",
  "Magyar": "hu-HU",
  "Nederlands": "nl-NL",
  "Norsk bokmål": "nb-NO",
  "Polski": "pl-PL",
  "Português (Brasil)": "pt-BR",
  "Português (Portugal)": "pt-PT",
  "Română": "ro-RO",
  "Slovenščina": "sl-SI",
  "Slovenčina": "sk-SK",
  "Suomi": "fi-FI",
  "Svenska": "sv-SE",
  "Tiếng Việt": "vi-VN",
  "Türkçe": "tr-TR",
  "Ελληνικά": "el-GR",
  "български": "bg-BG",
  "Pусский": "ru-RU",
  "Српски": "sr-RS",
  "Українська": "uk-UA",
  "한국어": "ko-KR",
  "普通话 (中国大陆)": "cmn-Hans-CN",
  "普通话 (香港)": "cmn-Hans-HK",
  "中文 (台灣)": "cmn-Hant-TW",
  "粵語 (香港)":"yue-Hant-HK",
  "日本語": "ja-JP",
  "हिन्दी": "hi-IN",
  "ภาษาไทย": "th-TH"
};

/**
* Initialize the Speech Recognition functions
* @param {boolean} auto - Automatically start to listen after loading
*/
function startSpeechRecognier(auto){
  // state used to to start and stop the detection
  var state = {
    "listening": false
  };

  var recognizer = new SpeechRecognition();

  // set recognizer to be continuous
  if (recognizer.continuous) {
    recognizer.continuous = true;
  }
  recognizer.interimResults = true; // we want partial result
  recognizer.lang = 'en-US'; // set language
  recognizer.maxAlternatives = 5; // number of alternatives for the recognized text

  recognizer.onstart = function() {
    // listening started
    console.log("onstart");
    $.notify("Called 'onstart': started listening", "success");
    document.getElementById('icon').className += " green-text text-darken-2";
    document.getElementById('icon').className = document.getElementById('icon').className.replace( /(?:^|\s)red-text text-darken-4(?!\S)/g , '' );
  };

  recognizer.onend = function() {
    // listening ended
    console.log("onend");
    $.notify("Called 'onend': stopped listening", "warn");
    document.getElementById('icon').className += " red-text text-darken-4";
    document.getElementById('icon').className = document.getElementById('icon').className.replace( /(?:^|\s)green-text text-darken-2(?!\S)/g , '' );
    if(state.listening) {
      recognizer.start();
    }
  };

  recognizer.onerror = function(error) {
    // an error occurred
    console.log("onerror:", error);
    $.notify("Called 'onerror': an error occured", "error");
  };

  recognizer.onspeechstart = function() {
    // detected sound that looks like speech
    console.log('Speech has been detected');
    $.notify("Called 'onspeechstart': detected speech", "info");
  };

  recognizer.onspeechend = function() {
    // stopped detecting speech
    console.log('Speech has stopped being detected');
    $.notify("Called 'onspeechend': stopped detecting speech", "info");
  };


  recognizer.onresult = function(event) {
    // got results
    // the event holds the results
    if (typeof(event.results) === 'undefined') {
        //Something is wrong...
        recognizer.stop();
        return;
    }

    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if(event.results[i].isFinal) {
        // get all the final detected text into an array
        var finalText = [], list = [];
        for(var j = 0; j < event.results[i].length; ++j) {
          // how confidente (between 0 and 1) is the service that the translation correct
          var confidence = event.results[i][j].confidence.toFixed(4);
          var transcript = event.results[i][j].transcript;
          list.push({"confidence": confidence, "text":transcript});
          finalText.push("Confidence: " + confidence + " Result: " + transcript);
        }

        // send the final results to the page
        showResult(finalText.join(' ⬤ '));
        console.log("Final result:", finalText);
        document.getElementById('partials').innerHTML = "...";

        checkCommand(sortByConfidence(list));
      } else {
        // got partial result
        document.getElementById('partials').innerHTML = event.results[i][0].transcript;
        console.log("Partial:", event.results[i][0].transcript, event.results[i].length);
      }
    }
  };

  // play button
  var play = document.getElementById('button-play');

  play.onclick = function() {
    if(play.getAttribute('data-muted') === 'false') {
      try {
        state.listening = true;
        recognizer.start();
        play.setAttribute('data-muted', 'true');
        play.innerHTML = "Stop Listening";
      } catch(ex) {
        console.log('Recognition error: ' + ex.message);
      }
    } else {
      play.setAttribute('data-muted', 'false');
      state.listening = false;
      recognizer.stop();
      play.innerHTML = "Start Listening";
    }
  };

  // auto start listening
  if(auto) {
    play.click();
  }

  // add change listener to update language
  var select = document.getElementById("langs");
  $(select).change(function(){
    recognizer.lang = select.value;
  });
}

/**
* Add the results to the page.
* @param {string} result - The results to show.
*/
function showResult(result) {
  // show the result in the page
  var finals = document.getElementById('finals');
  finals.innerHTML += '<li class="collection-item">' + result + '</li>';
  // scroll to bottom after adding the text
  finals.scrollTop = finals.scrollHeight;
}

/**
* Load the languages into the select options.
*/
function loadLanguages() {
  // add the languages to the page
  var select = document.getElementById("langs");
  for (var lang in langs) {
    if (langs.hasOwnProperty(lang)) {
      var option = document.createElement("option");
      if(lang == "English (United States)") option.selected = true;
      option.text = lang;
      option.value = langs[lang];
      select.add(option);
    }
  }
}

/**
* Returns an list ordered by confidence values, descending order.
* @param {array} list - A list of objects containing the confidence and transcript values.
* @return array - Ordered list
*/
function sortByConfidence(list) {
  list.sort(function(a, b) {
    return a.confidence - b.confidence;
  }).reverse();
  // console.log("SORTED LIST:", list);
  var sortedResult = list.map(function(obj) {
    return obj.text;
  });
  return sortedResult;
}

/**
* Find the trigger word to call the command.
* @param {array} list - Ordered list of transcripts.
*/
function checkCommand(text) {
  // trigger words to detect as commands
  var triggerWords = ["play"];
  var command = triggerWords.find(function(word) {
    return text.join(', ').toLowerCase().indexOf(word.toLowerCase()) !== -1;
  });
  if(command && command == "play") {
    var query = text[0].replace(command, "");
    searchSpotify(query);
  }
}

// ----------------- INIT -------------------------

/**
* Call to initialize SpeechRecognition if supported.
*/
function init() {
  // initialize speechRecognition if supported
  if(SpeechRecognition === null){
    alert("Web Speech API is not supported.");
  } else {
    startSpeechRecognier(false);
  }
}

window.addEventListener('load', function() {
  $.notify.defaults( { globalPosition: 'bottom left' } )
  loadLanguages();
  init();
  $('select').material_select();
}, false);
