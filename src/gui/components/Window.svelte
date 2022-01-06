<style lang="scss">
@import "../theme";
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
    }

    &.fill {
      flex-grow: 1;
      width: 100%;
      height: 100%;
    }
  }
}
</style>

<script lang="ts">
import { createEventDispatcher } from "svelte";
import { fade } from "svelte/transition";
import { MenuBarItem } from "../";
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

const dispatch = createEventDispatcher();

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
$: isTool = appearance === "tool";
$: isPositioned = x !== 0 || y !== 0 || width !== 0 || height !== 0;
$: buttonIconSize = isTool ? 10 : 16;
$: style = "";

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
</script>

{#if isOpen}
  <div class="window" class:modal class:positioned="{isPositioned}">
    {#if modal}
      <div class="overlay"></div>
    {/if}
    <div
      class="frame"
      transition:fade="{{ duration: 100 }}"
      class:fill="{x === 0 && y === 0 && width === 0 && height === 0}"
      class:minimised="{isMinimised}"
      style="{isPositioned ? style : undefined}"
      data-component="window">
      <div class="titleBar" class:isTool>
        <div class="iconTitleGroup" class:hasIcon="{!!icon}">
          {#if icon}
            <Icon src="{icon}" size="{isTool ? 14 : 20}" />
          {/if}
          {#if title}
            <div class="title">{title}</div>
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
{/if}
