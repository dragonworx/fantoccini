<style lang="scss">
@import "../theme";
$resize: 3px;
$resizeLarge: $resize * 2;

.window {
  width: 100%;
  height: 100%;

  &.modal {
    .overlay {
      background-color: black;
      opacity: 0.3;
      width: 100%;
      height: 100%;
    }
  }

  &.positioned {
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    .frame {
      position: absolute;
    }
  }

  .frame {
    display: flex;
    flex-direction: column;
    border-top: 1px solid #888;
    border-left: 1px solid #666;
    border-right: 1px solid #666;
    border-bottom: 1px solid #666;
    box-shadow: 5px 10px 10px 0px rgba(0, 0, 0, 0.25);
    background-color: #505050;
    transition: top 0.15s ease-out, left 0.15s ease-out, width 0.15s ease-out,
      height 0.15s ease-out;
    overflow: hidden;

    &.dragging {
      transition: none;
    }

    .resize {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      position: relative;
    }

    &.resizable {
      .resize {
        border: 3px ridge #767676;

        .resize-border {
          position: absolute;
        }

        .resize-left {
          top: 0;
          left: -($resize + 1px);
          height: 100%;
          width: $resize;
          background-color: blue;
          cursor: ew-resize;
        }

        .resize-right {
          top: 0;
          right: -($resize + 1px);
          height: 100%;
          width: $resize;
          background-color: red;
          cursor: ew-resize;
        }

        .resize-top {
          top: -($resize + 1px);
          left: 0;
          width: 100%;
          height: $resize;
          background-color: green;
          cursor: ns-resize;
        }

        .resize-bottom {
          bottom: -($resize + 1px);
          left: 0;
          width: 100%;
          height: $resize;
          background-color: pink;
          cursor: ns-resize;
        }

        .resize-topleft {
          top: -($resize + 1px);
          left: -($resize + 1px);
          height: $resizeLarge;
          width: $resizeLarge;
          background-color: yellow;
          cursor: nw-resize;
        }

        .resize-topright {
          top: -($resize + 1px);
          right: -($resize + 1px);
          height: $resizeLarge;
          width: $resizeLarge;
          background-color: yellow;
          cursor: ne-resize;
        }

        .resize-bottomleft {
          bottom: -($resize + 1px);
          left: -($resize + 1px);
          height: $resizeLarge;
          width: $resizeLarge;
          background-color: yellow;
          cursor: sw-resize;
        }

        .resize-bottomright {
          bottom: -($resize + 1px);
          right: -($resize + 1px);
          height: $resizeLarge;
          width: $resizeLarge;
          background-color: yellow;
          cursor: se-resize;
        }
      }
    }

    &.minimised {
      top: calc(100% - 30px) !important;
      left: 0 !important;
    }

    .titleBar {
      @include linear_gradient(#495b76, #252f44, 180deg);
      border-bottom: 1px solid #1e1e1e;
      box-sizing: border-box;
      padding: $spacing_small;
      height: 30px;
      display: flex;
      align-items: center;
      overflow: hidden;

      .iconTitleGroup {
        flex-grow: 1;
        display: flex;
        align-items: center;
        position: relative;
        height: 100%;

        .title {
          @include label_enabled;
          font-weight: 500;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
        }

        &.hasIcon {
          .title {
            left: $spacing_small * 5.5;
          }
        }
      }

      .buttonGroup {
        display: flex;
        align-items: center;

        :global([data-component="button"]) {
          margin-left: $spacing_small;
        }

        :global([data-component="button"]) {
          @include linear_gradient(#264e95, #2f343c);
        }
      }

      &.isTool {
        height: 20px;
        padding: 3px;

        .iconTitleGroup {
          .title {
            font-size: 10px;
          }

          &.hasIcon {
            .title {
              left: $spacing_small * 4;
            }
          }
        }
      }
    }

    .content {
      display: flex;
      flex-grow: 1;
      overflow: hidden;
    }

    &.fill {
      flex-grow: 1;
      width: 100%;
      height: 100%;
    }
  }
}
</style>

<script lang="ts" context="module">
let _isModalOpen = false;

export function openModal() {
  if (!_isModalOpen) {
    _isModalOpen = true;
  }
}

export function closeModal() {
  if (_isModalOpen) {
    _isModalOpen = false;
  }
}

export function isModalOpen() {
  return _isModalOpen;
}
</script>

<script lang="ts">
import { createEventDispatcher } from "svelte";
import { fade } from "svelte/transition";
import { MenuBarItem, Dragger } from "../";
import PushButton from "./PushButton.svelte";
import Icon from "./Icon.svelte";
import Panel from "./Panel.svelte";

export let isOpen: boolean = true;
export let title: string = "";
export let icon: string | undefined = undefined;
export let appearance: "window" | "tool" = "window";
export let modal: boolean = false;
export let menuBar: MenuBarItem[] | undefined = undefined;
export let width: number = 0;
export let height: number = 0;
export let x: number = 0;
export let y: number = 0;
export let canMinimise: boolean = true;
export let canMaximise: boolean = true;
export let canClose: boolean = true;
export let isResizable: boolean = false;

const dispatch = createEventDispatcher();

const minWidth = 140;
const minHeight = 140;

const titleDragger = new Dragger<{ x: number; y: number }>()
  .on("dragstart", (setStartValue) => {
    isDragging = true;
    setStartValue({ x, y });
  })
  .on("dragmove", (deltaX: number, deltaY: number) => {
    x = titleDragger.startValue.x + deltaX;
    y = titleDragger.startValue.y + deltaY;
    x = Math.min(Math.max(0, x), document.documentElement.clientWidth - width);
    y = Math.min(
      Math.max(0, y),
      document.documentElement.clientHeight - height
    );
  })
  .on("dragcomplete", () => (isDragging = false));

const rightDragger = new Dragger<number>()
  .on("dragstart", (setStartValue) => {
    isDragging = true;
    setStartValue(width);
  })
  .on("dragmove", (deltaX: number) => {
    width = rightDragger.startValue + deltaX;
    width = Math.min(
      Math.max(minWidth, width),
      document.documentElement.clientWidth - x
    );
  });

const leftDragger = new Dragger<{ x: number; width: number }>()
  .on("dragstart", (setStartValue) => {
    isDragging = true;
    setStartValue({ x, width });
  })
  .on("dragmove", (deltaX: number) => {
    x = leftDragger.startValue.x + deltaX;
    width = leftDragger.startValue.width + leftDragger.startValue.x - x;
    if (width < minWidth) {
      const offset = minWidth - width;
    }
  });

let restore: {
  x: number;
  y: number;
  width: number;
  height: number;
} = {
  x,
  y,
  width,
  height,
};

$: isMinimised = false;
$: isDragging = false;
$: isTool = appearance === "tool";
$: isPositioned = x !== 0 || y !== 0 || width !== 0 || height !== 0;
$: buttonIconSize = isTool ? 10 : 16;
$: style = "";
$: {
  if (isOpen && modal) {
    openModal();
  }
  if (!isOpen && modal) {
    closeModal();
  }
}

$: {
  if (isPositioned) {
    style = `left:${x}px;top:${y}px;width:${width}px;height:${height}px;`;
  }
}

export function toggleMinimise() {
  isMinimised = !isMinimised;
}

export function getIsMinimised() {
  return isMinimised;
}

export function setIsMinimised(value: boolean) {
  isMinimised = value;
}

export function maximise() {
  isMinimised = false;
  const clientWidth = document.documentElement.clientWidth;
  const clientHeight = document.documentElement.clientHeight;
  if (width === clientWidth && height === clientHeight) {
    x = restore.x;
    y = restore.y;
    width = restore.width;
    height = restore.height;
    return;
  }
  restore = {
    x,
    y,
    width,
    height,
  };
  x = 0;
  y = 0;
  width = clientWidth;
  height = clientHeight;
}

const onMinimiseClick = () => {
  dispatch("minimise");
};

const onMaximiseClick = () => {
  dispatch("maximise");
};

const onCloseClick = () => {
  dispatch("close");
};

const onTitleMouseDown = (e: MouseEvent) => {
  titleDragger.onStartDrag(e);
};
</script>

{#if isOpen}
  <div class="window" class:modal class:positioned="{isPositioned}">
    {#if modal}
      <div class="overlay"></div>
    {/if}
    <div
      transition:fade="{{ duration: 100 }}"
      class="frame"
      class:fill="{x === 0 && y === 0 && width === 0 && height === 0}"
      class:minimised="{isMinimised}"
      class:dragging="{isDragging}"
      class:resizable="{isResizable}"
      style="{isPositioned ? style : undefined}"
      data-component="window">
      <div class="resize">
        <div
          class="resize-left resize-border"
          on:mousedown="{leftDragger.onStartDrag}">
        </div>
        <div class="resize-top resize-border"></div>
        <div class="resize-bottom resize-border"></div>
        <div
          class="resize-right resize-border"
          on:mousedown="{rightDragger.onStartDrag}">
        </div>
        <div class="resize-topleft resize-border"></div>
        <div class="resize-topright resize-border"></div>
        <div class="resize-bottomleft resize-border"></div>
        <div class="resize-bottomright resize-border"></div>
        <div class="titleBar" class:isTool>
          <div class="iconTitleGroup" class:hasIcon="{!!icon}">
            {#if icon}
              <Icon src="{icon}" size="{isTool ? 14 : 20}" />
            {/if}
            {#if title}
              <div class="title" on:mousedown="{onTitleMouseDown}">{title}</div>
            {/if}
          </div>
          <div class="buttonGroup">
            {#if canMinimise && !isTool}
              <PushButton
                iconSrc="{'img/icons/minimise.svg'}"
                padding="{2}"
                iconSize="{buttonIconSize}"
                on:click="{onMinimiseClick}" />
            {/if}
            {#if canMaximise && !isTool}
              <PushButton
                iconSrc="{'img/icons/maximise.svg'}"
                padding="{2}"
                iconSize="{buttonIconSize}"
                on:click="{onMaximiseClick}" />
            {/if}
            {#if canClose}
              <PushButton
                iconSrc="{'img/icons/cross.svg'}"
                padding="{2}"
                iconSize="{buttonIconSize}"
                on:click="{onCloseClick}" />
            {/if}
          </div>
        </div>
        <div class="content"><Panel menuBar="{menuBar}"><slot /></Panel></div>
      </div>
    </div>
  </div>
{/if}
