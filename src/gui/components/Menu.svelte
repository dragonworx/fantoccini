<style lang="scss">
@import "../theme";

.menu {
  position: relative;

  & .open {
    opacity: 1;
  }

  & .closed {
    opacity: 0;
  }

  & .menu-position {
    position: absolute;
    top: 0;
    bottom: 0;

    & .menu-view {
      @include linear_gradient(#24282f, #2f343c);
      @include button_border_up;
      border-bottom: none;
      box-shadow: -1px 5px 8px 1px rgba(0, 0, 0, 0.25);

      border-radius: $border_radius_tiny;
      list-style: none;
      margin: 0;
      padding: 0;

      & li {
        padding: $spacing_small;
      }

      :global(& [data-component="label"]) {
        font-size: 12px;
      }

      :global(& [data-component="label"]:focus) {
        outline: none;
      }

      & li.selected {
        @include linear_gradient(#6d7683, #5a5c5e, 180deg);

        :global(& [data-component="label"]) {
          text-shadow: none;
        }
      }
    }
  }
}
</style>

<script lang="ts">
import { onMount } from "svelte";
import { MenuOption } from "../types";
import Label from "../components/Label.svelte";

export let options: MenuOption[];
export let position: "dropdown" | "popout" = "dropdown";
export let isOpen: boolean = false;
export let selectedIndex: number = 0;

let container: HTMLDivElement;
let popup: HTMLDivElement;

onMount(() => {
  const rect = container.getBoundingClientRect();
  console.log(rect);
});

function getLabel(option: MenuOption) {
  if (typeof option === "string") {
    return option;
  } else {
    return option.label;
  }
}

const onLIMouseOver = (index: number) => () => {
  selectedIndex = index;
};

const onLIMouseOut = (e: MouseEvent) => {
  selectedIndex = -1;
};
</script>

<div bind:this="{container}" class="menu">
  <slot />
  <div
    bind:this="{popup}"
    class="menu-position"
    class:open="{isOpen}"
    class:closed="{!isOpen}">
    <ul class="menu-view">
      {#each options as option, i (i)}
        <!-- svelte-ignore a11y-mouse-events-have-key-events -->
        <li
          class:selected="{selectedIndex === i}"
          data-index="{i}"
          on:mouseover="{onLIMouseOver(i)}"
          on:mouseout="{onLIMouseOut}">
          <Label text="{getLabel(option)}" />
        </li>
      {/each}
    </ul>
  </div>
</div>
