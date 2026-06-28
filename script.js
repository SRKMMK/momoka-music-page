const imageCount = 28;
const gallery = document.querySelector("#gallery");
const audio = document.querySelector("#audio");
const trackTitle = document.querySelector("#trackTitle");
const trackArtist = document.querySelector("#trackArtist");
const trackSelect = document.querySelector("#trackSelect");
const prevButton = document.querySelector("#prevButton");
const playButton = document.querySelector("#playButton");
const nextButton = document.querySelector("#nextButton");
const progress = document.querySelector("#progress");
const duration = document.querySelector("#duration");
const currentTime = document.querySelector(".time-current");
const autoplayNotice = document.querySelector("#autoplayNotice");

const tracks = [
  {
    title: "ラヴィアンローズ",
    artist: "照井春佳",
    src: "./assets/audio/ravian-rose.mp3",
  },
  {
    title: "愛の讃歌",
    artist: "照井春佳",
    src: "./assets/audio/track-02-ai-no-sanka.mp3",
  },
  {
    title: "無重力シャトル",
    artist: "照井春佳",
    src: "./assets/audio/track-03-mujuuryoku-shuttle.mp3",
  },
  {
    title: "Shine In The Sky☆ 櫻井桃華 ソロ・リミックス",
    artist: "櫻井桃華",
    src: "./assets/audio/track-04-shine-in-the-sky.mp3",
  },
  {
    title: "明日また会えるよね 櫻井桃華ソロ・リミックス",
    artist: "櫻井桃華",
    src: "./assets/audio/track-05-ashita-mata-aeru-yone.mp3",
  },
  {
    title: "キラッ! 満開スマイル! 櫻井桃華ソロ・リミックス",
    artist: "照井春佳",
    src: "./assets/audio/track-06-kira-mankai-smile.mp3",
  },
  {
    title: "お願い！シンデレラ 櫻井桃華ソロ・リミックス",
    artist: "櫻井桃華",
    src: "./assets/audio/track-07-onegai-cinderella.mp3",
  },
  {
    title: "きゅん・きゅん・まっくす",
    artist: "櫻井桃華",
    src: "./assets/audio/track-08-kyun-kyun-max.mp3",
  },
  {
    title: "ハイファイ☆デイズ 櫻井桃華ソロ・リミックス",
    artist: "櫻井桃華",
    src: "./assets/audio/track-09-hi-fi-days.mp3",
  },
  {
    title: "THE VILLAIN'S NIGHT 櫻井桃華ソロ・リミックス",
    artist: "櫻井桃華",
    src: "./assets/audio/track-10-villains-night.mp3",
  },
  {
    title: "White again 櫻井桃華ソロ・リミックス",
    artist: "櫻井桃華",
    src: "./assets/audio/track-11-white-again.mp3",
  },
];

let currentTrackIndex = 0;
let autoplayBlocked = false;

for (let index = 1; index <= imageCount; index += 1) {
  const number = String(index).padStart(3, "0");
  const image = document.createElement("img");
  image.src = `./assets/images/${number}.png`;
  image.alt = `图片 ${index}`;
  image.width = 1150;
  image.height = 740;
  image.decoding = "async";
  image.loading = index === 1 ? "eager" : "lazy";
  gallery.append(image);
}

tracks.forEach((track, index) => {
  const option = document.createElement("option");
  option.value = String(index);
  option.textContent = `${index + 1}. ${track.title}`;
  trackSelect.append(option);
});

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remaining}`;
}

function syncButton() {
  playButton.textContent = audio.paused ? "播放" : "暂停";
  playButton.setAttribute("aria-label", audio.paused ? "播放" : "暂停");
}

async function playAudio() {
  try {
    await audio.play();
    autoplayBlocked = false;
    autoplayNotice.hidden = true;
  } catch {
    autoplayBlocked = true;
    autoplayNotice.hidden = false;
    syncButton();
  }
}

function loadTrack(index, shouldPlay = false) {
  currentTrackIndex = (index + tracks.length) % tracks.length;
  const track = tracks[currentTrackIndex];
  trackTitle.textContent = track.title;
  trackArtist.textContent = track.artist;
  trackSelect.value = String(currentTrackIndex);
  currentTime.textContent = "0:00";
  duration.textContent = "0:00";
  progress.value = "0";
  audio.src = track.src;
  audio.load();

  if (shouldPlay) {
    playAudio();
  }
}

playButton.addEventListener("click", async () => {
  if (audio.paused) {
    await playAudio();
  } else {
    audio.pause();
  }
  syncButton();
});

prevButton.addEventListener("click", () => {
  loadTrack(currentTrackIndex - 1, !audio.paused);
});

nextButton.addEventListener("click", () => {
  loadTrack(currentTrackIndex + 1, !audio.paused);
});

trackSelect.addEventListener("change", () => {
  loadTrack(Number(trackSelect.value), !audio.paused);
});

audio.addEventListener("loadedmetadata", () => {
  duration.textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", () => {
  currentTime.textContent = formatTime(audio.currentTime);
  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    progress.value = Math.round((audio.currentTime / audio.duration) * 1000);
  }
});

audio.addEventListener("play", syncButton);
audio.addEventListener("pause", syncButton);
audio.addEventListener("ended", () => {
  loadTrack(currentTrackIndex + 1, true);
});

progress.addEventListener("input", () => {
  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    audio.currentTime = (Number(progress.value) / 1000) * audio.duration;
  }
});

function retryAutoplayAfterGesture() {
  if (autoplayBlocked && audio.paused) {
    playAudio();
  }
}

document.addEventListener("pointerdown", retryAutoplayAfterGesture, { once: true });
document.addEventListener("keydown", retryAutoplayAfterGesture, { once: true });
document.addEventListener("WeixinJSBridgeReady", () => playAudio(), false);

loadTrack(0, true);
