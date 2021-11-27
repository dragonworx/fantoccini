<style lang="scss">
@import "../gui/theme";

div.caption {
  display: flex;
  align-items: start;
  justify-content: start;

  &[data-position="left"] > * {
    margin-right: $spacing_small;
  }

  &[data-position="right"] > * {
    margin-left: $spacing_small;
  }

  &[data-position="top"] > * {
    margin-bottom: $spacing_small;
  }

  &[data-position="bottom"] > * {
    margin-top: $spacing_small;
  }

  &[data-position="left"] {
    flex-direction: row;

    &[data-align="center"] .label {
      align-self: center;
    }

    &[data-align="end"] .label {
      align-self: end;
    }
  }

  &[data-position="right"] {
    flex-direction: row-reverse;

    &[data-align="center"] .label {
      align-self: center;
    }

    &[data-align="end"] .label {
      align-self: end;
    }
  }

  &[data-position="top"] {
    flex-direction: column;

    &[data-align="center"] .label {
      align-self: center;
    }

    &[data-align="end"] .label {
      align-self: end;
    }
  }

  &[data-position="bottom"] {
    flex-direction: column-reverse;

    &[data-align="center"] .label {
      align-self: center;
    }

    &[data-align="end"] .label {
      align-self: end;
    }
  }
}
</style>

<script lang="ts">
export let position: "left" | "right" | "top" | "bottom" = "left";
export let align: "start" | "center" | "end" = "start";
</script>

<div class="caption" data-position="{position}" data-align="{align}">
  <slot name="label" />
  <div class="outline"><slot /></div>
</div>
