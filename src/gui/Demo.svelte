<style lang="scss">
demo {
  & .label {
    display: flex;
    padding: 2px 5px;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 5px;
    margin-right: 5px;

    :global(& label) {
      margin-right: 5px;
    }
  }
}
</style>

<script lang="ts">
import Caption from "./Caption.svelte";
import Label from "./Label.svelte";
export let key: string = "";
export let value: string = "";
</script>

<demo>
  <Caption>
    <span class="label" slot="label"
      ><Label text="{key}:" color="white" /><Label
        text="{value}"
        color="cyan" /></span>
    <slot />
  </Caption>
</demo>
