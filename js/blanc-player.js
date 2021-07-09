var blcplayer = (function () {
  // 비공개 변수
  var private = null;
  // 비공개 함수
  function privateFunc() {
    console.log("private!");
  }
  function addClass(el, className) {
    el.classList.add(className);
  }
  function removeClass(el, className) {
    el.classList.remove(className);
  }
  function hasClass(el, className) {
    return el.classList.contains(className);
  }
  function makeElement(option) {
    var element = document.createElement(option.tag);
    if (option.id) {
      element.id = option.id || "";
    }
    if (option.class) {
      element.classList.add(option.class);
    }
    if (option.click) element.addEventListener("click", option.click);
    return element;
  }
  function removeElement(type, string, index = 0) {
    switch (type) {
      case "id":
        if (isExistsElement("id", string))
          document.getElementById(string).remove();
        return;
      case "class":
        if (isExistsElement("class", string, index))
          document.getElementsByClassName(string)[index].remove();
        return;
      default:
        throw new Error("Not defined type");
    }
  }
  function isExistsElement(type, string, index = 0) {
    switch (type) {
      case "id":
        var element = document.getElementById(string);
        return typeof element != undefined && element != null;
      case "class":
        var element = document.getElementsByClassName(string)[index];
        return typeof element != undefined && element != null;
      default:
        throw new Error("Not defined type");
    }
  }
  function addHotkeyEvent() {
    window.onkeydown = function (e) {
      return !(e.keyCode == 32);
    };
    blcplayer.player.setAttribute("tabindex", 0);
    blcplayer.player.addEventListener("keydown", function (event) {
      var player = blcplayer.player;
      var video = blcplayer.video;
      var option = blcplayer.option.hotkey;
      switch (event.key) {
        case "ArrowLeft":
          if (!option.secSkip) return;
          video.currentTime = video.currentTime - option.secSkip;
          break;
        case "ArrowRight":
          if (!option.secSkip) return;
          video.currentTime = video.currentTime + option.secSkip;
          break;
        case " ":
          if (!option.playToggle) return;
          if (video.paused) video.play();
          else video.pause();
          break;
        case "m":
          if (!option.soundToggle) return;
          video.muted = !video.muted;
          break;
        case "w":
          if (!option.wideToggle) return;
          if (hasClass(player, "blc-wide-screen"))
            removeClass(player, "blc-wide-screen");
          else addClass(player, "blc-wide-screen");
          break;
        case "f":
          if (!option.fullToggle) return;
          if (hasClass(player, "blc-full-screen"))
            removeClass(player, "blc-full-screen");
          else addClass(player, "blc-full-screen");
          break;
        default:
          break;
      }
    });
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
      // hotkey : true
      hotkey: {
        secSkip: 5,
        playToggle: true,
        soundToggle: true,
        wideToggle: true,
        fullToggle: true,
      },
      // 기본 PIP 모드 : false
      pictureInPictureToggle: false,
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
    init: function (customOption = {}, func) {
      // option merge
      this.option = Object.assign(this.option, customOption);

      // blc-player 선언
      this.player = document.getElementById("blc-player");

      // Video tag 추가
      this.player.innerHTML = `<video id="blc-video"></video>`;
      this.video = document.getElementById("blc-video");

      // src 추가
      this.video.setAttribute("src", this.option.sources[0].src);

      // device class 추가
      this.player.classList.add(this.option.device);

      // hover 기능
      this.hover(this.option.hover);
      // controls 기능
      this.controlBar(this.option.controlBar);
      // hotkey
      addHotkeyEvent();
      // secSkip 기능
      this.hotkey.secSkip(this.option.hotkey.secSkip);
      // playToggle
      this.hotkey.playToggle(this.option.hotkey.playToggle);
      // soundToggle
      this.hotkey.soundToggle(this.option.hotkey.soundToggle);
      // wideToggle
      this.hotkey.wideToggle(this.option.hotkey.wideToggle);
      // fullToggle
      this.hotkey.fullToggle(this.option.hotkey.fullToggle);
      // // pip 기능
      // this.pip(this.option.pip);
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
      if (typeof func === "function") func();
    },
    hover: function (sec) {
      // 현재 설정값 return
      if (sec === undefined) return this.option.hover;

      // Parameter error
      if (typeof sec !== "number") throw new Error("Parameter is not number");

      // false 일 때 기능 제거
      if (!sec) {
        // option 값 변경
        this.option.hover = sec;
        // 이벤트 제거
        this.player.removeEventListener("mousemove", hover);
      } else {
        // option 값 변경
        this.option.hover = sec;
        // 이벤트 추가
        this.player.addEventListener("mousemove", hover);
      }

      // timeout object
      var outFunc = null;
      // mouseenter func
      function hover() {
        if(blcplayer.video.paused) return;
        // player class 추가
        addClass(this, "hover");
        // timeout clear
        clearTimeout(outFunc);
        // timeout set
        outFunc = setTimeout(function () {
          // player class 추가
          removeClass(blcplayer.player, "hover");
        }, blcplayer.option.hover * 1000);
      }

      blcplayer.video.onpause = function(){
        addClass(blcplayer.player,"hover");
        clearTimeout(outFunc);
      }
      blcplayer.video.onplay = function () {
        clearTimeout(outFunc);
        outFunc = setTimeout(function () {
          // player class 추가
          removeClass(blcplayer.player, "hover");
        }, blcplayer.option.hover * 1000);
      }

      return "hover : " + this.option.hover + "sec";
    },
    controlBar: function (bool) {
      // 현재 설정값 return
      if (bool === undefined) return this.option.controlBar;

      // Parameter error
      if (typeof bool !== "boolean")
        throw new Error("Parameter is not boolean");

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
        if (!isExistsElement("id", "blc-control-bar")) {
          var controlBar = makeElement({
            tag: "div",
            id: "blc-control-bar",
          });
          this.player.appendChild(controlBar);
        }
      }

      return "controlBar : " + this.option.controlBar;
    },
    hotkey: {
      toggle: function (bool) {
        // 현재 설정값 return
        if (bool === undefined) return blcplayer.option.hotkey;

        // Parameter error
        if (typeof bool !== "boolean")
          throw new Error("Parameter is not boolean");

        // option 값 변경
        if(!bool){
          blcplayer.option.hotkey.secSkip = 0;
          blcplayer.option.hotkey.playToggle = false;
          blcplayer.option.hotkey.soundToggle = false;
          blcplayer.option.hotkey.wideToggle = false;
          blcplayer.option.hotkey.fullToggle = false;
        }
        else {

          blcplayer.option.hotkey.secSkip = 5;
          blcplayer.option.hotkey.playToggle = true;
          blcplayer.option.hotkey.soundToggle = true;
          blcplayer.option.hotkey.wideToggle = true;
          blcplayer.option.hotkey.fullToggle = true;
        }

        return "hotkey - Toggle : " + bool;
      },
      secSkip: function (sec) {
        // 현재 설정값 return
        if (sec === undefined) return blcplayer.option.hotkey.secSkip;

        // Parameter error
        if (typeof sec !== "number") throw new Error("Parameter is not Number");

        // option 값 변경
        blcplayer.option.hotkey.secSkip = sec;

        return "hotkey - secSkip Value : " + blcplayer.option.hotkey.secSkip;
      },
      playToggle: function (bool) {
        // 현재 설정값 return
        if (bool === undefined) return blcplayer.option.hotkey.playToggle;

        // Parameter error
        if (typeof bool !== "boolean")
          throw new Error("Parameter is not boolean");

        // option 값 변경
        blcplayer.option.hotkey.playToggle = bool;

        return "hotkey - playToggle : " + blcplayer.option.hotkey.playToggle;
      },
      soundToggle: function (bool) {
        // 현재 설정값 return
        if (bool === undefined) return blcplayer.option.hotkey.soundToggle;

        // Parameter error
        if (typeof bool !== "boolean")
          throw new Error("Parameter is not boolean");

        // option 값 변경
        blcplayer.option.hotkey.soundToggle = bool;

        return "hotkey - soundToggle : " + blcplayer.option.hotkey.soundToggle;
      },
      wideToggle: function (bool) {
        // 현재 설정값 return
        if (bool === undefined) return blcplayer.option.hotkey.wideToggle;

        // Parameter error
        if (typeof bool !== "boolean")
          throw new Error("Parameter is not boolean");

        // option 값 변경
        blcplayer.option.hotkey.wideToggle = bool;

        return "hotkey - wideToggle : " + blcplayer.option.hotkey.wideToggle;
      },
      fullToggle: function (bool) {
        // 현재 설정값 return
        if (bool === undefined) return blcplayer.option.hotkey.fullToggle;

        // Parameter error
        if (typeof bool !== "boolean")
          throw new Error("Parameter is not boolean");

        // option 값 변경
        blcplayer.option.hotkey.fullToggle = bool;

        return "hotkey - fullToggle : " + blcplayer.option.hotkey.fullToggle;
      },
    },
  };
})();
