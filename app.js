(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Игра «Правда или нет»: любой ответ открывает вердикт
  var verdict = document.getElementById("verdict");
  var word = document.getElementById("verdict-word");
  var line = document.getElementById("verdict-line");
  var pills = document.querySelectorAll(".game-pill");
  var answers = {
    yes: ["Нет.", "Её не существует. Это кадр нейросети."],
    no: ["Верно.", "Это кадр нейросети. Дальше будет сложнее."]
  };
  pills.forEach(function (p) {
    p.addEventListener("click", function () {
      var a = answers[p.dataset.answer];
      word.textContent = a[0];
      line.textContent = a[1];
      pills.forEach(function (q) { q.setAttribute("aria-pressed", String(q === p)); });
      verdict.classList.add("is-open");
    });
  });
  verdict.addEventListener("click", function () {
    verdict.classList.remove("is-open");
    pills.forEach(function (q) { q.setAttribute("aria-pressed", "false"); });
  });

  // Видео играют без звука, только пока на экране
  var videos = document.querySelectorAll("video");
  if (reduce) {
    videos.forEach(function (v) { v.controls = true; });
  } else if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.play().catch(function () {}); }
        else { e.target.pause(); }
      });
    }, { threshold: 0.35 });
    videos.forEach(function (v) { io.observe(v); });
  }

  // Звук только у главного ролика
  var lead = document.getElementById("lead-video");
  var sound = document.getElementById("sound");
  sound.addEventListener("click", function () {
    lead.muted = !lead.muted;
    if (!lead.muted) { lead.play().catch(function () {}); }
    sound.setAttribute("aria-pressed", String(!lead.muted));
    sound.textContent = lead.muted ? "Включить звук" : "Выключить звук";
  });

  // Лента персонажа
  var strip = document.getElementById("strip");
  document.querySelectorAll(".strip-btn").forEach(function (b) {
    b.addEventListener("click", function () {
      strip.scrollBy({ left: Number(b.dataset.dir) * strip.clientWidth * 0.8, behavior: reduce ? "auto" : "smooth" });
    });
  });
})();
