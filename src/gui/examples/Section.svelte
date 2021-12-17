<style lang="scss">
@import "../theme";

.section {
  @include noselect();
  box-sizing: border-box;
  padding: 0 ($spacing_small * 2);
  border-radius: $spacing_small;
  border: 1px inset #7f7f7f8a;
  background-color: rgba(0, 0, 0, 0.05);
  margin-bottom: ($spacing_small * 2);
  padding-bottom: 8px;
  padding-top: 10px;

  legend {
    position: relative;
    left: $spacing_small * -1;
    top: -2px;
    color: #a8e9f3;
    padding: 2px $spacing_small;
    border-radius: $spacing_small;
    border-bottom: 1px solid #666666;
    border-top: 1px solid #9c9c9c;
    background-color: #545454;
    font-size: 11px;
    text-shadow: -1px -1px 1px #080808;
    padding-bottom: 3px;
  }

  .content {
    display: flex;
  }

  .content.horizontal {
    flex-direction: row;
    justify-content: space-around;
  }

  .content.vertical {
    flex-direction: column;
  }
}
</style>

<script lang="ts">
import type { Direction } from "../types";

export let title: string = "";
export let direction: Direction = "horizontal";
</script>

<fieldset class="section">
  <legend>{title}</legend>
  <div
    class="content"
    class:horizontal="{direction === 'horizontal'}"
    class:vertical="{direction === 'vertical'}">
    <slot />
  </div>
</fieldset>
