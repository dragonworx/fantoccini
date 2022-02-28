<script lang="ts">
import { onMount } from 'svelte';
import { ScrollView } from 'src/gui';
import { Application } from 'src/editor/application';
import { defaults, Project } from 'src/core/project';
import hub from 'src/core/hub';

let renderer: HTMLDivElement;
let hasProject: boolean = false;

onMount(() => {
  hub
    .on('project.init', () => {
      renderer.appendChild(Application.instance.project.renderer.view);
      hasProject = true;
    })
    .on('project.close', (project: Project) => {
      hasProject = false;
      renderer.removeChild(project.renderer.view);
    });
});
</script>

<div id="viewport">
  <ScrollView isEnabled="{hasProject}" align="center">
    <div
      class="renderer"
      bind:this="{renderer}"
      style="{`width:${
        hasProject ? Application.instance.project.width : defaults.width
      }px;height:${
        hasProject ? Application.instance.project.height : defaults.height
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
