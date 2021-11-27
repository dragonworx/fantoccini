<style lang="scss">
@import "theme";

label {
  box-sizing: border-box;
  user-select: none;
  color: $color_label_enabled;
  text-shadow: 1px 1px 1px $color_label_shadow_enabled;
  font-size: 12px;
  white-space: nowrap;

  &.disabled {
    color: $color_label_disabled;
    text-shadow: 1px 1px 1px $color_label_shadow_disabled;
  }

  &.link {
    color: $color_label_link;
    text-decoration: underline;
    cursor: pointer;
  }
}
</style>

<script lang="ts">
export let isEnabled: boolean = true;
export let text: string = "";
export let url: string = "";
</script>

<!-- svelte-ignore a11y-label-has-associated-control -->
<label
  class="label"
  class:disabled="{!isEnabled}"
  class:link="{url.length > 0}"
  tabindex="{isEnabled ? 0 : undefined}">
  {text}
</label>
