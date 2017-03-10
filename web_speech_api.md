# Web Speech API

The Web Speech API has two parts: `SpeechSynthesis` (Text-to-Speech - TTS) and `SpeechRecognition` (Speech-to-Text - STT).

Check [mozilla documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) to learn more.

## Code Explanation

The following section tries to explain the code used in [app.js](./scripts/app.js).

### - Constructor
#### SpeechRecognition()
```javascript
var recognizer = new SpeechRecognition();
```
Creating a new SpeechRecognition object instance.

### - Properties
#### SpeechRecognition.continuous
```javascript
recognizer.continuous = true;
```
Controls whether continuous results are returned for each recognition, or only a single result. Defaults to single (false)

#### SpeechRecognition.interimResults
```javascript
recognizer.interimResults = true; // we want partial result
```
Controls whether interim results should be returned (true) or not (false). Meaning we get results that are not the final result.

#### SpeechRecognition.lang
```javascript
recognizer.lang = 'en-US'; // set language
```
Returns and sets the language of the current SpeechRecognition. If not set it uses the HTML lang attribute value or the user agent language.

#### SpeechRecognition.maxAlternatives
```javascript
recognizer.maxAlternatives = 5; // number of alternatives for the recognized text
```
Sets the maximum number of alternatives provided per result.

### - Event handlers
#### SpeechRecognition.onstart
```javascript
recognizer.onstart = function() {
  // listening started
};
```
Fired when the speech recognition service starts listening to incoming audio to be recognized.

#### SpeechRecognition.onend
```javascript
recognizer.onend = function() {
  // listening ended
};
```
Fired when the speech recognition service has disconnected.

#### SpeechRecognition.onerror
```javascript
recognizer.onerror = function(error) {
  // an error occurred
};
```
Fired when a speech recognition error occurs.

#### SpeechRecognition.onspeechstart
```javascript
recognizer.onspeechstart = function() {
  // detected sound that looks like speech
}
```
Fired when sound that is recognised by the speech recognition service as speech has been detected.

#### SpeechRecognition.onspeechend
```javascript
recognizer.onspeechend = function() {
  // stopped detecting speech
}
```
Fired when speech recognised by the speech recognition service has stopped being detected.

#### SpeechRecognition.onresult
```javascript
recognizer.onresult = function(event) {
  // got results
  // the event holds the results
};
```
Fired when the speech recognition service returns a result.

##### Note:
If we want the best possible result we should get the confidence values (between 0 and 1) to know how much the service is sure that the speech matches the result.

### - Methods
#### SpeechRecognition.start()
```javascript
recognizer.start();
```
Starts the speech recognition service.

#### SpeechRecognition.stop()
```javascript
recognizer.stop();
```
Stops the speech recognition service.
