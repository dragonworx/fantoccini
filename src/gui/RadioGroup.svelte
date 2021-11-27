<style lang="scss">
@import "theme";
:global(button[data-type="checkbox"] .content) {
  padding: 2px;
}
</style>

<script lang="ts">
import Label from "./Label.svelte";
import Button from "./Button.svelte";
import type { RadioGroupOption, Position, Align } from "./types";

export let options: RadioGroupOption[] = [];
export let position: Position = "left";
export let align: Align = "start";

function onChange(event) {
  console.log("?", event.detail.isDown);
}
</script>

{#each options as { label, value }}{/each}
<Button
  isEnabled="{$$props.isEnabled}"
  isDown="{$$props.isDown}"
  canToggle="{true}"
  type="checkbox"
  on:change="{onChange}"><Icon name="cross" width="{12}" /></Button>
