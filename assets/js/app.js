$ = document.querySelector.bind(document);
$$ = document.querySelectorAll.bind(document);
const play = $(".player");
const heading = $("header h2");
const cdThumb = $(".cd .thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const pro = $("#progress");
const next = $(".btn-next");
const prev = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");
// 1.Render song
const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  songs: [
    {
      name: "Cà Phê",
      singer: "MIN",
      path: "./assets/music/song-1.mp3",
      image: "./assets/img/song-1.jpg",
    },
    {
      name: "Chạy về khóc với anh",
      singer: "Erik",
      path: "./assets/music/song-2.mp3",
      image: "./assets/img/song-2.jpg",
    },
    {
      name: "Chờ đợi có đáng sợ",
      singer: "Andiez",
      path: "./assets/music/song-3.mp3",
      image: "./assets/img/song-3.jpg",
    },
    {
      name: "Chuyện rằng",
      singer: "Thịnh Suy",
      path: "./assets/music/song-4.mp3",
      image: "./assets/img/song-4.jpg",
    },
    {
      name: "Có hẹn với thanh xuân",
      singer: "Monstar",
      path: "./assets/music/song-5.mp3",
      image: "./assets/img/song-5.jpg",
    },
    {
      name: "Sau tất cả",
      singer: "Erik",
      path: "./assets/music/song-6.mp3",
      image: "./assets/img/song-6.jpg",
    },
    {
      name: "Phải chăng em đã yêu",
      singer: "Juky San",
      path: "./assets/music/song-7.mp3",
      image: "./assets/img/song-7.jpg",
    },
    {
      name: "Ngày đầu tiên",
      singer: "Đức Phúc",
      path: "./assets/music/song-8.mp3",
      image: "./assets/img/song-8.jpg",
    },
    {
      name: "Nàng thơ",
      singer: "Hoàng Dũng",
      path: "./assets/music/song-9.mp3",
      image: "./assets/img/song-9.jpg",
    },
    {
      name: "Gác lại âu lo",
      singer: "Miu Lê",
      path: "./assets/music/song-10.mp3",
      image: "./assets/img/song-10.jpg",
    },
  ],
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `<div class="song ${
        index === this.currentIndex ? "active" : ""
      }" data-index="${index}">
        <div class="thumb-song" style="background-image: url('${song.image}')">
        </div>
        <div class="body">
          <h3 class="title">${song.name}</h3>
          <p class="desc">${song.singer}</p>
        </div>
      </div>`;
    });
    $(".playlist").innerHTML = htmls.join("");
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  handleEvents: function () {
    const _this = this;
    const cd = $(".cd .thumb");

    // Xử lí CD quay / dừng
    const cdThumbAnimate = cdThumb.animate(
      [
        {
          transform: "rotate(360deg)",
        },
      ],
      {
        duration: 10000,
        iterations: Infinity,
      }
    );
    cdThumbAnimate.pause();
    const cdWidth = cd.offsetWidth;
    const cdHeigth = cd.offsetHeight;
    // Xử lí phóng to thu nhỏ CD
    document.onscroll = function () {
      const scrollTop = window.scrollY;
      const newWidth = cdWidth - scrollTop;
      const newHeight = cdHeigth - scrollTop;
      cd.style.width = newWidth > 0 ? newWidth + "px" : 0;
      cd.style.height = newHeight > 0 ? newHeight + "px" : 0;
      cd.style.opacity = newWidth / cdWidth;
    };

    // Xử lí khi click play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    // Khi song được play
    audio.onplay = function () {
      _this.isPlaying = true;
      play.classList.add("playing");
      cdThumbAnimate.play();
    };

    // Khi song bị pause
    audio.onpause = function () {
      _this.isPlaying = false;
      play.classList.remove("playing");
      cdThumbAnimate.pause();
    };

    // Khi tiến độ bài hát thay đổi
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const proPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        pro.value = proPercent;
      }
    };

    // Xử lí khi tua xong
    pro.onchange = function (e) {
      const seekTime = (e.target.value * audio.duration) / 100;
      audio.currentTime = seekTime;
    };

    // Xử lí next
    next.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }

      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    // Xử lí prev
    prev.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    // Xử lý random
    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      randomBtn.classList.toggle("active", _this.isRandom);
    };

    // Xử lý next song khi audio ended
    audio.onended = function () {
      if (!_this.isRepeat) {
        next.click();
      } else {
        audio.play();
      }
    };

    // Xử lý song khi bấm nút repeat
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      repeatBtn.classList.toggle("active", _this.isRepeat);
    };

    // Xử lí click song
    playlist.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");
      if (songNode) {
        _this.currentIndex = Number(songNode.dataset.index);
        _this.loadCurrentSong();
        _this.render();
        audio.play();
      }
    };
  },

  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  scrollToActiveSong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 300);
  },
  start: function () {
    // Dịnh nghĩa các thuộc tính cho object
    this.defineProperties();
    // Lắng nghe / xử lí sự kiện (DOM Event)
    this.handleEvents();
    // Tải thông tin bài hát đầu tiên vào UI
    this.loadCurrentSong();

    // Render playlist
    this.render();
  },
};

app.start();
