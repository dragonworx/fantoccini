<style lang="scss">
@import "../theme";
$separatorSize: 5px;
$thumbSize: 20px;

.splitter {
  position: relative;
  width: 100%;
  height: 100%;
  flex-grow: 1;

  .separator {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .thumb {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #525252;
      border: 1px outset #919191;
      width: $separatorSize;
      height: $separatorSize;
      z-index: 1;

      &:active {
        background-color: #424242;
      }

      :global([data-component="icon"]) {
        opacity: 0.5;
      }
    }
  }

  &.horizontal {
    flex-direction: row;

    .separator {
      @include linear_gradient(#494d52, #383c42, 90deg);
      width: $separatorSize;
      border-left: 1px solid #343333;
      border-right: 1px solid#646262;

      .thumb {
        height: $thumbSize;
        cursor: ew-resize;
      }
    }
  }

  &.vertical {
    flex-direction: column;

    .separator {
      @include linear_gradient(#494d52, #383c42, 180deg);
      height: $separatorSize;
      border-top: 1px solid #343333;
      border-bottom: 1px solid#646262;

      .thumb {
        width: $thumbSize;
        cursor: ns-resize;

        :global([data-component="icon"]) {
          transform: rotate(90deg);
        }
      }
    }
  }
}

.panel1,
.panel2 {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
}
</style>

<script lang="ts">
import { onMount } from "svelte";
import { Direction } from "../";
import Icon from "./Icon.svelte";

export let direction: Direction = "horizontal";
export let value: number = 0.5;

const separatorSize = 5;

let elementWidth: number;
let elementHeight: number;
let panel1: HTMLDivElement;
let panel2: HTMLDivElement;
let separator: HTMLDivElement;
let dragInfo: {
  isDragging: boolean;
  startX: number;
  startY: number;
  startValue: number;
} = { isDragging: false, startX: 0, startY: 0, startValue: 0 };

function getLayout() {
  const panel1Size =
    (direction === "horizontal" ? elementWidth : elementHeight) * value -
    separatorSize / 2;
  const panel2Size =
    (direction === "horizontal" ? elementWidth : elementHeight) *
      (1.0 - value) -
    separatorSize / 2;
  return {
    panel1Size,
    separatorPos: panel1Size,
    panel2Size,
    panel2Pos: panel1Size + separatorSize,
  };
}

function setLayout() {
  const { panel1Size, separatorPos, panel2Size, panel2Pos } = getLayout();
  if (direction === "horizontal") {
    panel1.style.width = `${panel1Size}px`;
    separator.style.left = `${separatorPos}px`;
    panel2.style.left = `${panel2Pos}px`;
    panel2.style.width = `${panel2Size}px`;
  } else if (direction === "vertical") {
    panel1.style.height = `${panel1Size}px`;
    separator.style.top = `${separatorPos}px`;
    panel2.style.top = `${panel2Pos}px`;
    panel2.style.height = `${panel2Size}px`;
  }
}

onMount(() => {
  setLayout();
});

const onStartDrag = (e: MouseEvent) => {
  dragInfo.isDragging = true;
  dragInfo.startX = e.clientX;
  dragInfo.startY = e.clientY;
  dragInfo.startValue = value;
  let limit = separatorSize / 2 / elementWidth;

  const onMouseMove = (e: MouseEvent) => {
    let newValue: number;
    if (direction === "horizontal") {
      const delta = e.clientX - dragInfo.startX;
      newValue = (elementWidth * dragInfo.startValue + delta) / elementWidth;
    } else if (direction === "vertical") {
      const delta = e.clientY - dragInfo.startY;
      newValue = (elementHeight * dragInfo.startValue + delta) / elementHeight;
      limit = separatorSize / elementWidth;
    }
    value = Math.min(Math.max(limit, newValue), 1 - limit);
    setLayout();
  };

  const onMouseUp = () => {
    window.removeEventListener("mouseup", onMouseUp);
    window.removeEventListener("mousemove", onMouseMove);
  };

  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);
};

$: {
  if (elementWidth > 0) {
    setLayout();
  }
}
</script>

<div
  bind:clientWidth="{elementWidth}"
  bind:clientHeight="{elementHeight}"
  class="splitter"
  class:horizontal="{direction === 'horizontal'}"
  class:vertical="{direction === 'vertical'}"
  data-component="splitter">
  <div bind:this="{panel1}" class="panel1"><slot name="panel1" /></div>
  <div bind:this="{separator}" class="separator">
    <div class="thumb" on:mousedown="{onStartDrag}">
      <Icon src="img/icons/splitter.svg" size="{16}" />
    </div>
  </div>
  <div bind:this="{panel2}" class="panel2"><slot name="panel2" /></div>
</div>
