import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { ScriptStore } from '../interface/script.store';

declare var gtag: Function;
declare global {
  interface Window {
    Appcues: any;
    dataLayer: any;
  }
}
@Injectable({
  providedIn: 'root',
})

export class ScriptService {
  private scripts: any = [];
  private renderer: Renderer2;
  private hasConditionRun = false;
  
  constructor(
    @Inject(DOCUMENT) private document: Document,
    rendererFactory: RendererFactory2
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    ScriptStore.forEach((script: any) => {
      let scriptsInstance: any = {};
      scriptsInstance[script.name] = {
        loaded: false,
        src: script.src,
      };
      this.scripts.push(scriptsInstance);
    });
  }

  load() {
    var promises: any[] = [];
    this.scripts.forEach((script: any) =>
      promises.push(this.loadScript(script))
    );
    return Promise.all(promises);
  }

  public loadScript(script: any) {
    return new Promise((resolve, reject) => {
      let scriptName = Object.keys(script)[0];
      var scriptElement;
        scriptElement = this.appendScriptTag(
          this.renderer,
          script[scriptName].src
        );
      scriptElement.onload = () => {
        resolve({ script: scriptName, loaded: true, status: 'Loaded' });
      };
    }).then((result: any) => {
    });
  }


  public appendScriptTag(renderer: Renderer2, src: string) {
    const script = renderer.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = src;
    renderer.appendChild(this.document.body, script);
    return script;
  }

  public appendImageTag(renderer: Renderer2, src: string) {
    const imgData = renderer.createElement('img');
    imgData.style.display = 'none';
    imgData.style.height = '1';
    imgData.style.width = '1';
    imgData.src = src;
    renderer.appendChild(this.document.body, imgData);
    return imgData;
  }

  public appendCSSTag(renderer: Renderer2, src: string) {
    const style = renderer.createElement('link');
    style.id = 'css-styling';
    style.rel = 'stylesheet';
    style.href = src;
    renderer.appendChild(this.document.head, style);
    return style;
  }

 public shouldRunCondition(): boolean {
    if (!this.hasConditionRun) {
      this.hasConditionRun = true;
      return true;
    }
    return false;
  }
}
