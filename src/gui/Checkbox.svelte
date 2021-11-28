<style lang="scss">
@import "theme";
:global(button[data-type="checkbox"] .content) {
  padding: 2px;
}
</style>

<script lang="ts">
import Button from "./Button.svelte";
import Icon from "./Icon.svelte";
import Label from "./Label.svelte";
import type { Align, Position } from "./types";

export let label: string | undefined = undefined;
export let position: Position = "left";

let button;

function onChange(event) {
  console.log("?", event.detail.isDown);
}

function onMouseDown() {
  button.click();
}
</script>

{#if label !== undefined}
  <Label
    text="{label}"
    position="{position}"
    align="center"
    on:mousedown="{onMouseDown}">
    <Button
      bind:this="{button}"
      isEnabled="{$$props.isEnabled}"
      isDown="{$$props.isDown}"
      canToggle="{true}"
      type="checkbox"
      on:change="{onChange}"><Icon name="cross" width="{12}" /></Button>
  </Label>
{:else}
  <Button
    isEnabled="{$$props.isEnabled}"
    isDown="{$$props.isDown}"
    canToggle="{true}"
    type="checkbox"
    on:change="{onChange}"><Icon name="cross" width="{12}" /></Button>
{/if}
