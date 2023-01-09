const copyBtnEle = document.getElementById('copy-btn');
copyBtnEle.style.display="none";


// What happen when is clicked ?
// Send url to the server (POST method)
// If the server is OK then we can recieve data from server
// that data is url and randomstring (from mongodb)
// Just make a url link and show it on web browser
function createShortUrl() {
  const url = document.getElementById('url').value;
  console.log(url.substring(0,4));

  // The XMLHttpRequest object can be used to exchange 
  // data with a web server behind the scenes. 
  // This means that it is possible to update 
  // parts of a web page, without reloading the whole page.
  const xhr = new XMLHttpRequest();  

  if(!url) {
    alert("Please fill the url.");
  }
  else if((url.substring(0,4) !== 'http') && (url.substring(0,4) !== 'www.')) {
    alert('URL is not valid');
  }
  else {
    copyBtnEle.style.display="block";

    // To send a request to a server, you can use the open() 
    // and send() methods of the XMLHttpRequest object:
    // open(method, url, async, user, psw)
    xhr.open('POST', '/l');
    
    // Adds a label/value pair to the header to be sent
    xhr.setRequestHeader('Content-Type', 'text/plain');

    // Defines a function to be called when the request is recieved (loaded)
    xhr.onload = function() {
      if (xhr.status === 200) {
        //  Recieve data(always be a string) from the server
        //  so we'll make data to a JavaScript object
        const data = JSON.parse(xhr.responseText);   
        console.log('The responseText is', typeof xhr.responseText, xhr.responseText);
        console.log('The data is', typeof data, data);

        const shortElement = document.getElementById('short');
        const shortUrl = window.location.origin + '/l/' + data.genShort;  // Create a new short url
        shortElement.innerHTML = '<a id="short-url" href="' + shortUrl + '">' + shortUrl + '</a>';
      }
    };

    // send(string) => Sends the request to the server. Used for POST requests
    xhr.send(url);
  }
}

function copyLink() {
  const hiddenInput = document.getElementById('secret-input');
  const shortEle = document.getElementById('short-url');
  const copyText = shortEle.innerText;

  hiddenInput.setAttribute('value', copyText);
  hiddenInput.select();
  navigator.clipboard.writeText(hiddenInput.value);
}