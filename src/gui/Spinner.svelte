<style lang="scss">
@import "theme";
.spinner .buttons {
  display: flex;
  flex-direction: column;
}

:global(.spinner
    [data-component="textfield"].textfield
    button[data-type="pushbutton"].button
    .content) {
  padding: 0;
}

:global(.spinner
    [data-component="textfield"].textfield
    button[data-type="pushbutton"].button) {
  border-radius: 0;
}
</style>

<script lang="ts">
import TextField from "./TextField.svelte";
import PushButton from "./PushButton.svelte";
import { isNumericInput } from "./filters";
</script>

<div type="spinner">
  <TextField filter="{isNumericInput}">
    <div class="buttons">
      <PushButton iconName="increment-up" />
      <PushButton iconName="increment-down" />
    </div>
  </TextField>
</div>
