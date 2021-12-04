<style lang="scss">
@import "../theme";
:global(button[data-type="pushbutton"] .content) {
  padding: 5px;
}
:global(button[data-type="pushbutton"] .content > *) {
  margin-right: $spacing_small;
}
:global(button[data-type="pushbutton"] .content > *:last-child) {
  margin-right: 0;
}
</style>

<script lang="ts">
import { createEventDispatcher } from "svelte";
import Button from "./Button.svelte";
import Label from "./Label.svelte";
import Icon from "./Icon.svelte";

export let isEnabled: boolean = true;
export let canToggle: boolean = false;
export let isDown: boolean = false;
export let label: string | undefined = undefined;
export let iconSrc: string | undefined = undefined;
export let iconName: string | undefined = undefined;
export let iconWidth: number = 16;
export let iconHeight: number = 16;
export let noStyle: boolean = false;

const dispatch = createEventDispatcher();

function onChange(event) {
  isDown = event.detail.isDown;
  if (canToggle) {
    dispatch("toggle", { isDown });
  } else {
    dispatch(isDown ? "down" : "up", {});
  }
}
</script>

<Button
  type="pushbutton"
  {...{
    isEnabled,
    canToggle,
    isDown,
    noStyle,
  }}
  on:mousedown
  on:mouseup
  on:keydown
  on:keyup
  on:change
  on:change="{onChange}"
  on:longpress>
  {#if label}
    <Label text="{label}" />
  {/if}
  {#if iconSrc || iconName}
    <Icon
      src="{iconSrc}"
      name="{iconName}"
      width="{iconWidth}"
      height="{iconHeight}" />
  {/if}
</Button>
