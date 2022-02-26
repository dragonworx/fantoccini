import { Project } from 'src/core/project';
import { Scene } from 'src/core/scene';
import { ProjectDescriptor, SceneDescriptor } from 'src/core/format';

export function serialiseProject(project: Project): ProjectDescriptor {
  const { title, fps, width, height, currentScene } = project;

  const scenes = Array.from(project.scenes.values()).map(scene =>
    serialiseScene(scene)
  );

  const descriptor: ProjectDescriptor = {
    title,
    fps,
    width,
    height,
    scenes,
    currentScene,
  };

  return descriptor;
}

export function serialiseScene(scene: Scene): SceneDescriptor {
  const { id } = scene;
  const descriptor: SceneDescriptor = {
    id,
  };
  return descriptor;
}
