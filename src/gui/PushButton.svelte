<style lang="scss">
@import "theme";
:global(.pushbutton .content > *) {
  margin-right: $spacing_small;
}
:global(.pushbutton .content > *:last-child) {
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
export let iconWidth: number | undefined = 16;
export let iconHeight: number | undefined = undefined;
</script>

<Button on:mousedown class="pushbutton">
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
