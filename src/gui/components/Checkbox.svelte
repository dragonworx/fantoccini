<style lang="scss">
@import "../theme";
:global(button[data-type="checkbox"].button .content) {
  padding: 4px;
}
</style>

<script lang="ts">
import { createEventDispatcher } from "svelte";
import type { Position } from "../";
import Button from "./Button.svelte";
import Icon from "./Icon.svelte";
import Label from "./Label.svelte";

export let isEnabled: boolean = true;
export let isDown: boolean = false;
export let label: string | undefined = undefined;
export let position: Position = "left";

const dispatch = createEventDispatcher();

let button: Button;

const onButtonToggle = (event) => {
  dispatch("change", event.detail);
  isDown = event.detail;
};

const onLabelMouseUp = (e) => {
  const isLabelClick = e.target.classList.contains("label-wrapper");
  if (isEnabled && isLabelClick) {
    isDown = !isDown;
    button.setIsDown(isDown);
    dispatch("change", isDown);
  }
};
</script>

{#if label !== undefined}
  <Label
    isEnabled="{isEnabled}"
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
      on:change="{onButtonToggle}"><Icon name="cross" width="{12}" /></Button>
  </Label>
{:else}
  <Button
    isEnabled="{isEnabled}"
    isDown="{isDown}"
    canToggle="{true}"
    type="checkbox"
    on:change="{onButtonToggle}"><Icon name="cross" width="{12}" /></Button>
{/if}
