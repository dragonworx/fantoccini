<style lang="scss">
@import "../theme";

.menu {
  position: relative;

  & .open {
    opacity: 1;
    visibility: visible;
  }

  & .closed {
    opacity: 0;
    visibility: hidden;
  }

  & .menu-position {
    position: absolute;
    top: 0;
    left: 0;

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

      & li.hover,
      & li:focus {
        @include linear_gradient(#6d7683, #5a5c5e, 180deg);
        outline: none;

        :global(& [data-component="label"]) {
          text-shadow: none;
        }
      }

      & li.selected {
        @include linear_gradient(#73849d, #3a556f, 180deg);

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
import { MenuOption, MenuPosition } from "../types";
import Label from "../components/Label.svelte";

export let options: MenuOption[];
export let position: MenuPosition = "dropdown";
export let isOpen: boolean = false;
export let selectedIndex: number = 0;
export let hoverIndex: number = -1;

let container: HTMLDivElement;
let popup: HTMLDivElement;

onMount(() => {
  const rect = container.getBoundingClientRect();
  console.log(rect);
  if (position === "dropdown") {
    popup.style.top = `${rect.height}px`;
  } else if (position === "popout") {
    popup.style.left = `${rect.width}px`;
  }
});

function getLabel(option: MenuOption) {
  if (typeof option === "string") {
    return option;
  } else {
    return option.label;
  }
}

const onLIMouseOver = (index: number) => () => {
  hoverIndex = index;
};

const onLIMouseOut = (e: MouseEvent) => {
  hoverIndex = -1;
};
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
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
          class:hover="{hoverIndex === i}"
          data-index="{i}"
          tabindex="0"
          on:mouseover="{onLIMouseOver(i)}"
          on:mouseout="{onLIMouseOut}">
          <Label text="{getLabel(option)}" />
        </li>
      {/each}
    </ul>
  </div>
</div>
