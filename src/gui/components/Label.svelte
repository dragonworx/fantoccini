<style lang="scss">
@import "../theme";

.label {
  @include label_enabled;
  position: relative;
  outline: none;
  cursor: inherit;

  &.link {
    text-decoration: underline;

    &:focus {
      @include focus;
    }
  }

  &.enabled {
    &.link {
      color: $color_label_link;
      cursor: pointer;

      &:active {
        color: $color_label_link_active;
      }
    }
  }

  &.disabled {
    @include label_disabled;
  }

  .label-wrapper {
    position: relative;
  }

  &[data-position] {
    display: flex;

    &[data-position="left"] {
      flex-direction: row;
    }

    &[data-position="right"] {
      flex-direction: row-reverse;
    }

    &[data-position="bottom"] {
      flex-direction: column-reverse;
    }

    &[data-position="top"] {
      flex-direction: column;
    }

    &[data-position="left"] > * {
      margin-right: $spacing_label;
    }

    &[data-position="right"] > * {
      margin-left: $spacing_label;
    }

    &[data-position="top"] > * {
      margin-bottom: $spacing_label;
    }

    &[data-position="bottom"] > * {
      margin-top: $spacing_label;
    }

    &[data-align="start"] {
      align-items: start;
    }

    &[data-align="center"] {
      align-items: center;
    }

    &[data-align="end"] {
      align-items: end;
    }

    &[data-justify="start"] {
      justify-content: start;
    }

    &[data-justify="center"] {
      justify-content: center;
    }

    &[data-justify="end"] {
      justify-content: end;
    }
  }
}
</style>

<script lang="ts">
import { createEventDispatcher } from "svelte";
import type { Position, Align, Justify } from "../types";
export let isEnabled: boolean = true;
export let text: string = "";
export let isLink: boolean = false;
export let position: Position = "left";
export let align: Align = "start";
export let justify: Justify = "start";
export let indent: number = 0;
export let color: string | undefined = undefined;
export let fontSize: number = -1;

const dispatch = createEventDispatcher();

$: hasContent = "default" in $$slots;

let indentStyle = undefined;
$: {
  if (hasContent && indent !== 0) {
    if (position === "left" || position === "right") {
      indentStyle = `top:${indent}px;`;
    } else if (position === "top" || position === "bottom") {
      indentStyle = `left:${indent}px;`;
    }
  }
}

$: colorStyle = color ? `color:${color};` : "";
$: fontStyle = fontSize > -1 ? `font-size:${fontSize}px;` : "";

function onMouseUp() {
  if (isEnabled && isLink) {
    dispatch("clicked", {});
  }
}
</script>

<!-- svelte-ignore a11y-label-has-associated-control -->
<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<label
  class="label"
  class:enabled="{isEnabled}"
  class:disabled="{!isEnabled}"
  class:link="{isLink}"
  style="{colorStyle}{fontStyle}"
  data-component="label"
  data-position="{position}"
  data-align="{align}"
  data-justify="{justify}"
  tabindex="{isEnabled && isLink ? 0 : -1}"
  on:mouseover
  on:mouseout
  on:mousedown
  on:mouseup
  on:mouseup="{onMouseUp}">
  {#if !hasContent}
    {text}
  {:else}
    <span class="label-wrapper" style="{indentStyle}">{text}</span>
    <slot />
  {/if}
</label>
