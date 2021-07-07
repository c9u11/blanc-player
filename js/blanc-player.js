var blcplayer = (function () {
  // 비공개 변수
  var private = null;
  // 비공개 함수
  function privateFunc() {
    console.log("private!");
  }
  function addClass(el, className){
    el.classList.add(className);
  }
  function removeClass(el, className){
    el.classList.remove(className);
  }
  function makeElement(option) {
    var element = document.createElement(option.tag);
    if(option.id){
      element.id = option.id || "";
    }
    if(option.class){
      element.classList.add(option.class);
    }
    if (option.click) element.addEventListener("click", option.click);
    return element;
  }
  function removeElement(type, string, index = 0) {
    switch (type){
      case "id" :
        if(isExistsElement("id", string))
          document.getElementById(string).remove();
        return
      case "class" :
        if(isExistsElement("class",string,index))
        document.getElementsByClassName(string)[index].remove();
        return
      default :
        throw new Error("Not defined type");
    }
  }
  function isExistsElement(type, string, index = 0){
    switch (type){
      case "id" :
        var element = document.getElementById(string);
        return typeof element != undefined && element != null;
      case "class" :
        var element = document.getElementsByClassName(string)[index]
        return  typeof element != undefined && element != null;
      default :
        throw new Error("Not defined type");
    }
  }
  // 공개 Object
  return {
    // 공개 변수
    // video element
    video: null,
    // player element
    player: null,
    option: {
      // device
      device: "pc",
      // 자동 재생 여부: true
      autoplay: true,
      // controls 표시 여부 : true
      controls: true,
      // 해당 영상 반복 여부 : false
      loop: false,
      // 기본 썸네일 주소 : "../img/thumbnail.jpg"
      poster: "../img/thumbnail.jpg",
      // 영상 데이터 로드 기준 : "auto"
      preload: "auto",
      // 영상 음소거 여부 : false
      muted: false,
      // html player 강제 사용 여부 : true
      playsinline: true,
      // device 기본 컨트롤 강제 여부 : false
      nativeControlsForTouch: false,
      // 비디오 재생 불가 메세지 : "영상을 재생할 수 없습니다.관리자에게 문의 바랍니다."
      notSupportedMessage:
        "영상을 재생 할 수 없습니다. 관리자에게 문의 바랍니다.",
      // inacivityTimeout : 3000
      inactivityTimeout: 3000,
      // 영상 소스 : "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
      sources: [
        {
          src: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          type: "video/mp4",
        },
      ],
      // 다음 재생 목록
      nextSources: [
        {
          src: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          type: "video/mp4",
        },
      ],
      // 다음 페이지
      nextPage: {
        disable: true,
        url: window.location.href,
      },
      // hover : 3
      hover: 3,
      // controlBar : true
      controlBar: true,
      // 기본 PIP 모드 : false
      pictureInPictureToggle: false,
      // 중앙 플레이 버튼 : false
      bigPlayButton: false,
      // n초 넘어가기 버튼 : 0
      skipButton: 0,
      // pip mode : false
      pip: false,
      // 시네마 모드 : false
      wideButton: false,
      // dock : false
      dock: false,
      // Mouseout Event
      mouseoutEvent: false,
      // currentTimeDisplay : true
      currentTimeDisplay: true,
      // timeDividerDisplay : true
      timeDividerDisplay: true,
      // remainingTimeDisplay : false
      remainingTimeDisplay: false,
      // durationDisplay : true
      durationDisplay: true,
      // tollTip : false
      toolTip: false,
    },
    // 공개 함수
    init: function(customOption = {}, func) {
      // option merge
      this.option = Object.assign(this.option, customOption);

      // blc-player 선언
      this.player = document.getElementById('blc-player');

      // Video tag 추가
      this.player.innerHTML = `<video id="blc-video" controls></video>`;
      this.video = document.getElementById('blc-video');

      // src 추가
      this.video.setAttribute('src',this.option.sources[0].src);

      // device class 추가
      this.player.classList.add(this.option.device);

      // hover 기능
      this.hover(this.option.hover);
      // controls 기능
      this.controlBar(this.option.controlBar);
      // // skipButton 기능
      // this.skipButton(this.option.skipButton);
      // // pip 기능
      // this.pip(this.option.pip);
      // // wideButton 기능
      // this.wideButton(this.option.wideButton);
      // // dock 기능
      // this.dock(this.option.dock);
      // // mouseoutEvent 기능
      // this.mouseoutEvent(this.option.mouseoutEvent);
      // // currentTimeDisplay
      // this.currentTimeDisplay(this.option.currentTimeDisplay);
      // // timeDividerDisplay
      // this.timeDividerDisplay(this.option.timeDividerDisplay);
      // // remainingTimeDisplay
      // this.remainingTimeDisplay(this.option.remainingTimeDisplay);
      // // durationDisplay
      // this.durationDisplay(this.option.durationDisplay);
      // // toolTip
      // this.toolTip(this.option.toolTip);
      // func 실행
      if(typeof func === "function") func();
    },
    hover: function(sec){
      // 현재 설정값 return
      if(sec === undefined) return this.option.hover;

      // Parameter error
      if(typeof sec !== "number") throw new Error("Parameter is not number");

      // false 일 때 기능 제거
      if(!sec) {
        // option 값 변경
        this.option.hover = sec;
        // 이벤트 제거
        this.player.removeEventListener("mousemove",hover);
      }
      else {
        // option 값 변경
        this.option.hover = sec;
        // 이벤트 추가
        this.player.addEventListener("mousemove",hover);
      }

      // timeout object
      var outFunc = null;
      // mouseenter func
      function hover(){
        // player class 추가
        addClass(this, "hover");
        // timeout clear
        clearTimeout(outFunc)
        // timeout set
        outFunc = setTimeout(function(){
          // player class 추가
          removeClass(blcplayer.player,"hover");
        },blcplayer.option.hover * 1000);
      };

      return "hover : " + this.option.hover + "sec";
    },
    controlBar: function(bool){
      // 현재 설정값 return
      if (bool === undefined) return this.option.controlBar;
  
      // Parameter error
      if (typeof bool !== "boolean") throw new Error("Parameter is not boolean");
    
      // false 일 때 기능 제거
      if (!bool) {
        // option 값 변경
        this.option.controlBar = bool;
        // player class 제거
        removeClass(this.player, "blc-control-bar");
        // element 제거
        removeElement("id", "blc-control-bar");
      } else {
        // option 값 변경
        this.option.controlBar = bool;
        // player class 추가
        addClass(this.player, "blc-control-bar");
        /* Big Play 버튼 */
        if(!isExistsElement("id", "blc-control-bar")){
          var controlBar = makeElement({
            tag: "div",
            id: "blc-control-bar"
          });
          this.player.appendChild(controlBar);
        }
      }
  
      return "controlBar : " + this.option.controlBar;
    }
  };
})();
