<style lang="scss">
.area {
  flex-grow: 1;
  outline: 1px inset #7b7b7b52;
  padding: 5px;
  border-radius: 3px;
  background-color: #00000003;
  display: flex;
  flex-direction: row;
  align-items: start;
  justify-content: space-around;
  box-sizing: border-box;

  &.vertical {
    flex-direction: column;
  }
}
</style>

<script type="ts">
import { Direction } from "../types";
export let direction: Direction = "horizontal";
export let height: number = -1;
</script>

<div
  class="area"
  class:horizontal="{direction === 'horizontal'}"
  class:vertical="{direction === 'vertical'}"
  style="{`height:${height > 0 ? height + 'px' : 'auto'}`}">
  <slot />
</div>
