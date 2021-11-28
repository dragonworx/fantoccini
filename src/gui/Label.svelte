<style lang="scss">
@import "theme";

label {
  @include label;
  position: relative;

  &:focus {
    @include focus;
  }

  &.disabled {
    @include label_disabled;
  }

  &.link {
    color: $color_label_link;
    text-decoration: underline;
    cursor: pointer;

    &:active {
      color: $color_label_link_active;
    }
  }

  .label {
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
import type { Position, Align, Justify } from "./types";
export let isEnabled: boolean = true;
export let text: string = "";
export let isLink: boolean = false;
export let position: Position = "left";
export let align: Align = "start";
export let justify: Justify = "start";
export let indent: number = 0;
export let color: string | undefined = undefined;

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

$: colorStyle = color ? `color:${color};` : undefined;

function onMouseUp() {
  if (isLink) {
    dispatch("clicked", {});
  }
}
</script>

{#if !hasContent}
  <!-- svelte-ignore a11y-label-has-associated-control -->
  <label
    class="label"
    class:disabled="{!isEnabled}"
    class:link="{isLink}"
    style="{colorStyle}"
    tabindex="{isEnabled && isLink ? 0 : undefined}"
    on:mousedown
    on:mouseup
    on:mouseup="{onMouseUp}">
    {text}
  </label>
{:else}
  <!-- svelte-ignore a11y-label-has-associated-control -->
  <label
    class:disabled="{!isEnabled}"
    class:link="{isLink}"
    style="{colorStyle}"
    data-position="{position}"
    data-align="{align}"
    data-justify="{justify}"
    tabindex="{isEnabled && isLink ? 0 : -1}"
    on:mousedown
    on:mouseup>
    <span class="label" style="{indentStyle}">{text}</span>
    <slot />
  </label>
{/if}
