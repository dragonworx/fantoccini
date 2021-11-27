<style lang="scss">
@import "theme";
:global(button[data-type="checkbox"] .content) {
  padding: 2px;
}
</style>

<script lang="ts">
import Button from "./Button.svelte";
import Icon from "./Icon.svelte";

function onChange(event) {
  console.log("?", event.detail.isDown);
}
</script>

<Button
  isEnabled="{$$props.isEnabled}"
  isDown="{$$props.isDown}"
  canToggle="{true}"
  type="checkbox"
  on:change="{onChange}"><Icon name="cross" width="{12}" /></Button>
