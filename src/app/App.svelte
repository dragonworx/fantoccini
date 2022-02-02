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
import db from "./db";

let isLoading = true;
db.application.toArray().then((result) => {
  if (result.length === 0) {
    db.application
      .add({
        currentProject: null,
      })
      .then((id) => {
        console.log(`Application id ${id}`);
        isLoading = false;
      });
  } else {
    const application = result[0];
    if (application.currentProject) {
      // fire event, open project...
    }
  }
});

db.application.toArray().then((result) => console.log(result));
</script>

<main>
  <Panel menuBar="{menuBar}" />
  <NewProjectWindow />
  <div id="debug">{Date.now()}</div>
</main>
