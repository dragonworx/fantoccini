<style lang="scss">
@import "theme";
.isEnabled {
  @include buttonEnabled;
}
.isDown {
  @include buttonDown;
}
</style>

<script lang="ts">
export let isEnabled: boolean = true;
export let isDown: boolean = false;

const onMouseUp = () => {
  isDown = false;
  window.removeEventListener("mouseup", onMouseUp);
};

const onMouseDown = () => {
  isDown = true;
  window.addEventListener("mouseup", onMouseUp);
};
</script>

<button class:isEnabled class:isDown on:mousedown="{onMouseDown}" on:mousedown
  ><slot /></button>
