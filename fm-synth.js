/*
// Webaudio API stuff
var audioCtx = new (window.AudioContext || window.webkitAudioContext);

var volume = audioCtx.createGain();
volume.connect(audioCtx.destination);
volume.gain.value=0.0;

var sinea = audioCtx.createOscillator();
sinea.frequency.value = 440;
sinea.type = "sine";
sinea.start();
sinea.connect(volume);

volume.gain.value=0.2;
sinea.frequency.value = Math.round(Math.pow(2,(note.midiNr-69)/12)*440,0)
*/


let noteData, keyCode;

var someKeyIsPressed = false;

//MIDI note to Frequency (Hz) conversion
// Arrow Function example
const mtof = (midiNrIn) => { return Math.round(Math.pow(2,(midiNrIn-69)/12)*440,0)};

//default octave
var octave = 4;
var volume = 0.5;

//synth definition
var masterGain = new Tone.Gain().toMaster();
var pingPong = new Tone.PingPongDelay("16n", 0.6).connect(masterGain);
var chorus = new Tone.Chorus(5, 2.5, 0.5).connect(pingPong);
var synth = new Tone.FMSynth().connect(chorus); // creates single Tone.js synth


const addKeyToNoteData = function(midiNr, name, keyCode, elementId, clickListener) {
  var domElement = document.getElementById(elementId); //Gets elementId from HTML
  
  noteData[midiNr] = {midiNr: midiNr, name: name, element: domElement, code: keyCode};
  
  domElement.addEventListener("mousedown", clickListener);
}

const getKey = function(parameter, value) { //?
  for (midiNr in noteData) { // checks if midiNr exists in noteData
    if (parameter in noteData[midiNr] && noteData[midiNr][parameter] === value) {
      return noteData[midiNr]; //returns entire noteData?
    }
  }
  return null;
}

const playAndPrintNote = function(note) {
  var currentNote = note.midiNr + ((octave+1)*12);
  //print note
  document.getElementById("synthElementNote").innerHTML // writes Note Name to HTML
    = note.name + Math.trunc((octave+(note.midiNr/12))); 
  document.getElementById("synthElementFreq").innerHTML // writes Note Freq to HTML
    = mtof(currentNote) + " Hz" ; 
  synth.triggerAttack(mtof(currentNote)); // plays Tone.js synth
}

const keyClick = function(event) { //
  const note = getKey("element", event.target); // note = gets element ID at current clicked key
  if (note !== null) {
    playAndPrintNote(note); // prints info to HTML and plays single tone.js synth
  } 
}

document.addEventListener('keydown', function(event){ // keyboard down event
  if (event.key == '['){
    if (octave > 0){
      octave -= 1;
      document.getElementById("synthElementOctave").innerHTML = octave;   
    }  
  }
  if (event.key == ']'){
    if (octave < 7){
      octave += 1;
      document.getElementById("synthElementOctave").innerHTML = octave;   
    }  
  }
  note = getKey("code", event.key); //gets notename based on letter of computer keyboard
  if (note !== null) {
    playAndPrintNote(note);
    note.element.style['borderColor'] = 'red'
  }
  someKeyIsPressed = true;
});

document.addEventListener('keyup', function(event){
  note = getKey("code", event.key);
  if (note !== null) {
    note.element.style['borderColor'] = 'black';
    synth.triggerRelease();
  };
  someKeyIsPressed = false;
});

document.addEventListener('mouseup', function(event){
  if (someKeyIsPressed == false){  
  synth.triggerRelease();
  }
});

function onLoadDocument(e, i) {

  // getting all key dom elements
  keyElements = document.getElementById('keyCont').children; 

  noteData = {};

  addKeyToNoteData(0, "C", "a", "midi-60", keyClick);
  addKeyToNoteData(1, "C#", "w", "midi-61", keyClick);
  addKeyToNoteData(2, "D", "s", "midi-62", keyClick);
  addKeyToNoteData(3, "D#", "e", "midi-63", keyClick);
  addKeyToNoteData(4, "E", "d", "midi-64", keyClick);
  addKeyToNoteData(5, "F", "f", "midi-65", keyClick);
  addKeyToNoteData(6, "F#", "t", "midi-66", keyClick);
  addKeyToNoteData(7, "G", "g", "midi-67", keyClick);
  addKeyToNoteData(8, "G#", "y", "midi-68", keyClick);
  addKeyToNoteData(9, "A", "h", "midi-69", keyClick);
  addKeyToNoteData(10, "A#", "u", "midi-70", keyClick);
  addKeyToNoteData(11, "B", "j", "midi-71", keyClick);
  addKeyToNoteData(12, "C", "k", "midi-72", keyClick);
}

window.onload = function() { onLoadDocument() };

document.getElementById("synthElementOctave").innerHTML = octave;   

function modSliderFunction(val) {
  document.getElementById("synthElementModIndexValue").innerHTML =  val.toFixed(1); 
  document.getElementById("modSlider").value = val; 
  synth.modulationIndex.value = val; 
};

function harmSliderFunction(val) {
  document.getElementById("synthElementHarmonicityValue").innerHTML = val.toFixed(1); 
  document.getElementById("harmSlider").value = val; 
  synth.harmonicity.value = val;
};

function pingPongSliderFunction(val) {
  document.getElementById("synthElementPingPongValue").innerHTML = val; 
  pingPong.wet.value = val; 
};

function chorusSliderFunction(val) {
  document.getElementById("synthElementChorusValue").innerHTML = val; 
  chorus.frequency.value = val;
};

function volumeSliderFunction(val) {
  document.getElementById("synthElementVolumeValue").innerHTML = val; 
  masterGain.gain.value = val;
};

var mouseCoordToSynthParams = function(e) {
  var relativeX = 0;
  var relativeY = 0;
  var scaledX = 0;
  var scaledY = 0;
  
  docElem = document.getElementById('synthContainer');
  relativeX = e.clientX;
  relativeY = docElem.clientHeight - e.clientY;
  
  scaledX = relativeX/docElem.clientWidth;
  scaledY = relativeY/docElem.clientHeight;
  
  modSliderFunction(scaledX * 40 + 1);
  harmSliderFunction(scaledY * 3.5 + 0.5);
}

document.body.addEventListener("mousemove", function(e) {
  mouseCoordToSynthParams(e);
});
