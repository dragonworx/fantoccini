<style lang="scss">
  @import "../theme";
  .dialogButtons {
    display: flex;
    position: absolute;
    bottom: 10px;
    right: 10px;
  }

  :global([data-component="dialog-buttons"] > *) {
    margin-left: 10px;
  }
</style>

<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import PushButton from "./PushButton.svelte";

  export let acceptText: string = "Ok";

  const dispatch = createEventDispatcher();
</script>

<div class="dialogButtons" data-component="dialog-buttons">
  <PushButton
    label={acceptText}
    on:click={() => dispatch("accept")} /><PushButton
    label="Cancel"
    on:click={() => dispatch("cancel")} />
</div>
