import { IResourceItem } from "../store/resources";

export interface Api {
  resources(): any;
}

export class Hub implements Api {
  resources() {
    const data = [
      {
        id: 5,
        name: "buildah",
        catalog: {
          id: 1,
          type: "official"
        },
        type: "Task",
        latestVersion: {
          id: 5,
          version: "0.1",
          displayName: "buildah",
          description:
            "Buildah task builds source into a container image and then pushes it to a container registry.\nBuildah Task builds source into a container image using Project Atomic's Buildah build tool.It uses Buildah's support for building from Dockerfiles, using its buildah bud command.This command executes the directives in the Dockerfile to assemble a container image, then pushes that image to a container registry.",
          minPipelinesVersion: "",
          rawURL:
            "https://raw.githubusercontent.com/Pipelines-Marketplace/catalog/master/task/buildah/0.1/buildah.yaml",
          webURL:
            "https://github.com/Pipelines-Marketplace/catalog/tree/master/task/buildah/0.1/buildah.yaml",
          updatedAt: "2020-07-17 12:26:26.835302 +0000 UTC"
        },
        tags: [
          {
            id: 1,
            name: "image-build"
          }
        ],
        rating: 5
      },
      {
        id: 2,
        name: "argocd",
        catalog: {
          id: 1,
          type: "official"
        },
        type: "Task",
        latestVersion: {
          id: 2,
          version: "0.1",
          displayName: "argocd",
          description:
            "This task syncs (deploys) an Argo CD application and waits for it to be healthy.\nTo do so, it requires the address of the Argo CD server and some form of authentication either a username/password or an authentication token.",
          minPipelinesVersion: "",
          rawURL:
            "https://raw.githubusercontent.com/Pipelines-Marketplace/catalog/master/task/argocd/0.1/argocd.yaml",
          webURL:
            "https://github.com/Pipelines-Marketplace/catalog/tree/master/task/argocd/0.1/argocd.yaml",
          updatedAt: "2020-07-17 12:26:26.822315 +0000 UTC"
        },
        tags: [
          {
            id: 10,
            name: "deploy"
          }
        ],
        rating: 3.5
      }
    ];

    return new Promise((resolve, rej) => setTimeout(() => resolve(data), 1000));
  }
}
