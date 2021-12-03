<style lang="scss">
@import "theme";
.spinner {
  width: 71px;

  .buttons {
    display: flex;
    flex-direction: column;
  }
}

:global([data-component="spinner"]
    [data-component="textfield"]
    input[type="text"]) {
  text-align: center;
}

:global([data-component="spinner"]
    [data-component="textfield"]
    button[data-type="pushbutton"]
    .content) {
  padding: 0;
}

:global([data-component="spinner"]
    [data-component="textfield"]
    button[data-type="pushbutton"]) {
  border-radius: 0 !important;
}

:global([data-component="spinner"]
    [data-component="textfield"]
    button[data-type="pushbutton"]:before) {
  border-radius: 0 !important;
}

:global([data-component="spinner"] [data-component="textfield"]) {
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}
</style>

<script lang="ts">
import TextField from "./TextField.svelte";
import PushButton from "./PushButton.svelte";
import { isNumericInput } from "./filters";

let value: string = "0";
let incTimeout;

const inc = (amount: number) =>
  (value = String((parseFloat(value) + amount).toFixed(2)).replace(
    /\.00$|0+$/,
    ""
  ));

function filter(key: string) {
  if (key === "-") {
    if (value === "0") {
      value = "-";
    } else {
      const num = parseFloat(value) * -1;
      value = String(num);
    }
    return false;
  }
  if (!isNumericInput(key)) {
    return false;
  }
  if (value === "0" && key !== ".") {
    value = key;
    return false;
  }
  return true;
}

function onBlur() {
  if (isNaN(parseFloat(value))) {
    value = "0";
  }
  value = value.replace(/\.$/, "");
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === "ArrowUp") {
    inc(e.shiftKey ? 10 : e.ctrlKey ? 0.01 : 1);
  } else if (e.key === "ArrowDown") {
    inc(e.shiftKey ? -10 : e.ctrlKey ? -0.01 : -1);
  }
  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
    e.preventDefault();
  }
}

function incRepeat(amount: number) {
  inc(amount);
  incTimeout = setTimeout(() => {
    incRepeat(amount);
  }, 50);
}

function onIncUpMousedown() {
  inc(1);
}

function onIncDownMousedown() {
  inc(-1);
}

function onIncUpLongpress() {
  incRepeat(1);
}

function onIncDownLongpress() {
  incRepeat(-1);
}

function onIncMouseup() {
  clearTimeout(incTimeout);
}

function onIncKeydown(e: KeyboardEvent) {
  if (e.key === "ArrowUp") {
    onIncUpMousedown();
  } else if (e.key === "ArrowDown") {
    onIncDownMousedown();
  }
  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
    e.preventDefault();
  }
}
</script>

<div class="spinner" data-component="spinner">
  <TextField
    bind:value
    filter="{filter}"
    autofocus="{true}"
    on:blur="{onBlur}"
    on:keydown="{onKeyDown}">
    <div class="buttons">
      <PushButton
        iconName="increment-up"
        iconWidth="{10}"
        iconHeight="{10}"
        on:longpress="{onIncUpLongpress}"
        on:keydown="{onIncKeydown}"
        on:down="{onIncUpMousedown}"
        on:up="{onIncMouseup}" />
      <PushButton
        iconName="increment-down"
        iconWidth="{10}"
        iconHeight="{10}"
        on:longpress="{onIncDownLongpress}"
        on:keydown="{onIncKeydown}"
        on:down="{onIncDownMousedown}"
        on:up="{onIncMouseup}" />
    </div>
  </TextField>
</div>
