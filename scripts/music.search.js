/* global $:true*/

/**
* Search the inputed query on spotify and show the first result.
* @params {string} - query to search
*/
function searchSpotify(query) {
  var xhr = new XMLHttpRequest();
  var url = "https://api.spotify.com/v1/search?q="+encodeURIComponent(query)+"&type=track";
  xhr.open('GET', url);
  xhr.onload = function() {
      if (xhr.status === 200) {
        // console.log("response:", xhr.responseText);
        var jsonRes = JSON.parse(xhr.responseText);
        var queryRes = document.getElementById("queryRes");
        if (jsonRes.tracks.items) {
          var item = jsonRes.tracks.items[0];
          if(item) {
            var html = "";
            var name = item.name ?  item.name : "-----";
            html += "<p><strong>" + name + "</strong><p>";
            var url = item.external_urls.spotify ?  item.external_urls.spotify : "#";
            html += "<a href='"+url+"'>open in spotify</a><br />";
            if(item.preview_url)
              html += "<audio id='audio' src='"+item.preview_url+"' controls />";
            queryRes.innerHTML = html;
          } else {
            queryRes.innerHTML = "Can't find results.";
          }
        } else {
          queryRes.innerHTML = "Can't find results.";
        }
        // stop listening
        document.getElementById('button-play').click();
        // open modal
        $('.modal').openModal();
        $('.lean-overlay').click(function(){
          var sound = document.getElementById("audio");
          if(sound) {
            sound.pause();
          }
        })
      }
  };
  xhr.send();
}

window.addEventListener('load', function() {
  $('.modal-close').click(function(){
    var sound = document.getElementById("audio");
    if(sound) {
      sound.pause();
    }
  });
}, false);
