<style lang="scss">
@import "../theme";
</style>

<script lang="ts">
import Button from "./Button.svelte";
import Label from "./Label.svelte";
import Icon from "./Icon.svelte";

export let isEnabled: boolean = true;
export let canToggle: boolean = false;
export let isControlled: boolean = false;
export let isDown: boolean = false;
export let label: string | undefined = undefined;
export let iconSrc: string | undefined = undefined;
export let iconName: string | undefined = undefined;
export let iconWidth: number = 14;
export let iconHeight: number = 14;
export let noStyle: boolean = false;
</script>

<Button
  type="pushbutton"
  {...{
    isEnabled,
    canToggle,
    isDown,
    isControlled,
    noStyle,
  }}
  on:mousedown
  on:mouseup
  on:keydown
  on:keyup
  on:change
  on:down
  on:up
  on:longpress
  on:toggle
  on:pushed
  on:change>
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
