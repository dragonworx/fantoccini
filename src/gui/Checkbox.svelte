<style lang="scss">
@import "theme";
:global(button[data-type="checkbox"] .content) {
  padding: 2px;
}
</style>

<script lang="ts">
import { createEventDispatcher } from "svelte";
import Button from "./Button.svelte";
import Icon from "./Icon.svelte";
import Label from "./Label.svelte";
import type { Position } from "./types";

export let isEnabled: boolean = true;
export let isDown: boolean = false;
export let label: string | undefined = undefined;
export let position: Position = "left";

const dispatch = createEventDispatcher();

let button;

function onButtonChange(event) {
  dispatch("change", {
    checked: event.detail.isDown,
  });
  isDown = event.detail.isDown;
}

function onLabelMouseUp(e) {
  const isLabelClick = e.target.classList.contains("label");
  if (isLabelClick) {
    button.click();
    isDown = !isDown;
    dispatch("change", {
      checked: isDown,
    });
  }
}
</script>

{#if label !== undefined}
  <Label
    text="{label}"
    position="{position}"
    align="center"
    justify="center"
    on:mouseup="{onLabelMouseUp}">
    <Button
      bind:this="{button}"
      isEnabled="{isEnabled}"
      isDown="{isDown}"
      canToggle="{true}"
      type="checkbox"
      on:change="{onButtonChange}"><Icon name="cross" width="{12}" /></Button>
  </Label>
{:else}
  <Button
    isEnabled="{isEnabled}"
    isDown="{isDown}"
    canToggle="{true}"
    type="checkbox"
    on:change="{onButtonChange}"><Icon name="cross" width="{12}" /></Button>
{/if}
