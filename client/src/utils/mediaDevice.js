export default class MediaDevice {
 constructor(){
     super();
     if(hasUserMedia()) {

     }else {
         alert("This browser doesn't support webRtc");
     }
 }
}

function hasUserMedia() {
    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia;
    return !!navigator.getUserMedia;
  }
