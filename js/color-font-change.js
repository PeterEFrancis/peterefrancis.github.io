
function pow(a,b) {
  return a ** b
}

function changeColor() {
  // Choose random color
  var red = Math.floor((Math.random() * 255));
  var green = Math.floor((Math.random() * 255));
  var blue = Math.floor((Math.random() * 255));
  // color string
  var color = 'rgb(' + red + ',' + green + ',' + blue + ')'
  // Set the background color
  document.getElementById('colorChanging').style.backgroundColor = color;
  // Set the text color
  var textColor = getContrastColor(red,green,blue);
  var elements = document.getElementsByClassName('textColorChanging');
  elements[0].style.color = textColor;
  elements[1].style.color = textColor;
}



function getContrastColor(red, green, blue){
  var L1 = 0.2126 * pow(red / 255, 2.2) + 0.7152 * pow(green / 255, 2.2) +  0.0722 * pow(blue / 255, 2.2);
  var contrastRatio = 0;
  if (L1 > 0) {
      contrastRatio = parseInt(String((L1 + 0.05) / (0.05)));
  } else {
      contrastRatio = parseInt(String((0.05) / (L1 + 0.05)));
  }
  // If contrast is more than 5, return black
  if (contrastRatio > 5) {
      return '#000000';
  } else {
      // if not, return white
      return '#FFFFFF';
  }
}

function changeFont() {
  // serif
  var serifOptions = ['Merriweather', 'Roboto Slab', 'Libre Caslon Text', 'Slabo 27px',
                 'Libre Caslon Display', 'PT Serif', 'Lora', 'Playfair Display',
                 'Noto Serif', 'Grenze', 'Crimson Text', 'Libre Baskerville',
                 'Bree Serif', 'Source Serif Pro', 'Arvo', 'Bitter', 'EB Garamond',
                 'Domine', 'Vollkorn', 'Crete Round'];
  var serifElements = document.getElementsByClassName("serif");
  var serifFont = serifOptions[Math.floor(Math.random() * (serifOptions.length))];
  for (var i = 0; i < serifElements.length; i++) {
    serifElements[i].style.fontFamily = serifFont;
  }

  // sans serif
  var sansSerifOptions = ['Blinker', 'Lato', 'Lexend Exa', 'Montserrat', 'Muli',
                          'Noto Sans', 'Nunito', 'Open Sans', 'Open Sans Condensed',
                          'Oswald', 'PT Sans', 'Poppins', 'Raleway',
                          'Red Hat Display', 'Red Hat Text', 'Roboto',
                          'Roboto Condensed', 'Source Sans Pro', 'Titillium Web', 'Ubuntu']
  var sansSerifElements = document.getElementsByClassName("sansSerif");
  var sansSerifFont = sansSerifOptions[Math.floor(Math.random() * (sansSerifOptions.length))];
  for (var i = 0; i < sansSerifElements.length; i++) {
    sansSerifElements[i].style.fontFamily = sansSerifFont;
  }

  // Display
  var displayOptions = ['Abril Fatface', 'Alfas Slab One', 'Baloo Bhaina', 'Bangers',
                        'Bowlby One SC', 'Bungee', 'Cabin Sketch', 'Emilys Candy',
                        'Faster One', 'Lobster', 'Monoton', 'Mountains of Christmas',
                        'Nixie One', 'Press Start 2P', 'Righteous', 'Rye',
                        'Saira Stencil One', 'Shojumaru', 'Special Elite', 'Titan One']
  document.getElementById('display').style.fontFamily = displayOptions[Math.floor(Math.random() * (displayOptions.length))];

}
