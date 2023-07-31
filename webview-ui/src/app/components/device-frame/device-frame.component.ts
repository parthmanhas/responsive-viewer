import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostBinding, Input, Renderer2, SimpleChanges, ViewChild } from "@angular/core";
import { DEVICE_PROFILES } from "src/deviceProfiles";
import { DeviceProfile } from "src/deviceProfile.type";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

@Component({
    selector: "device-frame",
    templateUrl: "./device-frame.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceFrameComponent {

    id: number;

    selectedValue: string | undefined;

    // used only at the initialization of the component
    @Input()
    deviceProfileInit: DeviceProfile | undefined;

    // used for handling states after the component initialization
    selectedProfile: DeviceProfile | undefined;

    showLoadingSpinner: boolean = true;

    deviceProfiles = DEVICE_PROFILES;

    @ViewChild("iFrame", { static: true })
    iFrame: ElementRef<HTMLIFrameElement> | undefined;

    @ViewChild("iframeContainer", { static: true })
    iframeContainer: ElementRef<HTMLDivElement> | undefined;

    @ViewChild("selectHeadingContainer", { static: true })
    selectHeadingContainer: ElementRef | undefined;

    @Input()
    frameURL: string = "";

    @Input()
    closeFrameFn: Function | undefined;

    safeUrl: SafeResourceUrl | undefined;

    @HostBinding('class') hostClasses = 'mx-5';

    constructor(private renderer: Renderer2, public elementRef: ElementRef, private sanitizer: DomSanitizer, private changeDetectorRef: ChangeDetectorRef) {
        console.warn('UPDATE id');
        this.id = Math.floor(Math.random() * 1000);
    }

    ngOnInit() {
        if (!this.deviceProfileInit) {
            this.selectedProfile = this.deviceProfiles[0];
            this.selectedValue = this.selectedProfile.id.toString();
        } else {
            this.selectedProfile = this.deviceProfileInit;
            this.selectedValue = this.deviceProfileInit.id.toString();
        }

        this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.frameURL);
    }

    ngAfterViewInit() {
        if (!this.iFrame) {
            console.error('iframe is undefined');
            return;
        }

        if(!this.iframeContainer) {
            console.error('iframeContainer is undefined');
            return;
        }

        if (!this.selectedProfile) {
            console.error('selectedProfile is undefined');
            return;
        }

        this.iframeContainer.nativeElement.style.width = `${this.selectedProfile.width}px`;
        this.iframeContainer.nativeElement.style.height = `${this.selectedProfile.height}px`;

        this.iFrame.nativeElement.style.width = `${this.selectedProfile.width}px`;
        this.iFrame.nativeElement.style.height = `${this.selectedProfile.height}px`;
    }

    updateUrl(newUrl: string) {
        this.frameURL = newUrl;
        this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.frameURL);
        this.changeDetectorRef.detectChanges();
    }

    onSelect() {
        this.selectedProfile = this.deviceProfiles.find((profile) => profile.id === this.selectedValue);
        if (!this.selectedProfile) {
            console.error('selectedProfile is undefined');
            return;
        }
        if (!this.iFrame) {
            console.error('iFrame is undefined');
            return;
        }
        if (!this.selectHeadingContainer) {
            console.error('selectHeadingContainer is undefined');
            return;
        }
        if(!this.iframeContainer) {
            console.error('iframeContainer is undefined');
            return;
        }
        // set host width and height
        this.renderer.setStyle(this.elementRef.nativeElement, 'width', `${this.selectedProfile.width}px`);
        this.renderer.setStyle(this.elementRef.nativeElement, 'height', `${this.selectedProfile.height}px`);

        this.iframeContainer.nativeElement.style.width = `${this.selectedProfile.width}px`;
        this.iframeContainer.nativeElement.style.height = `${this.selectedProfile.height}px`;

        this.iFrame.nativeElement.style.width = `${this.selectedProfile.width}px`;
        this.iFrame.nativeElement.style.height = `${this.selectedProfile.height}px`;

        this.selectHeadingContainer.nativeElement.style.width = `${this.selectedProfile.width}px`;
    }

    onIframeLoaded() {
        this.showLoadingSpinner = false;
    }


    closeFrame() {
        // remove this device frame component from framesContainer
        if(!this.closeFrameFn) {
            console.error('closeFrameFn is undefined');
            return;
        }
        this.closeFrameFn();
    }
}