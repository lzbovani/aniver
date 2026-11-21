(() => {
  const start = new Date(2024, 11, 23);
  const forms = {
    years: ["ano", "anos"],
    months: ["mês", "meses"],
    days: ["dia", "dias"],
    hours: ["hora", "horas"],
    minutes: ["minuto", "minutos"],
    seconds: ["segundo", "segundos"]
  };
  const fields = Array.from(document.querySelectorAll("[data-unit]"), field => ({
    key: field.dataset.unit,
    value: field.querySelector("b"),
    label: field.querySelector("span")
  }));

  function elapsedSinceStart(now) {
    const date = now < start ? start : now;
    let months = (date.getFullYear() - start.getFullYear()) * 12 + date.getMonth() - start.getMonth();
    if (date.getDate() < start.getDate()) months -= 1;

    // Count calendar days separately so local daylight-saving transitions do not shift the clock.
    const anchor = new Date(start.getFullYear(), start.getMonth() + months, start.getDate());
    const anchorDay = Date.UTC(anchor.getFullYear(), anchor.getMonth(), anchor.getDate());
    const today = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
    return {
      years: Math.floor(months / 12),
      months: months % 12,
      days: Math.round((today - anchorDay) / 86400000),
      hours: date.getHours(),
      minutes: date.getMinutes(),
      seconds: date.getSeconds()
    };
  }

  function renderClock() {
    const elapsed = elapsedSinceStart(new Date());
    fields.forEach(({ key, value, label }) => {
      const n = elapsed[key];
      const digits = String(n).padStart(2, "0");
      if (value.textContent !== digits) {
        value.textContent = digits;
        label.textContent = forms[key][n === 1 ? 0 : 1];
      }
    });
  }

  renderClock();
  window.setInterval(renderClock, 1000);
})();
