import { ChangeDetectorRef, Component, ComponentFactoryResolver, ComponentRef, ElementRef, NgZone, Renderer2, ViewChild, ViewContainerRef } from "@angular/core";
import { provideVSCodeDesignSystem, vsCodeButton, vsCodeDropdown, vsCodeOption, vsCodeProgressRing, vsCodeTextField } from "@vscode/webview-ui-toolkit";
import { vscode } from "./utilities/vscode";
import { DeviceFrameComponent } from "./components/device-frame/device-frame.component";
import { DEVICE_PROFILES } from "src/deviceProfiles";

// In order to use the Webview UI Toolkit web components they
// must be registered with the browser (i.e. webview) using the
// syntax below.
provideVSCodeDesignSystem().register(vsCodeButton());
provideVSCodeDesignSystem().register(vsCodeTextField());
provideVSCodeDesignSystem().register(vsCodeDropdown());
provideVSCodeDesignSystem().register(vsCodeOption());
provideVSCodeDesignSystem().register(vsCodeProgressRing());

// To register more toolkit components, simply import the component
// registration function and call it from within the register
// function, like so:
//
// provideVSCodeDesignSystem().register(
//   vsCodeButton(),
//   vsCodeCheckbox()
// );
// 
// Finally, if you would like to register all of the toolkit
// components at once, there's a handy convenience function:
//
// provideVSCodeDesignSystem().register(allComponents);


@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  title = "Responsive Viewer";

  // frames div container -> used for holding dynamically created components
  @ViewChild("framesContainer", { static: true })
  framesContainer: ElementRef | undefined;

  // frames ng-container -> used for creating dynamic components
  @ViewChild("frames", { read: ViewContainerRef })
  frames: ViewContainerRef | undefined;

  frameURL: string = "http://localhost:4200";

  deviceFramesRefs: ComponentRef<DeviceFrameComponent>[] = [];

  isUrlValid: boolean = true;

  constructor() {
  }

  ngAfterViewInit() {
    if (!this.framesContainer) {
      console.error('framesContainer is undefined');
      return;
    }
  }

  handleHowdyClick() {
    vscode.postMessage({
      command: "hello",
      text: "Hey there partner! 🤠",
    });
  }

  updateUrl() {
    this.deviceFramesRefs.forEach((deviceFrameRef) => {
      deviceFrameRef.instance.showLoadingSpinner = true;
      deviceFrameRef.instance.updateUrl(this.frameURL);
    });
  }

  addNewFrame() {
    if (!this.frames) {
      console.error('frames is undefined');
      return;
    }
    // add new device frame component to framesContainer
    const component = this.frames.createComponent(DeviceFrameComponent);
    component.instance.frameURL = this.frameURL;
    component.instance.showLoadingSpinner = true;
    component.instance.closeFrameFn = () => {
      if (!this.frames) {
        console.error('frames is undefined');
        return;
      }
      this.frames.remove(this.frames.indexOf(component.hostView));
      this.deviceFramesRefs = this.deviceFramesRefs.filter((deviceFrameRef) => deviceFrameRef !== component);
    }
    this.deviceFramesRefs.push(component);
  }

  addAllUniqueFrames() {
    if (!this.frames) {
      console.error('frames is undefined');
      return;
    }
    this.frames.clear();
    this.deviceFramesRefs = [];
    // get unique device profiles which have different width and height
    const uniqueDeviceProfiles = DEVICE_PROFILES.filter((deviceProfile, index, self) =>
      index === self.findIndex((t) => (
        t.width === deviceProfile.width && t.height === deviceProfile.height
      ))
    );
    uniqueDeviceProfiles.forEach((deviceProfile) => {
      if (!this.frames) {
        console.error('frames is undefined');
        return;
      }
      const component = this.frames.createComponent(DeviceFrameComponent);
      component.instance.frameURL = this.frameURL;
      component.instance.deviceProfileInit = deviceProfile;
      component.instance.showLoadingSpinner = true;
      this.deviceFramesRefs.push(component);
    });
  }

  sortFramesByWidth() {
    if (!this.frames || this.deviceFramesRefs.length === 0) {
      console.error('frames or deviceFramesRefs is undefined or empty');
      return;
    }

    this.deviceFramesRefs.sort((a, b) => {
      const iframeA = a.instance.iFrame?.nativeElement;
      const iframeB = b.instance.iFrame?.nativeElement;

      if (!iframeA || !iframeB) {
        console.error('iframeA or iframeB is undefined');
        return 0;
      }

      return +iframeA.style.width.split('px')[0] - +iframeB.style.width.split('px')[0];
    });

    // Move frames within the framesContainer based on the sorted order
    this.deviceFramesRefs.forEach((deviceFrameRef) => {
      if (!this.frames) {
        console.error('frames is undefined or empty');
        return;
      }
      deviceFrameRef.instance.showLoadingSpinner = true;
      deviceFrameRef.instance.updateUrl(this.frameURL);
      this.frames.move(deviceFrameRef.hostView, this.frames.length - 1);
    });
  }

  sortFramesByHeight() {
    if (!this.frames || this.deviceFramesRefs.length === 0) {
      console.error('frames or deviceFramesRefs is undefined or empty');
      return;
    }

    this.deviceFramesRefs.sort((a, b) => {
      const iframeA = a.instance.iFrame?.nativeElement;
      const iframeB = b.instance.iFrame?.nativeElement;

      if (!iframeA || !iframeB) {
        console.error('iframeA or iframeB is undefined');
        return 0;
      }

      return +iframeA.style.height.split('px')[0] - +iframeB.style.height.split('px')[0];
    });

    // Move frames within the framesContainer based on the sorted order
    this.deviceFramesRefs.forEach((deviceFrameRef) => {
      if (!this.frames) {
        console.error('frames is undefined or empty');
        return;
      }
      deviceFrameRef.instance.showLoadingSpinner = true;
      deviceFrameRef.instance.updateUrl(this.frameURL);
      this.frames.move(deviceFrameRef.hostView, this.frames.length - 1);
    });
  }

  clearAllFrames() {
    if (!this.frames) {
      console.error('frames is undefined');
      return;
    }
    this.frames.clear();
  }
}
