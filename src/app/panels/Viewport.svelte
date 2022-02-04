<script lang="ts">
import ScrollView from "../../gui/components/ScrollView.svelte";
import { Hub, Event } from "src/app/eventHub";
import app from "src/app/application";
import { Project } from "src/core/project";

let renderer: HTMLDivElement;

let hasProject: boolean = false;

Hub.on(Event.Project_Init, () => {
  renderer.appendChild(app.project.renderer.view);
  hasProject = true;
});
</script>

<div id="viewport">
  <ScrollView isEnabled="{hasProject}" align="center">
    <div
      class="renderer"
      bind:this="{renderer}"
      style="{`width:${
        hasProject ? app.project.width : Project.defaults.width
      }px;height:${
        hasProject ? app.project.height : Project.defaults.height
      }px;background-color:${hasProject ? 'transparent' : '#2c2f34'}`}">
    </div>
  </ScrollView>
</div>

<style lang="scss">
#viewport {
  width: 100%;
  height: 100%;

  .renderer {
    box-shadow: 10px 10px 5px rgba(0, 0, 0, 0.3);
    outline: 1px solid #333;
  }
}
</style>
