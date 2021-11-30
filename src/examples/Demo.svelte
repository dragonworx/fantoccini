<style lang="scss">
.demo {
  & .label {
    display: flex;
    padding: 2px 5px;
    background-color: #4a4c52;
    border-radius: 5px;
    margin-right: 5px;
    border-bottom: 1px solid #6c6c6c;
    border-left: 1px solid #3a3b3c;

    :global(& label) {
      margin-right: 5px;
    }
  }
}
:global(div.caption .outline) {
  outline: 1px inset #74747440;
  background-color: #4c4c4c;
  border-radius: 3px;
}
</style>

<script lang="ts">
import Caption from "./Caption.svelte";
import Label from "../gui/Label.svelte";
export let key: string = "";
export let value: string = "";
</script>

<div class="demo">
  <Caption>
    <span class="label" slot="label"
      ><Label text="{key}:" color="#848689" /><Label
        text="{value}"
        color="#9ea9a9" /></span>
    <slot />
  </Caption>
</div>
