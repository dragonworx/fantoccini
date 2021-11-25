<style lang="scss">
@import "theme";

.isEnabled {
  @include buttonEnabled;
}
.isDown {
  @include buttonDown;

  & * {
    top: 1px;
  }
}
</style>

<script lang="ts">
import Label from "./Label.svelte";
export let isEnabled: boolean = true;
export let isDown: boolean = false;
export let label: string = "";

const onMouseUp = () => {
  isDown = false;
  window.removeEventListener("mouseup", onMouseUp);
};

const onMouseDown = () => {
  isDown = true;
  window.addEventListener("mouseup", onMouseUp);
};
</script>

<button class:isEnabled class:isDown on:mousedown="{onMouseDown}"
  ><Label text="{label}" /></button>
