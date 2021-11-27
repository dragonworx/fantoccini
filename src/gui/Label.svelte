<style lang="scss">
@import "theme";

label {
  @include label;
  position: relative;

  &.disabled {
    @include label_disabled;
  }

  &.link {
    color: $color_label_link;
    text-decoration: underline;
    cursor: pointer;
  }

  .label {
    position: relative;
  }

  &[data-position] {
    display: flex;
    align-items: start;
    justify-content: start;

    &[data-position="left"] > * {
      margin-right: $spacing_small;
    }

    &[data-position="right"] > * {
      margin-left: $spacing_small;
    }

    &[data-position="top"] > * {
      margin-bottom: $spacing_small;
    }

    &[data-position="bottom"] > * {
      margin-top: $spacing_small;
    }
  }

  &[data-position="left"] {
    flex-direction: row;

    &[data-align="center"] .label {
      align-self: center;
    }

    &[data-align="end"] .label {
      align-self: end;
    }
  }

  &[data-position="right"] {
    flex-direction: row-reverse;

    &[data-align="center"] .label {
      align-self: center;
    }

    &[data-align="end"] .label {
      align-self: end;
    }
  }

  &[data-position="top"] {
    flex-direction: column;

    &[data-align="center"] .label {
      align-self: center;
    }

    &[data-align="end"] .label {
      align-self: end;
    }
  }

  &[data-position="bottom"] {
    flex-direction: column-reverse;

    &[data-align="center"] .label {
      align-self: center;
    }

    &[data-align="end"] .label {
      align-self: end;
    }
  }
}
</style>

<script lang="ts">
export let isEnabled: boolean = true;
export let text: string = "";
export let isLink: boolean = false;
export let position: "left" | "right" | "top" | "bottom" = "left";
export let align: "start" | "center" | "end" = "start";
export let indent: number = 0;

$: hasContent = "default" in $$slots;

let indentStyle = "";
$: {
  if (hasContent && indent !== 0) {
    if (position === "left" || position === "right") {
      indentStyle = `top:${indent}px;`;
    }
  }
}
</script>

{#if !hasContent}
  <!-- svelte-ignore a11y-label-has-associated-control -->
  <label
    class="label"
    class:disabled="{!isEnabled}"
    class:link="{isLink}"
    tabindex="{isEnabled && isLink ? 0 : undefined}">
    {text}
  </label>
{:else}
  <!-- svelte-ignore a11y-label-has-associated-control -->
  <label
    class:disabled="{!isEnabled}"
    class:link="{isLink}"
    data-position="{position}"
    data-align="{align}"
    tabindex="{isEnabled && isLink ? 0 : undefined}">
    <span class="label" style="{indentStyle}">{text}</span>
    <slot />
  </label>
{/if}
