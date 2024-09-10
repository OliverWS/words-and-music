// Initializing function
//Step 1 - check for file param
//Step 2 - Load file (and print to console)
//Step 3 - Parse file contents

// Set global fade time for audio + image
var FADE_TIME = 1500;
window.appears = [];

function init(){
  var filename = $.getQuery("file"); //Returns false if there is no file param
  if(filename){
    $.get(filename, function(text){
      print("Text: " + text);
      parse(text,"#content");
    });
  }
  else {
    window.location.href = "about.html"
  }
}

// Parse the Markdown text and translate to HTML
//write a loop to go through each a tag
//for each tag, get the contents (e.g. using $(tag).html() )
//determine whether the tag is a video or audio
//if it's video, call video_parse(tag)
//if it's audio, call audio_parse(tag)

function parse(text,div){

  $(div).html(markdown.toHTML(text));
  var tags = $("a");
  tags.each(function(i,tag){
    var content = $(tag).html().toString();
    print(content);
    print(tag);
    if(content.indexOf("video") == 0){
      video_parse(tag);
    }

    else if(content.indexOf("audio") == 0){
      audio_parse(tag);
    }

    else {
      print("Error: file is not of correct type.");
    }
  });
  $("body").fadeIn();
}

// Parse video files
// step 1

function video_parse(tag){
  print("Got a video tag: " + tag);
  var videoLink = $(tag).attr("href");
  var opts = $(tag).html();
  print("Video link = " + videoLink);
  var videoEl = $("<video>").append($("<source>").attr("src",videoLink).attr("type","video/webm"));
  $(videoEl).addClass("video-js").addClass("vjs-default-skin");
  if(opts.indexOf("repeat") != -1) {
    $(videoEl).attr("loop",'');
  }

  var id = "vid"+Math.round(Math.random()*10000);
  $(videoEl).attr("id",id);
  $(videoEl).attr("height",800);
  $(videoEl).attr("width","100%");
  $(tag).after(videoEl);
  $(tag).remove();
  _V_(id, { "controls": false, "autoplay": false, "preload": "auto" },function(){

    console.log("Video loaded...");
    $("#"+id).find("video").on("canplay", function(){
    window.appears.push(  appear({
        init: function init(){
          console.log('appear is ready for video:'+id);
        },
        elements: function elements(){
          // work with all elements with the class "track"
          return $("#"+id);
        },
        appear: function appear(el){
          console.log("Video (" + id + ") appeared!");
          _V_(id).volume(0.0);
          $(el).find("video").fadeIn(FADE_TIME/2.0);
          $(el).find("video").animate({volume: 1.0}, FADE_TIME);
          _V_(id).play();
        },
        disappear: function disappear(el){
          console.log("Video (" + id + ") no longer visible");
          $(el).find("video").fadeOut(2.0);
          $(el).find("video").animate({volume: 0.0}, FADE_TIME, function(){
            _V_(id).pause();
          });
        },
        bounds: 200,
        reappear: true
      }));


    });
  });


}

// Parse audio files
// When audio 'appears' in relation to the text, fade into the audio and play
// When audio 'disappears' in relation to the text, fade out from the audio and pause

function audio_parse(tag){
  print("Got an audio tag: " + tag);
  var audioLink = $(tag).attr("href");
  var opts = $(tag).html();

  print("Audio link = " + audioLink);
  var audioEl = $("<audio>");
  $(audioEl).append($("<source>").attr("src", audioLink).attr("type", "audio/mpeg"));
  print("Audio EL = " + audioEl);
  if(opts.indexOf("repeat") != -1) {
    $(audioEl).attr("loop",'');
  }

  $(tag).after(audioEl);
  $(tag).remove();
  $(audioEl).on("canplay",function(){
    window.appears.push(appear({
      init: function init(){
        console.log('appear is ready');
      },
      elements: function elements(){
        // work with all elements with the class "track"
        return $(audioEl).parent();
      },
      appear: function appear(el){
        console.log('Audio is visible', el);
        $(audioEl)[0].volume = 0.0;
        $(audioEl)[0].play();
        $(audioEl).animate({volume: 1.0}, FADE_TIME);
      },
      disappear: function disappear(el){
        console.log('Audio no longer visible', el);
        $(audioEl).animate({volume: 0.0}, 1000, function(){
          $(audioEl)[0].pause();
        });
      },
      bounds: 200,
      reappear: true
    }));
  });
}


// Function that fades in and out images on scroll

/* function slowFade_Image (){

appear({
init: function init(){
console.log('image appear is ready');
},
elements: function elements(){
// work with all elements with the class "img"
return $('img')
},
appear: function appear(el){
console.log('visible', el);
$('img').hide().one("load",function(){
$(this).fadeIn(6000);
}).each(function(){
if(this.complete) $(this).trigger("load");
});
;
},
disappear: function disappear(el){
console.log('no longer visible', el);
$('img').hide().one("load",function(){
$(this).fadeOut(1000);
}).each(function(){
if(this.complete) $(this).trigger("load");
});
;
},
bounds: 200,
reappear: true
});
}*/
