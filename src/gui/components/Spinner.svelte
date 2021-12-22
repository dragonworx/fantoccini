<style lang="scss">
@import "../theme";
$digitWidth: 6;

$minWidth: 32px;

@mixin width($digitCount) {
  width: $minWidth + ($digitWidth * ($digitCount - 1));
}

.spinner {
  &.digitCount1 {
    @include width(1);
  }

  &.digitCount2 {
    @include width(2);
  }

  &.digitCount3 {
    @include width(3);
  }

  &.digitCount4 {
    @include width(4);
  }

  &.digitCount5 {
    @include width(5);
  }

  &.digitCount6 {
    @include width(6);
  }

  &.digitCount7 {
    @include width(7);
  }

  &.digitCount8 {
    @include width(8);
  }

  &.digitCount9 {
    @include width(9);
  }

  &.digitCount10 {
    @include width(10);
  }

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
import { createEventDispatcher } from "svelte";
import {
  isNumericInput,
  isDeleteKey,
  isArrowKey,
  isIncrementKey,
  isDecrementKey,
} from "../";
import TextField from "./TextField.svelte";
import PushButton from "./PushButton.svelte";

export let isEnabled: boolean = true;
export let autofocus: boolean = false;
export let digitCount: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 = 6;

const dispatch = createEventDispatcher();

let value: string = "0";
let incTimeout;

function inc(amount: number) {
  value = String((parseFloat(value) + amount).toFixed(2)).replace(
    /\.00$|0+$/,
    ""
  );
  dispatch("change", parseFloat(value));
}

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
  if (!isNumericInput(key) && !isDeleteKey(key)) {
    return false;
  }
  if (value === "0" && key !== "." && !isDeleteKey(key)) {
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
  const { key, shiftKey, ctrlKey } = e;
  if (isIncrementKey(key)) {
    inc(shiftKey ? 10 : ctrlKey ? 0.01 : 1);
  } else if (isDecrementKey(key)) {
    inc(shiftKey ? -10 : ctrlKey ? -0.01 : -1);
  }
  if (isArrowKey(key)) {
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
  const { key } = e;
  if (isIncrementKey(key)) {
    onIncUpMousedown();
  } else if (isDecrementKey(key)) {
    onIncDownMousedown();
  }
  if (isArrowKey(key)) {
    e.preventDefault();
  }
}

function onTextChange() {
  const num = parseFloat(value);
  !isNaN(num) && dispatch("change", parseFloat(value));
}
</script>

<div
  class="spinner"
  data-component="spinner"
  class:digitCount1="{digitCount === 1}"
  class:digitCount2="{digitCount === 2}"
  class:digitCount3="{digitCount === 3}"
  class:digitCount4="{digitCount === 4}"
  class:digitCount5="{digitCount === 5}"
  class:digitCount6="{digitCount === 6}"
  class:digitCount7="{digitCount === 7}"
  class:digitCount8="{digitCount === 8}"
  class:digitCount9="{digitCount === 9}"
  class:digitCount10="{digitCount === 10}">
  <TextField
    bind:value
    isEnabled="{isEnabled}"
    filter="{filter}"
    autofocus="{autofocus}"
    on:change="{onTextChange}"
    on:focus
    on:blur
    on:blur="{onBlur}"
    on:keydown="{onKeyDown}">
    <div class="buttons">
      <PushButton
        isEnabled="{isEnabled}"
        iconName="increment-up"
        iconWidth="{10}"
        iconHeight="{10}"
        on:longpress="{onIncUpLongpress}"
        on:keydown="{onIncKeydown}"
        on:down="{onIncUpMousedown}"
        on:up="{onIncMouseup}" />
      <PushButton
        isEnabled="{isEnabled}"
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
