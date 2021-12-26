<style lang="scss">
@import "../theme";
</style>

<script lang="ts">
import Button from "./Button.svelte";
import Label from "./Label.svelte";
import Icon from "./Icon.svelte";
import { Action } from "..";

export let isEnabled: boolean = true;
export let canToggle: boolean = false;
export let isControlled: boolean = false;
export let isDown: boolean = false;
export let label: string | undefined = undefined;
export let iconSrc: string | undefined = undefined;
export let iconName: string | undefined = undefined;
export let iconWidth: number = 14;
export let iconHeight: number = 14;
export let iconSize: number = -1;
export let noStyle: boolean = false;
export let isRound: boolean = false;
export let action: Action | undefined = undefined;
export let padding: number = -1;
export let canFocus: boolean = true;
</script>

<Button
  type="pushbutton"
  {...{
    isEnabled,
    canToggle,
    isDown,
    isControlled,
    noStyle,
    action,
    padding,
    canFocus,
  }}
  appearance="{isRound ? 'round' : 'box'}"
  on:mousedown
  on:mouseup
  on:keydown
  on:keyup
  on:change
  on:down
  on:up
  on:longpress
  on:toggle
  on:push
  on:click
  on:change>
  {#if label}
    <Label text="{label}" />
  {/if}
  {#if iconSrc || iconName}
    <Icon
      src="{iconSrc}"
      name="{iconName}"
      width="{iconSize > -1 ? iconSize : iconWidth}"
      height="{iconSize > -1 ? iconSize : iconHeight}" />
  {/if}
</Button>
