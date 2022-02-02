<style lang="scss">
main {
  box-sizing: border-box;
  position: relative;
  height: 100%;
  display: flex;
}

@media (min-width: 640px) {
  main {
    max-width: none;
  }
}

#debug {
  position: fixed;
  right: 5px;
  bottom: 5px;
  font-size: 10px;
  color: white;
}
</style>

<script lang="ts">
import { menuBar } from "./application";
import Panel from "../gui/components/Panel.svelte";
import NewProjectWindow from "./dialogs/NewProject.svelte";
</script>

<main>
  <Panel menuBar="{menuBar}" />
  <NewProjectWindow />
  <div id="debug">{Date.now()}</div>
</main>
