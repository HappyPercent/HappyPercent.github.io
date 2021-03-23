(async () => {
  if (window.location.origin !== "happypercent.github.io") {
    return;
  }
  let words;
  await fetch("./words.json")
    .then((res) => res.json())
    .then((res) => {
      words = res.words.map((word) => word.toUpperCase());
    });
  const speeds = {
    10: 400,
    9: 500,
    8: 750,
    7: 1000,
    6: 1250,
    5: 1500,
    4: 1750,
    3: 2000,
    2: 2500,
    1: 2750,
  };
  const alphabet = {
    А: { order: 1, format: "jpg" },
    Б: { order: 2, format: "jpg" },
    В: { order: 3, format: "jpg" },
    Г: { order: 4, format: "jpg" },
    Д: { order: 5, format: "mp4" },
    Ё: { order: 6, format: "mp4" },
    Е: { order: 7, format: "jpg" },
    Ж: { order: 8, format: "jpg" },
    З: { order: 9, format: "mp4" },
    И: { order: 10, format: "jpg" },
    Й: { order: 11, format: "mp4" },
    К: { order: 12, format: "mp4" },
    Л: { order: 13, format: "jpg" },
    М: { order: 14, format: "jpg" },
    Н: { order: 15, format: "jpg" },
    О: { order: 16, format: "jpg" },
    П: { order: 17, format: "jpg" },
    Р: { order: 18, format: "jpg" },
    С: { order: 19, format: "jpg" },
    Т: { order: 20, format: "jpg" },
    У: { order: 21, format: "jpg" },
    Ф: { order: 22, format: "jpg" },
    Х: { order: 23, format: "jpg" },
    Ц: { order: 24, format: "mp4" },
    Ч: { order: 25, format: "jpg" },
    Ш: { order: 26, format: "jpg" },
    Щ: { order: 27, format: "mp4" },
    Ь: { order: 28, format: "mp4" },
    Ы: { order: 29, format: "jpg" },
    Ъ: { order: 30, format: "mp4" },
    Э: { order: 31, format: "jpg" },
    Ю: { order: 32, format: "jpg" },
    Я: { order: 33, format: "jpg" },
  };
  const loadedImages = new Set();
  let currentWord = getNewWord();
  let nextWord = getNewWord();
  const answerInput = document.querySelector(".answer");
  const nextElem = document.querySelector(".icon__next");
  const repeatElem = document.querySelector(".icon__repeat");
  const speedInput = document.querySelector(".speed_input");
  const startElem = document.querySelector(".start");
  const imageContainer = document.querySelector(".body__left");
  const checkElem = document.querySelector(".check");
  let presenting = false;
  let started = false;
  const alphabetData = Object.values(alphabet);

  function onLoad(order) {
    loadedImages.add(order);
    if (loadedImages.size === 33) {
      startElem.classList.remove("unclickable");
    }
  }

  for (const data of alphabetData) {
    const elem = document.createElement(
      data.format === "mp4" ? "video" : "img"
    );
    elem.classList.add("picture", "hidden");
    elem.id = `${data.order}${data.format}`;
    elem.src = `img/letters/${data.order}.${data.format}`;
    if (data.format === "mp4") {
      elem.setAttribute("muted", "");
      elem.setAttribute("playsinline", "");
      // elem.setAttribute("controls", "");
      elem.preload = "auto";
      elem.currentTime = 0;
      elem.onloadeddata = () => {
        onLoad(data.order);
      };
      const source = document.createElement("source");
      source.src = `img/letters/${data.order}.${data.format}`;
      source.setAttribute("muted", "");
      source.setAttribute("playsinline", "");
      source.preload = "auto";
      source.type = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2';
      source.currentTime = 0;
      source.onloadeddata = () => {
        onLoad(data.order);
      };
      elem.appendChild(source);
    } else {
      elem.onload = () => {
        onLoad(data.order);
      };
    }
    imageContainer.appendChild(elem);
  }

  startElem.addEventListener("click", async () => {
    startElem.classList.add("hidden");
    nextElem.classList.remove("icon_disabled");
    repeatElem.classList.remove("icon_disabled");
    started = true;
    answerInput.focus();
    start();
  });

  answerInput.addEventListener("keypress", async (ev) => {
    if (ev.key === "Enter") {
      if (answerInput.value.toUpperCase().replace(/\s/g, "") === currentWord) {
        words = words.filter((word) => word !== currentWord);
        currentWord = nextWord;
        nextWord = getNewWord();
        answerInput.value = "";
        checkElem.classList.remove("hidden");
        await new Promise((res) => setTimeout(res, 1000));
        start();
      } else {
        answerInput.classList.add("answer_wrong");
        await new Promise((res) => setTimeout(res, 150));
        answerInput.classList.remove("answer_wrong");
      }
    }
  });

  repeatElem.addEventListener("click", () => {
    if (!presenting && started) {
      answerInput.focus();
      present();
    }
  });

  nextElem.addEventListener("click", () => {
    words = words.filter((word) => word !== currentWord);
    currentWord = nextWord;
    nextWord = getNewWord();
    answerInput.value = "";
    answerInput.focus();
    start();
  });

  function start() {
    checkElem.classList.add("hidden");
    if (words.length) {
      present();
    } else {
      document.querySelector(".sad_message").classList.remove("hidden");
    }
  }

  async function present() {
    presenting = true;
    const letters = currentWord.split("");
    console.log("currentWord: ", currentWord);
    let letterIndex = 0;
    while (letters.length > letterIndex) {
      if (letters.join("") !== currentWord) {
        break;
      }
      letterIndex++;
      await changeImage(
        alphabet[letters[letterIndex - 1]].order,
        alphabet[letters[letterIndex - 1]].format,
        alphabet[letters[letterIndex]]?.order,
        alphabet[letters[letterIndex]]?.format
      );
      await new Promise((res) => setTimeout(res, speeds[speedInput.value]));
    }
    if (letters.join("") === currentWord) {
      answerInput.classList.add("answer_ready");
      await new Promise((res) => setTimeout(res, 400));
      answerInput.classList.remove("answer_ready");
    }
    presenting = false;
  }

  async function changeImage(order, format, nextOrder, nextFormat) {
    const nextImage = document.querySelector(`[id="${order}${format}"]`);
    const afterNextImage =
      nextOrder && nextOrder !== order
        ? document.querySelector(`[id="${nextOrder}${nextFormat}"]`)
        : null;
    const currentImage = document.querySelector(`.picture:not(.hidden).top`);
    const currentOrder = currentImage ? Number.parseInt(currentImage.id) : null;
    if (currentOrder === order) {
      currentImage?.classList.add("hidden");
      currentImage?.classList.remove("top");
      await new Promise((res) => setTimeout(res, 50));
      if (format === "mp4") {
        const nextSource = document.querySelector(
          `[id="${order}${format}"] source`
        );
        nextSource.currentTime = 0;
        nextSource.playbackRate = Math.max(
          (nextImage.duration * 1000) / speeds[speedInput.value],
          1
        );
        nextImage.currentTime = 0;
        nextImage.playbackRate = Math.max(
          (nextImage.duration * 1000) / speeds[speedInput.value],
          1
        );
        await nextImage.play();
      }
      nextImage.classList.add("top");
      nextImage.classList.remove("hidden");
      afterNextImage?.classList.remove("top");
      afterNextImage?.classList.remove("hidden");
      if (currentImage) {
        currentImage.currentTime = 0;
      }
    } else {
      if (format === "mp4") {
        const nextSource = document.querySelector(
          `[id="${order}${format}"] source`
        );
        nextSource.currentTime = 0;
        nextSource.playbackRate = Math.max(
          (nextImage.duration * 1000) / speeds[speedInput.value],
          1
        );
        nextImage.currentTime = 0;
        nextImage.playbackRate = Math.max(
          (nextImage.duration * 1000) / speeds[speedInput.value],
          1
        );
        await nextImage.play();
      }
      currentImage?.classList.remove("top");
      currentImage?.classList.add("hidden");
      nextImage.classList.add("top");
      nextImage.classList.remove("hidden");
      afterNextImage?.classList.remove("top");
      afterNextImage?.classList.remove("hidden");
      if (currentImage) {
        currentImage.currentTime = 0;
      }
    }
  }

  function getNewWord() {
    return words[getRandomInt(0, words.length)].toUpperCase();
  }

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }
})();
