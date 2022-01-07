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
          cursor: ew-resize;
        }

        .resize-right {
          top: 0;
          right: -($resize + 1px);
          height: 100%;
          width: $resize;
          cursor: ew-resize;
        }

        .resize-top {
          top: -($resize + 1px);
          left: 0;
          width: 100%;
          height: $resize;
          cursor: ns-resize;
        }

        .resize-bottom {
          bottom: -($resize + 1px);
          left: 0;
          width: 100%;
          height: $resize;
          cursor: ns-resize;
        }

        .resize-topleft {
          top: -($resize + 1px);
          left: -($resize + 1px);
          height: $resizeLarge;
          width: $resizeLarge;
          cursor: nw-resize;
        }

        .resize-topright {
          top: -($resize + 1px);
          right: -($resize + 1px);
          height: $resizeLarge;
          width: $resizeLarge;
          cursor: ne-resize;
        }

        .resize-bottomleft {
          bottom: -($resize + 1px);
          left: -($resize + 1px);
          height: $resizeLarge;
          width: $resizeLarge;
          cursor: sw-resize;
        }

        .resize-bottomright {
          bottom: -($resize + 1px);
          right: -($resize + 1px);
          height: $resizeLarge;
          width: $resizeLarge;
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
const windows: Map<string, WindowAPI> = new Map();

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

export function getWindow(id: string) {
  return windows.get(id);
}

export type WindowAPI = {
  toggleMinimise: () => void;
  getIsMinimised: () => void;
  setIsMinimised: (value: boolean) => void;
  maximise: () => void;
  close: () => void;
  setTitle: (value: string) => void;
  getTitle: () => string;
};
</script>

<script lang="ts">
import { createEventDispatcher, onMount } from "svelte";
import { fade } from "svelte/transition";
import { MenuBarItem, Dragger } from "../";
import PushButton from "./PushButton.svelte";
import Icon from "./Icon.svelte";
import Panel from "./Panel.svelte";
import { getLocalStorage, setLocalStorage } from "../storage";

export let id: string;
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

export function close() {
  isOpen = false;
  onCloseClick();
}

export function setTitle(value: string) {
  title = value;
}

export function getTitle() {
  return title;
}

if (windows.has(id)) {
  throw new Error(`Window with id "${id}" already exists`);
}

windows.set(id, {
  toggleMinimise,
  getIsMinimised,
  setIsMinimised,
  maximise,
  close,
  setTitle,
  getTitle,
});

const dispatch = createEventDispatcher();

const minWidth = 140;
const minHeight = 140;

type DragEdge<T> = {
  onDragStart: (setStartValue: (value: T) => T) => void;
  onDragMove: (props: {
    dragger: Dragger<T>;
    deltaX: number;
    deltaY: number;
    clientX: number;
    clientY: number;
  }) => void;
  dragger: Dragger<T>;
};

function dragEdge<T>(
  onDragStart: (setStartValue: (value: T) => T) => void,
  onDragMove: (props: {
    dragger: Dragger<T>;
    deltaX: number;
    deltaY: number;
    clientX: number;
    clientY: number;
  }) => void
): DragEdge<T> {
  const dragger = new Dragger<T>();
  dragger.on("dragstart", onDragStart);
  dragger.on("dragmove", onDragMove);
  dragger.on("dragcomplete", () =>
    setLocalStorage(storageKey, { x, y, width, height })
  );
  return {
    onDragStart,
    onDragMove,
    dragger,
  };
}

function dragCorner(
  onDragMove: (props: {
    dragger: Dragger<{ x: number; y: number; width: number; height: number }>;
    deltaX: number;
    deltaY: number;
    clientX: number;
    clientY: number;
  }) => void
) {
  return dragEdge<{ x: number; y: number; width: number; height: number }>(
    (setStartValue) => {
      isDragging = true;
      setStartValue({ x, y, width, height });
    },
    onDragMove
  );
}

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

const titleDragger = new Dragger<{ x: number; y: number }>()
  .on("dragstart", (setStartValue) => {
    isDragging = true;
    setStartValue({ x, y });
  })
  .on("dragmove", ({ dragger, deltaX, deltaY }) => {
    x = dragger.startValue.x + deltaX;
    y = dragger.startValue.y + deltaY;
    x = Math.min(Math.max(0, x), document.documentElement.clientWidth - width);
    y = Math.min(
      Math.max(0, y),
      document.documentElement.clientHeight - height
    );
  })
  .on("dragcomplete", () => {
    isDragging = false;
    setLocalStorage(storageKey, { x, y, width, height });
  });

const top = dragEdge<{ y: number; height: number }>(
  (setStartValue) => {
    isDragging = true;
    setStartValue({ y, height });
  },
  ({ dragger, deltaY }) => {
    y = Math.max(0, dragger.startValue.y + deltaY);
    height = dragger.startValue.height + dragger.startValue.y - y;
    if (height < minHeight) {
      y = y - (minHeight - height);
      height = minHeight;
    }
  }
);

const left = dragEdge<{ x: number; width: number }>(
  (setStartValue) => {
    isDragging = true;
    setStartValue({ x, width });
  },
  ({ dragger, deltaX }) => {
    x = dragger.startValue.x + deltaX;
    width = dragger.startValue.width + dragger.startValue.x - x;
    if (width < minWidth) {
      x = x - (minWidth - width);
      width = minWidth;
    }
  }
);

const right = dragEdge<{ width: number }>(
  (setStartValue) => {
    isDragging = true;
    setStartValue({ width });
  },
  ({ dragger, deltaX }) => {
    width = dragger.startValue.width + deltaX;
    width = Math.min(
      Math.max(minWidth, width),
      document.documentElement.clientWidth - x
    );
  }
);

const bottom = dragEdge<{ height: number }>(
  (setStartValue) => {
    isDragging = true;
    setStartValue({ height });
  },
  ({ dragger, deltaY }) => {
    height = dragger.startValue.height + deltaY;
    height = Math.min(
      Math.max(minHeight, height),
      document.documentElement.clientHeight - y
    );
  }
);

const topLeft = dragCorner((values) => {
  top.onDragMove(values);
  left.onDragMove(values);
});

const topRight = dragCorner((values) => {
  top.onDragMove(values);
  right.onDragMove(values);
});

const bottomLeft = dragCorner((values) => {
  bottom.onDragMove(values);
  left.onDragMove(values);
});

const bottomRight = dragCorner((values) => {
  bottom.onDragMove(values);
  right.onDragMove(values);
});

onMount(() => {
  const savedValues = getLocalStorage(storageKey);
  if (savedValues !== null) {
    const {
      x: savedX,
      y: savedY,
      width: savedWidth,
      height: savedHeight,
    } = savedValues;
    x = savedX;
    y = savedY;
    width = savedWidth;
    height = savedHeight;
  }
});

$: storageKey = `window-${id}`;
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
  if (isPositioned) {
    titleDragger.onStartDrag(e);
  }
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
          on:mousedown="{left.dragger.onStartDrag}">
        </div>
        <div
          class="resize-top resize-border"
          on:mousedown="{top.dragger.onStartDrag}">
        </div>
        <div
          class="resize-bottom resize-border"
          on:mousedown="{bottom.dragger.onStartDrag}">
        </div>
        <div
          class="resize-right resize-border"
          on:mousedown="{right.dragger.onStartDrag}">
        </div>
        <div
          class="resize-topleft resize-border"
          on:mousedown="{topLeft.dragger.onStartDrag}">
        </div>
        <div
          class="resize-topright resize-border"
          on:mousedown="{topRight.dragger.onStartDrag}">
        </div>
        <div
          class="resize-bottomleft resize-border"
          on:mousedown="{bottomLeft.dragger.onStartDrag}">
        </div>
        <div
          class="resize-bottomright resize-border"
          on:mousedown="{bottomRight.dragger.onStartDrag}">
        </div>
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
