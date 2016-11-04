var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

let website = 'http://dev.markitondemand.com/MODApis/Api/v2/Lookup/json?input=';
let searchValue = 'CV';

function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
}
function printValue (value) {
  //print all symbols:
  // .Symbol .Name .Exchange
  value = JSON.parse(value);
  value.forEach((x) => {
    if (x.Exchange == 'NYSE' || x.Exchange == 'NASDAQ')
    console.log(x.Symbol);
  });
}

httpGetAsync(`${website}${searchValue}`,printValue);
