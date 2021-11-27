<style lang="scss">
@import "./theme";
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
import Button from "./Button.svelte";
import Label from "./Label.svelte";
import Icon from "./Icon.svelte";

export let label: string | undefined = undefined;
export let iconSrc: string | undefined = undefined;
export let iconName: string | undefined = undefined;
export let iconWidth: number = 16;
export let iconHeight: number = 16;

function onChange(event) {
  console.log("PushButton.onChange!", event.detail.isDown);
}
</script>

<Button
  type="pushbutton"
  isEnabled="{$$props.isEnabled}"
  canToggle="{$$props.canToggle}"
  isDown="{$$props.isDown}"
  on:mousedown
  on:change
  on:change="{onChange}">
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
