// script.js

const img = new Image(); // used to load image from <input> and draw to canvas
const generate = document.querySelector('button[type=submit]');
const reset = document.querySelector('button[type=reset]');
const button = document.querySelector('button[type=button]');
const canvas = document.getElementById("user-image");
const context = canvas.getContext('2d');

// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  // TODO

  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected

  context.clearRect(0,0,canvas.width,canvas.height);

  generate.disabled = false;
  reset.disabled = true;
  button.disabled = true;

  context.fillStyle = 'black';
  context.fillRect(0,0,canvas.width,canvas.height);

  let dimensions = getDimmensions(canvas.width, canvas.height, img.width, img.height);

  context.drawImage(img, dimensions['startX'], dimensions['startY'], dimensions['width'], dimensions['height']);

});

const fileUpload = document.getElementById('image-input');
fileUpload.addEventListener('change', (e) => {
  img.src = URL.createObjectURL(e.target.files[0]);
});

generate.addEventListener('click', ()=>{
  generate.disabled = true;
  reset.disabled = false;
  button.disabled = false;

  let topText = document.getElementById('text-top');
  let bottomText = document.getElementById('text-bottom');

  context.textAlign = 'center';
  context.fillStyle = 'white';
  context.font = '30px Arial';
  context.fillText(topText.value, canvas.width/2, 30);
  context.fillText(bottomText.value, canvas.width/2, canvas.height-10)
});

reset.addEventListener('click', ()=>{
  generate.disabled = false;
  reset.disabled = true;
  button.disabled = true;

  context.clearRect(0, 0, canvas.width, canvas.height);
});



function populateVoiceList() {
  if(typeof speechSynthesis === 'undefined') {
    return;
  }

  let selectVoices = document.getElementById('voice-selection');
  let voices = speechSynthesis.getVoices();

  selectVoices.innerHTML = '';
  selectVoices.disabled = false;

  for (let i = 0; i < voices.length; i++){
    let option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

    if(voices[i].default) {
      option.textContent += ' -- DEFAULT';
    }

    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    selectVoices.appendChild(option);
  }
}

populateVoiceList();
if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

button.addEventListener('click', () => {
  let selectVoices = document.getElementById('voice-selection');
  let voices = speechSynthesis.getVoices();

  let topText = document.getElementById('text-top').value;
  let bottomText = document.getElementById('text-bottom').value;

  var utterThis = new SpeechSynthesisUtterance(topText + ' ' + bottomText);
  let selectedOption = selectVoices.value;

  for(let i = 0; i < voices.length ; i++) {
    let temp = voices[i].name + ' (' + voices[i].lang + ')';
    if(voices[i].default){
      temp += ' -- DEFAULT';
    }
    if(temp === selectedOption) {
      utterThis.voice = voices[i];
    }
  }

  utterThis.volume = slider.value/100;
  speechSynthesis.speak(utterThis);
});

const slider = document.querySelector('input[type=range]');
slider.addEventListener('change', () => {
  console.log(slider.value);
  if(slider.value >= 67){
    document.getElementsByTagName('img')[0].src = './icons/volume-level-3.svg';
  }else if(slider.value < 67 && slider.value >= 34){
    document.getElementsByTagName('img')[0].src = './icons/volume-level-2.svg';
  }else if(slider.value < 34 && slider.value >= 1){
    document.getElementsByTagName('img')[0].src = './icons/volume-level-1.svg';
  }else{
    document.getElementsByTagName('img')[0].src = './icons/volume-level-0.svg';
  }

});

/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}

