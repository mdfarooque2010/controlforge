document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  // Scroll Reveal Observer
  var revealElements = document.querySelectorAll(".reveal-on-scroll");
  if (revealElements.length > 0 && typeof IntersectionObserver !== "undefined") {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: "0px 0px -20px 0px"
    });
    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback if IntersectionObserver not supported or disabled
    revealElements.forEach(function (el) {
      el.classList.add("revealed");
    });
  }

  // Interactive Gantt elements on landing page
  var gantt = document.querySelector(".gantt");
  if (gantt) {
    var rows = gantt.querySelectorAll(".gantt-row");
    var details = [
      { start: "Day 2", dur: "18d", float: "0d", res: "Planning Eng" },
      { start: "Day 16", dur: "30d", float: "2d", res: "PMO Auditor" },
      { start: "Day 40", dur: "24d", float: "0d", res: "Risk Specialist" },
      { start: "Day 58", dur: "36d", float: "12d", res: "Controls Lead" }
    ];
    rows.forEach(function (row, index) {
      var bar = row.querySelector(".gantt-bar");
      if (bar) {
        bar.style.cursor = "pointer";
        bar.style.transition = "transform 0.15s ease, filter 0.15s ease";
        
        bar.addEventListener("mouseenter", function () {
          bar.style.transform = "scaleY(1.2)";
          bar.style.filter = "brightness(1.1)";
          
          var data = details[index];
          var tooltip = document.createElement("div");
          tooltip.className = "gantt-tooltip";
          tooltip.innerHTML = "<strong>" + row.querySelector(".gantt-label").textContent + "</strong><br>" +
                              "Start: " + data.start + " | Dur: " + data.dur + "<br>" +
                              "Float: " + data.float + " | Owner: " + data.res;
          document.body.appendChild(tooltip);
          
          var rect = bar.getBoundingClientRect();
          tooltip.style.position = "absolute";
          tooltip.style.background = "var(--ink)";
          tooltip.style.color = "var(--paper)";
          tooltip.style.border = "1px solid var(--accent)";
          tooltip.style.padding = "6px 8px";
          tooltip.style.fontFamily = "var(--mono)";
          tooltip.style.fontSize = "0.55rem";
          tooltip.style.borderRadius = "var(--radius)";
          tooltip.style.zIndex = "100";
          tooltip.style.pointerEvents = "none";
          tooltip.style.boxShadow = "3px 3px 0px rgba(0,0,0,0.15)";
          
          var tooltipRect = tooltip.getBoundingClientRect();
          tooltip.style.left = (rect.left + window.scrollX + (rect.width/2) - (tooltipRect.width/2)) + "px";
          tooltip.style.top = (rect.top + window.scrollY - tooltipRect.height - 8) + "px";
          
          bar.addEventListener("mouseleave", function () {
            bar.style.transform = "none";
            bar.style.filter = "none";
            if (tooltip.parentNode) tooltip.parentNode.removeChild(tooltip);
          }, { once: true });
        });
      }
    });
  }

  // Analytics: fire a GA4 event for any element carrying data-track.
  // Works once the GA4 snippet in <head> is live (gtag defined); silently
  // does nothing before that, so this is safe to ship ahead of setup.
  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-track]");
    if (!el) return;
    if (typeof gtag === "function") {
      gtag("event", el.getAttribute("data-track"), {
        destination: el.getAttribute("data-destination") || undefined,
        tool: el.getAttribute("data-tool") || undefined,
      });
    }
  });
});
