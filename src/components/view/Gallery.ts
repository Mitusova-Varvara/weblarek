import { Component } from "../base/Component";

interface IGallery {
  catalog: HTMLElement[];
}

export interface GalleryInterface extends Component<IGallery> {
  set catalog(items: HTMLElement[]);
}

export class Gallery extends Component<IGallery> implements GalleryInterface {
  constructor(container: HTMLElement) {
    super(container);
  }

  set catalog(items: HTMLElement[]) {
    this.container.replaceChildren(...items);
  }
}
